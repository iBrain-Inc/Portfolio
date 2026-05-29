/**
 * iBrains Global Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Page Preloader
  // ==========================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        document.body.style.overflowY = 'auto';
      }, 500); // Small delay to guarantee visual smoothness
    });
  } else {
    document.body.style.overflowY = 'auto';
  }

  // ==========================================
  // 2. Sticky Header scroll effect
  // ==========================================
  const header = document.querySelector('header');
  const stickyScrollThreshold = 50;

  const checkHeaderSticky = () => {
    if (window.scrollY > stickyScrollThreshold) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  };

  window.addEventListener('scroll', checkHeaderSticky);
  checkHeaderSticky(); // Initial check in case of page reload halfway

  // ==========================================
  // 3. Mobile Hamburger Menu Toggle
  // ==========================================
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Toggle body scroll to prevent background scrolling when menu is open
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================
  // 4. Scroll-To-Top Button
  // ==========================================
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  const scrollThreshold = 500;

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > scrollThreshold) {
        scrollTopBtn.classList.add('show');
      } else {
        scrollTopBtn.classList.remove('show');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================
  // 5. Active Link Highlight (Current Page)
  // ==========================================
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  navLinks.forEach(link => {
    const hrefAttr = link.getAttribute('href');
    if (hrefAttr === pageName || (pageName === 'index.html' && hrefAttr === '/')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ==========================================
  // 6. Intersection Observer for Scroll Reveals
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once triggered
      }
    });
  }, {
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================
  // 7. Achievement Counter Animation
  // ==========================================
  const counters = document.querySelectorAll('.counter-number');
  
  if (counters.length > 0) {
    const animateCounters = (counter) => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000; // 2 seconds total animation time
      const increment = target / (duration / 16); // ~60fps
      
      let currentVal = 0;
      
      const updateValue = () => {
        currentVal += increment;
        if (currentVal < target) {
          counter.innerText = Math.ceil(currentVal);
          requestAnimationFrame(updateValue);
        } else {
          counter.innerText = target;
        }
      };
      
      updateValue();
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters(entry.target);
          observer.unobserve(entry.target); // Run animation once
        }
      });
    }, {
      threshold: 0.5
    });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }
});
