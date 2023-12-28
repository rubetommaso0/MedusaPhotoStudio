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
  constructor(foregroundElement) {
    this.foregroundContainer = document.querySelector('.foreground-container');
    this.foregroundElement = foregroundElement;
    this.animations = {
      homepage: false,
      portfolio: false,
      about: false,
      contatti: false,
      prodotti: false
    };
  }

  id() {
    return this.foregroundElement.querySelector('.child').id;
  }

  position() {
    return getTopPosition(this.foregroundElement);
  }

  height() {
    return this.foregroundElement.getBoundingClientRect().height;
  }

  update(isHome, id) {
    if (isHome) {
      this.foregroundContainer.style.opacity = 0;
      this.foregroundContainer.innerHTML = homeHTML;
      this.foregroundElement = this.foregroundContainer.querySelector('#homepage').parentElement;
    } else {
      this.foregroundContainer.style.opacity = 0;
      const index = childElementIndex[id];
      this.foregroundContainer.innerHTML = elementsArray[index];
      this.foregroundElement = this.foregroundContainer.querySelector('#' + id).parentElement;
    }
    setLayout(this.foregroundContainer);
    console.log("foregroundElement");
    console.log(this.foregroundElement);
  }

  updateWithoutAnimation(isHome, id) {
    if (isHome) {
      this.foregroundContainer.style.opacity = 0;
      this.foregroundContainer.innerHTML = animationCompeleteHome;
      this.foregroundElement = this.foregroundContainer.querySelector('#homepage').parentElement;
      setLayout(this.foregroundElement);
    } else {
      this.foregroundContainer.style.opacity = 0;
      const index = childElementIndex[id];
      if (isMobileLayout) {
        this.foregroundContainer.innerHTML = elementsAnimationCompleteArrayMobile[index];
      } else {
        this.foregroundContainer.innerHTML = elementsAnimationCompleteArrayDesktop[index];
      }
      this.foregroundElement = this.foregroundContainer.querySelector('#' + id).parentElement;
    }
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
          homeOnAppearAnimation(this.foregroundElement);
          break;
        case "portfolio":
          portfolioAnimation(this.foregroundElement);
          break;
        case "about":
          aboutAnimation(this.foregroundElement);
          break;
        case "contatti":
          contattiAnimation(this.foregroundElement);
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
    this.nextElement = null;
    this.homeElement = document.querySelector('.home-container');
    this.foregroundElement = null;
  }

  triggerAnimation(isHome, isNext) {
    if (isHome) {
      this.dissolve(this.homeElement);
    } else if (isNext) {
      this.dissolve(this.nextElement);
    } else {
      this.dissolve(this.foregroundElement);
    }
  }

  createFG() {
    this.foregroundElement = document.createElement('div');
    this.foregroundElement.classList.add("group", "scrolling-down", "foreground");
    this.pageContainer.appendChild(this.foregroundElement);
  }

  populateFG(id) {
    this.foregroundElement.innerHTML = presentationDownArray[childElementIndex[id]];
    this.foregroundElement = this.pageContainer.querySelector('.foreground');
  }

  resetScrollPosition(top) {
    //this.foregroundElement.scrollIntoView();
    this.pageContainer.scrollTo({
      top: top
    });
  }

  populateNext(id) {
    if (this.nextElement) {
      this.nextElement.innerHTML = presentationDownArray[childElementIndex[id]];
    } else {
      this.nextElement = document.createElement('div');
      this.nextElement.classList.add("group", "scrolling-down", "next-element");
      this.nextElement.innerHTML = presentationDownArray[childElementIndex[id]];
      this.pageContainer.appendChild(this.nextElement);
    }
  }

  removeNext() {
    this.nextElement.remove();
    this.nextElement = null;
  }

  idNextElement() {
    return this.nextElement.querySelector('.child').id;
  }

  startObserving() {
    console.log("start observing");
    homeObserver.observe(this.homeElement);
  }

  stopObserving() {
    console.log("stop observing");
    homeObserver.disconnect();
  }

  createNextElement(id) {
    const index = (childElementIndex[id]);
    console.log("new nextElement " + id);
    this.populateNext(id);
    this.nextElement.style.transition = 'none';
    setLayout(this.nextElement);
  }

  position() {
    if (isGoingDown) {
      if (this.nextElement) {
        return getTopPosition(this.nextElement);
      }
      if (this.foregroundElement) {
        return getTopPosition(this.foregroundElement);
      }
    }
    return getTopPosition(this.homeElement);
  }

  dissolve(element) {
    element.style.transition = 'opacity 0.8s ease-in';
    element.style.opacity = '0';
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
    this.foreground = new Foreground(this.scrollDownContainer);
    this.background = new Background();
    this.setLayout();
    this.adjustContainerOpacity = this.adjustContainerOpacity.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.animationId = this.startOpacityAnimation([this.background.homeElement], this.scrollDownContainer);
  }

  setLayout() {
    setLayout(this.scrollDownContainer);
    setLayout(this.foreground.foregroundContainer);
    setLayout(this.background.pageContainer);
  }

  calcOpacity() {
    const topPositionBG = this.background.position();
    const topPositionFG = this.foreground.position();
    const height = this.foreground.height();
    const test = Math.abs(topPositionBG - topPositionFG) / height;

    if (test * height <= height) {
      opacity = {
        opacityFG: Math.abs(topPositionBG - topPositionFG) / height,
        opacityBG: 1 - test
      }
    } else {
      const opacityBG = (Math.abs(topPositionBG - topPositionFG) - height) / height;
      opacity = {
        opacityFG: 1 - opacityBG,
        opacityBG: (Math.abs(topPositionBG - topPositionFG) - height) / height
      }
    }

    return opacity;
  }

  firstScroll() {
    document.body.style.height = 'calc(100vh + 10px)';
    window.scrollTo({
      top: 1
    });
    document.addEventListener('touchstart', this.touchStart, { passive: true });
    document.addEventListener('touchmove', this.handleScroll, { passive: false });
    this.scrollDownContainer.style.top = '-100vh';
    document.body.style.overflowY = 'hidden';
    this.foreground.foregroundContainer.style.top = '0vh';
    this.background.pageContainer.style.top = '0vh';
    this.background.pageContainer.style.overflowY = 'auto';

    this.foreground.update(true);
    this.cancelOpacityAnimation();

    setTimeout(() => {
      this.background.triggerAnimation(true, false);
    }, 200);

    setTimeout(() => {
      this.foreground.appear();
    }, 1000);

    setTimeout(() => {
      this.foreground.triggerAnimation();
      this.background.startObserving();
      // create foreground element
      this.background.createFG();
      this.background.populateFG(childElementsId[0]);

      this.startOpacityAnimation([this.background.foregroundElement], this.foreground.foregroundElement);

    }, 1500);

    console.log("first scroll down complete");
  }

  foregroundScroll(id, createNext) {

    if (this.foreground.animations[id]) {
      this.foreground.updateWithoutAnimation(false, id);
    } else {
      this.foreground.update(false, id);
    }
    this.cancelOpacityAnimation();

    setTimeout(() => {
      this.background.triggerAnimation(false, false);
    }, 200);

    setTimeout(() => {
      this.foreground.appear();
    }, 1000);

    setTimeout(() => {
      this.foreground.triggerAnimation();
      if (createNext) {
        let idNext = childElementsId[childElementIndex[id] + 1];
        this.background.createNextElement(idNext);
        this.startOpacityAnimation([this.background.nextElement, this.background.homeElement], this.foreground.foregroundElement);
      } else {
        this.startOpacityAnimation([this.background.homeElement], this.foreground.foregroundElement);
      }

    }, 1500);

    console.log("foreground scroll down complete");
  }

  nextScroll() {

    const idNext = this.background.idNextElement();
    if (this.foreground.animations[idNext]) {
      this.foreground.updateWithoutAnimation(false, idNext);
    } else {
      this.foreground.update(false, idNext);
    }
    this.cancelOpacityAnimation();

    setTimeout(() => {
      this.background.triggerAnimation(false, true);
    }, 200);

    setTimeout(() => {
      this.background.resetScrollPosition(this.foreground.height());
      this.foreground.appear();
    }, 1000);

    setTimeout(() => {
      this.foreground.triggerAnimation();
      this.background.createNextElement(childElementsId[childElementIndex[this.background.idNextElement()] + 1]);
      this.startOpacityAnimation([this.background.nextElement, this.background.homeElement], this.foreground.foregroundElement);
    }, 1500);

    console.log("next scroll down complete");
  }

  // Non viene triggherato perchè opacity della hove va sotto zero quando scrollo verso SU ! ! ! ! ! ! ! 
  
  homeScroll() {
    this.foreground.updateWithoutAnimation(true);
    this.cancelOpacityAnimation();

    setTimeout(() => {
      this.background.triggerAnimation(true, false);
    }, 200);

    setTimeout(() => {
      this.foreground.appear();
    }, 1000);

    setTimeout(() => {
      this.foreground.triggerAnimation();
      this.background.removeNext();
      this.background.populateFG(childElementsId[0]);

      // update views to animate & restart opacity animation
      this.startOpacityAnimation([this.background.foregroundElement], this.foreground.foregroundElement);
    }, 1500);

    console.log("home scroll complete");
  }


  touchStart(event) {
    startY = event.touches[0].clientY;
  }
  handleScroll(event) {
    const touchY = event.touches[0].clientY;
    if (touchY > startY && homepage) {
      event.preventDefault();
      return;
    }
    if (touchY < startY && last) {
      event.preventDefault();
      return;
    }
  }

  adjustContainerOpacity() {
    //console.log("opacity animation is running..");
    //console.log(elementsToAnimate);
    const opacity = this.calcOpacity();
    const elementToDissolve = elementsToAnimate.elementToDissolve;
    const elementsAppearing = elementsToAnimate.elementsAppearing;
    if (opacity.opacityBG < 0.98) {
      elementsAppearing.forEach(element => {
        element.style.opacity = Math.min(opacity.opacityBG + 0.2, 0.99).toString();
      });
      elementToDissolve.style.opacity = opacity.opacityFG;
      this.animationId = requestAnimationFrame(this.adjustContainerOpacity);
    } else {
      if (firstScroll) {
        this.firstScroll();
        this.cancelOpacityAnimation();
        firstScroll = false;
      } else if (this.background.nextElement) {
        if (isHomeAppearing) {
          this.homeScroll();
        } else {
          this.nextScroll();
        }
      } else {
        if (this.requestedForeground) {
          this.foregroundScroll(this.requestedForeground, false);
        } else {
          this.foregroundScroll(childElementsId[0], true);
        }
      }
    }
  }

  startOpacityAnimation(elementsAppearing, elementToDissolve) {
    // update views to animate and restart opacity animation
    elementsToAnimate = {
      elementsAppearing: elementsAppearing,
      elementToDissolve: elementToDissolve
    }
    elementsAppearing.forEach(element => {
      element.style.transition = 'none';
    });
    elementToDissolve.style.transition = 'none';
    const animationId = requestAnimationFrame(this.adjustContainerOpacity);
    return animationId;
  }

  cancelOpacityAnimation() {
    cancelAnimationFrame(this.animationId);
  }

}

/* 
---- Variables ----
*/
let startY = 0;
var firstScroll = true;
var isGoingDown = true;
var homepage = true;
var last = false;
var isHomeAppearing = false;

var opacity = {
  opacityBG: 0,
  opacityFG: 1
};

const childElementIndex = {
  portfolio: 0,
  about: 1,
  contatti: 2,
  prodotti: 3
};
const childElementsId = [
  'portfolio',
  'about',
  'contatti',
  'prodotti'
];

const loader = document.body.querySelector('.loader');
var timer = 2800;

var isMobileLayout = window.innerWidth <= 960 || (window.innerWidth > 960 && /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

// setup opacity animation elements
let elementsToAnimate;
// Start navigation
var nav = new Navigation();

const options = {
  threshold: 0.5
};
const homeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
      isHomeAppearing = true;
    } else if (entry.intersectionRatio < 0.5) {
      isHomeAppearing = false;
    }
  });
}, options);

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
        element.querySelector('#ab-image').src = "../images/home/about_me_mobile.jpg";
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



// On appear home animation 
function homeOnAppearAnimation(foregroundElement) {
  // Animation on intersection
  setTimeout(() => {
    foregroundElement.querySelector('#menu').style.opacity = '0.85';
  }, 200);
  setTimeout(() => {
    foregroundElement.querySelector('#name').querySelector('h1').style.opacity = '1';
  }, 700);
  setTimeout(() => {
    foregroundElement.querySelector('#logo').style.opacity = '0.7';
  }, 900);
  const h2 = foregroundElement.querySelector('#name').querySelector('h2');
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
function aboutAnimation(aboutElement) {
  const name_txt = " Marta Cosca."

  const descContainer = aboutElement.querySelector('#descrizione');
  const heightContainer = aboutElement.querySelector('#height-container');
  const image = aboutElement.querySelector('#ab-image');
  const title = aboutElement.querySelector('#ab-title');
  const sub = aboutElement.querySelector('#ab-subtitle');
  const p1 = aboutElement.querySelector('#ab-p1');
  const p2 = aboutElement.querySelector('#ab-p2');
  const p3 = aboutElement.querySelector('#ab-p3');
  const p4 = aboutElement.querySelector('#ab-p4');
  const p5 = aboutElement.querySelector('#ab-p5');

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
function contattiAnimation(foregroundElement) {
  const contatti = Array.from(foregroundElement.querySelectorAll('.c'));

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

var homeHTML = `
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
`;

var elementsArray = [
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

const backToHome =
  `
            <div id="homepage" class="child">
                <div class = "presentation-container">
                    <h3 class="pres">Home</h3>
                    <img class="scroll-up-arrow" src="../images/home/scrollUpArrow.png">
                </div>
            </div>
        ` ;

const presentationDownArray = [
  `
            <div id="portfolio" class="child">
                <div class = "presentation-container">
                    <img class="scroll-down-arrow" src="../images/home/scrollDownArrow.png">
                    <h3 class="pres">Portfolio</h3>
                </div>
            </div>
        `,
  `
            <div id="about" class="child">
                <div class = "presentation-container">
                    <img class="scroll-down-arrow" src="../images/home/scrollDownArrow.png">
                    <h3 class="pres">About me</h3>
                </div>
            </div>
        `,
  `
            <div id="contatti" class="child">
                <div class = "presentation-container">
                    <img class="scroll-down-arrow" src="../images/home/scrollDownArrow.png">
                    <h3 class="pres">Contatti</h3>
                </div>
            </div>
        `,
  `
            <div id="prodotti" class="child">
                <div class = "presentation-container">
                    <h3 class="pres">Foto<br>prodotti</h3>
                    <img class="scroll-down-arrow" src="../images/home/scrollDownArrow.png">
                </div> 
            </div>
        `
]

var elementsAnimationCompleteArrayDesktop = [
  `
  <div class="group desktop" style="transition: none 0s ease 0s; opacity: 0.998728;">
            <div id="portfolio" class="child desktop">
                <div class="v desktop" style="height: 100%; width: 100%;">
                    <div class="h desktop" id="second" style="height: 50%;">
                        <div class="image-container desktop" id="matrimoni-link" style="width: 50%;">
                            <img src="../images/home/matrimoni.JPG" id="matrimoni" class="desktop" style="opacity: 1;">
                            <div class="text-overlay desktop">
                                <div class="text desktop">Matrimoni</div>
                            </div>
                        </div>
                        <div class="image-container desktop" id="battesimi-link" style="width: 50%;">
                            <img src="../images/home/battesimi.jpg" class="desktop" style="opacity: 1;">
                            <div class="text-overlay desktop">
                                <div class="text desktop">Battesimi</div>
                            </div>
                        </div>
                    </div>
                    <div class="h desktop" id="start" style="height: 50%;">
                        <div id="caption" class="caption desktop" style="width: 50%;">
                            <h1 class="desktop">portfolio</h1>
                        </div>
                        <div class="image-container desktop" id="altro-link" style="width: 50%;">
                            <img src="../images/home/altro.jpg" class="desktop" style="opacity: 1;">
                            <div class="text-overlay desktop">
                                <div class="text desktop">Altro</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>`,
        `
        <div class="group desktop" style="transition: none 0s ease 0s; opacity: 0.998728;">
            <div id="about" class="child desktop">
                <div class="h desktop" id="height-container">
                    <img id="ab-image" src="../images/home/about_me.jpg" class="desktop">
                    <div id="descrizione" class="desktop" style = "justify-content: center; height: auto;">
                        <div id="ab-title-container" class="desktop">
                            <h1 id="ab-title" class="desktop" style="height: auto; font-size: 60px; opacity: 1;">Ciao!</h1>
                        </div>
                        <h2 id="ab-subtitle" class="desktop" style="opacity: 1;">Mi chiamo Marta Cosca.</h2>
                        <p id="ab-p1" class="desktop" style="opacity: 1; padding-top: 10px;">Sono diplomata in lingue e laureata in Arti Visive presso la NABA di Milano.</p>
                        <p id="ab-p2" class="desktop" style="opacity: 1; padding-top: 10px;">Dal 2020 ho la mia attività da fotografa.</p>
                        <p id="ab-p3" class="desktop" style="opacity: 1; padding-top: 10px;">Amo osservare e documentare tutto ciò che è reale, spontaneo, crudo!</p>
                        <p id="ab-p4" class="desktop" style="opacity: 1; padding-top: 10px;">Qui non troverete mai finzione, filtri stravolgenti, effetti speciali, visi perfezionati, immagini costruite.</p>
                        <p id="ab-p5" class="desktop" style="opacity: 1; padding-top: 10px;">Qui troverete una versione bidimensionale, autentica e trasparente di ciò che siete, interpretata da me, che mi innamoro delle piccole cose, dei piccoli gesti, degli sguardi fugaci e di tutto ciò che ci rende unici.</p>
                    </div>
                </div>
            </div>
        </div>
        `, 
        `
        <div class="group desktop" style="transition: none 0s ease 0s; opacity: 0.998728;">
            <div id="contatti" class="child desktop">
                <div class="h desktop" id="height-container">
                    <div id="title" class="desktop">
                        <h1 class="desktop">Contatti</h1>
                    </div>
                    <div class="c desktop" id="c-p1" style="height: 14vh; opacity: 1;">
                        <img src="../images/home/phone.png" class="desktop">
                        <p class="desktop">Telefono:</p>
                        <p class="desktop">12345832732</p>
                    </div>
                    <div class="c desktop" id="c-p2" style="height: 14vh; opacity: 1;">
                        <img src="../images/home/email.png" class="desktop">
                        <p class="desktop">Email:</p>
                        <p class="desktop">12345832732</p>
                    </div>
                    <div class="c desktop" id="c-p3" style="height: 14vh; opacity: 1;">
                        <img src="../images/home/insta1.png" class="desktop">
                        <p class="desktop">Instagram:</p>
                        <p class="desktop">12345832732</p>
                    </div>
                    <div class="c desktop" id="c-p4" style="height: 14vh; opacity: 1;">
                        <img src="../images/home/insta2.png" class="desktop">
                        <p class="desktop">Instagram inclusive profile:</p>
                        <p class="desktop">12345832732</p>
                    </div>
                    <div class="c desktop" id="c-p5" style="height: 14vh; opacity: 1;">
                        <img src="../images/home/camera.png" class="desktop">
                        <p class="desktop">Rikorda.it:</p>
                        <p class="desktop">12345832732</p>
                    </div>
                </div>
            </div>
        </div>
        `,
        `
        ** FotoProdotti **
        `
];

var elementsAnimationCompleteArrayMobile = [
  `
  <div class="group mobile" style="transition: none 0s ease 0s; opacity: 0.998884;">
            <div id="portfolio" class="child mobile">
                <div class="v mobile" style="height: 100%; width: 100%;">
                    <div class="h mobile" id="second">
                        <div class="image-container mobile" id="matrimoni-link">
                            <img src="../images/home/matrimoni.JPG" id="matrimoni" class="mobile">
                            <div class="text-overlay mobile">
                                <div class="text mobile" style="transform: translateX(0px);">Matrimoni</div>
                            </div>
                        </div>
                        <div class="image-container mobile" id="battesimi-link">
                            <img src="../images/home/battesimi.jpg" class="mobile">
                            <div class="text-overlay mobile">
                                <div class="text mobile" style="transform: translateX(0px);">Battesimi</div>
                            </div>
                        </div>
                    </div>
                    <div class="h mobile" id="start">
                        <div id="caption" class="caption mobile">
                            <h1 class="mobile">portfolio</h1>
                        </div>
                        <div class="image-container mobile" id="altro-link">
                            <img src="../images/home/altro.jpg" class="mobile">
                            <div class="text-overlay mobile">
                                <div class="text mobile" style="transform: translateX(0px);">Altro</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
  `, 
  `
  <div class="group mobile" style="transition: none 0s ease 0s; opacity: 0.998884;">
            <div id="about" class="child mobile">
                <div class="h mobile" id="height-container">
                    <img id="ab-image" src="../images/home/about_me_mobile.jpg" class="mobile" style="height: 35%;">
                    <div id="descrizione" class="mobile" style = "justify-content: center; height: 100%;">
                        <div id="ab-title-container" class="mobile" style="height: 70px;">
                            <h1 id="ab-title" class="mobile" style="font-size: 40px; opacity: 1;">Ciao!</h1>
                        </div>
                        <h2 id="ab-subtitle" class="mobile" style="opacity: 1;">Mi chiamo Marta Cosca.</h2>
                        <p id="ab-p1" class="mobile" style="opacity: 1;">Sono diplomata in lingue e laureata in Arti Visive presso la NABA di Milano.</p>
                        <p id="ab-p2" class="mobile" style="opacity: 1;">Dal 2020 ho la mia attività da fotografa.</p>
                        <p id="ab-p3" class="mobile" style="opacity: 1;">Amo osservare e documentare tutto ciò che è reale, spontaneo, crudo!</p>
                        <p id="ab-p4" class="mobile" style="opacity: 1;">Qui non troverete mai finzione, filtri stravolgenti, effetti speciali, visi perfezionati, immagini costruite.</p>
                        <p id="ab-p5" class="mobile" style="opacity: 1;">Qui troverete una versione bidimensionale, autentica e trasparente di ciò che siete, interpretata da me, che mi innamoro delle piccole cose, dei piccoli gesti, degli sguardi fugaci e di tutto ciò che ci rende unici.</p>
                    </div>
                </div>
            </div>
        </div>
  `, 
  `
  <div class="group mobile" style="transition: none 0s ease 0s; opacity: 0.998884;">
            <div id="contatti" class="child mobile">
                <div class="h mobile" id="height-container">
                    <div id="title" class="mobile">
                        <h1 class="mobile">Contatti</h1>
                    </div>
                    <div class="c mobile" id="c-p1" style="height: 14vh; opacity: 1;">
                        <img src="../images/home/phone.png" class="mobile">
                        <p class="mobile">Telefono:</p>
                        <p class="mobile">12345832732</p>
                    </div>
                    <div class="c mobile" id="c-p2" style="height: 14vh; opacity: 1;">
                        <img src="../images/home/email.png" class="mobile">
                        <p class="mobile">Email:</p>
                        <p class="mobile">12345832732</p>
                    </div>
                    <div class="c mobile" id="c-p3" style="height: 14vh; opacity: 1;">
                        <img src="../images/home/insta1.png" class="mobile">
                        <p class="mobile">Instagram:</p>
                        <p class="mobile">12345832732</p>
                    </div>
                    <div class="c mobile" id="c-p4" style="height: 14vh; opacity: 1;">
                        <img src="../images/home/insta2.png" class="mobile">
                        <p class="mobile">Instagram inclusive profile:</p>
                        <p class="mobile">12345832732</p>
                    </div>
                    <div class="c mobile" id="c-p5" style="height: 14vh; opacity: 1;">
                        <img src="../images/home/camera.png" class="mobile">
                        <p class="mobile">Rikorda.it:</p>
                        <p class="mobile">12345832732</p>
                    </div>
                </div>
            </div>
        </div>
  `
];

const animationCompeleteHome = 
  `
  <div class="group" style="transition: none 0s ease 0s; opacity: 0.998728;">
        <div id="homepage" class="child">
            <img id="bg" src="../images/home/bg.jpg">
            <div id="menu" style="opacity: 0.85;">
                <a data-link="#portfolio" id="menu-1" class="scroll-link">PORTFOLIO</a>
                <p>•</p>
                <a data-link="#about" id="menu-2" class="scroll-link">ABOUT ME</a>
                <p>•</p>
                <a data-link="#contatti" id="menu-3" class="scroll-link">CONTATTI</a>
                <p>•</p>
                <a data-link="#prodotti" id="menu-4" class="scroll-link">FOTOPRODOTTI</a>
            </div>
            <div id="name">
                <img id="logo" src="../images/home/logo.png" style="opacity: 0.7;">
                <div class="v">
                    <h1 style="opacity: 1;">MEDUSA</h1>
                    <h2 style="opacity: 1;">PHOTOSTUDIO</h2>
                </div>
            </div>
        </div>
    </div>`;