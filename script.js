// Global array of supported languages
const languages = [
    { name: "Spanish", difficulty: "Medium", speakers: "559 million", funFact: "Spanish is the second most spoken language globally!" },
    { name: "German", difficulty: "Hard", speakers: "130 million", funFact: "German has compound words like 'Donaudampfschiffahrt'!" },
    { name: "Russian", difficulty: "Hard", speakers: "258 million", funFact: "Russian uses the Cyrillic alphabet!" }
];

// Quiz dataset (plugged in from reliable sources: Spanish/German from ProProfs, Russian from FunTrivia)
const quizzes = {
    "Spanish": [
        { question: "How do you say 'hello' in Spanish?", answer: "Hola" },
        { question: "What is the correct phrase for Good Morning?", answer: "Buenos Dias" },
        { question: "How do you say 'Miss' in Spanish?", answer: "Senorita" },
        { question: "If you want to ask where the bathroom is, what is the correct phrase?", answer: "Adonde esta el bano?" },
        { question: "How do you say 'dog' in Spanish?", answer: "Perro" }
    ],
    "German": [
        { question: "How could you greet someone you see on the way to school in the morning?", answer: "Guten Morgen" },
        { question: "How do you say 'Please'?", answer: "Bitte" },
        { question: "What is 'to write'?", answer: "Schreiben" },
        { question: "Which of the following is Deutsch for the word 'with'?", answer: "Mit" },
        { question: "How do you say 'black' in German?", answer: "Schwarz" }
    ],
    "Russian": [
        { question: "Which of these is an informal greeting in Russian?", answer: "Preevet" },
        { question: "How do you say 'sorry' in Russian?", answer: "Izvinite" },
        { question: "How can you say 'zero' in Russian?", answer: "nol" },
        { question: "How can you say 'thank you' in Russian?", answer: "Spasibo" },
        { question: "What is an informal farewell in Russian?", answer: "Poka" }
    ]
};

// Global variable to track selected language
let selectedLanguage = null;

/**
 * Displays language details in a modal with animation
 * @param {Object} langObj - Language object with name, difficulty, speakers, and funFact
 * @returns {boolean} - True if displayed successfully, false if langObj is invalid
 */
function displayLanguageDetails(langObj) {
    const modal = document.getElementById('language-modal');
    const modalBody = document.querySelector('.modal-body');
    
    if (!langObj) {
        modalBody.innerHTML = "<p>Please select a language to learn more.</p>";
        modal.classList.add('active');
        return false;
    }

    // Local scope variable for difficulty message
    const difficultyMessage = langObj.difficulty === "Hard" 
        ? "This language is challenging but rewarding!" 
        : "This language is approachable for beginners!";

    modalBody.innerHTML = `
        <h3>${langObj.name}</h3>
        <p>Difficulty: ${langObj.difficulty}</p>
        <p>Speakers: ${langObj.speakers}</p>
        <p>Fun Fact: ${langObj.funFact}</p>
        <p>${difficultyMessage}</p>
    `;
    modal.classList.add('active'); // Trigger modal slide-in animation
    return true;
}

/**
 * Toggles card flip animation
 * @param {HTMLElement} card - The card element to flip
 * @param {Object} langObj - Language object to display on back
 */
function toggleCardFlip(card, langObj) {
    card.classList.toggle('flipped');
    if (card.classList.contains('flipped')) {
        // Update back content when flipped
        const cardBack = card.querySelector('.card-back');
        cardBack.innerHTML = `
            <h3>${langObj.name}</h3>
            <p>Difficulty: ${langObj.difficulty}</p>
            <p>Click again to return</p>
        `;
    }
}

/**
 * Populates language cards dynamically with flip structure
 * @returns {number} - Number of cards created
 */
function populateLanguageCards() {
    const languageCardsDiv = document.querySelector('.card-container');
    if (!languageCardsDiv) return 0; // Skip if no container (e.g., on language page)
    languageCardsDiv.innerHTML = ""; // Clear existing cards

    languages.forEach((lang, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <h3>${lang.name}</h3>
                    <p>This card will open up new paths to the ${lang.name} Language</p>
                    <button class="learn-more">Learn More</button>
                </div>
                <div class="card-back"></div>
            </div>
        `;
        languageCardsDiv.appendChild(card);

        // Add click event for card flip
        card.addEventListener('click', () => {
            toggleCardFlip(card, lang);
        });

        // Add click event for "Learn More" to redirect to language page with quiz
        card.querySelector('.learn-more').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card flip when clicking button
            window.location.href = `language.html?lang=${lang.name}`;
        });
    });

    return languages.length; // Return number of cards created
}

/**
 * Loads and displays quiz for the selected language from URL param
 */
function loadQuiz() {
    const quizSection = document.getElementById('quiz-section');
    if (!quizSection) return;

    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang');

    if (lang && quizzes[lang]) {
        quizSection.innerHTML = `<h2>Quiz for ${lang}</h2>`;
        quizzes[lang].forEach((q, i) => {
            quizSection.innerHTML += `
                <p>${q.question}</p>
                <input type="text" id="ans${i}" placeholder="Your answer">
            `;
        });
        quizSection.innerHTML += `
            <button id="submit-quiz">Submit Quiz</button>
            <div id="quiz-result"></div>
        `;

        document.getElementById('submit-quiz').addEventListener('click', () => {
            let score = 0;
            quizzes[lang].forEach((q, i) => {
                const userAnswer = document.getElementById(`ans${i}`).value.trim().toLowerCase();
                if (userAnswer === q.answer.toLowerCase()) score++;
            });
            document.getElementById('quiz-result').innerHTML = `<p>Score: ${score} / ${quizzes[lang].length}</p>`;
        });
    } else {
        quizSection.innerHTML = `<p>No language selected. Go back to Home and choose a card.</p>`;
    }
}

/**
 * Simulates a countdown with async timing
 * @param {number} seconds - Countdown duration
 * @param {HTMLElement} container - Element to display countdown
 * @returns {Promise} - Resolves when countdown completes
 */
function startLearningCountdown(seconds = 5, container) {
    return new Promise((resolve) => {
        container.innerHTML = "<p>Preparing to learn... Starting in:</p>";
        let count = seconds;

        const interval = setInterval(() => {
            if (count <= 0) {
                clearInterval(interval);
                container.innerHTML += "<p>Let's start learning!</p>";
                resolve();
                return;
            }
            const countdownElement = document.createElement('p');
            countdownElement.textContent = `${count}...`;
            container.appendChild(countdownElement);
            count--;
        }, 1000);
    });
}

/**
 * Validates form input
 * @returns {boolean} - True if valid, false otherwise
 */
function validateForm() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const feedback = document.getElementById('form-feedback');

    let isValid = true;

    // Clear previous errors
    nameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    feedback.textContent = '';

    // Validate name
    if (!nameInput.value.trim()) {
        nameError.textContent = 'Name is required.';
        isValid = false;
    } else if (nameInput.value.trim().length < 3) {
        nameError.textContent = 'Name must be at least 3 characters long.';
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
        emailError.textContent = 'Email is required.';
        isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordInput.value) {
        passwordError.textContent = 'Password is required.';
        isValid = false;
    } else if (!passwordRegex.test(passwordInput.value)) {
        passwordError.textContent = 'Password must be at least 8 characters long, with at least one uppercase letter, one lowercase letter, and one number.';
        isValid = false;
    }

    // Provide feedback
    feedback.textContent = isValid ? 'Form submitted successfully!' : 'Please fix the errors above.';
    feedback.classList.add(isValid ? 'success' : 'error');

    return isValid;
}

/**
 * Toggles dark/light mode
 */
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

/**
 * Loads saved theme from localStorage
 */
function loadTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize language cards (only on pages with .card-container, e.g., home)
    const cardCount = populateLanguageCards();
    console.log(`Populated ${cardCount} language cards`);

    // Load quiz if on language page
    loadQuiz();

    // Modal close event
    const closeModal = document.getElementById('close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('language-modal').classList.remove('active');
        });
    }

    // Form submission (on contact page)
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            validateForm();
        });
    }

    // Theme toggle
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }

    // Load theme
    loadTheme();

    // Page-specific interactivity
    if (window.location.pathname.includes('language-maps.html')) {
        const mapPreviewButton = document.getElementById('map-preview');
        if (mapPreviewButton) {
            mapPreviewButton.addEventListener('click', () => {
                const modalBody = document.querySelector('.modal-body');
                modalBody.innerHTML = `
                    <h3>Language Learning Stages (CEFR Levels)</h3>
                    <ul>
                        <li><strong>A1 (Beginner)</strong>: Basic phrases, greetings, simple interactions.</li>
                        <li><strong>A2 (Elementary)</strong>: Describe surroundings, handle simple tasks.</li>
                        <li><strong>B1 (Intermediate)</strong>: Deal with most situations while traveling, describe experiences.</li>
                        <li><strong>B2 (Upper Intermediate)</strong>: Understand main ideas of complex text, interact fluently.</li>
                        <li><strong>C1 (Advanced)</strong>: Express ideas fluently, use language flexibly for social/professional purposes.</li>
                        <li><strong>C2 (Proficiency)</strong>: Understand everything heard or read, express spontaneously with precision.</li>
                    </ul>
                `;
                document.getElementById('language-modal').classList.add('active');
            });
        }
    }

    if (window.location.pathname.includes('help.html')) {
        const supportContactButton = document.getElementById('support-contact');
        if (supportContactButton) {
            supportContactButton.addEventListener('click', () => {
                window.location.href = 'contact.html';
            });
        }
    }
});