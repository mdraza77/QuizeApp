// Variables
const menuButton = document.getElementById("menu-btn");
const sidePanel = document.getElementById("side-panel");
const quizContainer = document.getElementById("quiz-container");
const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const timerContainer = document.getElementById("timer-container");
const nextButton = document.getElementById("next-btn");
const scoreContainer = document.getElementById("score-container");
const questionCount = document.getElementById("question-count");
const retryButton = document.getElementById("retry-btn");
let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let timerInterval;
// let selectedCategory = 9;
// let selectedDifficulty = "easy";

// Side Panel open close
menuButton.addEventListener("click", () => {
  sidePanel.classList.toggle("open");
});
// Side Panel open close
function open_sidePannel() {
  sidePanel.classList.add("open");
}

// Set filter and start game
function applyFilters() {
  selectedCategory = document.getElementById("category-select").value;
  selectedDifficulty = document.getElementById("difficulty-select").value;
  amount = document.getElementById("amount-select").value;
  fetchQuestions();
  document.getElementById("score-box2").innerHTML = `${amount}`;
  sidePanel.classList.remove("open");
  startTimerCount();
}

// Fetch questions from Opendb database
async function fetchQuestions() {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`
  );
  const data = await response.json();
  questions = data.results;
  showNextQuestion();
}

// Show next questions
function showNextQuestion() {
  const question = questions[currentQuestionIndex];
  questionContainer.innerHTML = `
                <div>
                    <h2 title='Question Index' class='questionIndex'>${
                      currentQuestionIndex + 1
                    }-${questions.length}</h2>
                    <p class='questions'>${currentQuestionIndex + 1}. ${
    question.question
  }</p>
                </div>
            `;
  optionsContainer.innerHTML = "";
  const allOptions = [...question.incorrect_answers, question.correct_answer];
  allOptions.sort(() => Math.random() - 0.5);
  const ul = document.createElement("ul");
  allOptions.forEach((option) => {
    const li = document.createElement("li");
    li.className = "lists";
    const button = document.createElement("button");
    button.innerHTML = option;
    button.classList.add("option");
    button.addEventListener("click", () => {
      checkAnswer(button, option, question.correct_answer);
    });
    li.appendChild(button);
    ul.appendChild(li);
  });
  optionsContainer.appendChild(ul);
  startTimer();
  updateQuestionCount();
}

// Timer for game
function startTimer() {
  document.getElementById("life-btn").disabled = false;
  set_time = document.getElementById("set_time").value;
  let timeLeft = set_time;
  clearInterval(timerInterval);
  timerContainer.innerHTML = `${timeLeft}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerContainer.innerHTML = `${timeLeft}`;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

// Check ans wether it is correct or incorrect
function checkAnswer(button, selectedOption, correctAnswer) {
  clearInterval(timerInterval);
  if (selectedOption === correctAnswer) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
    const correctButton = [
      ...optionsContainer.getElementsByClassName("option"),
    ].find((b) => b.innerHTML === correctAnswer);
    if (correctButton) {
      correctButton.classList.add("correct");
    }
  }
  // scoreContainer.innerHTML = `${score}`;
  if (score < 10) {
    document.getElementById("score-box1").innerHTML = `0${score}`;
  } else {
    document.getElementById("score-box1").innerHTML = `${score}`;
  }
  disableOptions();
  nextButton.style.display = "inline-block";
}

// Disable options after choose options
function disableOptions() {
  const optionButtons = optionsContainer.getElementsByClassName("option");
  for (let button of optionButtons) {
    button.disabled = true;
    // document.getElementById("life-btn").disabled = false;
  }
  nextButton.style.display = "inline-block";
}

// Show next questions untill reached the questions limit
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showNextQuestion();
  } else {
    endQuiz();
  }
}

// Live for view answeres
let life = 5;
const lifeCountElement = document.getElementById("life-btn");
lifeCountElement.innerHTML = `💖${life}`;
function use_life() {
  const lifeCountElement = document.getElementById("life-btn");

  if (life > 0) {
    life--;
    lifeCountElement.innerHTML = `💖${life}`;

    clearInterval(timerInterval);
    const question = questions[currentQuestionIndex];
    const correctAnswer = question.correct_answer;

    const correctButton = [
      ...optionsContainer.getElementsByClassName("option"),
    ].find((b) => b.innerHTML === correctAnswer);

    if (correctButton) {
      correctButton.classList.add("correct-option");
      checkAnswer();
    }
    if (life === 0) {
      alert("No more");
    }

    scoreContainer.innerHTML = `${score}`;
    nextButton.style.display = "inline-block";
  }
}

// End the game
function endQuiz() {
  const totalQuestions = questions.length;
  const percentageScore = (score / totalQuestions) * 100;
  let message = "";
  let emoji = "";

  if (percentageScore >= 90) {
    message = "Excellent!";
    emoji = "😃";
  } else if (percentageScore >= 80) {
    message = "Great Job!";
    emoji = "😊";
  } else if (percentageScore >= 70) {
    message = "Good Effort!";
    emoji = "🙂";
  } else if (percentageScore >= 60) {
    message = "Keep Trying!";
    emoji = "😐";
  } else if (percentageScore >= 50) {
    message = "You Can Do Better!";
    emoji = "😕";
  } else if (percentageScore >= 40) {
    message = "Needs Improvement!";
    emoji = "🙁";
  } else if (percentageScore >= 30) {
    message = "Keep Practicing!";
    emoji = "😟";
  } else if (percentageScore >= 20) {
    message = "Not Quite There!";
    emoji = "😣";
  } else if (percentageScore >= 10) {
    message = "Better Luck Next Time!";
    emoji = "😔";
  } else {
    message = "Try Again!";
    emoji = "😢";
  }

  var time_taken = totalQuestions * set_time;

  if (time_taken < 60) {
    time_taken = time_taken + " second" + (time_taken !== 1 ? "s" : "");
  } else {
    var minutes = Math.floor(time_taken / 60);
    var seconds = time_taken % 60;
    time_taken =
      minutes +
      " minute" +
      (minutes !== 1 ? "s" : "") +
      (seconds > 0
        ? " and " + seconds + " second" + (seconds !== 1 ? "s" : "")
        : "");
  }

  quizContainer.innerHTML = `<h1>${message} ${emoji}</h1>`;

  const retryButton = document.createElement("button");
  // const saveRecords = document.createElement("button");
  retryButton.innerHTML = '<i class="fas fa-redo-alt"></i>';
  // saveRecords.innerText = "Save Records";
  retryButton.id = "retry-btn";
  // saveRecords.id = "saveRecords";
  retryButton.title = `Click to play again (Press Enter)`;
  retryButton.addEventListener("click", () => {
    window.location.reload();
  });

  quizContainer.appendChild(retryButton);

  document.getElementById("Score-container").style.visibility = "visible";
  document.getElementById("scr1").innerHTML = `${score}`;
  document.getElementById("scr2").innerHTML = `${amount}`;
  document.getElementById("c-ans1").innerHTML = `${score}`;
  // document.getElementById("c-ans2").innerHTML = `${amount}`;
  document.getElementById("ic-ans1").innerHTML = `${amount - score}`;
  // document.getElementById("ic-ans2").innerHTML = `${amount}`;
  document.getElementById("message").innerHTML = `${message} ${emoji}`;
  document.getElementById("time-taken").innerHTML = `${time_taken}`;
  clearInterval(timer);
}

function close_score_box() {
  document.getElementById("Score-container").style.display = "none";
}

// click events by keyboard's button press
document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const retryButton = document.getElementById("retry-btn");
    if (retryButton) {
      retryButton.click();
    } else {
      applyFilters();
    }
  }
  if (event.key === " ") {
    nextQuestion();
  }

  if (event.key === "m" || event.key === "M") {
    sidePanel.classList.toggle("open");
  }

  if (event.key === "l" || event.key === "L") {
    use_life();
  }

  if (event.key === "c" || event.key === "C") {
    close_score_box();
  }
});

// Update questions count in the top of the container
function updateQuestionCount() {
  questionCount.innerHTML = `${currentQuestionIndex + 1}/${questions.length}`;
}

nextButton.addEventListener("click", nextQuestion);

// fetchQuestions();