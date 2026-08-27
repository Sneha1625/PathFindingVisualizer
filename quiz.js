const questions = [
    {
        question: "🔍 What does BFS stand for?",
        answers: [
            { text: "Binary File System", correct: false },
            { text: "Breadth First Search", correct: true },
            { text: "Best First Sort", correct: false },
            { text: "Back Forward Search", correct: false }
        ]
    },
    {
        question: "🚀 Which algorithm uses a priority queue?",
        answers: [
            { text: "DFS", correct: false },
            { text: "Dijkstra", correct: true },
            { text: "Bubble Sort", correct: false },
            { text: "Linear Search", correct: false }
        ]
    },
    {
        question: "📍 What is the time complexity of BFS in an unweighted graph?",
        answers: [
            { text: "O(V+E)", correct: true },
            { text: "O(V^2)", correct: false },
            { text: "O(log V)", correct: false },
            { text: "O(VE)", correct: false }
        ]
    },
    {
        question: "🧱 What does a wall tile represent in pathfinding?",
        answers: [
            { text: "Obstacle", correct: true },
            { text: "Start", correct: false },
            { text: "Checkpoint", correct: false },
            { text: "Destination", correct: false }
        ]
    },
    {
        question: "🎯 Which algorithm guarantees the shortest path?",
        answers: [
            { text: "DFS", correct: false },
            { text: "Greedy BFS", correct: false },
            { text: "A*", correct: true },
            { text: "None", correct: false }
        ]
    },
    {
        question: "🔗 What data structure is used in BFS?",
        answers: [
            { text: "Stack", correct: false },
            { text: "Queue", correct: true },
            { text: "Array", correct: false },
            { text: "Heap", correct: false }
        ]
    },
    {
        question: "📦 What type of algorithm is Merge Sort?",
        answers: [
            { text: "Greedy", correct: false },
            { text: "Divide and Conquer", correct: true },
            { text: "Backtracking", correct: false },
            { text: "Dynamic", correct: false }
        ]
    },
    {
        question: "⚡ Which one is a sorting algorithm?",
        answers: [
            { text: "DFS", correct: false },
            { text: "Dijkstra", correct: false },
            { text: "Bubble Sort", correct: true },
            { text: "A*", correct: false }
        ]
    },
    {
        question: "🧠 Which algorithm is heuristic-based?",
        answers: [
            { text: "A*", correct: true },
            { text: "DFS", correct: false },
            { text: "BFS", correct: false },
            { text: "Dijkstra", correct: false }
        ]
    },
    {
        question: "🎨 What is the use of visualization in pathfinding?",
        answers: [
            { text: "Entertainment", correct: false },
            { text: "To understand algorithm flow", correct: true },
            { text: "To slow down process", correct: false },
            { text: "To improve memory", correct: false }
        ]
    },
    // New additional questions
    {
        question: "🔎 What does DFS stand for?",
        answers: [
            { text: "Depth First Search", correct: true },
            { text: "Data File Search", correct: false },
            { text: "Depth File Sort", correct: false },
            { text: "Data First Search", correct: false }
        ]
    },
    {
        question: "💡 What is the primary purpose of a heuristic function in A*?",
        answers: [
            { text: "To calculate the distance to the destination", correct: true },
            { text: "To calculate the time complexity", correct: false },
            { text: "To generate the path", correct: false },
            { text: "To select the shortest path", correct: false }
        ]
    },
    {
        question: "🧩 Which algorithm is best used for searching a large set of data in a graph?",
        answers: [
            { text: "A*", correct: false },
            { text: "Dijkstra", correct: true },
            { text: "DFS", correct: false },
            { text: "BFS", correct: false }
        ]
    },
    {
        question: "🔑 In pathfinding, what does a 'start' node represent?",
        answers: [
            { text: "The point where the pathfinding starts", correct: true },
            { text: "The destination point", correct: false },
            { text: "An obstacle", correct: false },
            { text: "A checkpoint", correct: false }
        ]
    },
    {
        question: "📚 Which of the following algorithms is considered an example of divide and conquer?",
        answers: [
            { text: "Quick Sort", correct: true },
            { text: "DFS", correct: false },
            { text: "Bubble Sort", correct: false },
            { text: "Dijkstra", correct: false }
        ]
    }
];

// Function to shuffle the questions array
function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]]; // Swap
    }
}

// Function to select 10 random questions
function getRandomQuestions() {
    shuffleQuestions(); // Shuffle the questions
    return questions.slice(0, 10); // Select the first 10 questions after shuffling
}

const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result-container');
const scoreText = document.getElementById('score');

let currentQuestionIndex = 0;
let score = 0;
let currentQuestions = [];

function startQuiz() {
    currentQuestions = getRandomQuestions(); // Get 10 random questions
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add('hidden');
    nextButton.innerText = 'Next ➡️';
    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = currentQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    currentQuestion.answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.innerText = answer.text;
        btn.classList.add('btn');
        btn.addEventListener('click', () => selectAnswer(btn, answer.correct));
        answerButtons.appendChild(btn);
    });
}

function resetState() {
    feedback.innerText = '';
    nextButton.style.display = 'none';
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(button, isCorrect) {
    const buttons = answerButtons.children;
    for (let btn of buttons) {
        btn.disabled = true;
    }

    if (isCorrect) {
        button.classList.add('correct');
        feedback.innerText = "✅ Correct!";
        score++;
    } else {
        button.classList.add('wrong');
        feedback.innerText = "❌ Incorrect!";
        for (let btn of buttons) {
            if (btn.innerText === currentQuestions[currentQuestionIndex].answers.find(a => a.correct).text) {
                btn.classList.add('correct');
            }
        }
    }
    nextButton.style.display = 'inline-block';
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    document.getElementById('question-container').style.display = 'none';
    nextButton.style.display = 'none';
    resultContainer.classList.remove('hidden');
    scoreText.innerText = `You scored ${score} out of ${currentQuestions.length} 🎉`;

// Save the score to localStorage
    let userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        userData.score = score; // Save the score in the user's data
        localStorage.setItem('userData', JSON.stringify(userData)); // Save updated user data
    }
}

startQuiz();
