document.addEventListener('DOMContentLoaded', () => {
    fetch('/footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footer-container').innerHTML = html;
            // 在页脚加载完成后执行其他逻辑
            console.log('页脚已加载');
        })
        .catch(error => console.error('加载页脚失败:', error));
});
