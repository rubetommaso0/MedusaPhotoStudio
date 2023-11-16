

// menu links scroll animation
document.querySelectorAll('.scroll-link').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
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
          if (last <= i && last != i) {
            console.log("last:" + last + " - 200y")
            childElement = childElements[last];
            childElement.style.transform = 'translateZ(-200px) scale(2)';
          } 
          if (last != 0 && last > i) {
            console.log("i:" + i + " - 200y" + last + i)
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
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
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

window.addEventListener('wheel', () => {
  clearTimeout(scrollTimer); // Clear the existing timeout

  // Set a new timeout after the wheel event
  scrollTimer = setTimeout(() => {

    for (i=0; i<childElements.length; i++) {
      if (childElements[i] === currentView.querySelector('.child')) {
        last = i;
        console.log("last is now " + i);
      }
    }

    currentView.scrollIntoView({
      behavior: 'smooth'
    });
  }, 100); 
});


