/**
 * iBrains Contact Form Validation & Submission Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';

  // Modal Structure Creation for Success Overlay
  const createSuccessModal = (name) => {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'contact-success-overlay';
    modalOverlay.id = 'success-modal';
    
    modalOverlay.innerHTML = `
      <div class="glass-card success-modal-card">
        <div class="success-icon-wrap">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Thank You, ${escapeHTML(name)}!</h2>
        <p>Your message has been successfully transmitted. The iBrains team will review your inquiry and connect with you within 24 hours.</p>
        <button id="close-modal-btn" class="btn btn-primary">Back to Website</button>
      </div>
    `;
    
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden'; // Stop background scrolling

    // Add styles dynamically if not loaded
    if (!document.getElementById('modal-styles')) {
      const styles = document.createElement('style');
      styles.id = 'modal-styles';
      styles.innerHTML = `
        .contact-success-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10, 31, 68, 0.6);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99999;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .contact-success-overlay.active {
          opacity: 1;
        }
        .success-modal-card {
          width: 90%;
          max-width: 480px;
          padding: 3rem 2rem;
          text-align: center;
          transform: scale(0.85);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .contact-success-overlay.active .success-modal-card {
          transform: scale(1);
        }
        .success-icon-wrap {
          font-size: 4rem;
          color: var(--accent);
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 10px rgba(0, 245, 212, 0.4));
          animation: pulseIcon 2s infinite;
        }
        .success-modal-card h2 {
          color: var(--primary);
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }
        .success-modal-card p {
          color: var(--text-dark);
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }
        @keyframes pulseIcon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `;
      document.head.appendChild(styles);
    }

    // Trigger transition Reflow
    setTimeout(() => {
      modalOverlay.classList.add('active');
    }, 10);

    // Event Listeners for Close
    const closeModal = () => {
      modalOverlay.classList.remove('active');
      setTimeout(() => {
        modalOverlay.remove();
        document.body.style.overflow = '';
      }, 400);
    };

    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  };

  // Helper function to escape HTML output
  const escapeHTML = (str) => {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  };

  // Validation functions
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const showError = (inputEl, message) => {
    const formGroup = inputEl.parentElement;
    formGroup.classList.add('error');
    
    // Check if error element already exists, if not create it
    let errorEl = formGroup.querySelector('.error-msg');
    if (!errorEl) {
      errorEl = document.createElement('small');
      errorEl.className = 'error-msg';
      formGroup.appendChild(errorEl);
    }
    errorEl.innerText = message;
  };

  const clearError = (inputEl) => {
    const formGroup = inputEl.parentElement;
    formGroup.classList.remove('error');
    const errorEl = formGroup.querySelector('.error-msg');
    if (errorEl) {
      errorEl.remove();
    }
  };

  // Attach dynamic clear on input
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        clearError(input);
      }
    });
  });

  // Handle Form Submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const subjectEl = document.getElementById('subject');
    const messageEl = document.getElementById('message');
    
    let hasError = false;

    // Validate Name
    if (nameEl.value.trim() === '') {
      showError(nameEl, 'Full Name is required.');
      hasError = true;
    } else if (nameEl.value.trim().length < 3) {
      showError(nameEl, 'Name must be at least 3 characters.');
      hasError = true;
    } else {
      clearError(nameEl);
    }

    // Validate Email
    if (emailEl.value.trim() === '') {
      showError(emailEl, 'Email Address is required.');
      hasError = true;
    } else if (!validateEmail(emailEl.value.trim())) {
      showError(emailEl, 'Please enter a valid email address.');
      hasError = true;
    } else {
      clearError(emailEl);
    }

    // Validate Subject
    if (subjectEl.value.trim() === '') {
      showError(subjectEl, 'Subject is required.');
      hasError = true;
    } else if (subjectEl.value.trim().length < 5) {
      showError(subjectEl, 'Subject must be at least 5 characters.');
      hasError = true;
    } else {
      clearError(subjectEl);
    }

    // Validate Message
    if (messageEl.value.trim() === '') {
      showError(messageEl, 'Message content is required.');
      hasError = true;
    } else if (messageEl.value.trim().length < 15) {
      showError(messageEl, 'Message must be at least 15 characters.');
      hasError = true;
    } else {
      clearError(messageEl);
    }

    // If form is valid, trigger simulated submission
    if (!hasError) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      }

      // Simulate API loading
      setTimeout(() => {
        const userName = nameEl.value.trim();
        
        // Show success modal
        createSuccessModal(userName);
        
        // Clear all inputs
        contactForm.reset();
        
        // Reset submit button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }, 1500);
    }
  });
});
