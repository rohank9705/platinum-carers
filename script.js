document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Menu Toggle Logic
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      // Toggle the slide-down menu
      navLinks.classList.toggle('active');
      
      // Change the icon and trigger the CSS spin
      if (navLinks.classList.contains('active')) {
        mobileToggle.innerHTML = '&#10005;'; // Turns into an 'X'
        mobileToggle.style.transform = 'rotate(90deg)';
      } else {
        mobileToggle.innerHTML = '&#9776;'; // Turns back into 3 bars
        mobileToggle.style.transform = 'rotate(0deg)';
      }
    });
  }

  // 2. Mobile Flip Card Logic
  const flipCards = document.querySelectorAll('.flip-card');
  
  if (flipCards.length > 0) {
    flipCards.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
      });
    });
  }

});

document.addEventListener("DOMContentLoaded", () => {
  // Select all elements that have the 'fade-in' class
  const fadeElements = document.querySelectorAll(".fade-in");

  // Set up the observer options
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15 // Triggers the animation when 15% of the element is visible
  };

  // Create the observer
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the 'visible' class to trigger the CSS transition
        entry.target.classList.add("visible");
        
        // Stop observing the element so it doesn't fade out and back in again
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Tell the observer to watch each of our fade elements
  fadeElements.forEach(element => {
    fadeObserver.observe(element);
  });
});

// Require reCAPTCHA on all forms before submitting
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(event) {
    // Google injects a hidden textarea with this name when the widget loads
    const captchaResponse = form.querySelector('[name="g-recaptcha-response"]').value;
    
    // If the hidden field is empty, the user hasn't clicked the box
    if (!captchaResponse) {
      event.preventDefault(); // Stops the form from submitting
      alert("Please check the 'I'm not a robot' box before submitting!");
    }
  });
});