document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('open');
        
        // Toggle icon between bars and X
        const icon = menuToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    }
    
    // Close mobile menu when a link is clicked
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
    
    // FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
        // Toggle active class on the question
        this.classList.toggle('active');
        
        // Get the answer element
        const answer = this.nextElementSibling;
        
        // Toggle open class on the answer
        answer.classList.toggle('open');
        
        // Toggle icon
        const icon = this.querySelector('i');
        if (answer.classList.contains('open')) {
          icon.classList.remove('fa-plus');
          icon.classList.add('fa-minus');
        } else {
          icon.classList.remove('fa-minus');
          icon.classList.add('fa-plus');
        }
      });
    });
    
    // Animation for elements when they come into view
    function animateOnScroll() {
      const elements = document.querySelectorAll('.fade-in');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
          element.style.animation = 'fadeIn 0.8s ease-out forwards';
        }
      });
    }
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Initial check for animations
    animateOnScroll();
  });

  
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('open');
      
      // Toggle icon between bars and X
      const icon = menuToggle.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
  
  // Close mobile menu when a link is clicked
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });
  
  // Check login status and update header
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginButton = document.querySelector('.auth-buttons .btn-outline-light');
  const signupButton = document.querySelector('.auth-buttons .btn-primary');
  
  if (isLoggedIn && loginButton && signupButton) {
    const userName = localStorage.getItem('userName') || 'User';
    loginButton.innerHTML = `<i class="fas fa-user"></i> ${userName}`;
    loginButton.href = '#';
    signupButton.innerHTML = 'Log out';
    signupButton.href = '#';
    signupButton.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      window.location.reload();
    });
  }
  
  // FAQ accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      // Toggle active class on the question
      this.classList.toggle('active');
      
      // Get the answer element
      const answer = this.nextElementSibling;
      
      // Toggle open class on the answer
      answer.classList.toggle('open');
      
      // Toggle icon
      const icon = this.querySelector('i');
      if (answer.classList.contains('open')) {
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
      } else {
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
      }
    });
  });
  
  // Animation for elements when they come into view
  function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        element.style.animation = 'fadeIn 0.8s ease-out forwards';
      }
    });
  }
  
  // Run animation on scroll
  window.addEventListener('scroll', animateOnScroll);
  
  // Initial check for animations
  animateOnScroll();
  
  // Start scanning button redirect
  const startScanningBtn = document.querySelector('.start-scanning-btn');
  if (startScanningBtn) {
    startScanningBtn.addEventListener('click', function() {
      window.location.href = 'scan.html';
    });
  }
});

const stateDistrictMap = {
  "Karnataka": [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", 
    "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", 
    "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", 
    "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", 
    "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", 
    "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura","Vijayanagara", "Yadgir"
  ],
  // Add other states and their districts here if needed
};

document.getElementById('state').addEventListener('change', function () {
  const state = this.value;
  const districtSelect = document.getElementById('district');
  
  // Clear existing options
  districtSelect.innerHTML = '<option value="" disabled selected>Select your district</option>';
  
  // Populate districts if the state exists in the map
  if (stateDistrictMap[state]) {
    stateDistrictMap[state].forEach(district => {
      const option = document.createElement('option');
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    });
  }
});




document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('open');
      
      // Toggle icon between bars and X
      const icon = menuToggle.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
  
  // Close mobile menu when a link is clicked
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });
  
  // Check login status and update header
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginButton = document.querySelector('.auth-buttons .btn-outline-light');
  const signupButton = document.querySelector('.auth-buttons .btn-primary');
  
  if (isLoggedIn && loginButton && signupButton) {
    const userName = localStorage.getItem('userName') || 'User';
    loginButton.innerHTML = `<i class="fas fa-user"></i> ${userName}`;
    loginButton.href = '#';
    signupButton.innerHTML = 'Log out';
    signupButton.href = '#';
    signupButton.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      window.location.reload();
    });
  }
  
  // FAQ accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      // Toggle active class on the question
      this.classList.toggle('active');
      
      // Get the answer element
      const answer = this.nextElementSibling;
      
      // Toggle open class on the answer
      answer.classList.toggle('open');
      
      // Toggle icon
      const icon = this.querySelector('i');
      if (answer.classList.contains('open')) {
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
      } else {
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
      }
    });
  });
  
  // Animation for elements when they come into view
  function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;
      
      if (elementPosition < screenPosition) {
        element.style.animation = 'fadeIn 0.8s ease-out forwards';
      }
    });
  }
  
  // Run animation on scroll
  window.addEventListener('scroll', animateOnScroll);
  
  // Initial check for animations
  animateOnScroll();
  
  // Start scanning button redirect
  const startScanningBtn = document.querySelector('.start-scanning-btn');
  if (startScanningBtn) {
    startScanningBtn.addEventListener('click', function() {
      window.location.href = 'scan.html';
    });
  }
});
