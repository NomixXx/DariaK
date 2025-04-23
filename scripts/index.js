document.addEventListener('DOMContentLoaded', () => {
    // При загрузке страницы ничего не делаем, так как это просто ссылки
});

// Функция для очистки всех данных в localStorage
function clearAllData() {
    if (confirm("Вы уверены, что хотите очистить все данные?")) {
        localStorage.clear(); // Очищаем все данные
        alert("Все данные успешно очищены!");
        window.location.reload(); // Перезагружаем страницу
    }
}

// Функция для тестирования добавления факультетов и вопросов
function testAddFaculties() {
    const testFaculties = {
        "full-time": ["Факультет бизнеса", "Факультет экономики"],
        "blended": ["Факультет информатики", "Факультет права"],
        "distance": ["Факультет психологии", "Факультет туризма"]
    };

    let faculties = JSON.parse(localStorage.getItem('faculties')) || {};
    let questions = JSON.parse(localStorage.getItem('questions')) || {};

    // Добавляем тестовые факультеты
    Object.keys(testFaculties).forEach(type => {
        if (!faculties[type]) {
            faculties[type] = [];
        }

        testFaculties[type].forEach(faculty => {
            if (!faculties[type].includes(faculty)) {
                faculties[type].push(faculty); // Добавляем новый факультет
                const encodedFaculty = encodeURIComponent(faculty);
                if (!questions[encodedFaculty]) {
                    questions[encodedFaculty] = generateDefaultQuestions(); // Генерируем вопросы для нового факультета
                }
            }
        });
    });

    localStorage.setItem('faculties', JSON.stringify(faculties)); // Сохраняем факультеты
    localStorage.setItem('questions', JSON.stringify(questions)); // Сохраняем вопросы

    alert("Тестовые факультеты и вопросы успешно добавлены!");
}

// Функция для генерации десяти вопросов по умолчанию
function generateDefaultQuestions() {
    return Array.from({ length: 10 }, (_, i) => { // Создаем массив из 10 вопросов
        return {
            question: `Вопрос ${i + 1}`, // Текст вопроса
            options: generateOptions() // Варианты ответов
        };
    });
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


