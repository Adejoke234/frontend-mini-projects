// ---------- DOM elements ----------
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const changeLevelButton = document.getElementById("change-level-btn");
const progressBar = document.getElementById("progress");
const timerSpan = document.getElementById("timer");
const bestStart = document.getElementById("best-start");
const bestResult = document.getElementById("best-result");
const levelLabel = document.getElementById("level-label");
const resultLevel = document.getElementById("result-level");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

// ---------- Settings ----------
const TIME_PER_QUESTION = 15; // seconds for every question

// ---------- Question bank (20 questions) ----------
// q(difficulty, question, correct answer, [wrong answers])
function q(difficulty, question, correct, wrong) {
  return {
    difficulty,
    question,
    answers: [{ text: correct, correct: true }, ...wrong.map((text) => ({ text, correct: false }))],
  };
}

const quizQuestions = [
  // ----- EASY (7) -----
  q("easy", "What is the capital of France?", "Paris", ["London", "Berlin", "Madrid"]),
  q("easy", "Which planet is known as the Red Planet?", "Mars", ["Venus", "Jupiter", "Saturn"]),
  q("easy", "What is the largest ocean on Earth?", "Pacific Ocean", ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"]),
  q("easy", "Which of these is NOT a programming language?", "Banana", ["Java", "Python", "JavaScript"]),
  q("easy", "What colour do you get when you mix blue and yellow?", "Green", ["Purple", "Orange", "Brown"]),
  q("easy", "What does HTML stand for?", "HyperText Markup Language", ["High Tech Modern Language", "HyperTool Multi Language", "Home Text Markup Language"]),
  q("easy", "How many continents are there on Earth?", "7", ["5", "6", "8"]),

  // ----- MEDIUM (7) -----
  q("medium", "What is the chemical symbol for gold?", "Au", ["Go", "Gd", "Ag"]),
  q("medium", "Which CSS property changes the colour of text?", "color", ["font-color", "text-style", "background"]),
  q("medium", "Who painted the Mona Lisa?", "Leonardo da Vinci", ["Pablo Picasso", "Vincent van Gogh", "Michelangelo"]),
  q("medium", "What is the largest planet in our solar system?", "Jupiter", ["Saturn", "Neptune", "Earth"]),
  q("medium", "In JavaScript, which keyword declares a variable that cannot be reassigned?", "const", ["let", "var", "static"]),
  q("medium", "What is the capital city of Nigeria?", "Abuja", ["Lagos", "Kano", "Ibadan"]),
  q("medium", "Which gas do plants absorb from the air to make food?", "Carbon dioxide", ["Oxygen", "Nitrogen", "Hydrogen"]),

  // ----- HARD (6) -----
  q("hard", "Which element has the atomic number 26?", "Iron", ["Copper", "Zinc", "Nickel"]),
  q("hard", "What is the capital city of Australia?", "Canberra", ["Sydney", "Melbourne", "Perth"]),
  q("hard", "Who wrote the novel \"Things Fall Apart\"?", "Chinua Achebe", ["Wole Soyinka", "Chimamanda Ngozi Adichie", "Ngugi wa Thiong'o"]),
  q("hard", "What is the time complexity of binary search?", "O(log n)", ["O(n)", "O(n log n)", "O(1)"]),
  q("hard", "In JavaScript, what does typeof null return?", "\"object\"", ["\"null\"", "\"undefined\"", "\"number\""]),
  q("hard", "What does the CSS property z-index control?", "The stacking order of elements", ["The zoom level of an element", "The width of an element", "The transparency of an element"]),
];

// ---------- Quiz state ----------
let selectedDifficulty = loadDifficulty();
let activeQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let timeLeft = TIME_PER_QUESTION;
let timerId = null;

// ---------- Helpers ----------
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Fisher-Yates shuffle: returns a new array in random order
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function questionsFor(difficulty) {
  return quizQuestions.filter((question) => question.difficulty === difficulty);
}

// ---------- Saved data (kept in the browser) ----------
function loadDifficulty() {
  try {
    const saved = localStorage.getItem("quiz-difficulty");
    return ["easy", "medium", "hard"].includes(saved) ? saved : "medium";
  } catch {
    return "medium";
  }
}

// Each difficulty has its own best score
function getBestScore(difficulty) {
  try {
    const saved = localStorage.getItem(`quiz-best-${difficulty}`);
    return saved === null ? null : Number(saved);
  } catch {
    return null;
  }
}

function saveBestScore(difficulty, value) {
  try {
    localStorage.setItem(`quiz-best-${difficulty}`, value);
  } catch {
    /* storage blocked: the quiz still works, the score just is not saved */
  }
}

function showBestScore(difficulty) {
  const best = getBestScore(difficulty);
  const total = questionsFor(difficulty).length;
  const text = best === null ? "" : `Best score on ${capitalize(difficulty)}: ${best} / ${total}`;
  bestStart.textContent = text;
  bestResult.textContent = text;
}

// ---------- Difficulty picker ----------
function selectDifficulty(difficulty) {
  selectedDifficulty = difficulty;
  try {
    localStorage.setItem("quiz-difficulty", difficulty);
  } catch {
    /* ignore */
  }

  difficultyButtons.forEach((button) => {
    const active = button.dataset.difficulty === difficulty;
    button.classList.toggle("selected", active);
    button.setAttribute("aria-checked", active);
  });

  showBestScore(difficulty);
}

difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => selectDifficulty(button.dataset.difficulty));
});

selectDifficulty(selectedDifficulty);

// ---------- Event listeners ----------
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", startQuiz);
changeLevelButton.addEventListener("click", () => {
  resultScreen.classList.remove("active");
  startScreen.classList.add("active");
});

// ---------- Game flow ----------
function startQuiz() {
  // new random order every time the quiz starts or restarts
  activeQuestions = shuffle(questionsFor(selectedDifficulty));
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  totalQuestionsSpan.textContent = activeQuestions.length;
  maxScoreSpan.textContent = activeQuestions.length;
  levelLabel.textContent = capitalize(selectedDifficulty);
  resultLevel.textContent = capitalize(selectedDifficulty);

  startScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
}

function showQuestion() {
  answersDisabled = false;

  const currentQuestion = activeQuestions[currentQuestionIndex];

  currentQuestionSpan.textContent = currentQuestionIndex + 1;
  progressBar.style.width = (currentQuestionIndex / activeQuestions.length) * 100 + "%";
  questionText.textContent = currentQuestion.question;

  answersContainer.innerHTML = "";

  // answers are shuffled too, so the correct one is not always in the same place
  shuffle(currentQuestion.answers).forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });

  startTimer();
}

// ---------- Countdown timer ----------
function startTimer() {
  clearInterval(timerId);
  timeLeft = TIME_PER_QUESTION;
  timerSpan.textContent = timeLeft;
  timerSpan.parentElement.classList.remove("low");

  timerId = setInterval(() => {
    timeLeft--;
    timerSpan.textContent = timeLeft;
    if (timeLeft <= 5) timerSpan.parentElement.classList.add("low");
    if (timeLeft <= 0) handleTimeUp();
  }, 1000);
}

// If time runs out, show the right answer and move on without a point
function handleTimeUp() {
  clearInterval(timerId);
  if (answersDisabled) return;
  answersDisabled = true;

  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") button.classList.add("correct");
  });

  setTimeout(nextQuestion, 1000);
}

function selectAnswer(event) {
  if (answersDisabled) return;

  answersDisabled = true;
  clearInterval(timerId);

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  setTimeout(nextQuestion, 1000);
}

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < activeQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  // save a new best score for this difficulty
  const best = getBestScore(selectedDifficulty);
  const isNewBest = best === null || score > best;
  if (isNewBest) saveBestScore(selectedDifficulty, score);
  showBestScore(selectedDifficulty);

  const percentage = (score / activeQuestions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }

  if (isNewBest && score > 0) resultMessage.textContent += " New best score!";
}
