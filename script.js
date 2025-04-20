// script.js

// Store participant name and score
let participantName = "";
let score = 0;
let userAnswers = {}; // Store user's answers
let timeLeft = 360; // 6 minutes in seconds
let timerInterval;

// Timer logic
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Time Left: ${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      saveAnswers(); // Save answers before navigating
      nextPage();
    }
  }, 1000);
}

// Navigation logic
function startQuiz() {
  participantName = document.getElementById('name').value;
  if (!participantName) {
    alert("Please enter your name to start the quiz.");
    return;
  }
  localStorage.setItem('participantName', participantName);
  window.location.href = 'page-1.html';
}

function nextPage() {
  const currentPage = window.location.pathname.split('/').pop();
  const form = document.getElementById('quiz-form');
  if (form) {
    const questions = form.querySelectorAll('.question');
    let allAnswered = true;
    questions.forEach((question, index) => {
      const selectedOption = question.querySelector('input[type="radio"]:checked');
      if (!selectedOption) {
        allAnswered = false;
      }
    });

    if (!allAnswered) {
      alert("Please answer all questions before proceeding.");
      return;
    }
  }

  saveAnswers(); // Save answers before navigating

  if (currentPage === 'index.html') {
    window.location.href = 'page-1.html';
  } else if (currentPage === 'page-1.html') {
    window.location.href = 'page-2.html';
  } else if (currentPage === 'page-2.html') {
    window.location.href = 'page-3.html';
  } else if (currentPage === 'page-3.html') {
    window.location.href = 'page-4.html';
  } else if (currentPage === 'page-4.html') {
    window.location.href = 'page-5.html';
  } else if (currentPage === 'page-5.html') {
    window.location.href = 'results.html';
  }
}

// Save user's answers
function saveAnswers() {
  const form = document.getElementById('quiz-form');
  if (form) {
    const questions = form.querySelectorAll('.question');
    questions.forEach((question, index) => {
      const selectedOption = question.querySelector('input[type="radio"]:checked');
      const questionNumber = `q${(getPageNumber() - 1) * 5 + index + 1}`; // Calculate question number globally
      userAnswers[questionNumber] = selectedOption ? selectedOption.value : null; // Store null if no answer is selected
    });
  }

  // Retrieve existing answers from localStorage and merge with current answers
  const storedAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {};
  const updatedAnswers = { ...storedAnswers, ...userAnswers }; // Merge stored and current answers
  localStorage.setItem('userAnswers', JSON.stringify(updatedAnswers)); // Save merged answers to localStorage
}

// Get page number (1, 2, 3, 4, or 5)
function getPageNumber() {
  const currentPage = window.location.pathname.split('/').pop();
  switch (currentPage) {
    case 'page-1.html': return 1;
    case 'page-2.html': return 2;
    case 'page-3.html': return 3;
    case 'page-4.html': return 4;
    case 'page-5.html': return 5;
    default: return 0;
  }
}

// Calculate score
function calculateScore() {
  const correctAnswers = {
    q1: 'B', q2: 'A', q3: 'B', q4: 'B', q5: 'B', // Page 1 answers
    q6: 'A', q7: 'C', q8: 'A', q9: 'A', q10: 'C', // Page 2 answers
    q11: 'A', q12: 'A', q13: 'C', q14: 'B', q15: 'C', // Page 3 answers
    q16: 'A', q17: 'B', q18: 'A', q19: 'B', q20: 'C', // Page 4 answers
    q21: 'A', q22: 'B', q23: 'C', q24: 'B', q25: 'B', // Page 5 answers
  };

  score = 0;
  for (let i = 1; i <= 25; i++) {
    const question = `q${i}`;
    const userAnswer = userAnswers[question];
    const correctAnswer = correctAnswers[question];

    if (userAnswer && userAnswer === correctAnswer) {
      score++;
    }
  }
}

// Display results
function displayResults() {
  participantName = localStorage.getItem('participantName');
  userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || {}; // Retrieve all answers from localStorage

  calculateScore();

  document.getElementById('participant-name').textContent = participantName;
  document.getElementById('score').textContent = `${score} out of 25`; // Show score out of 25
}

// Finish and End
function finishQuiz() {
  alert("Thank you for completing the quiz!");
  localStorage.removeItem('participantName');
  localStorage.removeItem('userAnswers');
  window.location.href = 'index.html'; // Redirect to the start page
}

// Event listener for start form
document.getElementById('start-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  startQuiz();
});

// Start timer on question pages
if (window.location.pathname.includes('page')) {
  startTimer();
}

// Display results on results page
if (window.location.pathname.includes('results.html')) {
  displayResults();
}