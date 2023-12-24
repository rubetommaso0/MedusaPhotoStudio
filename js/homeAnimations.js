/* 
-- Utility --
 */

function getTopPosition(element) {
  const rect = element.getBoundingClientRect();
  return rect.top;
}

function getBottomPosition(element) {
  const rect = element.getBoundingClientRect();
  return rect.bottom;
}

/* 
-- Foreground class --
 */

class Foreground {
  constructor() {
    this.foregroundContainer = document.querySelector('.foreground-container');
    this.foregroundElement = null;
    this.animations = {
      homepage: false,
      portfolio: false,
      about: false,
      contatti: false,
      prodotti: false
    };
  }

  id() {
    return this.foregroundContainer.querySelector('.child').id;
  }

  update(x) {
    this.foregroundContainer.style.opacity = 0;
    const index = Number.isInteger(x) ? x : childElementIndex[x];
    this.foregroundContainer.innerHTML = elementsArray[index];
    this.foregroundElement = this.foregroundContainer.querySelector('.group');
    setLayout(this.foregroundContainer);
  }

  appear() {
    this.foregroundContainer.style.opacity = '1';
  }

  triggerAnimation() {
    const id = this.id();
    const animationComplete = this.animations[id];

    if (!animationComplete) {
      switch (id) {
        case "homepage":
          homeOnAppearAnimation();
          break;
        case "portfolio":
          portfolioAnimation(view);
          break;
        case "about":
          aboutAnimation();
          break;
        case "contatti":
          contattiAnimation();
          break;
        default:
          break;
      }
      this.animations[id] = true;
    }
  }
}

/* 
-- Background class --
 */

class Background {
  constructor() {
    this.pageContainer = document.body.querySelector('.container');
    this.nextElement = document.querySelector('.group');
    this.previousElement = null;
    this.topPosition = getTopPosition(this.nextElement);
  }

  idNext() {
    return this.nextElement.querySelector('.child').id;
  }

  calcPosition() {
    if (this.topPosition == null) {
      this.topPosition = getTopPosition(this.nextElement);
    }
    if (this.topPosition == getBottomPosition(this.nextElement)) {
      this.topPosition == null;
    }
    const dict = {
      top: this.topPosition,
      bottom: getBottomPosition(this.nextElement)
    }
    console.log(dict);
    return dict;
  }

  createNextElement() {
    this.nextElement.style.transition = 'none';
    const index = childElementIndex[this.idNext()] + 1;
    this.pageContainer.innerHTML = this.pageContainer.innerHTML + presentationDownArray[index];
    this.nextElement = this.pageContainer.querySelector('#' + this.idNext());
    setLayout(this.nextElement);
  }

  updatePrevoius(id) {
    const element = pageContainer.querySelector(id).parentElement;
    element.innerHTML = presentationUpArray[id];
    this.previousElement = element;
    setLayout(this.previousElement);
  }

  dissolve() {
    this.nextElement.style.transition = 'opacity 0.8s ease-in';
    this.nextElement.style.opacity = '0';
  }

  startAnimation(timer) {
    setTimeout(() => {
      if (getTopPosition(this.pageContainer) > (isMobileLayout ? window.outerHeight * 0.2 : window.innerHeight * 0.2)) {
        window.scrollTo({
          top: isMobileLayout ? window.outerHeight * 0.8 : window.innerHeight * 0.8,
          behavior: 'smooth'
        });

        const arrow = document.querySelector('.scroll-down-arrow');
        setTimeout(() => {
          arrow.style.transform = 'translateY(-50px)';
        }, 500);
        setTimeout(() => {
          arrow.style.transform = 'translateY(0)';
        }, 800);
        setTimeout(() => {
          arrow.style.transform = 'translateY(-50px)';
        }, 1300);
        setTimeout(() => {
          arrow.style.transform = 'translateY(0)';
        }, 1600);
      }
    }, timer);
  }
}

/* 
-- Navigation class --
 */

class Navigation {
  constructor() {
    this.scrollDownContainer = document.body.querySelector('.scroll-down-container')
    this.foreground = new Foreground();
    this.background = new Background();
    this.setLayout();
    this.adjustContainerOpacity = this.adjustContainerOpacity.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.animationId = this.startOpacityAnimation();
  }

  setLayout() {
    setLayout(this.scrollDownContainer);
    setLayout(this.foreground.foregroundContainer);
    setLayout(this.background.pageContainer);
  }

  handlefirstScrollDown() {
    // comm for now: startObserverChilds();
    document.body.style.height = 'calc(100vh + 10px)';
    window.scrollTo({
      top: 1
    });
    this.addForeground('homepage');
    document.addEventListener('touchstart', this.touchStart, { passive: true });
    document.addEventListener('touchmove', this.handleScroll, { passive: false });

    this.scrollDownContainer.style.top = '-100vh';
    document.body.style.overflowY = 'hidden';
    this.foreground.foregroundContainer.style.top = '0vh';
    this.background.pageContainer.style.top = '0vh';
    this.background.pageContainer.style.overflowY = 'auto';

    console.log("first scroll down complete");
  }

  touchStart(event) {
    startY = event.touches[0].clientY;
  }
  handleScroll(event) {
    const touchY = event.touches[0].clientY;

    if (touchY > startY && !notHomepage) {
      event.preventDefault();
      return;
    }
    if (touchY < startY && !notLast) {
      event.preventDefault();
      return;
    }
  }

  adjustContainerOpacity() {
    const topPosition = this.background.calcPosition().top;
    if (this.background.topPosition == null) {
      return;
    }
    const bottomPosition = this.background.calcPosition().bottom;
    const opacityForeground = 1 - (bottomPosition - topPosition) / topPosition;
    const opacityScrollDown = (bottomPosition - topPosition) / topPosition;
    const elementToAnimate = isGoingDown ? this.background.nextElement : this.background.previousElement;
    const elementToDissolve = firstScroll ? this.scrollDownContainer : this.foreground.foregroundContainer;

    if (opacityForeground < 0.98) {
      elementToAnimate.style.opacity = Math.min(opacityForeground + 0.2, 0.99).toString();
      elementToDissolve.style.opacity = opacityScrollDown;
      this.animationId = requestAnimationFrame(this.adjustContainerOpacity);
    } else {
      if (firstScroll) {
        this.handlefirstScrollDown();
        firstScroll = false;
      } else if (isGoingDown) {
        console.log("down scroll for " + nextElement);
        handleScrollOnPageContainer(nextElement);
      } else if (!isGoingDown) {
        console.log("up scroll for " + previousElement);
        handleScrollOnPageContainer(previousElement);
      }
      cancelAnimationFrame(this.animationId);
      this.background.topPosition = null;
    }
  }

  startOpacityAnimation() {
    const animationId = requestAnimationFrame(this.adjustContainerOpacity);
    return animationId;
  }

  updatePrevoius() {
    const foregroundId = this.foreground.id();
    this.background.updatePrevoius(foregroundId);
  }

  addForeground(foregroundEl) {
    if (foregroundEl != 0 && foregroundEl != 'homepage') {
      this.updatePrevoius();
    }
    this.foreground.update(foregroundEl);

    setTimeout(() => {
      this.background.dissolve();
    }, 600);

    setTimeout(() => {
      this.foreground.appear();
      this.background.createNextElement();
    }, 1100);

    setTimeout(() => {
      this.foreground.triggerAnimation();
    }, 1600);
  }

}

/* 
---- Variables ----
*/
let startY = 0;
var firstScroll = true;
var isGoingDown = true;

const childElementIndex = {
  homepage: 0,
  portfolio: 1,
  about: 2,
  contatti: 3,
  prodotti: 4
};
const childElementsId = [
  'homepage',
  'portfolio',
  'about',
  'contatti',
  'prodotti'
];

const loader = document.body.querySelector('.loader');
var timer = 2800;

var isMobileLayout = window.innerWidth <= 960 || (window.innerWidth > 960 && /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

// Start navigation
var nav = new Navigation();

/* 
---- Disable scroll restoration ----
*/
window.addEventListener('DOMContentLoaded', function () {

  sessionStorage.removeItem('scrollPosition');
  localStorage.removeItem('scrollPosition');

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
});

// StartAnimation for back action
window.addEventListener('pageshow', function (event) {
  if (event.persisted) {
    nav.background.startAnimation(700);
  }
});

/* 
---- Mobile vs. Desktop layout ---- 
*/
function setLayout(element) {
  const allElements = element.querySelectorAll('*');
  if (isMobileLayout) {
    allElements.forEach(element => {
      element.classList.add('mobile');
      if (element.querySelector('#ab-image')) {
        element.querySelector('#bg').src = "../images/home/about_me_mobile.jpg";
      }
      if (element.querySelector('#bg')) {
        element.querySelector('#bg').src = "../images/home/bg_mobile.jpg";
      }
    });
  } else {
    allElements.forEach(element => {
      element.classList.add('desktop');
    });
  }
}

/* 
---- Menu scroll links ----

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
      //triggerAnimation(view);
    }, 500);
  }
});

-- comm for now
*/

/* 
---- Portfolio pages links ----

function createScrollLinks() {
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
}
-- comm for now
*/


/* 
---- Scroll Down to start ----
*/

/* ForegroundView & scroll up-down observer

function startObserving(element) {
  observerCurrentView.observe(element);
}

const optionsCurrentView = {
  root: null,
  rootMargin: '0px',
  threshold: 0.982
};
const observerCurrentView = new IntersectionObserver(handleCurrentView, optionsCurrentView);

function handleCurrentView(entries) {
  entries.forEach(entry => {

    if (entry.isIntersecting && entry.intersectionRatio > 0.982) {

    } else if (foregroundElement != null && entry.target.id == childElements[foregroundElement].id && entry.intersectionRatio < 0.982) {

      const isTopDisappearing = getTopPosition(entry.target) < getTopPosition(foregroundContainer);
      if (isTopDisappearing) {
        console.log("going down");
      } else {
        console.log("going up");
      }
    }
  });
} 
--- comm or now
*/

// OnScroll opacity animation & Trigger handleScrollOnPage

// HandleScrollOnPage
function handleScrollOnPageContainer(element) {

  console.log("addForeground");
  addForeground(element);
}







// On appear home animation 
function homeOnAppearAnimation(entries, observer) {
  // Animation on intersection
  setTimeout(() => {
    document.getElementById('menu').style.opacity = '0.85';
  }, 200);
  setTimeout(() => {
    document.getElementById('name').querySelector('h1').style.opacity = '1';
  }, 700);
  setTimeout(() => {
    document.getElementById('logo').style.opacity = '0.7';
  }, 900);
  const h2 = document.getElementById('name').querySelector('h2');
  const text = h2.textContent;
  h2.textContent = text[0];
  setTimeout(() => {
    h2.style.opacity = 1;
  }, 900);

  for (let i = 1; i < text.length; i++) {
    (function (index) {
      setTimeout(() => {
        h2.textContent += text[index];
      }, 900 + 250 * index);
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
  const contatti = Array.from(foregroundContainer.querySelectorAll('.c'));

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

    nav.background.startAnimation(timer);
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

const presentationUpArray = [
  `
        <div class="group scrolling-up">
            <div id="homepage" class="child">
                <div class = "presentation-container">
                    <h3 class="pres">Home</h3>
                    <img class="scroll-up-arrow" src="../images/home/scrollUpArrow.png">
                </div>
            </div>
        </div>
        ` ,
  `
        <div class="group scrolling-up">
            <div id="portfolio" class="child">
                <div class = "presentation-container">
                    <h3 class="pres">Portfolio</h3>
                    <img class="scroll-up-arrow" src="../images/home/scrollUpArrow.png">
                </div>
            </div>
        </div>
        `,
  `
        <div class="group scrolling-up">
            <div id="about" class="child">
                <div class = "presentation-container">
                    <h3 class="pres">About me</h3>
                    <img class="scroll-up-arrow" src="../images/home/scrollUpArrow.png">
                </div>
            </div>
        </div>
        `,
  `
        <div class="group scrolling-up">
            <div id="contatti" class="child">
                <div class = "presentation-container">
                    <h3 class="pres">Contatti</h3>
                    <img class="scroll-up-arrow" src="../images/home/scrollUpArrow.png">
                </div>
            </div>
        </div>
        `,
  `
        <div class="group scrolling-up">
            <div id="prodotti" class="child">
                <div class = "presentation-container">
                    <h3 class="pres">Foto<br>prodotti</h3>
                    <img class="scroll-up-arrow" src="../images/home/scrollUpArrow.png">
                </div> 
            </div>
        </div>
        `
]

const presentationDownArray = [
  `
        <div class="group scrolling-down">
            <div id="homepage" class="child">
                <div class = "presentation-container">
                    <img class="scroll-down-arrow" src="../images/home/scrollDownArrow.png">
                    <h3 class="pres">Home</h3>
                </div>
            </div>
        </div>
        ` ,
  `
        <div class="group scrolling-down">
            <div id="portfolio" class="child">
                <div class = "presentation-container">
                    <img class="scroll-down-arrow" src="../images/home/scrollDownArrow.png">
                    <h3 class="pres">Portfolio</h3>
                </div>
            </div>
        </div>
        `,
  `
        <div class="group scrolling-down">
            <div id="about" class="child">
                <div class = "presentation-container">
                    <img class="scroll-down-arrow" src="../images/home/scrollDownArrow.png">
                    <h3 class="pres">About me</h3>
                </div>
            </div>
        </div>
        `,
  `
        <div class="group scrolling-down">
            <div id="contatti" class="child">
                <div class = "presentation-container">
                    <img class="scroll-down-arrow" src="../images/home/scrollDownArrow.png">
                    <h3 class="pres">Contatti</h3>
                </div>
            </div>
        </div>
        `,
  `
        <div class="group scrolling-down">
            <div id="prodotti" class="child">
                <div class = "presentation-container">
                    <h3 class="pres">Foto<br>prodotti</h3>
                    <img class="scroll-down-arrow" src="../images/home/scrollDownArrow.png">
                </div> 
            </div>
        </div>
        `
]