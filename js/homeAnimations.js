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
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    window.location.reload(false);
  }
});


/* Mobile vs. Desktop layout */
const allElements = document.querySelectorAll('*');
var isMobileLayout = window.innerWidth <= 960 || (window.innerWidth > 960 && /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

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
  stopScrollCommands();
  window.location.href = 'portfolio.html?page=Matrimoni';
 
});
battesimi.addEventListener('click', function () {
  stopScrollCommands();
  window.location.href = 'portfolio.html?page=Battesimi';
});
altro.addEventListener('click', function () {
  stopScrollCommands();
  window.location.href = 'portfolio.html?page=Altro';
});

function stopScrollCommands() {
  console.log("stopScrollCommands");
  window.scrollY = 0;
  document.removeEventListener('touchmove', touchListener);
  document.removeEventListener('wheel', desktopListener);
}

/* 
-----  3d scroll animation -----
*/
const childElements = document.querySelectorAll('.child');
var current = 0;
var newInd = 0;
var down = true;

// Transform function
function setTransform(down) {
  const index = down ? (current + 1) : current;
  console.log("setTransform on " + index + " down: " + down + "current: " + current);
  if (index == 0 && !down) {
    // do nothing
  } else if (index == childElements.length - 1) {
    if (down == true) {
      childElements[index].parentElement.style.transform = 'translateZ(-200px) scale(2)';
      childElements[index].parentElement.style.zIndex = -1;
      childElements[index - 1].parentElement.style.transform = 'translateZ(0px) scale(1)';
      childElements[index - 1].parentElement.style.zIndex = 0;
    }
  } else {
    childElements.forEach((el, ind) => {
      if (ind == index) {
        el.parentElement.style.transform = 'translateZ(-200px) scale(2)';
        el.parentElement.style.zIndex = -1;
      } else {
        el.parentElement.style.transform = 'translateZ(0px) scale(1)';
        el.parentElement.style.zIndex = 0;
      }
    });
  }
}

// NewView observer
const optionsNewView = {
  root: null,
  rootMargin: '0px',
  threshold: 0.01
};
const observerNewView = new IntersectionObserver(handleIntersection, optionsNewView);

function handleIntersection(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.01) {
      var i = 0;
      childElements.forEach(el => {
        if (el == entry.target) {
          newInd = i;
          console.log("newInd:" + newInd);
        } else {
          i++;
        }
      });

      if (newInd != current) {
        down = newInd > current;
        setTransform(down);
      }
    }
  });
}

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
      var currentIndex = 0;
      childElements.forEach((el, ind) => {
        if (el == entry.target) {
          current = currentIndex;
          isScrolling = false;
          currentVisibleView = ind;
          console.log("snapping on: " + currentIndex + " down:" + down);
          triggerAnimation(el);
        } else {
          currentIndex++;
        }
      });
    }
  });
}

/* 
---- Scroll Down to start ----
*/

// startScrollCommands function
function checkScrollPosition() {
  const scrollPosition = window.scrollY || window.pageYOffset;
  const viewportHeight = window.innerHeight;
  const threshold = viewportHeight * 0.2;
  if (scrollPosition > threshold) {
    console.log("starting scroll commands");
    document.removeEventListener('scroll', checkScrollPosition);
    startScrollCommands();
  }
}

const optionsScrollObserver = {
  threshold: 0.30 
};

function intersectionCallback(entries, observer) {
  entries.forEach(entry => {
    if (entry.intersectionRatio >= 0.30) {
      let child = entry.target;
      if (child) {
        if (child == childElements[current]) {
          console.log("checkScrollPosition");
          checkScrollPosition();
        }
      }
    }
  });
}
const scrollObserver = new IntersectionObserver(intersectionCallback, optionsScrollObserver);

let touchListener;
let desktopListener;

function startScrollCommands() {
  touchListener = document.addEventListener('touchmove', handleScroll, { passive: false });
  desktopListener = document.addEventListener('wheel', handleWheel, { passive: false });
}

// Container observer
const optionsContainerViewForeground = {
  root: null,
  rootMargin: '0px',
  threshold: 1
};
const observerContainerViewForeground = new IntersectionObserver(handleContainerViewForeground, optionsContainerViewForeground);
function handleContainerViewForeground(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio === 1) {
      pageContainer.style.overflowY = 'auto';
      console.log("Container foreground");
    }
  });
}

const optionsContainerViewBackground = {
  root: null,
  rootMargin: '0px',
  threshold: 0.98
};
const observerContainerViewBackground = new IntersectionObserver(handleContainerViewBackground, optionsContainerViewBackground);
function handleContainerViewBackground(entries) {
  entries.forEach(entry => {
    console.log(entry.intersectionRatio);
    if (entry.intersectionRatio < 0.98) {
      console.log("Container hidden");
    }
  });
}

// OnScroll opacity animation
let animationId;

function adjustContainerOpacity() {
  const topPosition = document.documentElement.scrollTop || window.scrollY;
  const maxHeight = document.documentElement.clientHeight;

  const opacity = topPosition / maxHeight;

  if (opacity < 0.95) {
    pageContainer.style.opacity = opacity;
    animationId = requestAnimationFrame(adjustContainerOpacity);
  } else {
    pageContainer.style.opacity = 1;
    cancelAnimationFrame(animationId);
    console.log('Opacity reached 1');
  }
}
animationId = requestAnimationFrame(adjustContainerOpacity);

// Custom navigation
const parentViews = Array.from(childElements).map(element => element.parentElement);
let currentVisibleView = -1;
let firstTouchY = null;
let isScrolling = false;

// Scroll navigation
function handleScroll(event) {
  event.preventDefault();

  if (!isScrolling) {
    const lastTouchY = event.touches[0].clientY;

    if (firstTouchY && (lastTouchY > firstTouchY + 20) || (lastTouchY < firstTouchY - 20)) {
      console.log("handleScroll - firstTouchY:" + firstTouchY + " lastTouchY:" + lastTouchY);
      const delta = firstTouchY - lastTouchY;
      handleInteraction(delta);
      firstTouchY = null;
    } else if (firstTouchY == null) {
      firstTouchY = lastTouchY;
    }
  }
}

// Desktop navigation
let wheelTimer = null;
const handleWheel = (event) => {
  clearTimeout(wheelTimer);
  console.log("wheel");
  event.preventDefault();

  if (!isScrolling && wheelTimer == null) {
    const delta = Math.max(-1, Math.min(1, event.deltaY || -event.detail));
    handleInteraction(delta);
  }

  wheelTimer = setTimeout(() => {
    wheelTimer = null;
    console.log("restarting Timer");
  }, 70);
};

function handleInteraction(delta) {
  console.log("handleInteraction called");
  isScrolling = true;
  if (delta > 0) {
    goToNextView();
  } else {
    goToPreviousView();
  }
}

function goToNextView() {
  console.log("goToNextView called, view: " + (currentVisibleView + 1));
  if (currentVisibleView + 1 < parentViews.length) {
    scrollToView(parentViews[currentVisibleView + 1]);
  } else {
    isScrolling = false;
  }
}
function goToPreviousView() {
  console.log("goToPreviousView called, view: " + (currentVisibleView - 1));
  if (currentVisibleView - 1 >= 0) {
    scrollToView(parentViews[currentVisibleView - 1]);
  } else {
    isScrolling = false;
  }
}

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
  const subtitle_txt = "Mi chiamo "
  const name_txt = "Marta Cosca."

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

  setTimeout(() => {
    title.style.fontSize = '60px';
    title.style.opacity = '1';
    if (isMobileLayout) {
      descContainer.style.height = '65%';
      image.style.height = '35%';
      if (window.innerHeight < 750) {
        title.style.fontSize = '40px';
        sub.paddingTop = '5px';
        sub.paddingBottom = '5px';
        p1.style.fontSize = '15px';
        p2.style.fontSize = '15px';
        p3.style.fontSize = '15px';
        p4.style.fontSize = '15px';
        p5.style.fontSize = '15px';
      }
    }
  }, 500);

  setTimeout(() => {
    sub.textContent = subtitle_txt;
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
    setTimeout(() => {
      pageContainer.style.height = '100vh';
    }, 700);
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
  observerNewView.observe(childElement);
  observerCurrentView.observe(childElement);
  scrollObserver.observe(childElement);
});
//ContainerViewForeground
observerContainerViewForeground.observe(pageContainer);
observerContainerViewBackground.observe(pageContainer);



/*
function resetPortfolio(view) {
  console.log("ResetAnimation of " + view.id);
  const start = view.querySelector("#start");
  const second = view.querySelector("#second");
  const matrimoni = view.querySelector("#matrimoni");
  const battesimi = view.querySelector("#battesimi");
  const altro = view.querySelector("#altro");
  const caption = view.querySelector("#caption");
  const imgContainers = view.querySelectorAll('.image-container');
  if (!isMobileLayout) {
    start.style.height = '100%';
    second.style.height = '0%';
    caption.style.width = '100%';

    imgContainers.forEach(container => {
      container.style.width = '0%';
      container.querySelector('img').style.opacity = '0';
      const newElement = container.cloneNode(true);
      container.parentNode.replaceChild(newElement, container);
    });
  } else {
    imgContainers.forEach(container => {
      const textOverlay = container.querySelector('.text-overlay');
      textOverlay.style.opacity = '0';
    });
  }
} */

// Observer to always remove top bar on mobile phones before scrolling the main container
/* const options = {
  threshold: 0.75 
};

const callback = (entries, bottomDivObserver) => {
  entries.forEach(entry => {
    console.log("bottomdiv intRatio: " + entry.intersectionRatio);
    if (entry.intersectionRatio < 0.75) {
      pageContainer.style.overflowY = 'hidden';
      scrollDownContainer.style.overflowY = 'auto';
    }
    if (entry.intersectionRatio > 0.75) {
      pageContainer.style.overflowY = 'auto';
      externalContainer.style.overflowY = 'hidden';
    }
  });
};
const bottomDivObserver = new IntersectionObserver(callback, options); 
-- html 
<div class="bottom-div">
    <div id="link" class="h">
      <footer>Ti piace questo sito?</footer>
      <a href="https://github.com/rubetommaso0">Clicca qui!</a>
    </div>
 </div>
//bottomDiv
bottomDivObserver.observe(bottomDiv);
*/