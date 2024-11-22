class QuizApp {
    constructor() {
        this.questions = {
            general: [
                {
                    question: "What is the capital of France?",
                    options: ["London", "Berlin", "Paris", "Madrid"],
                    correctAnswer: 2
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Saturn"],
                    correctAnswer: 1
                },
                // Add more general knowledge questions
            ],
            science: [
                {
                    question: "What is the chemical symbol for Gold?",
                    options: ["Ag", "Fe", "Au", "Cu"],
                    correctAnswer: 2
                },
                {
                    question: "Which is the smallest unit of life?",
                    options: ["Atom", "Molecule", "Cell", "Tissue"],
                    correctAnswer: 2
                },
                // Add more science questions
            ]
        };

        this.currentCategory = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 60;

        this.initEventListeners();
    }

    initEventListeners() {
        // Category Selection
        document.querySelectorAll('.category-buttons button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentCategory = e.target.dataset.category;
                document.querySelectorAll('.category-buttons button').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });

        // Start Quiz
        document.getElementById('start-quiz-btn').addEventListener('click', () => {
            if (this.currentCategory) {
                this.startQuiz();
            } else {
                alert('Please select a quiz category');
            }
        });

        // Option Selection
        document.getElementById('options-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('option')) {
                this.selectOption(e.target);
            }
        });

        // Next Question
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Restart Quiz
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.resetQuiz();
        });
    }

    startQuiz() {
        this.hideAllPages();
        document.getElementById('quiz-page').classList.add('active');
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.loadQuestion();
        this.startTimer();
    }

    loadQuestion() {
        const currentQuestions = this.questions[this.currentCategory];
        const question = currentQuestions[this.currentQuestionIndex];
        
        document.getElementById('question-text').textContent = question.question;
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = currentQuestions.length;

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionsContainer.appendChild(optionElement);
        });
    }

    selectOption(optionElement) {
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });
        optionElement.classList.add('selected');
    }

    nextQuestion() {
        const selectedOption = document.querySelector('.option.selected');
        if (!selectedOption) {
            alert('Please select an option');
            return;
        }

        const currentQuestions = this.questions[this.currentCategory];
        const currentQuestion = currentQuestions[this.currentQuestionIndex];
        const selectedIndex = parseInt(selectedOption.dataset.index);

        if (selectedIndex === currentQuestion.correctAnswer) {
            this.score++;
            selectedOption.classList.add('correct');
        } else {
            selectedOption.classList.add('incorrect');
            const correctOption = document.querySelector(`.option[data-index="${currentQuestion.correctAnswer}"]`);
            correctOption.classList.add('correct');
        }

        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < currentQuestions.length) {
            setTimeout(() => {
                this.loadQuestion();
            }, 1000);
        } else {
            this.endQuiz();
        }
    }

    startTimer() {
        this.timeLeft = 60;
        const timerElement = document.getElementById('timer');
        this.timer = setInterval(() => {
            this.timeLeft--;
            timerElement.textContent = `Time Left: ${this.timeLeft}s`;

            if (this.timeLeft <= 0) {
                this.endQuiz();
            }
        }, 1000);
    }

    endQuiz() {
        clearInterval(this.timer);
        this.hideAllPages();
        document.getElementById('results-page').classList.add('active');
        
        const currentQuestions = this.questions[this.currentCategory];
        document.getElementById('final-score').textContent = `${this.score}/${currentQuestions.length}`;
    }

    resetQuiz() {
        this.hideAllPages();
        document.getElementById('landing-page').classList.add('active');
        this.currentCategory = null;
        document.querySelectorAll('.category-buttons button').forEach(b => b.classList.remove('selected'));
    }

    hideAllPages() {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
    }
}

// Initialize the quiz app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});