
document.querySelectorAll('.scroll-link').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

const childElements = document.querySelectorAll('.child');
var childElement = null;
var last = 0;

// Function to handle the intersection changes
function handleIntersection(entries, observer) {
  entries.forEach(entry => {

    if (entry.isIntersecting) {
      for (i = 0; i < childElements.length; i++) {
        if (childElements[i] === entry.target.querySelector('.child')) {
          childElement = childElements[i]
          //console.log("last: " + last + "i: " + i);
          if (last < i) {
            childElement.style.transform = 'translateZ(0) scale(1)';
            childElement.style.zIndex = 1;
            if (childElements[last] != null) {
              childElements[last].style.transform = 'translateZ(-200px) scale(2)';
            }
          } else if (last == childElements.length - 1){
            childElements[last-1].style.transform = 'translateZ(0) scale(1)';
          } else {
            childElements[last].style.transform = 'translateZ(0) scale(1)';
          }
          last = i;
        }
      }
    } 
  });
}

// Options for the Intersection Observer
const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.02
};

// Create the Intersection Observer
const observer = new IntersectionObserver(handleIntersection, options);

// Target the elements with the class 'group'
const groupElements = document.querySelectorAll('.group');

// Observe each 'group' element
groupElements.forEach(groupElement => {
  observer.observe(groupElement);
});
