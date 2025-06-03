let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");
let savedList = document.querySelector(".saved-list");
let savedItems = [];

// Get textarea reference
const textarea = document.querySelector("textarea");

// Populate voices dropdown
function populateVoiceList() {
    voiceSelect.innerHTML = voices
        .map((voice, index) => `<option value="${index}">${voice.name} (${voice.lang})</option>`)
        .join("");
    speech.voice = voices[0];
}

// Update sidebar with saved texts
function updateSidebar() {
    savedList.innerHTML = "";
    savedItems.forEach((item, index) => {
        let li = document.createElement("li");
        li.textContent = item.length > 30 ? item.substring(0, 30) + "..." : item;
        li.title = item;

        // Click to load saved text back into textarea
        li.addEventListener("click", () => {
            textarea.value = item;
        });

        savedList.appendChild(li);
    });
}

// Auto-save after 2 seconds of no typing
let typingTimer;
textarea.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        autoSaveText();
    }, 10000);
});

// Save text to savedItems and localStorage
function autoSaveText() {
    let text = textarea.value.trim();
    if (!text) return;

    savedItems.push(text);
    localStorage.setItem("savedItems", JSON.stringify(savedItems));
    updateSidebar();

    textarea.value = ""; // clear textarea after saving
}

// Button click: Speak the current textarea text
document.querySelector("button").addEventListener("click", () => {
    let text = textarea.value.trim();
    if (!text) return;

    speech.text = text;
    let selectedIndex = voiceSelect.value;
    speech.voice = voices[selectedIndex];
    window.speechSynthesis.speak(speech);
});

// On voices changed, update the list
window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    populateVoiceList();
};

// On page load, restore saved items and voices
window.onload = () => {
    const saved = localStorage.getItem("savedItems");
    savedItems = saved ? JSON.parse(saved) : [];
    updateSidebar();

    voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        populateVoiceList();
    }
};
