// mobile vs. desktop behaviour

const allElements = document.querySelectorAll('*');
var isMobileLayout = window.innerWidth <= 960;

function setLayout() {
  if (isMobileLayout) {
    allElements.forEach(element => {
      element.classList.add('mobile');
      element.classList.remove('desktop');
    });
  } else {
    allElements.forEach(element => {
      element.classList.add('desktop');
      element.classList.remove('mobile');
    });
  }
}

setLayout();


const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

// Menu links scroll animation
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('scroll-link')) {
    const target = event.target;
    const selector = target.dataset.link;
    if ('scrollBehavior' in document.documentElement.style) {
      document.querySelector(selector).parentElement.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      document.querySelector(selector).parentElement.scrollIntoView();
    }

    const view = document.querySelector(selector);
    scrollTimer = setTimeout(() => {
      triggerAnimation(view);
    }, 500);
  }
});

// portfolio links
const matrimoni = document.body.querySelector("#matrimoni-link");
const battesimi = document.body.querySelector("#battesimi-link");
const altro = document.body.querySelector("#altro-link");
matrimoni.addEventListener('click', function () {
  // Replace 'your-link-here' with the URL you want to navigate to
  window.location.href = 'portfolio.html?page=Matrimoni';
});
battesimi.addEventListener('click', function () {
  // Replace 'your-link-here' with the URL you want to navigate to
  window.location.href = 'portfolio.html?page=Battesimi';
});
altro.addEventListener('click', function () {
  // Replace 'your-link-here' with the URL you want to navigate to
  window.location.href = 'portfolio.html?page=Altro';
});


// Slide animation

const childElements = document.querySelectorAll('.child');
var current = 0;
var newInd = 0;
var down = true;

function setTransform(down) {
  const index = down ? (current + 1) : (current - 1);
  if (index == 0) {
    const index = 1;
    childElements[index].style.transform = 'translateZ(-200px) scale(2)';
    childElements[index].parentElement.style.zIndex = -1;
    childElements[index + 1].style.transform = 'translateZ(0px) scale(1)';
    childElements[index + 1].parentElement.style.zIndex = 0;
  } else {
    childElements.forEach((el, ind) => {
      if (ind == index) {
        el.style.transform = 'translateZ(-200px) scale(2)';
        el.parentElement.style.zIndex = -1;
      } else {
        el.style.transform = 'translateZ(0px) scale(1)';
        el.parentElement.style.zIndex = 0;
      }
    });
  }
  console.log("setTransform on " + index + " down: " + down);
}
setTransform(down);

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

function handleCurrentView(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.99) {
      var currentIndex = 0;
      childElements.forEach(el => {
        if (el == entry.target) {
          current = currentIndex;
          console.log("snapping on: " + currentIndex + " down:" + down);
        } else {
          currentIndex++;
        }
      });
    }
  });
}

const optionsNewView = {
  root: null,
  rootMargin: '0px',
  threshold: 0.01
};

const optionsCurrentView = {
  root: null,
  rootMargin: '0px',
  threshold: 0.99
};

const observerNewView = new IntersectionObserver(handleIntersection, optionsNewView);
const observerCurrentView = new IntersectionObserver(handleCurrentView, optionsCurrentView);

childElements.forEach(childElement => {
  observerNewView.observe(childElement);
  observerCurrentView.observe(childElement);
});


// scroll snap animation 
let scrollTimer;
let currentView;

function intersectionCallback(entries, observer) {
  entries.forEach(entry => {
    if (entry.intersectionRatio >= 0.30) {
      let child = entry.target.querySelector('.child');
      if (child) {
        if (child == childElements[current]) {
          currentView = entry.target;
          console.log(currentView);
        }
      }
    }
  });
}

function triggerAnimation(view) {
  if (view.id == "portfolio") {
    portfolioAnimation(view);
  } else {
    resetPortfolio(document.querySelector("#portfolio"));
  }
  if (view.id == "about" && !aboutAnimationComplete) {
    aboutAnimation();
  } else {
    aboutAnimationComplete = true;
  }
}

function handleMouseOver(container) {
  // Get the text overlay within the hovered container
  const textOverlay = container.querySelector('.text-overlay');

  // Apply styles to the text overlay when hovered
  if (textOverlay) {
    textOverlay.style.backgroundColor = `#f8f4f1`;
    textOverlay.style.color = '#e6947c';
    textOverlay.style.opacity = '1';
  }
}

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
    // Get all elements with the class "image-container"
    const imageContainers = document.querySelectorAll('.image-container');

    Array.from(imgContainers).forEach(container => {
      (function (index) {
        container.style.width = '50%';
        setTimeout(() => {
          container.querySelector('img').style.opacity = '1';
          container.addEventListener('mouseover', () => handleMouseOver(container));

          container.addEventListener('mouseout', () => {
            const textOverlay = container.querySelector('.text-overlay');

            // Reset styles when mouse leaves
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
          container.querySelector('img').style.opacity = '1';
        }, (index - 1) * 1500);
        setTimeout(() => {
          textOverlay.style.opacity = '1';
        }, index * 1500);
      })(i);
      i++;
    });
  }
}

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
}

function aboutAnimation() {
  const subtitle_txt = "Mi chiamo "
  const name_txt = "Marta Cosca."
  const p1_txt = "Sono diplomata in lingue e laureata in Arti Visive presso la NABA di Milano."
  const p2_txt = "Dal 2020 ho la mia attività da fotografa."
  const p3_txt = "Amo osservare e documentare tutto ciò che è reale, spontaneo, crudo!"
  const p4_txt = "Qui non troverete mai finzione, filtri stravolgenti, effetti speciali, visi perfezionati, immagini costruite."
  const p5_txt = "Qui troverete una versione bidimensionale, autentica e trasparente di ciò che siete, interpretata da me, che mi innamoro delle piccole cose, dei piccoli gesti, degli sguardi fugaci e di tutto ciò che ci rende unici."

  const descContainer = document.body.querySelector('#descrizione');
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
    p1.textContent = p1_txt;
    p1.style.opacity = '1';
  }, 2400 + 150 * i);
  setTimeout(() => {
    p2.textContent = p2_txt;
    p2.style.opacity = '1';
  }, 3200 + 150 * i);
  setTimeout(() => {
    p3.textContent = p3_txt;
    p3.style.opacity = '1';
  }, 4000 + 150 * i);
  setTimeout(() => {
    p4.textContent = p4_txt;
    p4.style.opacity = '1';
  }, 4800 + 150 * i);
  setTimeout(() => {
    p5.textContent = p5_txt;
    p5.style.opacity = '1';
  }, 5600 + 150 * i);
  setTimeout(() => {
    p1.style.paddingTop = '12px';
    p2.style.paddingTop = '12px';
    p3.style.paddingTop = '12px';
    p4.style.paddingTop = '12px';
    p5.style.paddingTop = '12px';
  }, 6000 + 150 * i);
}

// on appear animation 

function animateOnIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
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
      // Stop observing after animation is triggered
      observer.unobserve(entry.target);
    }
  });
}

// Create Intersection Observer with threshold 0.01
const observer3 = new IntersectionObserver(animateOnIntersection, { threshold: 0.01 });

// Observe target elements
observer3.observe(document.getElementById('menu'));
observer3.observe(document.getElementById('name'));

// loader animation
function updateProgress(loaded, total) {
  const progress = (loaded / total) * 100;
  const progressBar = document.querySelector('.progress');
  progressBar.style.width = `${progress}%`;
}

const images = Array.from(document.body.querySelectorAll('img'));
const loader = document.body.querySelector('.loader');
const dots = document.body.querySelector('#dots');
imageSources = images.map(image => {
  return image.src;
});

imageSources.forEach(imageSrc => {
  const img = new Image();
  img.src = imageSrc;
  img.onload = () => loadedImagesCount++;
});

let loadedImagesCount = 0;
let dotStates = ['', '.', '..', '...'];
let dotIndex = 0;

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
    contentLoad();
  }
}

function contentLoad() {
  console.log("contentLoad called");
  loader.style.height = '0vh';
  setTimeout(() => {
    document.body.querySelector('.container').style.height = '100vh';
  }, 700);
  console.log("contentLoad ended");
}