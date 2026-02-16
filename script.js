const dots = document.querySelectorAll('.dot');
const pages = document.querySelectorAll('.page');
let currentPage = 0;
let isScrolling = false;

function switchPage(index) {
    if (document.body.classList.contains('easter-egg-active')) return;
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
    if (document.body.classList.contains('easter-egg-active')) return;
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
    if (document.body.classList.contains('easter-egg-active')) return;
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
let touchStartTime = 0;

document.addEventListener('touchstart', (e) => {
    if (document.body.classList.contains('easter-egg-active')) return;
    touchStartY = e.changedTouches[0].clientY;
    touchStartTime = Date.now();

    const projectsWrapper = document.querySelector('.projects-wrapper');
    const target = e.target;
    if (projectsWrapper && projectsWrapper.contains(target)) {
        touchStartScrollTop = projectsWrapper.scrollTop;
    }
}, { passive: true });

document.addEventListener('touchmove', (e) => {
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (document.body.classList.contains('easter-egg-active')) return;
    const touchEndTime = Date.now();
    const timeDiff = touchEndTime - touchStartTime;
    
    if (isScrolling && timeDiff > 1000) {
        isScrolling = false;
    }
    
    if (isScrolling) return;

    const touchEndY = e.changedTouches[0].clientY;
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) < swipeThreshold) return;

    const projectsWrapper = document.querySelector('.projects-wrapper');
    const target = document.elementFromPoint(e.changedTouches[0].clientX, touchStartY);

    if (projectsWrapper && projectsWrapper.contains(target)) {
        const isAtTop = projectsWrapper.scrollTop <= 1;
        const isAtBottom = projectsWrapper.scrollTop + projectsWrapper.clientHeight >= projectsWrapper.scrollHeight - 2;

        if (diff < 0 && isAtTop) {
            isScrolling = true;
            if (currentPage > 0) {
                switchPage(currentPage - 1);
            }
            setTimeout(() => {
                isScrolling = false;
            }, 600);
            return;
        } else if (diff > 0 && isAtBottom) {
            isScrolling = true;
            if (currentPage < pages.length - 1) {
                switchPage(currentPage + 1);
            }
            setTimeout(() => {
                isScrolling = false;
            }, 600);
            return;
        }
        
        return;
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

let easterEggClickCount = 0;
let easterEggClickTimeout;
let easterEggTriggered = false;
let rotationAngle = 0;
let currentOpacity = 1;

const textContainer = document.querySelector('.text-container');
if (textContainer) {
    textContainer.addEventListener('click', () => {
        if (currentPage !== 0) return;

        if (document.body.classList.contains('easter-egg-active')) {
            rotationAngle++;
            
            if (currentOpacity > 0.55) {
                currentOpacity = Math.max(0.55, currentOpacity - 0.01);
            }
            
            textContainer.style.transform = `rotate(-${rotationAngle}deg)`;
            textContainer.style.opacity = currentOpacity.toString();
            
            if (rotationAngle >= 45) {
                activateFullPattern();
            }
            return;
        }

        if (easterEggTriggered) return;

        easterEggClickCount++;

        if (easterEggClickTimeout) {
            clearTimeout(easterEggClickTimeout);
        }

        if (easterEggClickCount >= 10) {
            activateEasterEgg();
            easterEggClickCount = 0;
            easterEggTriggered = true;
        } else {
            easterEggClickTimeout = setTimeout(() => {
                easterEggClickCount = 0;
            }, 2000);
        }
    });
}

function activateEasterEgg() {
    document.body.classList.add('easter-egg-active');
}

function activateFullPattern() {
    const itemWidth = textContainer.offsetWidth;
    const itemHeight = textContainer.offsetHeight;
    const gap = 50;
    const strideX = itemWidth + gap;
    const strideY = itemHeight + gap;

    let patternContainer = document.getElementById('easter-egg-pattern');
    if (!patternContainer) {
        patternContainer = document.createElement('div');
        patternContainer.id = 'easter-egg-pattern';
        document.body.appendChild(patternContainer);
        
        const content = textContainer.innerHTML;
        
        const range = 10; 
        
        for (let x = -range; x <= range; x++) {
            for (let y = -range; y <= range; y++) {
                const div = document.createElement('div');
                div.className = 'text-container';
                div.innerHTML = content;
                
                const left = `calc(50% + ${x * strideX}px)`;
                const top = `calc(50% + ${y * strideY}px)`;
                
                div.style.left = left;
                div.style.top = top;
                div.style.transform = 'translate(-50%, -50%)';
                
                patternContainer.appendChild(div);
            }
        }
    }
    
    requestAnimationFrame(() => {
        patternContainer.classList.add('active');
        textContainer.style.opacity = '0';
        textContainer.style.pointerEvents = 'none';
        
        setTimeout(() => {
            if (patternContainer && patternContainer.classList.contains('active')) {
                patternContainer.dataset.vx = -2;
                patternContainer.dataset.vy = 0;
                patternContainer.dataset.px = 0;
                patternContainer.dataset.py = 0;
                patternContainer.dataset.strideX = strideX;
                patternContainer.dataset.strideY = strideY;
                
                startPatternAnimation(patternContainer);
            }
        }, 1000);
    });
}

let patternAnimationId;
let isDraggingPattern = false;
let lastMouseX = 0;
let lastMouseY = 0;
let dragHistory = [];

function startPatternAnimation(container) {
    document.addEventListener('mousedown', onPatternMouseDown);
    document.addEventListener('mousemove', onPatternMouseMove);
    document.addEventListener('mouseup', onPatternMouseUp);
    
    let prevPx = parseFloat(container.dataset.px || 0);
    let prevPy = parseFloat(container.dataset.py || 0);

    function animate() {
        if (!document.body.classList.contains('easter-egg-active')) return;
        
        let vx = parseFloat(container.dataset.vx || 0);
        let vy = parseFloat(container.dataset.vy || 0);
        let px = parseFloat(container.dataset.px || 0);
        let py = parseFloat(container.dataset.py || 0);
        const strideX = parseFloat(container.dataset.strideX || 0);
        const strideY = parseFloat(container.dataset.strideY || 0);
        
        if (isDraggingPattern) {
        } else {
            px += vx;
            py += vy;
            
            const currentSpeed = Math.sqrt(vx * vx + vy * vy);
            const TARGET_SPEED = 2;
            
            if (currentSpeed > TARGET_SPEED) {
                const decayFactor = 0.997;
                let newSpeed = currentSpeed * decayFactor;
                if (newSpeed < TARGET_SPEED) newSpeed = TARGET_SPEED;
                
                const scale = newSpeed / currentSpeed;
                vx *= scale;
                vy *= scale;
            } else if (currentSpeed < TARGET_SPEED) {
                if (currentSpeed < 0.1) {
                    vx = -0.1;
                    vy = 0;
                } else {
                    const accelFactor = 1.05;
                    let newSpeed = currentSpeed * accelFactor;
                    if (newSpeed > TARGET_SPEED) newSpeed = TARGET_SPEED;
                    
                    const scale = newSpeed / currentSpeed;
                    vx *= scale;
                    vy *= scale;
                }
            }
            
            container.dataset.px = px;
            container.dataset.py = py;
            container.dataset.vx = vx;
            container.dataset.vy = vy;
        }
        
        prevPx = px;
        prevPy = py;
        
        container.style.transform = `rotate(-45deg) translate(${px % strideX}px, ${py % strideY}px)`;
        
        patternAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function onPatternMouseDown(e) {
    if (!document.body.classList.contains('easter-egg-active')) return;
    isDraggingPattern = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    dragHistory = [];
    
    const container = document.getElementById('easter-egg-pattern');
    if (container) {
        const px = parseFloat(container.dataset.px || 0);
        const py = parseFloat(container.dataset.py || 0);
        dragHistory.push({ x: px, y: py, time: Date.now() });
    }
    
    document.body.style.cursor = 'grabbing';
}

function onPatternMouseMove(e) {
    if (!isDraggingPattern) return;
    
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    
    const angle = -45 * Math.PI / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    
    const du = dx * cos + dy * sin;
    const dv = dx * (-sin) + dy * cos;
    
    const container = document.getElementById('easter-egg-pattern');
    if (container) {
        let px = parseFloat(container.dataset.px || 0);
        let py = parseFloat(container.dataset.py || 0);
        px += du;
        py += dv;
        container.dataset.px = px;
        container.dataset.py = py;
        
        const now = Date.now();
        dragHistory.push({ x: px, y: py, time: now });
        
        dragHistory = dragHistory.filter(p => now - p.time < 100);
    }
}

function onPatternMouseUp() {
    isDraggingPattern = false;
    document.body.style.cursor = '';
    
    const now = Date.now();
    dragHistory = dragHistory.filter(p => now - p.time < 100);
    
    if (dragHistory.length >= 2) {
        const oldest = dragHistory[0];
        const newest = dragHistory[dragHistory.length - 1];
        
        const dt = newest.time - oldest.time;
        if (dt > 0) {
            const vPx = (newest.x - oldest.x) / dt;
            const vPy = (newest.y - oldest.y) / dt;
            
            const throwMultiplier = 16; 
            
            let vx = vPx * throwMultiplier;
            let vy = vPy * throwMultiplier;
            
            const MAX_SPEED = 5;
            const currentSpeed = Math.sqrt(vx * vx + vy * vy);
            if (currentSpeed > MAX_SPEED) {
                const scale = MAX_SPEED / currentSpeed;
                vx *= scale;
                vy *= scale;
            }
            
            const container = document.getElementById('easter-egg-pattern');
            if (container) {
                 container.dataset.vx = vx;
                 container.dataset.vy = vy;
            }
        }
    }
    dragHistory = [];
}

const closeBtn = document.getElementById('easter-egg-close');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        document.body.classList.remove('easter-egg-active');
        
        if (patternAnimationId) {
            cancelAnimationFrame(patternAnimationId);
        }
        
        document.removeEventListener('mousedown', onPatternMouseDown);
        document.removeEventListener('mousemove', onPatternMouseMove);
        document.removeEventListener('mouseup', onPatternMouseUp);
        document.body.style.cursor = '';
        
        rotationAngle = 0;
        currentOpacity = 1;
        if (textContainer) {
            textContainer.style.transform = '';
            textContainer.style.opacity = '';
            textContainer.style.pointerEvents = '';
            textContainer.style.cursor = 'text';
            textContainer.style.userSelect = 'text';
            textContainer.style.webkitUserSelect = 'text';
        }
        
        const patternContainer = document.getElementById('easter-egg-pattern');
        if (patternContainer) {
            patternContainer.classList.remove('active');
            patternContainer.remove();
        }
    });
}
