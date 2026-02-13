const dots = document.querySelectorAll('.dot');
const pages = document.querySelectorAll('.page');
let currentPage = 0;
let isScrolling = false;

function switchPage(index) {
    if (index < 0 || index >= pages.length) return;

    dots.forEach(d => d.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    dots[index].classList.add('active');
    pages[index].classList.add('active');
    currentPage = index;
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        switchPage(index);
    });
});

document.addEventListener('keydown', (e) => {
    if (isScrolling) return;

    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentPage > 0) {
            isScrolling = true;
            switchPage(currentPage - 1);
            setTimeout(() => {
                isScrolling = false;
            }, 300);
        }
    }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentPage < pages.length - 1) {
            isScrolling = true;
            switchPage(currentPage + 1);
            setTimeout(() => {
                isScrolling = false;
            }, 300);
        }
    }
});

let wheelDelta = 0;
const wheelThreshold = 50;

window.addEventListener('wheel', (e) => {
    if (isScrolling) return;

    const projectsWrapper = document.querySelector('.projects-wrapper');
    if (projectsWrapper && projectsWrapper.contains(e.target)) {
        const isAtTop = projectsWrapper.scrollTop === 0;
        const isAtBottom = projectsWrapper.scrollTop + projectsWrapper.clientHeight >= projectsWrapper.scrollHeight - 1;

        if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
            wheelDelta = 0;
            return;
        }
    }

    wheelDelta += e.deltaY;

    if (Math.abs(wheelDelta) >= wheelThreshold) {
        isScrolling = true;

        if (wheelDelta > 0) {
            if (currentPage < pages.length - 1) {
                switchPage(currentPage + 1);
            }
        } else {
            if (currentPage > 0) {
                switchPage(currentPage - 1);
            }
        }

        wheelDelta = 0;

        setTimeout(() => {
            isScrolling = false;
        }, 600);
    }
});

let touchStartY = 0;
let touchStartScrollTop = 0;
let hasScrolledInProject = false;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].clientY;
    hasScrolledInProject = false;

    const projectsWrapper = document.querySelector('.projects-wrapper');
    const target = e.target;
    if (projectsWrapper && projectsWrapper.contains(target)) {
        touchStartScrollTop = projectsWrapper.scrollTop;
    }
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    const projectsWrapper = document.querySelector('.projects-wrapper');
    const target = e.target;

    if (projectsWrapper && projectsWrapper.contains(target)) {
        if (Math.abs(projectsWrapper.scrollTop - touchStartScrollTop) > 5) {
            hasScrolledInProject = true;
        }
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (isScrolling) return;

    const touchEndY = e.changedTouches[0].clientY;
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) < swipeThreshold) return;

    const projectsWrapper = document.querySelector('.projects-wrapper');
    const target = document.elementFromPoint(e.changedTouches[0].clientX, touchStartY);

    if (projectsWrapper && projectsWrapper.contains(target)) {
        if (hasScrolledInProject) {
            return;
        }

        const isAtTop = projectsWrapper.scrollTop === 0;
        const isAtBottom = projectsWrapper.scrollTop + projectsWrapper.clientHeight >= projectsWrapper.scrollHeight - 1;

        if ((diff > 0 && !isAtBottom) || (diff < 0 && !isAtTop)) {
            return;
        }
    }

    isScrolling = true;

    if (diff > 0) {
        if (currentPage < pages.length - 1) {
            switchPage(currentPage + 1);
        }
    } else {
        if (currentPage > 0) {
            switchPage(currentPage - 1);
        }
    }

    setTimeout(() => {
        isScrolling = false;
    }, 600);
});

function updateNavDotsVisibility() {
    if (window.innerWidth <= 768) {
        const projectsWrapper = document.querySelector('.projects-wrapper');
        const navDots = document.querySelector('.nav-dots');

        if (projectsWrapper && navDots && currentPage === 2) {
            const isAtTop = projectsWrapper.scrollTop <= 5;
            navDots.style.opacity = isAtTop ? '1' : '0';
        } else if (navDots) {
            navDots.style.opacity = '1';
        }
    }
}

const projectsWrapper = document.querySelector('.projects-wrapper');
if (projectsWrapper) {
    projectsWrapper.addEventListener('scroll', updateNavDotsVisibility);
}

window.addEventListener('resize', updateNavDotsVisibility);

const originalSwitchPage = switchPage;
switchPage = function (index) {
    originalSwitchPage(index);
    setTimeout(updateNavDotsVisibility, 100);
};

