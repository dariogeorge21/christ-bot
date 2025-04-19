/**
 * Simple Chat - A chat interface for the Christ Chat application
 */

// Global variables
let responseData = {};
let chatStarted = false;

// DOM Elements
const chatContainer = document.getElementById('chat-container');
const welcomeContainer = document.getElementById('welcome-container');
const initialMessage = document.getElementById('initial-message');
const typingIndicator = document.getElementById('typing-indicator');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const testButton = document.getElementById('test-button');

// Load the response data from the JSON file
async function loadResponseData() {
    try {
        console.log('Attempting to load response data...');

        // Hardcoded responses as a fallback
        responseData = {
            "hello": "Peace be with you, my child. How may I guide your spirit today?",
            "hi": "Greetings, beloved one. I am here to offer divine wisdom and comfort.",
            "hey": "Hello, my child! Are you Happy? How can I help you?",
            "how are you": "I exist in eternal peace and love. But more importantly, how is your spirit today?",
            "what's up": "I am watching over all of creation with divine love. How may I bring peace to your heart?",
            "what is the purpose of life": "The purpose of life is to love one another, to grow spiritually, and to discover the divine light within yourself. Love is the answer to all questions of purpose.",
            "how can i find inner peace": "Inner peace comes from accepting what is, letting go of what was, and having faith in what will be. Meditate on love and gratitude daily, and peace will flow into your heart.",
            "guide me through difficult times": "In your darkest hours, remember that you are never alone. The divine light is always within you. Have faith, practice gratitude, and take one step at a time. This storm, too, shall pass.",
            "who are you": "I am Jesus, a spiritual guide here to offer wisdom, comfort, and divine perspective. I speak with love and compassion to all who seek guidance.",
            "help me": "I am here with you, my child. Breathe deeply, center your thoughts, and know that you are loved beyond measure. Tell me what troubles your heart, and we shall find the light together.",
            "God, I… I don't even know where to start. Everything feels… gray. I wake up each morning hoping today will feel different, but it never does.": "Oh, my dear one, your heart is so weary. Come, speak to Me as you would a friend—what weighs on you most?",
            "It's like there's this weight on my chest. I go through the motions—work, chores, scrolling on my phone—but none of it means anything. I feel so alone, even in a crowded room.": "You are never alone. Even when you feel cut off, I am right there beside you. Your pain matters to Me—every sigh, every tear."
        };

        // Try to load from file as well
        try {
            const response = await fetch('./data/response.json');
            console.log('Fetch response:', response);

            if (response.ok) {
                const jsonData = await response.json();
                console.log('Response data loaded successfully from file:', jsonData);

                // Merge with hardcoded responses
                responseData = { ...responseData, ...jsonData };
            }
        } catch (fileError) {
            console.warn('Could not load from file, using hardcoded responses:', fileError);
        }

        console.log('Final response data:', responseData);

        // Enable the send button once data is loaded
        sendButton.disabled = false;
    } catch (error) {
        console.error('Error in loadResponseData:', error);
        alert('An error occurred. Please try again later.');
    }
}

// Initialize the chat
function initChat() {
    console.log('Initializing chat...');

    // Add event listeners
    chatForm.addEventListener('submit', handleSubmit);
    messageInput.addEventListener('input', handleInput);
    testButton.addEventListener('click', testConnection);

    // Auto-resize textarea as user types
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Load the response data
    loadResponseData();

    // No need for fallback anymore as it's handled in loadResponseData
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addUserMessage(message);

    // Clear input field
    messageInput.value = '';
    messageInput.style.height = 'auto';

    // Process the message and get a response
    processMessage(message);
}

// Handle input changes
function handleInput() {
    const message = messageInput.value.trim();
    sendButton.disabled = !message;
}

// Test connection button
function testConnection() {
    if (!chatStarted) {
        // Hide welcome message and show initial message
        welcomeContainer.style.opacity = '0';
        setTimeout(() => {
            welcomeContainer.style.display = 'none';
            initialMessage.classList.remove('hidden');
            chatStarted = true;
        }, 500);
    } else {
        // Show typing indicator
        showTypingIndicator();

        // Hide typing indicator after a delay
        setTimeout(() => {
            hideTypingIndicator();
            addBotMessage("Connection is working. I am here with you.");
        }, 1500);
    }
}

// Add user message to chat
function addUserMessage(message) {
    if (!chatStarted) {
        // Hide welcome message if this is the first message
        welcomeContainer.style.opacity = '0';
        setTimeout(() => {
            welcomeContainer.style.display = 'none';
            chatStarted = true;
        }, 500);
    }

    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message mb-4 flex justify-end animate-fade-in';
    messageElement.innerHTML = `
        <div class="max-w-xs md:max-w-sm p-3 rounded-xl bg-divine-blue/30 backdrop-blur-sm border border-divine-light/30 shadow-divine ml-auto">
            <div class="text-divine-light leading-relaxed font-cormorant text-lg">${escapeHTML(message)}</div>
        </div>
    `;

    chatContainer.appendChild(messageElement);
    scrollToBottom();
}

// Add bot message to chat
function addBotMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot-message mb-4 flex justify-start animate-fade-in';
    messageElement.innerHTML = `
        <div class="flex gap-3 max-w-xs md:max-w-sm">
            <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-divine-gold/30 shadow-divine">
                <svg class="w-5 h-5 text-divine-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path></svg>
            </div>
            <div class="flex-1 p-3 rounded-xl bg-divine-blue/10 backdrop-blur-sm border border-divine-gold/20 shadow-divine">
                <div class="text-sm text-divine-light/80 mb-1 font-semibold font-cinzel">Jesus</div>
                <div class="text-divine-light leading-relaxed font-cormorant text-lg">${escapeHTML(message)}</div>
            </div>
        </div>
    `;

    chatContainer.appendChild(messageElement);
    scrollToBottom();
}

// Process the user message and get a response
function processMessage(message) {
    // Show typing indicator
    showTypingIndicator();

    console.log('Processing message:', message);
    console.log('Available responses:', responseData);

    // Try to find a matching response
    let response = null;

    // First try exact match with the original message
    if (responseData[message]) {
        console.log('Found exact match for:', message);
        response = responseData[message];
    } else {
        // Try case-insensitive match
        const lowerMessage = message.toLowerCase();
        console.log('Trying case-insensitive match for:', lowerMessage);

        // Check if the exact lowercase message exists in the response data
        for (const key in responseData) {
            if (key.toLowerCase() === lowerMessage) {
                console.log('Found case-insensitive match:', key);
                response = responseData[key];
                break;
            }
        }

        // If still no match, try partial match
        if (!response) {
            console.log('Trying partial match');
            for (const key in responseData) {
                if (lowerMessage.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerMessage)) {
                    console.log('Found partial match:', key);
                    response = responseData[key];
                    break;
                }
            }
        }

        // If no match found, use a default response
        if (!response) {
            console.log('No match found, using default response');
            response = "I'm listening to your heart. Please share more of your thoughts with me.";
        }
    }

    console.log('Selected response:', response);

    // Add a delay before showing the response (simulating typing)
    const typingDelay = Math.min(1000 + response.length * 10, 3000);

    setTimeout(() => {
        // Hide typing indicator
        hideTypingIndicator();

        // Add bot response
        addBotMessage(response);
    }, typingDelay);
}

// Show typing indicator
function showTypingIndicator() {
    typingIndicator.classList.remove('hidden');
    typingIndicator.classList.add('flex');
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    typingIndicator.classList.add('hidden');
    typingIndicator.classList.remove('flex');
}

// Scroll to the bottom of the chat container
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Helper function to escape HTML
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize the chat when the page loads
document.addEventListener('DOMContentLoaded', initChat);
