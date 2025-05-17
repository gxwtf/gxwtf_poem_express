document.addEventListener('DOMContentLoaded', () => {
    fetch('/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
            // 在导航栏加载完成后执行其他逻辑
            console.log('导航栏已加载');
        })
        .catch(error => console.error('加载导航栏失败:', error));
});
