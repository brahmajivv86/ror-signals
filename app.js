// State Variables
let cardsData = {};
let sessionMode = 'trainer'; // 'trainer' | 'quiz'
let trainerOrder = 'direct'; // 'direct' | 'shuffle'
let quizIncludeDay = true;
let quizQuestionCount = '20';
let currentQueue = []; // Holds items: { cardId: string, type: 'night' | 'day' }
let currentIndex = 0;
let quizScore = 0;
let quizAnswers = []; // { cardId, type, correct }
let missedCards = []; // List of missed cardIds

// Step-wise Quiz state
let quizCurrentStep = 1; // 1 | 2 | 3
let quizStepsList = []; // List of step definitions
let quizCardFailed = false; // True if user got any step wrong for the current card

// DOM Elements
const startupModal = document.getElementById('startup-modal');
const appContainer = document.getElementById('app-container');
const btnHome = document.getElementById('btn-home');
const sessionModeBadge = document.getElementById('session-mode-badge');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const progressPercent = document.getElementById('progress-percent');

// Startup Menu Controls
const btnModeTrainer = document.getElementById('btn-mode-trainer');
const btnModeQuiz = document.getElementById('btn-mode-quiz');
const groupTrainerOptions = document.getElementById('group-trainer-options');
const groupQuizOptions = document.getElementById('group-quiz-options');
const btnStartSession = document.getElementById('btn-start-session');
const quizToggleDay = document.getElementById('quiz-toggle-day');
const quizQuestionCountSelect = document.getElementById('quiz-question-count');

// Views
const trainerView = document.getElementById('trainer-view');
const quizView = document.getElementById('quiz-view');
const resultsView = document.getElementById('results-view');

// Trainer Elements
const flashcard = document.getElementById('flashcard');
const trainerImg = document.getElementById('trainer-img');
const trainerCardLabel = document.getElementById('trainer-card-label');
const trainerBackTitle = document.getElementById('trainer-back-title');
const trainerInfoIdent = document.getElementById('trainer-info-ident');
const trainerInfoAction = document.getElementById('trainer-info-action');
const trainerInfoDay = document.getElementById('trainer-info-day');
const trainerInfoFog = document.getElementById('trainer-info-fog');
const btnTrainerPrev = document.getElementById('btn-trainer-prev');
const btnTrainerFlip = document.getElementById('btn-trainer-flip');
const btnTrainerNext = document.getElementById('btn-trainer-next');

// Quiz Elements
const quizQuestionImg = document.getElementById('quiz-question-img');
const quizCardNumberLabel = document.getElementById('quiz-card-number-label');
const quizQuestionTypeBadge = document.getElementById('quiz-question-type-badge');
const quizPromptText = document.getElementById('quiz-prompt-text');
const quizOptionsContainer = document.getElementById('quiz-options-container');
const quizFeedbackPanel = document.getElementById('quiz-feedback-panel');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackDescIdent = document.getElementById('feedback-desc-ident');
const feedbackDescAction = document.getElementById('feedback-desc-action');
const feedbackDescDay = document.getElementById('feedback-desc-day');
const feedbackDescFog = document.getElementById('feedback-desc-fog');
const btnQuizContinue = document.getElementById('btn-quiz-continue');

// Results Elements
const resultsScorePercent = document.getElementById('results-score-percent');
const resultsTotal = document.getElementById('results-total');
const resultsCorrect = document.getElementById('results-correct');
const resultsIncorrect = document.getElementById('results-incorrect');
const resultsModePlayed = document.getElementById('results-mode-played');
const resultsReviewSection = document.getElementById('results-review-section');
const resultsReviewList = document.getElementById('results-review-list');
const btnResultsRetry = document.getElementById('btn-results-retry');
const btnResultsHome = document.getElementById('btn-results-home');

// Initialization
window.addEventListener('DOMContentLoaded', () => {
    fetchCardsData();
    setupEventListeners();
});

// Fetch parsed JSON card data
async function fetchCardsData() {
    try {
        const response = await fetch('cards.json');
        if (!response.ok) throw new Error('Failed to load card data');
        cardsData = await response.json();
        console.log(`Loaded ${Object.keys(cardsData).length} cards.`);
    } catch (error) {
        console.error('Error fetching cards:', error);
        alert('Could not load card details. Please ensure the server is running.');
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Mode toggles in startup menu
    btnModeTrainer.addEventListener('click', () => {
        sessionMode = 'trainer';
        btnModeTrainer.classList.add('active');
        btnModeQuiz.classList.remove('active');
        groupTrainerOptions.classList.remove('hidden');
        groupQuizOptions.classList.add('hidden');
    });

    btnModeQuiz.addEventListener('click', () => {
        sessionMode = 'quiz';
        btnModeQuiz.classList.add('active');
        btnModeTrainer.classList.remove('active');
        groupQuizOptions.classList.remove('hidden');
        groupTrainerOptions.classList.add('hidden');
    });

    // Start Session
    btnStartSession.addEventListener('click', startSession);

    // Return to main menu
    btnHome.addEventListener('click', showMainMenu);
    btnResultsHome.addEventListener('click', showMainMenu);

    // Trainer actions
    flashcard.addEventListener('click', toggleCardFlip);
    btnTrainerFlip.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering double flips
        toggleCardFlip();
    });
    btnTrainerPrev.addEventListener('click', () => navigateTrainer(-1));
    btnTrainerNext.addEventListener('click', () => navigateTrainer(1));

    // Keyboard navigation in Trainer Mode
    document.addEventListener('keydown', (e) => {
        if (appContainer.classList.contains('hidden')) return;
        if (sessionMode !== 'trainer') return;
        
        if (e.code === 'Space') {
            e.preventDefault();
            toggleCardFlip();
        } else if (e.code === 'ArrowLeft') {
            navigateTrainer(-1);
        } else if (e.code === 'ArrowRight') {
            navigateTrainer(1);
        }
    });

    // Quiz actions
    btnQuizContinue.addEventListener('click', loadNextQuizQuestion);
    btnResultsRetry.addEventListener('click', restartSession);
}

// Main Menu view trigger
function showMainMenu() {
    appContainer.classList.add('hidden');
    startupModal.classList.remove('hidden');
    // Clean up active classes
    trainerView.classList.add('hidden');
    quizView.classList.add('hidden');
    resultsView.classList.add('hidden');
}

// Fisher-Yates Shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize Queue and Start the Session
function startSession() {
    // Collect settings
    trainerOrder = document.querySelector('input[name="trainer-order"]:checked').value;
    quizIncludeDay = quizToggleDay.checked;
    quizQuestionCount = quizQuestionCountSelect.value;

    const allCardIds = Object.keys(cardsData).sort((a, b) => parseInt(a) - parseInt(b));
    if (allCardIds.length === 0) {
        alert('Card data is empty. Please run extract_data.py.');
        return;
    }

    currentQueue = [];
    currentIndex = 0;
    quizScore = 0;
    quizAnswers = [];
    missedCards = [];

    if (sessionMode === 'trainer') {
        // Trainer mode is night signals primarily
        allCardIds.forEach(id => {
            currentQueue.push({ cardId: id, type: 'night' });
        });
        
        if (trainerOrder === 'shuffle') {
            shuffleArray(currentQueue);
        }
        
        sessionModeBadge.textContent = 'Trainer Mode';
        sessionModeBadge.className = 'badge badge-teal';
        
        showView('trainer');
        loadTrainerCard();
    } else {
        // Quiz mode: Assemble pool of questions
        let questionPool = [];
        
        allCardIds.forEach(id => {
            // Add night signal
            questionPool.push({ cardId: id, type: 'night' });
            
            // Add day signal if requested and day shape exists (cards 1-30)
            const num = parseInt(id);
            if (quizIncludeDay && num <= 30) {
                // Ensure card actually has day shapes (non-trivial day signal)
                const dayText = cardsData[id].day_signal;
                if (dayText && !dayText.toLowerCase().includes('no day signal') && dayText.toLowerCase() !== 'nil') {
                    questionPool.push({ cardId: id, type: 'day' });
                }
            }
        });
        
        // Shuffle the entire pool
        shuffleArray(questionPool);
        
        // Slice to requested size
        if (quizQuestionCount !== 'all') {
            const count = parseInt(quizQuestionCount);
            currentQueue = questionPool.slice(0, Math.min(count, questionPool.length));
        } else {
            currentQueue = questionPool;
        }

        sessionModeBadge.textContent = 'Quiz Mode';
        sessionModeBadge.className = 'badge';
        
        showView('quiz');
        loadQuizQuestion();
    }

    // Show app interface
    startupModal.classList.add('hidden');
    appContainer.classList.remove('hidden');
    updateProgressBar();
}

function restartSession() {
    currentIndex = 0;
    quizScore = 0;
    quizAnswers = [];
    
    if (sessionMode === 'trainer') {
        if (trainerOrder === 'shuffle') {
            shuffleArray(currentQueue);
        }
        showView('trainer');
        loadTrainerCard();
    } else {
        // Re-shuffle the quiz queue to give a fresh experience on retry
        shuffleArray(currentQueue);
        showView('quiz');
        loadQuizQuestion();
    }
    updateProgressBar();
}

// Show specific view inside main container
function showView(viewName) {
    trainerView.classList.toggle('hidden', viewName !== 'trainer');
    quizView.classList.toggle('hidden', viewName !== 'quiz');
    resultsView.classList.toggle('hidden', viewName !== 'results');
}

// Update Header Progress Indicators
function updateProgressBar() {
    const total = currentQueue.length;
    const currentNum = currentIndex + 1;
    const progressVal = total > 0 ? (currentIndex / total) * 100 : 0;

    progressBarFill.style.width = `${progressVal}%`;
    progressText.textContent = `Question/Card ${currentNum} of ${total}`;
    progressPercent.textContent = `${Math.round(progressVal)}% Completed`;
}

/* ==========================================================================
   TRAINER MODE LOGIC
   ========================================================================== */

function loadTrainerCard() {
    // Reset flip status
    flashcard.classList.remove('flipped');
    
    if (currentQueue.length === 0 || currentIndex >= currentQueue.length) return;
    
    const item = currentQueue[currentIndex];
    const card = cardsData[item.cardId];

    // Set Front Side Image
    trainerImg.src = `images/night/NightSignal${item.cardId}.gif`;
    trainerImg.alt = `R.O.R. Night Signal Card #${item.cardId}`;
    
    // Fallback if image doesn't exist
    trainerImg.onerror = () => {
        trainerImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="284" height="180" viewBox="0 0 284 180"><rect width="100%" height="100%" fill="%23111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23555" font-family="sans-serif" font-size="14">Image Missing</text></svg>';
    };

    // Label Front
    trainerCardLabel.textContent = `Night Signal #${item.cardId}`;
    
    // Populate Back Info Panel
    trainerBackTitle.textContent = `Signal Reference Details (Card #${item.cardId})`;
    trainerInfoIdent.textContent = card.identification || 'No identification text.';
    trainerInfoAction.textContent = card.action || 'No action specified.';
    trainerInfoDay.textContent = card.day_signal || 'No day signal shape.';
    trainerInfoFog.textContent = card.fog_signal || 'No fog signal.';

    // Manage Prev/Next disabled states
    btnTrainerPrev.disabled = currentIndex === 0;
    
    // Change next button to "Finish" or icon on last card
    if (currentIndex === currentQueue.length - 1) {
        btnTrainerNext.innerHTML = `Finish <i class="fa-solid fa-flag-checkered"></i>`;
    } else {
        btnTrainerNext.innerHTML = `Next <i class="fa-solid fa-arrow-right"></i>`;
    }
}

function toggleCardFlip() {
    flashcard.classList.toggle('flipped');
}

function navigateTrainer(direction) {
    const nextIdx = currentIndex + direction;
    
    if (nextIdx >= 0 && nextIdx < currentQueue.length) {
        currentIndex = nextIdx;
        loadTrainerCard();
        updateProgressBar();
    } else if (nextIdx >= currentQueue.length) {
        // Reached end of trainer deck
        showResults();
    }
}

/* ==========================================================================
   QUIZ MODE LOGIC (Step-wise Quiz System)
   ========================================================================== */

const vesselTypesList = [
    "Power-Driven Vessel (P/D Vsl)",
    "Towing / Pushing Vessel (Tow)",
    "Trawler",
    "Fishing Vessel (not trawling)",
    "Sailing Vessel",
    "Air-Cushion Vessel",
    "Pilot Vessel",
    "Mine Clearance Vessel",
    "Constrained by Draft (C.B.D.)"
];

const maneuveringStatusesList = [
    "Underway (Making Way)",
    "Underway (Stopped / Not Making Way)",
    "At Anchor",
    "Restricted in Ability to Maneuver (R.A.M.)",
    "Towing alongside / Pushing ahead",
    "Underway (Towing / Pushing)",
    "Mine clearance operations",
    "Dredging / Obstruction operations",
    "Not Under Command (N.U.C.)",
    "Vessel Aground"
];

const seenFromList = [
    "seen from port side",
    "seen from starboard side",
    "seen end on",
    "seen from astern",
    "not specified"
];

function loadQuizQuestion() {
    // Hide feedback panel
    quizFeedbackPanel.classList.add('hidden');
    quizOptionsContainer.innerHTML = '';
    
    if (currentQueue.length === 0 || currentIndex >= currentQueue.length) return;
    
    const item = currentQueue[currentIndex];
    const card = cardsData[item.cardId];
    
    quizCardFailed = false;
    quizCurrentStep = 1;
    quizStepsList = [
        {
            type: 'type_of_vessel',
            correctText: card.type_of_vessel,
            prompt: "Step 1 of 4: Identify the Type of Vessel:"
        },
        {
            type: 'maneuvering_status',
            correctText: card.maneuvering_status,
            prompt: "Step 2 of 4: Identify the Maneuvering Status:"
        },
        {
            type: 'seen_from',
            correctText: card.seen_from,
            prompt: "Step 3 of 4: Identify the aspect (seen from):"
        },
        {
            type: 'day_signal',
            correctText: card.day_signal,
            prompt: "Step 4 of 4: Identify the Day Signal displayed:"
        }
    ];

    // Configure static view options (images, labels, badges)
    if (item.type === 'night') {
        quizQuestionImg.src = `images/night/NightSignal${item.cardId}.gif`;
        quizQuestionImg.alt = `Quiz Night Signal Card #${item.cardId}`;
        quizCardNumberLabel.textContent = `Signal #${item.cardId}`;
        quizQuestionTypeBadge.textContent = 'Night Signal';
        quizQuestionTypeBadge.className = 'badge badge-teal';
    } else {
        quizQuestionImg.src = `images/day/DayImage${item.cardId}.gif`;
        quizQuestionImg.alt = `Quiz Day Signal Card #${item.cardId}`;
        quizCardNumberLabel.textContent = `Signal #${item.cardId}`;
        quizQuestionTypeBadge.textContent = 'Day Shape';
        quizQuestionTypeBadge.className = 'badge';
    }

    quizQuestionImg.onerror = () => {
        quizQuestionImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="284" height="180" viewBox="0 0 284 180"><rect width="100%" height="100%" fill="%23111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23555" font-family="sans-serif" font-size="14">Image Missing</text></svg>';
    };

    // Load first step
    loadQuizStep();
}

function loadQuizStep() {
    quizOptionsContainer.innerHTML = '';
    
    if (quizStepsList.length === 0 || quizCurrentStep > quizStepsList.length) return;
    
    const step = quizStepsList[quizCurrentStep - 1];
    quizPromptText.textContent = step.prompt;
    
    // Generate options based on type
    let options = [step.correctText];
    
    if (step.type === 'type_of_vessel') {
        const distractors = vesselTypesList.filter(v => v !== step.correctText);
        shuffleArray(distractors);
        options.push(...distractors.slice(0, 3));
    } else if (step.type === 'maneuvering_status') {
        const distractors = maneuveringStatusesList.filter(m => m !== step.correctText);
        shuffleArray(distractors);
        options.push(...distractors.slice(0, 3));
    } else if (step.type === 'seen_from') {
        const distractors = seenFromList.filter(s => s !== step.correctText);
        shuffleArray(distractors);
        options.push(...distractors.slice(0, 3));
    } else if (step.type === 'day_signal') {
        const allCardIds = Object.keys(cardsData);
        // Distractors are other cards' day signals
        const distractors = allCardIds
            .map(id => cardsData[id].day_signal)
            .filter(d => d && d !== step.correctText && d.trim() !== "");
        const uniqueDistractors = [...new Set(distractors)];
        shuffleArray(uniqueDistractors);
        options.push(...uniqueDistractors.slice(0, 3));
    }
    
    // Fill if somehow less than 4 options
    while (options.length < 4) {
        options.push(`Distractor option placeholder ${options.length + 1}`);
    }
    
    // Shuffle combined options list
    shuffleArray(options);
    
    // Render option buttons
    const labels = ['A', 'B', 'C', 'D'];
    options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'option-btn';
        btn.id = `opt-btn-${labels[idx]}`;
        
        btn.innerHTML = `
            <span class="option-badge">${labels[idx]}</span>
            <span class="option-text">${optText}</span>
        `;
        
        btn.addEventListener('click', () => handleQuizStepAnswer(btn, optText, step.correctText));
        quizOptionsContainer.appendChild(btn);
    });
}

function handleQuizStepAnswer(selectedBtn, selectedText, correctAnswer) {
    const buttons = quizOptionsContainer.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    const isCorrect = selectedText === correctAnswer;
    const item = currentQueue[currentIndex];
    
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        
        // If there's another step, transition after 800ms delay
        if (quizCurrentStep < quizStepsList.length) {
            setTimeout(() => {
                quizCurrentStep++;
                loadQuizStep();
            }, 800);
        } else {
            // Last step correct, and card hasn't failed in previous steps
            if (!quizCardFailed) {
                quizScore++;
                quizAnswers.push({
                    cardId: item.cardId,
                    type: item.type,
                    correct: true
                });
                feedbackTitle.textContent = "Correct! Card Identified";
                feedbackIcon.className = "fa-solid fa-circle-check";
                quizFeedbackPanel.className = "feedback-panel correct-theme";
            } else {
                feedbackTitle.textContent = "Session review";
            }
            showQuizFeedback();
        }
    } else {
        // Failed this step
        selectedBtn.classList.add('incorrect');
        quizCardFailed = true;
        
        // Highlight correct button
        buttons.forEach(btn => {
            const btnText = btn.querySelector('.option-text').textContent;
            if (btnText === correctAnswer) {
                btn.classList.add('correct');
            }
        });
        
        // Record failure
        quizAnswers.push({
            cardId: item.cardId,
            type: item.type,
            correct: false
        });
        if (!missedCards.includes(item.cardId)) {
            missedCards.push(item.cardId);
        }
        
        // Stop steps and immediately show feedback card after 1000ms delay
        setTimeout(() => {
            feedbackTitle.textContent = `Incorrect on Step ${quizCurrentStep}!`;
            feedbackIcon.className = "fa-solid fa-circle-xmark";
            quizFeedbackPanel.className = "feedback-panel incorrect-theme";
            showQuizFeedback();
        }, 1000);
    }
}

function showQuizFeedback() {
    const item = currentQueue[currentIndex];
    const card = cardsData[item.cardId];
    
    // Fill detailed feedback fields
    feedbackDescIdent.textContent = card.identification || '-';
    feedbackDescAction.textContent = card.action || '-';
    feedbackDescDay.textContent = card.day_signal || '-';
    feedbackDescFog.textContent = card.fog_signal || '-';
    
    quizFeedbackPanel.classList.remove('hidden');
    
    // Change button text on final question
    if (currentIndex === currentQueue.length - 1) {
        btnQuizContinue.innerHTML = `Finish & Score <i class="fa-solid fa-flag-checkered"></i>`;
    } else {
        btnQuizContinue.innerHTML = `Continue <i class="fa-solid fa-arrow-right"></i>`;
    }
}

function loadNextQuizQuestion() {
    currentIndex++;
    if (currentIndex < currentQueue.length) {
        loadQuizQuestion();
        updateProgressBar();
    } else {
        showResults();
    }
}


/* ==========================================================================
   RESULTS SUMMARY LOGIC
   ========================================================================== */

function showResults() {
    showView('results');
    
    const total = currentQueue.length;
    const accuracy = total > 0 ? Math.round((quizScore / total) * 100) : 0;
    
    // Overall Stats
    resultsTotal.textContent = total;
    resultsCorrect.textContent = quizScore;
    resultsIncorrect.textContent = total - quizScore;
    resultsModePlayed.textContent = sessionMode === 'quiz' ? 'Quiz Mode' : 'Trainer Mode';

    if (sessionMode === 'quiz') {
        // Animate circular accuracy gauge
        resultsScorePercent.textContent = `${accuracy}%`;
        const circularProgress = document.querySelector('.circular-progress');
        circularProgress.style.background = `conic-gradient(var(--primary) ${accuracy * 3.6}deg, rgba(255,255,255,0.05) 0deg)`;
        
        // List review cards if there are incorrect answers
        if (missedCards.length > 0) {
            resultsReviewSection.classList.remove('hidden');
            resultsReviewList.innerHTML = '';
            
            missedCards.forEach(id => {
                const card = cardsData[id];
                const item = document.createElement('div');
                item.className = 'review-card-item';
                
                item.innerHTML = `
                    <div class="review-card-thumb-wrapper">
                        <img class="signal-img" src="images/night/NightSignal${id}.gif" alt="Thumbnail">
                    </div>
                    <div>
                        <strong>Card #${id}</strong>
                        <p style="font-size: 0.82rem; color: var(--text-muted);">${card.identification}</p>
                    </div>
                `;
                resultsReviewList.appendChild(item);
            });
        } else {
            resultsReviewSection.classList.add('hidden');
        }
    } else {
        // Trainer Mode finish stats
        resultsScorePercent.textContent = '100%';
        const circularProgress = document.querySelector('.circular-progress');
        circularProgress.style.background = `conic-gradient(var(--accent) 360deg, rgba(255,255,255,0.05) 0deg)`;
        resultsReviewSection.classList.add('hidden');
    }
}
