function saveScrollPosition() {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
}

function restoreScrollPosition() {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition !== null) {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('scrollPosition');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreScrollPosition);
} else {
    restoreScrollPosition();
}

document.addEventListener('DOMContentLoaded', () => {
    const blogLinks = document.querySelectorAll('.blog-link');
    blogLinks.forEach(link => {
        link.addEventListener('click', saveScrollPosition);
    });
});
