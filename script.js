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
    const navDots = document.querySelector('.nav-dots');
    const isOnNavDots = navDots && navDots.contains(e.target);
    
    const windowWidth = window.innerWidth;
    const clickX = e.clientX;
    const leftZone = clickX < 200;
    const rightZone = clickX > windowWidth - 200;
    
    const targetIsPage = e.target.classList.contains('page') || e.target.tagName === 'BODY';
    
    if (!isOnNavDots && !(targetIsPage && (leftZone || rightZone))) {
        wheelDelta = 0;
        return;
    }
    
    if (isScrolling) return;
    
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

const mediaList = [
    { title: "Breaking Bad", type: "TV Show", year: 2008, imdb: "tt0903747" },
    { title: "Better Call Saul", type: "TV Show", year: 2015, imdb: "tt3032476" },
    { title: "Chernobyl", type: "TV Show", year: 2019, imdb: "tt7366338" },
    { title: "Dead Poets Society", type: "Movie", year: 1989, imdb: "tt0097165" },
    { title: "12 Angry Men", type: "Movie", year: 1957, imdb: "tt0050083" },
    { title: "The Social Network", type: "Movie", year: 2010, imdb: "tt1285016" },
    { title: "Black Mirror", type: "TV Show", year: 2011, imdb: "tt2085059" },
    { title: "Succession", type: "TV Show", year: 2018, imdb: "tt7660850" },
    { title: "Fargo", type: "TV Show", year: 2014, imdb: "tt2802850" },
    { title: "Parasite", type: "Movie", year: 2019, imdb: "tt6751668" },
    { title: "Rick and Morty", type: "TV Show", year: 2013, imdb: "tt2861424" },
    { title: "Django Unchained", type: "Movie", year: 2012, imdb: "tt1853728" },
    { title: "Whiplash", type: "Movie", year: 2014, imdb: "tt2582802" },
    { title: "Sex Education", type: "TV Show", year: 2019, imdb: "tt7767422" },
    { title: "Memento", type: "Movie", year: 2000, imdb: "tt0209144" },
    { title: "Kill Bill: Vol. 1", type: "Movie", year: 2003, imdb: "tt0266697" },
    { title: "The Hateful Eight", type: "Movie", year: 2015, imdb: "tt3460252" },
    { title: "The Intouchables", type: "Movie", year: 2011, imdb: "tt1675434" },
    { title: "American Beauty", type: "Movie", year: 1999, imdb: "tt0169547" },
    { title: "The Hunt", type: "Movie", year: 2012, imdb: "tt2106476" },
    { title: "Green Book", type: "Movie", year: 2018, imdb: "tt6966692" },
    { title: "The Handmaiden", type: "Movie", year: 2016, imdb: "tt4016934" },
    { title: "Ford v Ferrari", type: "Movie", year: 2019, imdb: "tt1950186" },
    { title: "The Queen's Gambit", type: "TV Show", year: 2020, imdb: "tt10048342" },
    { title: "Saw", type: "Movie", year: 2004, imdb: "tt0387564" },
    { title: "Memories of Murder", type: "Movie", year: 2003, imdb: "tt0353969" },
    { title: "A Beautiful Mind", type: "Movie", year: 2001, imdb: "tt0268978" },
    { title: "1917", type: "Movie", year: 2019, imdb: "tt8579674" },
    { title: "Little Women", type: "Movie", year: 2019, imdb: "tt3281548" },
    { title: "Love Actually", type: "Movie", year: 2003, imdb: "tt0314331" },
    { title: "Ratatouille", type: "Movie", year: 2007, imdb: "tt0382932" },
    { title: "3 Idiots", type: "Movie", year: 2009, imdb: "tt1187043" },
    { title: "Rush", type: "Movie", year: 2013, imdb: "tt1979320" },
    { title: "Capharnaüm", type: "Movie", year: 2018, imdb: "tt8267604" },
    { title: "Before Sunrise", type: "Movie", year: 1995, imdb: "tt0112471" },
    { title: "Inside Out", type: "Movie", year: 2015, imdb: "tt2096673" },
    { title: "Contratiempo", type: "Movie", year: 2017, imdb: "tt4857264" },
    { title: "The Pursuit of Happyness", type: "Movie", year: 2006, imdb: "tt0454921" },
    { title: "Scent of a Woman", type: "Movie", year: 1992, imdb: "tt0105323" },
    { title: "The Butterfly Effect", type: "Movie", year: 2004, imdb: "tt0289879" },
    { title: "The Terminal", type: "Movie", year: 2004, imdb: "tt0362227" },
    { title: "Slumdog Millionaire", type: "Movie", year: 2008, imdb: "tt1010048" },
    { title: "A Separation", type: "Movie", year: 2011, imdb: "tt1832382" },
    { title: "The Bourne Ultimatum", type: "Movie", year: 2007, imdb: "tt0440963" },
    { title: "Flipped", type: "Movie", year: 2010, imdb: "tt0817177" },
    { title: "Children of Heaven", type: "Movie", year: 1997, imdb: "tt0118849" },
    { title: "The Substance", type: "Movie", year: 2024, imdb: "tt17526714" },
    { title: "Severance", type: "TV Show", year: 2022, imdb: "tt11280740" },
    { title: "The Bear", type: "TV Show", year: 2022, imdb: "tt14452776" },
    { title: "There Will Be Blood", type: "Movie", year: 2007, imdb: "tt0469494" },
    { title: "Adolescence", type: "TV Show", year: 2025, imdb: "tt31806037" },
    { title: "Inglourious Basterds", type: "Movie", year: 2009, imdb: "tt0361748" },
    { title: "Ozark", type: "TV Show", year: 2017, imdb: "tt5071412" },
    { title: "Fallout", type: "TV Show", year: 2024, imdb: "tt12637874" },
    { title: "How I Met Your Mother", type: "TV Show", year: 2005, imdb: "tt0460649" },
    { title: "The Gentlemen", type: "Movie", year: 2019, imdb: "tt8367814" },
    { title: "Dune: Part Two", type: "Movie", year: 2024, imdb: "tt15239678" },
    { title: "Good Will Hunting", type: "Movie", year: 1997, imdb: "tt0119217" },
    { title: "Knives Out", type: "Movie", year: 2019, imdb: "tt8946378" },
    { title: "The Martian", type: "Movie", year: 2015, imdb: "tt3659388" },
    { title: "Money Heist", type: "TV Show", year: 2017, imdb: "tt6468322" },
    { title: "The Menu", type: "Movie", year: 2022, imdb: "tt9764362" },
    { title: "3 Body Problem", type: "TV Show", year: 2024, imdb: "tt13016388" },
    { title: "Hacksaw Ridge", type: "Movie", year: 2016, imdb: "tt2119532" },
    { title: "Spirited Away", type: "Movie", year: 2001, imdb: "tt0245429" },
    { title: "Everything Everywhere All at Once", type: "Movie", year: 2022, imdb: "tt6710474" },
    { title: "Avatar", type: "Movie", year: 2009, imdb: "tt0499549" },
    { title: "Reservoir Dogs", type: "Movie", year: 1992, imdb: "tt0105236" },
    { title: "The Hangover", type: "Movie", year: 2009, imdb: "tt1119646" },
    { title: "The Big Short", type: "Movie", year: 2015, imdb: "tt1596363" },
    { title: "Her", type: "Movie", year: 2013, imdb: "tt1798709" },
    { title: "Zootopia", type: "Movie", year: 2016, imdb: "tt2948356" },
    { title: "The Marvelous Mrs. Maisel", type: "TV Show", year: 2017, imdb: "tt5788792" },
    { title: "The Imitation Game", type: "Movie", year: 2014, imdb: "tt2084970" },
    { title: "Edge of Tomorrow", type: "Movie", year: 2014, imdb: "tt1631867" },
    { title: "Nightcrawler", type: "Movie", year: 2014, imdb: "tt2872718" },
    { title: "Oppenheimer", type: "Movie", year: 2023, imdb: "tt15398776" },
    { title: "Argo", type: "Movie", year: 2012, imdb: "tt1024648" },
    { title: "Fantastic Mr. Fox", type: "Movie", year: 2009, imdb: "tt0432283" },
    { title: "Trainspotting", type: "Movie", year: 1996, imdb: "tt0117951" },
    { title: "Identity", type: "Movie", year: 2003, imdb: "tt0309698" },
    { title: "The Mist", type: "Movie", year: 2007, imdb: "tt0884328" },
    { title: "Jojo Rabbit", type: "Movie", year: 2019, imdb: "tt2584384" },
    { title: "Ready Player One", type: "Movie", year: 2018, imdb: "tt1677720" },
    { title: "Train to Busan", type: "Movie", year: 2016, imdb: "tt5700672" },
    { title: "Apocalypto", type: "Movie", year: 2006, imdb: "tt0472043" },
    { title: "The Bourne Identity", type: "Movie", year: 2002, imdb: "tt0258463" },
    { title: "Moneyball", type: "Movie", year: 2011, imdb: "tt1210166" },
    { title: "The End of the F***ing World", type: "TV Show", year: 2017, imdb: "tt6257970" },
    { title: "Darkest Hour", type: "Movie", year: 2017, imdb: "tt4555426" },
    { title: "Cinema Paradiso", type: "Movie", year: 1988, imdb: "tt0095765" },
    { title: "Upgrade", type: "Movie", year: 2018, imdb: "tt6499752" },
    { title: "Big Fish", type: "Movie", year: 2003, imdb: "tt0319061" },
    { title: "Blood Diamond", type: "Movie", year: 2006, imdb: "tt0450259" },
    { title: "Bohemian Rhapsody", type: "Movie", year: 2018, imdb: "tt1727824" },
    { title: "Predestination", type: "Movie", year: 2014, imdb: "tt2397535" },
    { title: "The Blind Side", type: "Movie", year: 2009, imdb: "tt0878804" },
    { title: "Wild Tales", type: "Movie", year: 2014, imdb: "tt3011894" },
    { title: "Portrait of a Lady on Fire", type: "Movie", year: 2019, imdb: "tt8613070" },
    { title: "Groundhog Day", type: "Movie", year: 1993, imdb: "tt0107048" },
    { title: "Lord of War", type: "Movie", year: 2005, imdb: "tt0399295" },
    { title: "Captain Phillips", type: "Movie", year: 2013, imdb: "tt1535109" },
    { title: "Gattaca", type: "Movie", year: 1997, imdb: "tt0119177" },
    { title: "The Fall", type: "Movie", year: 2006, imdb: "tt0460791" },
    { title: "District 9", type: "Movie", year: 2009, imdb: "tt1136608" },
    { title: "The Talented Mr. Ripley", type: "Movie", year: 1999, imdb: "tt0134119" },
    { title: "Maleficent", type: "Movie", year: 2014, imdb: "tt1587310" },
    { title: "Taken", type: "Movie", year: 2008, imdb: "tt0936501" },
    { title: "Source Code", type: "Movie", year: 2011, imdb: "tt0945513" },
    { title: "Gifted", type: "Movie", year: 2017, imdb: "tt4481414" },
    { title: "Marriage Story", type: "Movie", year: 2019, imdb: "tt7653254" },
    { title: "Face/Off", type: "Movie", year: 1997, imdb: "tt0119094" },
    { title: "Majo no takkyûbin", type: "Movie", year: 1989, imdb: "tt0097814" },
    { title: "The Intern", type: "Movie", year: 2015, imdb: "tt2361509" },
    { title: "Maharaja", type: "Movie", year: 2024, imdb: "tt26548265" },
    { title: "Cosmos: A Spacetime Odyssey", type: "TV Show", year: 2014, imdb: "tt2395695" },
    { title: "The King's Speech", type: "Movie", year: 2010, imdb: "tt1504320" },
    { title: "I Am Sam", type: "Movie", year: 2001, imdb: "tt0277027" },
    { title: "The Bourne Supremacy", type: "Movie", year: 2004, imdb: "tt0372183" },
    { title: "Moon", type: "Movie", year: 2009, imdb: "tt1182345" },
    { title: "Perfume: The Story of a Murderer", type: "Movie", year: 2006, imdb: "tt0396171" },
    { title: "Life of Pi", type: "Movie", year: 2012, imdb: "tt0454876" },
    { title: "Burning", type: "Movie", year: 2018, imdb: "tt7282468" },
    { title: "Taare Zameen Par", type: "Movie", year: 2007, imdb: "tt0986264" },
    { title: "Sully", type: "Movie", year: 2016, imdb: "tt3263904" },
    { title: "Hotel Rwanda", type: "Movie", year: 2004, imdb: "tt0395169" },
    { title: "The Theory of Everything", type: "Movie", year: 2014, imdb: "tt2980516" },
    { title: "Phone Booth", type: "Movie", year: 2003, imdb: "tt0183649" },
    { title: "Mary and Max", type: "Movie", year: 2009, imdb: "tt0978762" },
    { title: "Cube", type: "Movie", year: 1998, imdb: "tt0123755" },
    { title: "Se jie", type: "Movie", year: 2007, imdb: "tt0808357" },
    { title: "Dead Silence", type: "Movie", year: 2007, imdb: "tt0455760" },
    { title: "My Brilliant Friend", type: "TV Show", year: 2018, imdb: "tt7278862" },
    { title: "The Life of David Gale", type: "Movie", year: 2003, imdb: "tt0289992" },
    { title: "Andhadhun", type: "Movie", year: 2018, imdb: "tt8108198" },
    { title: "Following", type: "Movie", year: 1999, imdb: "tt0154506" },
    { title: "Searching", type: "Movie", year: 2018, imdb: "tt7668870" },
    { title: "Swiss Army Man", type: "Movie", year: 2016, imdb: "tt4034354" },
    { title: "Non-Stop", type: "Movie", year: 2014, imdb: "tt2024469" },
    { title: "Hotel Mumbai", type: "Movie", year: 2019, imdb: "tt5461944" },
    { title: "The Wave", type: "Movie", year: 2008, imdb: "tt1063669" },
    { title: "A Perfect World", type: "Movie", year: 1993, imdb: "tt0107808" },
    { title: "Ba wang bie ji", type: "Movie", year: 1993, imdb: "tt0106332" },
    { title: "Kokuhaku", type: "Movie", year: 2010, imdb: "tt1590089" },
    { title: "Da hong denglong gaogao gua", type: "Movie", year: 1991, imdb: "tt0101640" },
    { title: "Yi dai zong shi", type: "Movie", year: 2013, imdb: "tt1462900" },
    { title: "Persian Lessons", type: "Movie", year: 2020, imdb: "tt9738784" },
    { title: "Tian mi mi", type: "Movie", year: 1996, imdb: "tt0117905" },
    { title: "Yangguang puzhao", type: "Movie", year: 2019, imdb: "tt10883506" },
    { title: "The Lost Bus", type: "Movie", year: 2025, imdb: "tt21103218" },
    { title: "Weapons", type: "Movie", year: 2025, imdb: "tt26581740" },
    { title: "Sinners", type: "Movie", year: 2025, imdb: "tt31193180" },
    { title: "F1", type: "Movie", year: 2025, imdb: "tt16311594" },
    { title: "Yellowstone", type: "TV Show", year: 2018, imdb: "tt4236770" },
    { title: "The White Lotus", type: "TV Show", year: 2021, imdb: "tt13406094" },
    { title: "The Last of Us", type: "TV Show", year: 2023, imdb: "tt3581920" },
    { title: "The Maze Runner", type: "Movie", year: 2014, imdb: "tt1790864" },
    { title: "Heretic", type: "Movie", year: 2024, imdb: "tt28015403" },
    { title: "Silo", type: "TV Show", year: 2023, imdb: "tt14688458" },
    { title: "The Ugly Stepsister", type: "Movie", year: 2025, imdb: "tt29344903" },
    { title: "Anora", type: "Movie", year: 2024, imdb: "tt28607951" },
    { title: "The Handmaid's Tale", type: "TV Show", year: 2017, imdb: "tt5834204" },
    { title: "Killers of the Flower Moon", type: "Movie", year: 2023, imdb: "tt5537002" },
    { title: "You", type: "TV Show", year: 2018, imdb: "tt7335184" },
    { title: "Prisoners", type: "Movie", year: 2013, imdb: "tt1392214" },
    { title: "Poor Things", type: "Movie", year: 2023, imdb: "tt14230458" },
    { title: "American Psycho", type: "Movie", year: 2000, imdb: "tt0144084" },
    { title: "City of God", type: "Movie", year: 2002, imdb: "tt0317248" },
    { title: "Young Sheldon", type: "TV Show", year: 2017, imdb: "tt6226232" },
    { title: "Midsommar", type: "Movie", year: 2019, imdb: "tt8772262" },
    { title: "The Holdovers", type: "Movie", year: 2023, imdb: "tt14849194" },
    { title: "The Hunger Games", type: "Movie", year: 2012, imdb: "tt1392170" },
    { title: "The Devil Wears Prada", type: "Movie", year: 2006, imdb: "tt0458352" },
    { title: "Primal Fear", type: "Movie", year: 1996, imdb: "tt0117381" },
    { title: "Bullet Train", type: "Movie", year: 2022, imdb: "tt12593682" },
    { title: "Ex Machina", type: "Movie", year: 2015, imdb: "tt0470752" },
    { title: "Mystic River", type: "Movie", year: 2003, imdb: "tt0327056" },
    { title: "Civil War", type: "Movie", year: 2024, imdb: "tt17279496" },
    { title: "Past Lives", type: "Movie", year: 2023, imdb: "tt13238346" },
    { title: "Love, Death & Robots", type: "TV Show", year: 2019, imdb: "tt9561862" },
    { title: "Uncut Gems", type: "Movie", year: 2019, imdb: "tt5727208" },
    { title: "Arrival", type: "Movie", year: 2016, imdb: "tt2543164" },
    { title: "Pan's Labyrinth", type: "Movie", year: 2006, imdb: "tt0457430" },
    { title: "Don't Look Up", type: "Movie", year: 2021, imdb: "tt11286314" },
    { title: "The Grand Budapest Hotel", type: "Movie", year: 2014, imdb: "tt2278388" },
    { title: "The Revenant", type: "Movie", year: 2015, imdb: "tt1663202" },
    { title: "12th Fail", type: "Movie", year: 2023, imdb: "tt23849204" },
    { title: "Children of Men", type: "Movie", year: 2006, imdb: "tt0206634" },
    { title: "CODA", type: "Movie", year: 2021, imdb: "tt10366460" },
    { title: "The Sound of Music", type: "Movie", year: 1965, imdb: "tt0059742" },
    { title: "Prometheus", type: "Movie", year: 2012, imdb: "tt1446714" },
    { title: "Superbad", type: "Movie", year: 2007, imdb: "tt0829482" },
    { title: "Pearl", type: "Movie", year: 2022, imdb: "tt18925334" },
    { title: "The Descent", type: "Movie", year: 2005, imdb: "tt0435625" },
    { title: "The Great Gatsby", type: "Movie", year: 2013, imdb: "tt1343092" },
    { title: "Saltburn", type: "Movie", year: 2023, imdb: "tt17351924" },
    { title: "Coherence", type: "Movie", year: 2013, imdb: "tt2866360" },
    { title: "The Lighthouse", type: "Movie", year: 2019, imdb: "tt7984734" },
    { title: "Twisters", type: "Movie", year: 2024, imdb: "tt12584954" },
    { title: "Dunkirk", type: "Movie", year: 2017, imdb: "tt5013056" },
    { title: "Beef", type: "TV Show", year: 2023, imdb: "tt14403178" },
    { title: "Baby Driver", type: "Movie", year: 2017, imdb: "tt3890160" },
    { title: "Passengers", type: "Movie", year: 2016, imdb: "tt1355644" },
    { title: "The Darjeeling Limited", type: "Movie", year: 2007, imdb: "tt0838221" },
    { title: "[Rec]", type: "Movie", year: 2007, imdb: "tt1038988" },
    { title: "Hidden Figures", type: "Movie", year: 2016, imdb: "tt4846340" },
    { title: "Leave the World Behind", type: "Movie", year: 2023, imdb: "tt12747748" },
    { title: "Notting Hill", type: "Movie", year: 1999, imdb: "tt0125439" },
    { title: "The Lobster", type: "Movie", year: 2015, imdb: "tt3464902" },
    { title: "Black Hawk Down", type: "Movie", year: 2001, imdb: "tt0265086" },
    { title: "The Man from Earth", type: "Movie", year: 2007, imdb: "tt0756683" },
    { title: "The Whale", type: "Movie", year: 2022, imdb: "tt13833688" },
    { title: "The Favourite", type: "Movie", year: 2018, imdb: "tt5083738" },
    { title: "Snowpiercer", type: "Movie", year: 2013, imdb: "tt1706620" },
    { title: "Don't Breathe", type: "Movie", year: 2016, imdb: "tt4160708" },
    { title: "Isle of Dogs", type: "Movie", year: 2018, imdb: "tt5104604" },
    { title: "Where the Crawdads Sing", type: "Movie", year: 2022, imdb: "tt9411972" },
    { title: "Lady Bird", type: "Movie", year: 2017, imdb: "tt4925292" },
    { title: "The Royal Tenenbaums", type: "Movie", year: 2001, imdb: "tt0265666" },
    { title: "Gravity", type: "Movie", year: 2013, imdb: "tt1454468" },
    { title: "Fresh", type: "Movie", year: 2022, imdb: "tt13403046" },
    { title: "A Star Is Born", type: "Movie", year: 2018, imdb: "tt1517451" },
    { title: "Druk", type: "Movie", year: 2020, imdb: "tt10288566" },
    { title: "Night at the Museum", type: "Movie", year: 2006, imdb: "tt0477347" },
    { title: "House of Wax", type: "Movie", year: 2005, imdb: "tt0397065" },
    { title: "The Ballad of Buster Scruggs", type: "Movie", year: 2018, imdb: "tt6412452" },
    { title: "Baby Reindeer", type: "TV Show", year: 2024, imdb: "tt13649112" },
    { title: "Escape Room", type: "Movie", year: 2019, imdb: "tt5886046" },
    { title: "Crash", type: "Movie", year: 2004, imdb: "tt0375679" },
    { title: "Last Night in Soho", type: "Movie", year: 2021, imdb: "tt9639470" },
    { title: "I, Robot", type: "Movie", year: 2004, imdb: "tt0343818" },
    { title: "Aquaman", type: "Movie", year: 2018, imdb: "tt1477834" },
    { title: "Cashback", type: "Movie", year: 2007, imdb: "tt0460740" },
    { title: "Cloud Atlas", type: "Movie", year: 2012, imdb: "tt1371111" },
    { title: "Moonrise Kingdom", type: "Movie", year: 2012, imdb: "tt1748122" },
    { title: "Witness for the Prosecution", type: "Movie", year: 1957, imdb: "tt0051201" },
    { title: "The Florida Project", type: "Movie", year: 2017, imdb: "tt5649144" },
    { title: "Dogman", type: "Movie", year: 2023, imdb: "tt17009348" },
    { title: "Aladdin", type: "Movie", year: 2019, imdb: "tt6139732" },
    { title: "A Simple Favor", type: "Movie", year: 2018, imdb: "tt7040874" },
    { title: "Real Steel", type: "Movie", year: 2011, imdb: "tt0433035" },
    { title: "Chungking Express", type: "Movie", year: 1994, imdb: "tt0109424" },
    { title: "The Hitchhiker's Guide to the Galaxy", type: "Movie", year: 2005, imdb: "tt0371724" },
    { title: "Monsters University", type: "Movie", year: 2013, imdb: "tt1453405" },
    { title: "127 Hours", type: "Movie", year: 2010, imdb: "tt1542344" },
    { title: "The Wonderful Story of Henry Sugar", type: "Movie", year: 2023, imdb: "tt16968450" },
    { title: "The Trial of the Chicago 7", type: "Movie", year: 2020, imdb: "tt1070874" },
    { title: "Babel", type: "Movie", year: 2006, imdb: "tt0449467" },
    { title: "tick, tick... BOOM!", type: "Movie", year: 2021, imdb: "tt8721424" },
    { title: "Run Lola Run", type: "Movie", year: 1998, imdb: "tt0130827" },
    { title: "And Then There Were None", type: "TV Show", year: 2017, imdb: "tt3581932" },
    { title: "The Last Emperor", type: "Movie", year: 1987, imdb: "tt0093389" },
    { title: "Matchstick Men", type: "Movie", year: 2003, imdb: "tt0325805" },
    { title: "Me and Earl and the Dying Girl", type: "Movie", year: 2015, imdb: "tt2582496" },
    { title: "Buried", type: "Movie", year: 2010, imdb: "tt1462758" },
    { title: "The Two Popes", type: "Movie", year: 2019, imdb: "tt8404614" },
    { title: "PK", type: "Movie", year: 2014, imdb: "tt2338151" },
    { title: "An Elephant Sitting Still", type: "Movie", year: 2018, imdb: "tt8020896" },
    { title: "Swan Song", type: "Movie", year: 2021, imdb: "tt13207508" },
    { title: "A Brighter Summer Day", type: "Movie", year: 1991, imdb: "tt0101985" },
    { title: "Hereditary", type: "Movie", year: 2018, imdb: "tt7784604" },
    { title: "Dung che sai duk", type: "Movie", year: 1994, imdb: "tt0109688" },
    { title: "The Brutalist", type: "Movie", year: 2024, imdb: "tt8999762" },
    { title: "Dune", type: "Movie", year: 2021, imdb: "tt1160419" },
    { title: "Get Out", type: "Movie", year: 2017, imdb: "tt5052448" },
    { title: "The Thing", type: "Movie", year: 1982, imdb: "tt0084787" },
    { title: "A Quiet Place", type: "Movie", year: 2018, imdb: "tt6644200" },
    { title: "Conclave", type: "Movie", year: 2024, imdb: "tt20215234" },
    { title: "Birdman or (The Unexpected Virtue of Ignorance)", type: "Movie", year: 2014, imdb: "tt2562232" },
    { title: "Under the Skin", type: "Movie", year: 2014, imdb: "tt1441395" },
    { title: "Aftersun", type: "Movie", year: 2022, imdb: "tt19770238" },
    { title: "It Follows", type: "Movie", year: 2015, imdb: "tt3235888" },
    { title: "Melancholia", type: "Movie", year: 2011, imdb: "tt1527186" },
    { title: "Cloverfield", type: "Movie", year: 2008, imdb: "tt1060277" },
    { title: "Tetris", type: "Movie", year: 2023, imdb: "tt12758060" },
    { title: "X", type: "Movie", year: 2022, imdb: "tt13560574" },
    { title: "Yi yi", type: "Movie", year: 2000, imdb: "tt0244316" },
    { title: "How to Train Your Dragon", type: "Movie", year: 2010, imdb: "tt0892769" },
    { title: "Sinister", type: "Movie", year: 2012, imdb: "tt1922777" },
    { title: "Goemool", type: "Movie", year: 2006, imdb: "tt0468492" },
    { title: "Monsters, Inc.", type: "Movie", year: 2001, imdb: "tt0198781" },
    { title: "Midnight in Paris", type: "Movie", year: 2011, imdb: "tt1605783" },
    { title: "Fa yeung nin wah", type: "Movie", year: 2000, imdb: "tt0118694" },
    { title: "Twelve Monkeys", type: "Movie", year: 1995, imdb: "tt0114746" },
    { title: "Roma", type: "Movie", year: 2018, imdb: "tt6155172" },
    { title: "One Battle After Another", type: "Movie", year: 2025, imdb: "tt30144839" },
    { title: "Ferris Bueller's Day Off", type: "Movie", year: 1986, imdb: "tt0091042" },
    { title: "Frankenstein", type: "Movie", year: 2025, imdb: "tt1312221" },
    { title: "Gran Torino", type: "Movie", year: 2008, imdb: "tt1205489" },
    { title: "Pluribus", type: "TV Show", year: 2025, imdb: "tt22202452" },
    { title: "Train Dreams", type: "Movie", year: 2025, imdb: "tt29768334" },
    { title: "Bugonia", type: "Movie", year: 2025, imdb: "tt12300742" },
];

const recommendButton = document.getElementById('recommendButton');
const imdbLink = document.getElementById('imdbLink');

recommendButton.addEventListener('click', () => {
    recommendButton.classList.add('fade-out');
    imdbLink.classList.add('fade-out');

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * mediaList.length);
        const media = mediaList[randomIndex];

        recommendButton.textContent = `${media.title} (${media.year})`;
        imdbLink.href = `https://www.imdb.com/title/${media.imdb}/`;
        imdbLink.style.display = 'block';

        recommendButton.classList.remove('fade-out');
        recommendButton.classList.add('fade-in');
        imdbLink.classList.remove('fade-out');
        imdbLink.classList.add('fade-in');

        setTimeout(() => {
            recommendButton.classList.remove('fade-in');
            imdbLink.classList.remove('fade-in');
        }, 300);
    }, 300);
});

let touchStartY = 0;
let touchStartX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].clientY;
    touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    handleSwipe(touchEndY);
}, { passive: true });

function handleSwipe(touchEndY) {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) < swipeThreshold) return;

    const navDots = document.querySelector('.nav-dots');
    if (!navDots) return;
    
    const navRect = navDots.getBoundingClientRect();
    const allowedZone = touchStartX <= navRect.right;

    if (!allowedZone) {
        return;
    }

    if (isScrolling) return;

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
    }, 200);
}
