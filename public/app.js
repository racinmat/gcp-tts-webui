// Global variables
let voices = [];
let currentUser = null;
let currentAudioBlob = null;

// DOM elements
const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userDisplay = document.getElementById('user-display');
const userName = document.getElementById('user-name');
const textInput = document.getElementById('text-input');
const charCount = document.getElementById('char-count');
const languageSelect = document.getElementById('language-select');
const voiceSelect = document.getElementById('voice-select');
const synthesizeBtn = document.getElementById('synthesize-btn');
const clearBtn = document.getElementById('clear-btn');
const audioSection = document.getElementById('audio-section');
const audioPlayer = document.getElementById('audio-player');
const downloadBtn = document.getElementById('download-btn');
const loading = document.getElementById('loading');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupEventListeners();
});

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (data.authenticated) {
            currentUser = data.user;
            showApp();
            loadVoices();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        showLogin();
    }
}

// Show login section
function showLogin() {
    loginSection.classList.remove('hidden');
    appSection.classList.add('hidden');
    userDisplay.classList.add('hidden');
}

// Show app section
function showApp() {
    loginSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    userDisplay.classList.remove('hidden');
    userName.textContent = currentUser.displayName;
}

// Setup event listeners
function setupEventListeners() {
    loginBtn.addEventListener('click', () => {
        window.location.href = '/auth/google';
    });
    
    logoutBtn.addEventListener('click', () => {
        window.location.href = '/auth/logout';
    });
    
    textInput.addEventListener('input', updateCharCount);
    textInput.addEventListener('input', validateForm);
    
    languageSelect.addEventListener('change', filterVoices);
    voiceSelect.addEventListener('change', validateForm);
    
    synthesizeBtn.addEventListener('click', synthesizeSpeech);
    clearBtn.addEventListener('click', clearForm);
    downloadBtn.addEventListener('click', downloadAudio);
}

// Update character count
function updateCharCount() {
    const count = textInput.value.length;
    charCount.textContent = count;
    
    if (count > 4500) {
        charCount.style.color = '#dc3545';
    } else if (count > 4000) {
        charCount.style.color = '#fd7e14';
    } else {
        charCount.style.color = '#666';
    }
    
    validateForm();
}

// Validate form
function validateForm() {
    const text = textInput.value.trim();
    const selectedVoice = voiceSelect.value;
    
    const isValid = text.length > 0 && text.length <= 5000 && selectedVoice;
    synthesizeBtn.disabled = !isValid;
}

// Load available voices
async function loadVoices() {
    try {
        const response = await fetch('/api/voices');
        if (!response.ok) {
            throw new Error('Failed to load voices');
        }
        
        voices = await response.json();
        populateLanguageSelect();
    } catch (error) {
        console.error('Error loading voices:', error);
        showNotification('Error loading voices. Please refresh the page.', 'error');
    }
}

// Populate language select
function populateLanguageSelect() {
    const languages = [...new Set(voices.map(voice => voice.languageCodes[0]))];
    languages.sort();
    
    languageSelect.innerHTML = '<option value="">Select a language...</option>';
    
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = getLanguageName(lang);
        languageSelect.appendChild(option);
    });
}

// Filter voices by language
function filterVoices() {
    const selectedLang = languageSelect.value;
    voiceSelect.innerHTML = '<option value="">Select a voice...</option>';
    
    if (!selectedLang) {
        voiceSelect.disabled = true;
        return;
    }
    
    const filteredVoices = voices.filter(voice => 
        voice.languageCodes.includes(selectedLang)
    );
    
    filteredVoices.sort((a, b) => a.name.localeCompare(b.name));
    
    filteredVoices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.ssmlGender})`;
        voiceSelect.appendChild(option);
    });
    
    voiceSelect.disabled = false;
    validateForm();
}

// Synthesize speech
async function synthesizeSpeech() {
    const text = textInput.value.trim();
    const selectedVoice = voiceSelect.value;
    const selectedLang = languageSelect.value;
    
    if (!text || !selectedVoice || !selectedLang) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading
    loading.classList.remove('hidden');
    synthesizeBtn.disabled = true;
    audioSection.classList.add('hidden');
    
    try {
        const response = await fetch('/api/synthesize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                voice: selectedVoice,
                languageCode: selectedLang
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to synthesize speech');
        }
        
        const data = await response.json();
        
        if (data.success) {
            // Convert base64 to blob
            const audioData = atob(data.audioContent);
            const audioArray = new Uint8Array(audioData.length);
            for (let i = 0; i < audioData.length; i++) {
                audioArray[i] = audioData.charCodeAt(i);
            }
            
            currentAudioBlob = new Blob([audioArray], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(currentAudioBlob);
            
            // Update audio player
            audioPlayer.src = audioUrl;
            audioSection.classList.remove('hidden');
            
            showNotification('Speech generated successfully!', 'success');
        } else {
            throw new Error('Failed to generate speech');
        }
    } catch (error) {
        console.error('Error synthesizing speech:', error);
        showNotification('Error generating speech. Please try again.', 'error');
    } finally {
        loading.classList.add('hidden');
        validateForm(); // Re-enable button if form is valid
    }
}

// Clear form
function clearForm() {
    textInput.value = '';
    languageSelect.value = '';
    voiceSelect.value = '';
    voiceSelect.disabled = true;
    audioSection.classList.add('hidden');
    updateCharCount();
    validateForm();
    
    // Clear audio player
    audioPlayer.src = '';
    currentAudioBlob = null;
}

// Download audio
function downloadAudio() {
    if (!currentAudioBlob) {
        showNotification('No audio to download', 'error');
        return;
    }
    
    const url = URL.createObjectURL(currentAudioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tts_${new Date().getTime()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Audio downloaded successfully!', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    if (!document.head.querySelector('style[data-notifications]')) {
        style.setAttribute('data-notifications', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Get language name from code
function getLanguageName(code) {
    const languageNames = {
        'af-ZA': 'Afrikaans (South Africa)',
        'ar-XA': 'Arabic',
        'bg-BG': 'Bulgarian (Bulgaria)',
        'ca-ES': 'Catalan (Spain)',
        'cs-CZ': 'Czech (Czech Republic)',
        'da-DK': 'Danish (Denmark)',
        'de-DE': 'German (Germany)',
        'el-GR': 'Greek (Greece)',
        'en-AU': 'English (Australia)',
        'en-GB': 'English (UK)',
        'en-IN': 'English (India)',
        'en-US': 'English (US)',
        'es-ES': 'Spanish (Spain)',
        'es-US': 'Spanish (US)',
        'fi-FI': 'Finnish (Finland)',
        'fr-CA': 'French (Canada)',
        'fr-FR': 'French (France)',
        'he-IL': 'Hebrew (Israel)',
        'hi-IN': 'Hindi (India)',
        'hr-HR': 'Croatian (Croatia)',
        'hu-HU': 'Hungarian (Hungary)',
        'id-ID': 'Indonesian (Indonesia)',
        'is-IS': 'Icelandic (Iceland)',
        'it-IT': 'Italian (Italy)',
        'ja-JP': 'Japanese (Japan)',
        'ko-KR': 'Korean (South Korea)',
        'lv-LV': 'Latvian (Latvia)',
        'ms-MY': 'Malay (Malaysia)',
        'nb-NO': 'Norwegian (Norway)',
        'nl-NL': 'Dutch (Netherlands)',
        'pl-PL': 'Polish (Poland)',
        'pt-BR': 'Portuguese (Brazil)',
        'pt-PT': 'Portuguese (Portugal)',
        'ro-RO': 'Romanian (Romania)',
        'ru-RU': 'Russian (Russia)',
        'sk-SK': 'Slovak (Slovakia)',
        'sl-SI': 'Slovenian (Slovenia)',
        'sr-RS': 'Serbian (Serbia)',
        'sv-SE': 'Swedish (Sweden)',
        'ta-IN': 'Tamil (India)',
        'te-IN': 'Telugu (India)',
        'th-TH': 'Thai (Thailand)',
        'tr-TR': 'Turkish (Turkey)',
        'uk-UA': 'Ukrainian (Ukraine)',
        'vi-VN': 'Vietnamese (Vietnam)',
        'zh-CN': 'Chinese (China)',
        'zh-TW': 'Chinese (Taiwan)'
    };
    
    return languageNames[code] || code;
} 