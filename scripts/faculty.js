// Функция для отправки результатов
async function submitQuiz() {
    const facultySelect = document.getElementById('facultySelect');
    const selectedFacultyEncoded = facultySelect.value;
    if (!selectedFacultyEncoded) {
        alert("Выберите факультет перед отправкой ответов.");
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

    // Сохраняем результаты в results
    results[decodedFaculty] = results[decodedFaculty] || [];
    results[decodedFaculty].push({ totalScore, date });

    // Сохраняем результаты в localStorage
    localStorage.setItem('results', JSON.stringify(results));

    // Создаем текстовое представление результатов
    const resultText = `Факультет: ${decodedFaculty}\nДата: ${date}\nОбщий балл: ${totalScore}\n\n`;

    // Записываем результаты в txt файл
    saveResultsToTxt(resultText);

    alert("Спасибо за ваши ответы!"); // Сообщение после отправки
    window.location.href = "index.html"; // Возвращаемся на главную страницу
}

// Функция для сохранения результатов в .txt файл
function saveResultsToTxt(resultText) {
    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Создаем ссылку для скачивания
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz_results.txt'; // Имя файла
    a.click();

    // Очищаем URL после скачивания
    URL.revokeObjectURL(url);
}

// Функция для загрузки результатов из .txt файла
function loadResultsFromTxt(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("Файл не выбран.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        processResultsFromTxt(content);
    };

    reader.readAsText(file);
}

// Функция для обработки результатов из .txt файла
function processResultsFromTxt(content) {
    const lines = content.split('\n');
    lines.forEach(line => {
        if (line.startsWith('Факультет:')) {
            const faculty = line.replace('Факультет:', '').trim();
            results[faculty] = results[faculty] || [];
        } else if (line.startsWith('Общий балл:')) {
            const totalScore = parseInt(line.replace('Общий балл:', '').trim());
            const date = lines[lines.indexOf(line) - 1].replace('Дата:', '').trim();
            results[faculty].push({ totalScore, date });
        }
    });

    // Обновляем localStorage с новыми результатами
    localStorage.setItem('results', JSON.stringify(results));
    alert("Результаты успешно загружены из файла!");
}

// Добавляем обработчик для кнопки загрузки файла
document.getElementById('uploadResults').addEventListener('change', loadResultsFromTxt);
