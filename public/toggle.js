let currentVersion = 'senior'; // 默认是高中版

function loadPoems(version) {
    fetch(`/poem/${version}`)
        .then(response => response.json())
        .then(poems => {
            const app = document.getElementById('app');
            app.innerHTML = `
                <h2>${version === 'senior' ? '高中版古诗文' : '初中版古诗文'}</h2>
                <ul>
                    ${poems.map(poem => `<li>${poem.title} - ${poem.author}</li>`).join('')}
                </ul>
            `;
        })
        .catch(error => {
            console.error('加载诗文失败:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');

    // 加载默认版本
    loadPoems(currentVersion);

    // 切换版本
    toggleBtn.addEventListener('click', () => {
        currentVersion = currentVersion === 'senior' ? 'junior' : 'senior';
        toggleBtn.classList.toggle('fa-toggle-on');
        toggleBtn.classList.toggle('fa-toggle-off');
        loadPoems(currentVersion);
    });
});
