// URL вашего GitHub repository и файла с результатами
const GITHUB_API_URL = "https://nomixxx.github.io/DariaK/";
const GITHUB_TOKEN = "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"; // Замените на ваш токен

// Получаем результаты из GitHub или создаем пустой объект
async function fetchResults() {
    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        if (!response.ok) {
            console.error("Не удалось загрузить результаты с GitHub.");
            return {};
        }

        const data = await response.json();
        const resultsContent = atob(data.content); // Расшифровываем Base64
        return JSON.parse(resultsContent);
    } catch (error) {
        console.error("Ошибка при получении результатов:", error);
        return {};
    }
}

// Сохраняем результаты на GitHub
async function saveResultsToGitHub(newResults) {
    try {
        const currentResults = await fetchResults();

        // Объединяем текущие результаты с новыми
        for (const faculty in newResults) {
            if (!currentResults[faculty]) {
                currentResults[faculty] = [];
            }
            currentResults[faculty].push(...newResults[faculty]);
        }

        // Подготавливаем данные для отправки
        const content = btoa(JSON.stringify(currentResults)); // Кодируем в Base64
        const shaResponse = await fetch(GITHUB_API_URL, {
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            }
        });
        const shaData = await shaResponse.json();

        // Отправляем обновленные результаты
        const updateResponse = await fetch(GITHUB_API_URL, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Обновление результатов опроса",
                content,
                sha: shaData.sha
            })
        });

        if (!updateResponse.ok) {
            console.error("Не удалось сохранить результаты на GitHub.");
        } else {
            console.log("Результаты успешно сохранены!");
        }
    } catch (error) {
        console.error("Ошибка при сохранении результатов:", error);
    }
}

// Функция для отправки результатов
function submitQuiz() {
    const facultySelect = document.getElementById('facultySelect');
    const selectedFacultyEncoded = facultySelect.value;
    if (!selectedFacultyEncoded) {
        alert("Выберите факультет перед отправкой ответов.");
        return;
    }

    const quizForm = document.getElementById('quizForm');
    const totalScore = Array.from(quizForm.querySelectorAll('input[type="radio"]:checked'))
        .reduce((sum, input) => sum + parseInt(input.value), 0);

    const unansweredQuestions = Array.from(quizForm.querySelectorAll('.question-block')).filter(block => {
        const radioButtons = block.querySelectorAll('input[type="radio"]');
        return !Array.from(radioButtons).some(button => button.checked);
    });

    if (unansweredQuestions.length > 0) {
        alert(`Вы не ответили на ${unansweredQuestions.length} вопрос${unansweredQuestions.length === 1 ? '' : unansweredQuestions.length > 4 ? 'ов' : 'а'}.`);
        return;
    }

    if (totalScore === 0) {
        alert("Произошла ошибка при подсчете баллов.");
        return;
    }

    const date = new Date().toLocaleString();
    const decodedFaculty = decodeURIComponent(selectedFacultyEncoded);
    const newResult = { totalScore, date };

    // Сохраняем результаты на GitHub
    const updatedResults = { [decodedFaculty]: [newResult] };
    saveResultsToGitHub(updatedResults);

    alert("Спасибо за ваши ответы!");
    window.location.href = "index.html";
}

// Отображение результатов
async function displayResults() {
    const resultsTableBody = document.querySelector('#resultsTable tbody');
    resultsTableBody.innerHTML = ''; // Очищаем таблицу

    const results = await fetchResults();

    // Преобразуем результаты в массив объектов для сортировки
    const sortedResults = Object.keys(results)
        .map(facultyKey => {
            const decodedFaculty = decodeURIComponent(facultyKey);
            const facultyResults = results[facultyKey];

            if (!facultyResults || facultyResults.length === 0) return null;

            const totalScores = facultyResults.reduce((sum, result) => sum + result.totalScore, 0);
            const reviewCount = facultyResults.length;

            return {
                faculty: decodedFaculty,
                totalScore: totalScores,
                reviewCount: reviewCount
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.totalScore - a.totalScore);

    // Отображаем отсортированные результаты в таблице
    sortedResults.forEach(result => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.faculty}</td>
            <td>${result.totalScore}</td>
            <td>${result.reviewCount}</td>
        `;
        resultsTableBody.appendChild(row);
    });

    if (sortedResults.length === 0) {
        alert("Пока нет данных для отображения результатов.");
    }
}
