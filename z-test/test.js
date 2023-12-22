
const scrollContainer = document.body.querySelector('.scroll-down-container');
const childElements = document.querySelectorAll('.child');
const parentElements = document.querySelectorAll('.group');

var isMobileLayout = window.innerWidth <= 960 || (window.innerWidth > 960 && /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

const pageContainer = document.body.querySelector('.container');
const scrollDownContainer = document.body.querySelector('.scroll-down');
const loader = document.body.querySelector('.loader');
const externalContainer = document.querySelector('.scroll-down-container');


window.addEventListener('DOMContentLoaded', function () {

    sessionStorage.removeItem('scrollPosition');
    localStorage.removeItem('scrollPosition');

    // Disable scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
});

// Clear stored scroll position
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        window.location.reload(false);
    }
});


/* Mobile vs. Desktop layout */
const allElements = document.querySelectorAll('*');

function setLayout() {
    if (isMobileLayout) {
        allElements.forEach(element => {
            element.classList.add('mobile');
            element.classList.remove('desktop');
            document.getElementById('ab-image').src = "../images/home/about_me_mobile.jpg";
            document.getElementById('bg').src = "../images/home/bg_mobile.jpg";
        });
    } else {
        allElements.forEach(element => {
            element.classList.add('desktop');
            element.classList.remove('mobile');
        });
    }
}
setLayout();

/* Menu scroll links */
let scrollTimer;

function scrollToView(elementToScrollTo) {
    if (elementToScrollTo.style.zIndex != 0) {
        elementToScrollTo.style.transform = 'translateZ(0px) scale(1)';
        elementToScrollTo.style.zIndex = 0;
        if ('scrollBehavior' in document.documentElement.style) {
            console.log("scrolling to view");
            elementToScrollTo.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            elementToScrollTo.scrollIntoView();
        }
        elementToScrollTo.style.transform = 'translateZ(-200px) scale(2)';
        elementToScrollTo.style.zIndex = -1;
    } else {
        if ('scrollBehavior' in document.documentElement.style) {
            console.log("scrolling to view ");
            elementToScrollTo.scrollIntoView({
                behavior: 'smooth'
            });
        } else {
            elementToScrollTo.scrollIntoView();
        }
    }
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('scroll-link')) {
        const target = event.target;
        const selector = target.dataset.link;
        const elementToScrollTo = document.querySelector(selector).parentElement;
        scrollToView(elementToScrollTo);

        const view = document.querySelector(selector);
        scrollTimer = setTimeout(() => {
            triggerAnimation(view);
        }, 500);
    }
});

/* Portfolio pages links */
const matrimoni = document.body.querySelector("#matrimoni-link");
const battesimi = document.body.querySelector("#battesimi-link");
const altro = document.body.querySelector("#altro-link");
matrimoni.style.zIndex = '3';
battesimi.style.zIndex = '3';
altro.style.zIndex = '3';
matrimoni.addEventListener('click', function () {
    window.location.href = 'portfolio.html?page=Matrimoni';

});
battesimi.addEventListener('click', function () {
    window.location.href = 'portfolio.html?page=Battesimi';
});
altro.addEventListener('click', function () {
    window.location.href = 'portfolio.html?page=Altro';
});

// Current view Observer & Animation trigger function (On Appear)
const optionsCurrentView = {
    root: null,
    rootMargin: '0px',
    threshold: 0.95
};
const observerCurrentView = new IntersectionObserver(handleCurrentView, optionsCurrentView);

function handleCurrentView(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.95) {
            if (entry.target.id == "homepage") {
                notHomepage = false;
            } else {
                notHomepage = true;
            }
            triggerAnimation(entry.target);
        }
    });
}

/* 
---- Scroll Down to start ----
*/

function handleForeground() {
    scrollContainer.style.height = '0px';
    scrollContainer.style.overflowY = 'hidden';
    scrollContainer.style.position = 'relative';
    pageContainer.style.overflowY = 'auto';
    document.body.style.height = 'calc(100vh+30px)';
    pageContainer.style.position = 'fixed';
    pageContainer.style.top = '0px';
    document.body.style.overflow = 'hidden';
    window.scrollTo({
        top: 30
    })
    document.addEventListener('touchstart', touchStart, { passive: true });
    document.addEventListener('touchmove', handleScroll, { passive: false });
    console.log("Container foreground");
}

let startY = 0;
let notHomepage = false;

function touchStart(event) {
    startY = event.touches[0].clientY;
}

function handleScroll(event) {
    const touchY = event.touches[0].clientY;

    if (touchY < startY || notHomepage) {
        return;
    }

    event.preventDefault();
}

// OnScroll opacity animation
let animationId;

function adjustContainerOpacity() {
    const topPosition = document.documentElement.scrollTop || window.scrollY;
    const maxHeight = isMobileLayout ? document.documentElement.offsetHeight / 2 : document.documentElement.clientHeight;

    const opacity = topPosition / maxHeight;

    if (opacity < 0.998) {
        pageContainer.style.opacity = opacity;
        animationId = requestAnimationFrame(adjustContainerOpacity);
    } else {
        pageContainer.style.opacity = 1;
        handleForeground();
        cancelAnimationFrame(animationId);
        console.log('Opacity reached 1');
    }
}
animationId = requestAnimationFrame(adjustContainerOpacity);

/* 
----- On Appear animations for sections ----- 
*/
var homeAnimationComplete = false;
var portfolioAnimationComplete = false;
var aboutAnimationComplete = false;
var contactsAnimationComplete = false;

function triggerAnimation(view) {
    if (view.id == "homepage" && !homeAnimationComplete) {
        homeOnAppearAnimation();
        homeAnimationComplete = true;
        console.log("triggerAnimation called " + view.id)
    }
    if (view.id == "portfolio" && !portfolioAnimationComplete) {
        portfolioAnimation(view);
        portfolioAnimationComplete = true;
        console.log("triggerAnimation called " + view.id)
    }
    if (view.id == "about" && !aboutAnimationComplete) {
        aboutAnimation();
        console.log("triggerAnimation called " + view.id)
        aboutAnimationComplete = true;
    }
    if (view.id == "contatti" && !contactsAnimationComplete) {
        contattiAnimation();
        console.log("triggerAnimation called " + view.id)
        contactsAnimationComplete = true;
    }
}

// On appear home animation 
function homeOnAppearAnimation(entries, observer) {
    // Animation on intersection
    document.getElementById('menu').style.opacity = '0.85';
    setTimeout(() => {
        document.getElementById('name').querySelector('h1').style.opacity = '1';
    }, 1000);
    setTimeout(() => {
        document.getElementById('logo').style.opacity = '0.7';
    }, 1400);
    const h2 = document.getElementById('name').querySelector('h2');
    const text = h2.textContent;
    h2.textContent = text[0];
    setTimeout(() => {
        h2.style.opacity = 1;
    }, 1400);

    for (let i = 1; i < text.length; i++) {
        (function (index) {
            setTimeout(() => {
                h2.textContent += text[index];
            }, 1400 + 250 * index);
        })(i);
    }
}

// Portfolio onAppear Animation
function portfolioAnimation(view) {
    console.log("triggerAnimation of " + view.id);
    const start = view.querySelector("#start");
    const second = view.querySelector("#second");
    const matrimoni = view.querySelector("#matrimoni");
    const battesimi = view.querySelector("#battesimi");
    const altro = view.querySelector("#altro");
    const caption = view.querySelector("#caption");
    const imgContainers = view.querySelectorAll('.image-container');

    if (!isMobileLayout) {
        start.style.height = '50%';
        second.style.height = '50%';
        caption.style.width = '50%';
        var i = 1;
        const imageContainers = document.querySelectorAll('.image-container');

        Array.from(imgContainers).forEach(container => {
            (function (index) {
                container.style.width = '50%';
                setTimeout(() => {
                    container.querySelector('img').style.opacity = '1';
                    container.addEventListener('mouseover', () => handleMouseOver(container));

                    container.addEventListener('mouseout', () => {
                        const textOverlay = container.querySelector('.text-overlay');
                        if (textOverlay) {
                            textOverlay.style.opacity = '0';
                        }
                    });
                }, index * 800);
            })(i);
            i++;
        });
    } else {
        var i = 1;
        Array.from(imgContainers).forEach(container => {
            const textOverlay = container.querySelector('.text-overlay');
            (function (index) {
                setTimeout(() => {
                    textOverlay.querySelector('.text').style.transform = 'translateX(0px)';
                }, (index - 1) * 800 + 200);
            })(i);
            i++;
        });
    }
}
// Desktop Portfolio Mouseover Animation
function handleMouseOver(container) {
    const textOverlay = container.querySelector('.text-overlay');
    if (textOverlay) {
        textOverlay.style.backgroundColor = `#f8f4f1`;
        textOverlay.style.color = '#e6947c';
        textOverlay.style.opacity = '1';
    }
}

// About onAppear animation
function aboutAnimation() {
    const name_txt = " Marta Cosca."

    const descContainer = document.body.querySelector('#descrizione');
    const heightContainer = document.body.querySelector('#height-container');
    const image = document.body.querySelector('#ab-image');
    const title = document.body.querySelector('#ab-title');
    const sub = document.body.querySelector('#ab-subtitle');
    const p1 = document.body.querySelector('#ab-p1');
    const p2 = document.body.querySelector('#ab-p2');
    const p3 = document.body.querySelector('#ab-p3');
    const p4 = document.body.querySelector('#ab-p4');
    const p5 = document.body.querySelector('#ab-p5');

    if (!isMobileLayout) {
        title.style.height = 'auto';
        title.style.fontSize = '60px';
    } else {
        image.style.height = '35%';
        title.style.fontSize = '40px';
        if (window.innerHeight < 750) {
            sub.paddingTop = '5px';
            sub.paddingBottom = '5px';
            p1.style.fontSize = '15px';
            p2.style.fontSize = '15px';
            p3.style.fontSize = '15px';
            p4.style.fontSize = '15px';
            p5.style.fontSize = '15px';
        }
        setTimeout(() => {
            title.parentElement.style.height = '70px';
        }, 2100);
    }
    title.style.opacity = '1';

    setTimeout(() => {
        sub.style.opacity = '1';
    }, 1600);
    i = 0;
    Array.from(name_txt).forEach(letter => {
        (function (index) {
            setTimeout(() => {
                sub.textContent = sub.textContent + letter;
                console.log(sub.textContent + letter);
            }, 1800 + 150 * index);
        })(i);
        i++;
    })
    setTimeout(() => {
        p1.style.opacity = '1';
    }, 2400 + 150 * i);
    setTimeout(() => {
        p2.style.opacity = '1';
    }, 3200 + 150 * i);
    setTimeout(() => {
        p3.style.opacity = '1';
    }, 4000 + 150 * i);
    setTimeout(() => {
        p4.style.opacity = '1';
    }, 4800 + 150 * i);
    setTimeout(() => {
        p5.style.opacity = '1';
    }, 5600 + 150 * i);
    setTimeout(() => {
        const totHeight = isMobileLayout ? (0.65 * heightContainer.clientHeight) : (heightContainer.clientHeight);
        const descHeight = title.clientHeight + sub.clientHeight + p1.clientHeight + p2.clientHeight + p3.clientHeight + p4.clientHeight + p5.clientHeight
        const descHeightNew = isMobileLayout ? descHeight : (descHeight + 25);
        console.log(totHeight + " tot, desc " + descHeight);
        descContainer.style.paddingTop = `${(totHeight - descHeightNew) / 2}px`;
        if (!isMobileLayout) {
            p1.style.paddingTop = '10px';
            p2.style.paddingTop = '10px';
            p3.style.paddingTop = '10px';
            p4.style.paddingTop = '10px';
            p5.style.paddingTop = '10px';
        } else {
            if (descHeight > totHeight) {
                p1.style.fontSize = '14px';
                p2.style.fontSize = '14px';
                p3.style.fontSize = '14px';
                p4.style.fontSize = '14px';
                p5.style.fontSize = '14px';
            }
        }
    }, 6000 + 150 * i);
}

// Contatti on appear animation
function contattiAnimation() {
    const contatti = Array.from(pageContainer.querySelectorAll('.c'));

    contatti.forEach((cont, ind) => {
        setTimeout(() => {
            cont.style.height = '14vh';
            cont.style.opacity = '1';
        }, isMobileLayout ? (800 * ind) : (1400 * ind));
    });
}

/* 
----- Loader ----- 
*/

const images = Array.from(document.body.querySelectorAll('img'));
const dots = document.body.querySelector('#dots');
let loadedImagesCount = 0;
let dotStates = ['', '.', '..', '...'];
let dotIndex = 0;
imageSources = images.map(image => {
    return image.src;
});

const intervalId = setInterval(() => {
    dots.textContent = dotStates[dotIndex];
    dotIndex = (dotIndex + 1) % dotStates.length;
    if (loadedImagesCount == images.length) {
        clearInterval(intervalId);

    }
    checkImagesLoaded();
}, 800);

function checkImagesLoaded() {
    console.log(loadedImagesCount + "/" + images.length);
    updateProgress(loadedImagesCount, images.length);
    if (loadedImagesCount == images.length) {
        const loaderText = loader.querySelector('#loader-text');
        loaderText.innerHTML = 'Benvenuto!';
        loaderText.style.fontSize = '65px';
        loader.querySelector('.progress-bar').style.height = '0px';
        loader.querySelector('.progress-bar').style.margin = '0px';
        loader.style.height = '0vh';
    }
}

function updateProgress(loaded, total) {
    const progress = (loaded / total) * 100;
    const progressBar = document.querySelector('.progress');
    progressBar.style.width = `${progress}%`;
}

imageSources.forEach(imageSrc => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => loadedImagesCount++;
});


/* Add All Observers */

// 3dscroll
childElements.forEach(childElement => {
    observerCurrentView.observe(childElement);
});

const elementsArray = [
    `
    <div class="group">
            <div id="homepage" class="child">
                <img id="bg" src="../images/home/bg.jpg">
                <div id="menu">
                    <a data-link="#portfolio" id="menu-1" class="scroll-link">PORTFOLIO</a>
                    <p>•</p>
                    <a data-link="#about" id="menu-2" class="scroll-link">ABOUT ME</a>
                    <p>•</p>
                    <a data-link="#contatti" id="menu-3" class="scroll-link">CONTATTI</a>
                    <p>•</p>
                    <a data-link="#prodotti" id="menu-4" class="scroll-link">FOTOPRODOTTI</a>
                </div>
                <div id="name">
                    <img id="logo" src="../images/home/logo.png">
                    <div class="v">
                        <h1>MEDUSA</h1>
                        <h2>PHOTOSTUDIO</h2>
                    </div>
                </div>
            </div>
        </div>
    `,

    `
    <div class="group">
            <div id="portfolio" class="child">
                <div class="v" style="height: 100%; width: 100%;">
                    <div class="h" id="second">
                        <div class="image-container" id="matrimoni-link">
                            <img src="../images/home/matrimoni.JPG" id="matrimoni">
                            <div class="text-overlay">
                                <div class="text">Matrimoni</div>
                            </div>
                        </div>
                        <div class="image-container" id="battesimi-link">
                            <img src="../images/home/battesimi.jpg">
                            <div class="text-overlay">
                                <div class="text">Battesimi</div>
                            </div>
                        </div>
                    </div>
                    <div class="h" id="start">
                        <div id="caption" class="caption">
                            <h1>portfolio</h1>
                        </div>
                        <div class="image-container" id="altro-link">
                            <img src="../images/home/altro.jpg">
                            <div class="text-overlay">
                                <div class="text">Altro</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `,

    `
    <div class="group">
            <div id="about" class="child">
                <div class="h" id="height-container">
                    <img id="ab-image" src="../images/home/about_me.jpg">
                    <div id="descrizione">
                        <div id = "ab-title-container">
                            <h1 id="ab-title">Ciao!</h1>
                        </div>
                        <h2 id="ab-subtitle">Mi chiamo</h2>
                        <p id="ab-p1">Sono diplomata in lingue e laureata in Arti Visive presso la NABA di Milano.</p>
                        <p id="ab-p2">Dal 2020 ho la mia attività da fotografa.</p>
                        <p id="ab-p3">Amo osservare e documentare tutto ciò che è reale, spontaneo, crudo!</p>
                        <p id="ab-p4">Qui non troverete mai finzione, filtri stravolgenti, effetti speciali, visi perfezionati, immagini costruite.</p>
                        <p id="ab-p5">Qui troverete una versione bidimensionale, autentica e trasparente di ciò che siete, interpretata da me, che mi innamoro delle piccole cose, dei piccoli gesti, degli sguardi fugaci e di tutto ciò che ci rende unici.</p>
                    </div>
                </div>
            </div>
        </div>
    `,

    `
    <div class="group">
            <div id="contatti" class="child">
                <div class="h" id="height-container">
                    <div id="title">
                        <h1>Contatti</h1>
                    </div>
                    <div class="c" id="c-p1">
                        <img src="../images/home/phone.png">
                        <p>Telefono:</p>
                        <p>12345832732</p>
                    </div>
                    <div class="c" id="c-p2">
                        <img src="../images/home/email.png">
                        <p>Email:</p>
                        <p>12345832732</p>
                    </div>
                    <div class="c" id="c-p3">
                        <img src="../images/home/insta1.png">
                        <p>Instagram:</p>
                        <p>12345832732</p>
                    </div>
                    <div class="c" id="c-p4">
                        <img src="../images/home/insta2.png">
                        <p>Instagram inclusive profile:</p>
                        <p>12345832732</p>
                    </div>
                    <div class="c" id="c-p5">
                        <img src="../images/home/camera.png">
                        <p>Rikorda.it:</p>
                        <p>12345832732</p>
                    </div>
                </div>
            </div>
        </div>
    `,

    `
    <div class="group">
            <div id="prodotti" class="child">

            </div>
        </div>
    `,

    `
    `
]