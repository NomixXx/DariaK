// Получаем результаты из localStorage или создаем пустой объект
let results = JSON.parse(localStorage.getItem('results')) || {};

document.addEventListener('DOMContentLoaded', () => {
    displayResults(); // Отображаем результаты при загрузке страницы
});

// Функция для отображения результатов
function displayResults() {
    const resultsTableBody = document.querySelector('#resultsTable tbody');
    resultsTableBody.innerHTML = ''; // Очищаем таблицу

    // Преобразуем результаты в массив объектов для сортировки
    const sortedResults = Object.keys(results)
        .map(facultyKey => {
            const decodedFaculty = decodeURIComponent(facultyKey); // Декодируем название факультета
            const facultyResults = results[facultyKey]; // Получаем результаты для факультета

            if (!facultyResults || facultyResults.length === 0) return null; // Пропускаем факультеты без результатов

            // Считаем общую сумму баллов и количество отзывов
            const totalScores = facultyResults.reduce((sum, result) => sum + result.totalScore, 0);
            const reviewCount = facultyResults.length;

            return {
                faculty: decodedFaculty,
                totalScore: totalScores, // Общая сумма баллов
                reviewCount: reviewCount // Количество отзывов
            };
        })
        .filter(Boolean) // Убираем null значения
        .sort((a, b) => b.totalScore - a.totalScore); // Сортируем по убыванию общей суммы баллов

    // Отображаем отсортированные результаты в таблице
    sortedResults.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.faculty}</td> <!-- Название факультета -->
            <td>${result.totalScore}</td> <!-- Общая сумма баллов -->
            <td>${result.reviewCount}</td> <!-- Количество отзывов -->
        `;
        resultsTableBody.appendChild(row); // Добавляем строку в таблицу
    });

    if (sortedResults.length === 0) {
        alert("Пока нет данных для отображения результатов.");
    }
}

// Функция для редактирования общей суммы баллов через код
function editFinalScores() {
    const updatedResults = {}; // Создаем новый объект для результатов

    // Проходим по всем факультетам в results
    Object.keys(results).forEach(facultyKey => {
        const decodedFaculty = decodeURIComponent(facultyKey); // Декодируем название факультета
        const currentTotalScore = calculateTotalScore(results[facultyKey]); // Текущая общая сумма баллов
        const currentReviewCount = results[facultyKey].length; // Количество отзывов

        // Запрашиваем новое значение общей суммы баллов
        const newTotalScore = parseFloat(
            prompt(
                `Введите новую общую сумму баллов для факультета "${decodedFaculty}"\n` +
                `(Текущая сумма баллов: ${currentTotalScore}, Количество отзывов: ${currentReviewCount})`
            )
        );

        if (!isNaN(newTotalScore)) {
            // Создаем новые фиктивные результаты с заданной общей суммой баллов
            updatedResults[facultyKey] = generateMockResults(decodedFaculty, newTotalScore, currentReviewCount);
        } else {
            alert(`Некорректное значение для факультета "${decodedFaculty}".`);
        }
    });

    // Сохраняем обновленные результаты в localStorage
    localStorage.setItem('results', JSON.stringify(updatedResults));
    results = updatedResults; // Обновляем глобальную переменную results
    displayResults(); // Перерисовываем таблицу
}

// Функция для расчета текущей общей суммы баллов
function calculateTotalScore(facultyResults) {
    if (!facultyResults || facultyResults.length === 0) return 0;

    return facultyResults.reduce((sum, result) => sum + result.totalScore, 0);
}

// Функция для генерации фиктивных результатов с заданной общей суммой баллов
function generateMockResults(facultyName, targetTotalScore, reviewCount) {
    const mockResults = [];

    // Генерируем фиктивные результаты так, чтобы их общая сумма равнялась targetTotalScore
    for (let i = 0; i < reviewCount; i++) {
        const scorePerReview = Math.round(targetTotalScore / reviewCount); // Распределяем баллы между отзывами
        const date = new Date().toLocaleString(); // Текущая дата
        mockResults.push({ totalScore: scorePerReview, date });
    }

    return mockResults;
}


// editFinalScores(); - ввести в консоли и указать нужное кол-во баллов