

// menu links scroll animation
document.querySelectorAll('.scroll-link').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
    const view = document.querySelector(this.getAttribute('href'));
    scrollTimer = setTimeout(() => {
      triggerAnimation(view);
    }, 500);
  });
})

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
var childElement = null;
var last = 0;

function handleIntersection(entries, observer1) {
  entries.forEach(entry => {

    if (entry.isIntersecting) {
      for (i = 0; i < childElements.length; i++) {
        if (childElements[i] === entry.target.querySelector('.child')) {
          console.log("i= " + i + ", last=" + last);
          if (last == i - 2) {
            last++;
          }
          if (last <= i && last != i) {
            console.log("last:" + last + " - 200y")
            childElement = childElements[last];
            childElement.style.transform = 'translateZ(-200px) scale(2)';
          }
          if (last != 0 && last > i) {
            console.log("i:" + i + " - 200y")
            childElement = childElements[i];
            childElement.style.transform = 'translateZ(-200px) scale(2)';
          }
          last = i;
        } else {
          childElements[i].style.transform = 'translateZ(0) scale(1)';
        }
      }
    }
  });
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.005
};

const observer1 = new IntersectionObserver(handleIntersection, options);

const groupElements = document.querySelectorAll('.group');

groupElements.forEach(groupElement => {
  observer1.observe(groupElement);
});


// scroll snap animation 
let scrollTimer;
let currentView;

function intersectionCallback(entries, observer) {
  entries.forEach(entry => {
    if (entry.intersectionRatio >= 0.5) {
      currentView = entry.target;
    }
  });
}

const observer2 = new IntersectionObserver(intersectionCallback, {
  threshold: 0.5,
});

groupElements.forEach(groupElement => {
  observer2.observe(groupElement);
});

var isScrolling = false;

window.addEventListener('wheel', Event => {
  if (!isScrolling) {
    clearTimeout(scrollTimer); // Clear the existing timeout
    console.log("wheel");

    // Set a new timeout after the wheel event
    scrollTimer = setTimeout(() => {
      isScrolling = true;

      currentView.scrollIntoView({
        behavior: 'smooth'
      });
      triggerAnimation(currentView.querySelector('.child'));
      for (i = 0; i < childElements.length; i++) {
        if (childElements[i] === currentView.querySelector('.child')) {
          last = i;
          console.log("last is now " + i);
        }
      }
      setTimeout(() => {
        isScrolling = false;
      }, 500);
    }, 500);
  } else {
    Event.preventDefault();
    Event.stopPropagation();
  }
}, { passive: false });

function triggerAnimation(view) {
  if (view.id == "portfolio") {
    portfolioAnimation(view);
  } else {
    resetPortfolio(document.querySelector("#portfolio"));
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
  start.style.height = '50%';
  second.style.height = '50%';
  caption.style.width = '50%';
  var i = 1;
  imgContainers.forEach(container => {
    container.style.width = '50%';
    container.style.opacity = 0;
    setTimeout(() => {
      container.style.opacity = 1;
    }, i * 800);
    i++;
  });
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
  start.style.height = '100%';
  second.style.height = '0%';
  caption.style.width = '100%';
  imgContainers.forEach(container => {
    container.style.width = '0%';
    container.style.opacity = 0;
  });
}

// on appear animation 

function animateOnIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animation on intersection
      document.getElementById('menu').style.opacity = '1';
      setTimeout(() => {
        document.getElementById('name').querySelector('h1').style.opacity = '1';
      }, 1500);
      const h2 = document.getElementById('name').querySelector('h2');
      const text = h2.textContent;
      h2.textContent = '';

      for (let i = 0; i < text.length; i++) {
        (function (index) {
          setTimeout(() => {
            h2.textContent += text[index];
          }, 3000 + 250 * index);
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
  img.onload = () => console.log(`Image ${imageSrc} loaded`);
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
  updateProgress(loadedImagesCount,images.length);
  if (loadedImagesCount == images.length) {
    contentLoad();
  }
}

images.forEach(image => {
  image.onload = ( () => {
    loadedImagesCount++;
  });
}); 

function contentLoad() {
  console.log("contentLoad called");
  loader.style.height = '0vh';
  setTimeout(() => {
    document.body.querySelector('.container').style.height = '100vh';
  }, 700);
  console.log("contentLoad ended");
}