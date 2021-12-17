const container = document.querySelector(".container");
//get the container for transition
const slideContainer = document.querySelector(".slide-container");
//get all slides
const slides = Array.from(slideContainer.children);
//get buttons
const nextButton = container.querySelector(".right-btn");
const previousButton = container.querySelector(".left-btn");
const navDotBox = container.querySelector(".navigation-btn");
const dots = Array.from(navDotBox.children);
const b1 = navDotBox.querySelector(".b1");
const b3 = navDotBox.querySelector(".b3");

//global variables
let currentImageIndex = 0;
let currentTranslate = 0;
let size = slides[0].clientWidth;
let isDragging = false;
let startPos = 0;
let animationId = 0;
let prevTranslate = 0;
//global variables ends here

//functions
const disableArrow = () => {
  if (currentImageIndex === 0) {
    previousButton.classList.add("is-hidden");
    nextButton.classList.remove("is-hidden");
  } else if (currentImageIndex === slides.length - 1) {
    previousButton.classList.remove("is-hidden");
    nextButton.classList.add("is-hidden");
  } else {
    previousButton.classList.remove("is-hidden");
    nextButton.classList.remove("is-hidden");
  }
};
const setSliderPosition = (pos) => {
  slideContainer.style.transform = `translateX(${pos}px)`;
};
let prevdot = 0;
const updateDots = (index) => {
  const currentdot = index;
  dots[currentdot].classList.add("active-nav");
  dots[prevdot].classList.remove("active-nav");
  prevdot = currentdot;
  if (currentdot === 0) {
    b1.classList.add("active-nav");
  }
  if (currentdot === slides.length - 1) {
    b3.classList.add("active-nav");
  }
};
//functions ends here...
disableArrow();
//Be able to click next and previous button
nextButton.addEventListener("click", function () {
  currentImageIndex += 1;
  disableArrow();
  currentTranslate = currentImageIndex * -size;
  setSliderPosition(currentTranslate);
  updateDots(currentImageIndex);
});
previousButton.addEventListener("click", function () {
  currentImageIndex -= 1;
  disableArrow();
  currentTranslate = currentImageIndex * -size;
  setSliderPosition(currentTranslate);
  updateDots(currentImageIndex);
});

//bubble buttons functionality
navDotBox.addEventListener("click", (event) => {
  const targetDot = event.target.closest("button");
  if (targetDot) {
    const dotIndex = dots.findIndex((dot) => dot === targetDot);
    currentImageIndex = dotIndex;
    currentTranslate = dotIndex * -size;
    setSliderPosition(currentTranslate);
    updateDots(dotIndex);
    disableArrow();
  }
});

//SWIPING FUNCTIONALITY

slides.forEach((slide, index) => {
  //prevent default image draging
  const slideImages = slide.querySelectorAll("img");
  slideImages.forEach((slide) => {
    slide.addEventListener("dragstart", (e) => e.preventDefault());
  });

  //touch event handlers
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchmove", touchMove);
  slide.addEventListener("touchend", touchEnd);

  //mouse event handlers
  slide.addEventListener("mousedown", touchStart(index));
  slide.addEventListener("mousemove", touchMove);
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("mouseleave", touchEnd);
});
window.oncontextmenu = function (e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
};
//FUNCTION DECLARATIONS...
function touchStart(index) {
  return function (event) {
    isDragging = true;
    currentImageIndex = index;
    startPos = getPositionX(event);
    animationId = requestAnimationFrame(animate);
  };
}
function touchMove() {
  if (isDragging) {
    const currPos = getPositionX(event);
    currentTranslate = prevTranslate + currPos - startPos;
  }
}
function touchEnd() {
  isDragging = false;
  cancelAnimationFrame(animationId);
  const movedBy = currentTranslate - prevTranslate;
  if (movedBy < -80 && currentImageIndex < slides.length - 1) {
    currentImageIndex += 1;
  }
  if (movedBy > 80 && currentImageIndex > 0) {
    currentImageIndex -= 1;
  }
  currentTranslate = currentImageIndex * -size;
  prevTranslate = currentTranslate;
  setSliderPosition(currentTranslate);
  disableArrow();
  updateDots(currentImageIndex);
}

function animate() {
  slideContainer.style.transform = `translateX(${currentTranslate}px)`;
  if (isDragging) requestAnimationFrame(animate);
}
function getPositionX(event) {
  return event.type.includes("touch") ? event.touches[0].clientX : event.pageX;
}
//FUNCTION DECLARATIONS ENDS HERE....
