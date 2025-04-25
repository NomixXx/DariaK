
// Получаем данные из localStorage или создаем их по умолчанию
let faculties = JSON.parse(localStorage.getItem('faculties')) || {
    "full-time": [ // Факультеты для очного обучения
        
        "38.03.05 Бизнес-информатика. Цифровая трансформация управления бизнесом",
        "38.03.01 Экономика. Финансовая разведка, управление рисками и экономическая безопасность",
        "38.03.02 Менеджмент. Управление бизнесом", // Ваш новый факультет
        "42.03.01 Реклама и связи с общественностью. Реклама и связи с общественностью"
    ],
    "blended": [ // Факультеты для очно-заочного обучения
        
        "38.03.01 Экономика. Корпоративные финансы",
        "38.03.02 Менеджмент. Логистика",
        "38.03.02 Менеджмент. Управление бизнесом" // Ваш новый факультет
    ],
    "distance": [ // Факультеты для заочного обучения
        
        "27.03.05 Инноватика. Управление цифровыми инновациями",
        "43.03.02 Туризм. Туристический и гостиничный бизнес",
         // Ваш новый факультет
    ]
};

// Постоянные вопросы (не будут удаляться при localStorage.clear())
const defaultQuestions = [
    { question: "Как вы оцениваете уровень преподавателей?", options: generateOptions() },
    { question: "Насколько удобно организован учебный процесс?", options: generateOptions() },
    { question: "Как вы оцениваете доступность учебных материалов?", options: generateOptions() },
    { question: "Насколько вы довольны оборудованием аудиторий?", options: generateOptions() },
    { question: "Как вы оцениваете взаимодействие с администрацией?", options: generateOptions() },
    { question: "Насколько вам нравится атмосфера на факультете?", options: generateOptions() },
    { question: "Как вы оцениваете возможность участия в мероприятиях?", options: generateOptions() },
    { question: "Насколько вы удовлетворены уровнем поддержки студентов?", options: generateOptions() },
    { question: "Как вы оцениваете перспективы трудоустройства после обучения?", options: generateOptions() },
    { question: "Насколько комфортно вам учиться на этом факультете?", options: generateOptions() }
];

// Результаты опросов
let results = JSON.parse(localStorage.getItem('results')) || {};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const trainingType = urlParams.get('trainingType') || "full-time";
    if (!faculties[trainingType]) {
        alert("Нет доступных факультетов для этого типа обучения.");
        window.location.href = "index.html";
        return;
    }
    populateFacultySelect(trainingType); // Загружаем список факультетов
});

// Функция для загрузки факультетов выбранного типа обучения
function populateFacultySelect(trainingType) {
    const facultySelect = document.getElementById('facultySelect');
    facultySelect.innerHTML = ''; // Очищаем выпадающий список
    if (faculties[trainingType]) {
        faculties[trainingType].forEach(faculty => {
            const option = document.createElement('option'); // Создаем новый элемент <option>
            option.value = encodeURIComponent(faculty); // Кодируем название факультета
            option.textContent = decodeURIComponent(faculty); // Отображаем декодированное название
            facultySelect.appendChild(option); // Добавляем элемент в выпадающий список
        });
    }
}

// Функция для начала опроса
function startQuiz() {
    const selectedFacultyEncoded = document.getElementById('facultySelect').value;
    if (!selectedFacultyEncoded) {
        alert("Выберите факультет перед началом опроса."); // Проверка выбора факультета
        return;
    }

    const decodedFaculty = decodeURIComponent(selectedFacultyEncoded);
    const facultyQuestions = getQuestionsForFaculty(decodedFaculty);

    if (facultyQuestions.length === 0) {
        alert("Нет вопросов для данного факультета."); // Проверка наличия вопросов
        return;
    }

    renderQuestionsForFaculty(decodedFaculty, facultyQuestions); // Отображаем вопросы
}

// Функция для получения вопросов для факультета
function getQuestionsForFaculty(facultyName) {
    // Возвращаем стандартные вопросы, так как они постоянны
    return defaultQuestions;
}

// Функция для генерации вариантов ответов
function generateOptions() {
    return [
        { text: "Очень плохо", score: 1 }, // Ответ с баллами
        { text: "Плохо", score: 2 },
        { text: "Удовлетворительно", score: 3 },
        { text: "Хорошо", score: 4 },
        { text: "Отлично", score: 5 }
    ];
}

// Функция для отображения вопросов
function renderQuestionsForFaculty(facultyName, facultyQuestions) {
    const container = document.getElementById('questionsList');
    container.innerHTML = ''; // Очищаем контейнер с вопросами
    const questionsContainer = document.getElementById('questionsContainer');
    if (!facultyQuestions) {
        alert("Нет вопросов для данного факультета."); // Проверка наличия вопросов
        return;
    }

    questionsContainer.classList.remove('hidden'); // Показываем контейнер с вопросами

    facultyQuestions.forEach((q, index) => { // Проходим по всем вопросам
        const div = document.createElement('div');
        div.className = 'question-block'; // Класс для блока вопроса
        div.innerHTML = `
            <h3>${index + 1}. ${q.question}</h3> <!-- Текст вопроса -->
            <div class="options-container"> <!-- Контейнер для вариантов ответов -->
                ${q.options.map((option, i) => `
                    <label>
                        <input type="radio" name="q${index}" value="${option.score}">
                        ${option.text} (${option.score} баллов)
                    </label>
                `).join('')}
            </div>
        `;
        container.appendChild(div); // Добавляем блок вопроса на страницу
    });
}

// Функция для отправки результатов
function submitQuiz() {
    const facultySelect = document.getElementById('facultySelect');
    const selectedFacultyEncoded = facultySelect.value;
    if (!selectedFacultyEncoded) {
        alert("Выберите факультет перед отправкой ответов."); // Проверка выбора факультета
        return;
    }

    const quizForm = document.getElementById('quizForm');
    const totalScore = Array.from(quizForm.querySelectorAll('input[type="radio"]:checked'))
        .reduce((sum, input) => sum + parseInt(input.value), 0); // Считаем сумму баллов

    // Проверяем, ответили ли на все вопросы
    const unansweredQuestions = Array.from(quizForm.querySelectorAll('.question-block')).filter(block => {
        const radioButtons = block.querySelectorAll('input[type="radio"]');
        return !Array.from(radioButtons).some(button => button.checked); // Проверяем, есть ли непройденные вопросы
    });

    if (unansweredQuestions.length > 0) {
        alert(`Вы не ответили на ${unansweredQuestions.length} вопрос${unansweredQuestions.length === 1 ? '' : unansweredQuestions.length > 4 ? 'ов' : 'а'}.`);
        return;
    }

    if (totalScore === 0) {
        alert("Произошла ошибка при подсчете баллов."); // Защита от ошибок
        return;
    }

    const date = new Date().toLocaleString(); // Текущая дата и время
    const decodedFaculty = decodeURIComponent(selectedFacultyEncoded);
    results[decodedFaculty] = results[decodedFaculty] || []; // Инициализируем массив результатов для факультета
    results[decodedFaculty].push({ totalScore, date }); // Добавляем результаты
    localStorage.setItem('results', JSON.stringify(results)); // Сохраняем результаты в localStorage
    alert("Спасибо за ваши ответы!"); // Сообщение после отправки
    window.location.href = "index.html"; // Возвращаемся на главную страницу
}
// Исходный код консоли
const originalConsoleLog = console.log;
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

// Переопределение методов консоли
console.log = function (...args) {
    if (!checkConsolePassword()) {
        alert("Доступ к консоли заблокирован!");
        return;
    }
    originalConsoleLog.apply(console, args);
};

console.warn = function (...args) {
    if (!checkConsolePassword()) {
        alert("Доступ к консоли заблокирован!");
        return;
    }
    originalConsoleWarn.apply(console, args);
};


// Функция для проверки пароля
function checkConsolePassword() {
    const password = prompt("Введите пароль для доступа к консоли:", "");
    if (password !== "Admin159951") { // Замените "your_password_here" на ваш пароль
        alert("Неверный пароль!");
        return false;
    }
    
    return true;
}
