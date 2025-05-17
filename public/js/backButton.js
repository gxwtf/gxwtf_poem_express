document.addEventListener('DOMContentLoaded', () => {
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            if (document.referrer) {
                window.history.back();
            } else {
                window.location.href = '/';
            }
        });
    });
});
