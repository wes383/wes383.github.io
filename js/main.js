function getRandomRecommendation() {
    const randomIndex = Math.floor(Math.random() * recommendations.length);
    return recommendations[randomIndex];
}

function getRandomColor() {
    const colors = [
        '#060', '#360', '#660', '#960', '#C60', '#F60',
        '#063', '#363', '#663', '#963', '#C63', '#F63',
        '#066', '#366', '#666', '#966', '#C66', '#F66',
        '#069', '#369', '#669', '#969', '#C69', '#F69',
        '#06C', '#36C', '#66C', '#96C', '#C6C', '#F6C',
        '#06F', '#36F', '#66F', '#96F', '#C6F', '#F6F',
        '#090', '#390', '#690', '#990', '#C90', '#F90',
        '#093', '#393', '#693', '#993', '#C93', '#F93',
        '#096', '#396', '#696', '#996', '#C96', '#F96',
        '#099', '#399', '#699', '#999', '#C99', '#F99',
        '#09C', '#39C', '#69C', '#99C', '#C9C', '#F9C',
        '#09F', '#39F', '#69F', '#99F', '#C9F', '#F9F',
        '#0C0', '#3C0', '#6C0', '#9C0', '#CC0', '#FC0',
        '#0C3', '#3C3', '#6C3', '#9C3', '#CC3', '#FC3',
        '#0C6', '#3C6', '#6C6', '#9C6', '#CC6', '#FC6',
        '#0C9', '#3C9', '#6C9', '#9C9', '#CC9', '#FC9',
        '#0CC', '#3CC', '#6CC', '#9CC', '#CCC', '#FCC',
        '#0CF', '#3CF', '#6CF', '#9CF', '#CCF', '#FCF'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function updateRecommendationText() {
    const recommendation = getRandomRecommendation();
    const textElement = document.querySelector('.recommend-text');
    const linkElement = document.querySelector('.imdb-link');

    textElement.style.opacity = '0';
    if (linkElement) {
        linkElement.style.opacity = '0';
    }

    setTimeout(() => {
        textElement.textContent = `${recommendation.title} (${recommendation.year})`;

        if (linkElement) {
            linkElement.href = `https://www.imdb.com/title/${recommendation.imdb}/`;
            linkElement.style.display = 'block';
            setTimeout(() => {
                linkElement.style.opacity = '1';
            }, 50);
        }

        textElement.style.opacity = '1';
    }, 200);
}

document.addEventListener('DOMContentLoaded', () => {
    const recommendText = document.querySelector('.recommend-text');

    recommendText.addEventListener('click', updateRecommendationText);

    const wesName = document.getElementById('wes-name');
    if (wesName) {
        wesName.addEventListener('click', () => {
            wesName.style.color = getRandomColor();
        });
    }

    const navBlocks = document.querySelectorAll('.nav-block');
    navBlocks.forEach(block => {
        block.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = block.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    if (targetId === '#section-3') {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            }
        });
    });
});
