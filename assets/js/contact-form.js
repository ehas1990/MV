/**
 * WebGlobal Contact Form Validation & Submission Controller
 * Recipient: sales.mv@webgbl.com
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var nameInput = form.querySelector('[name="name"]');
    var emailInput = form.querySelector('[name="email"]') || form.querySelector('[name="email3"]');
    var phoneInput = form.querySelector('[name="number"]');
    var subjectInput = form.querySelector('[name="subject"]');
    var messageInput = form.querySelector('[name="message"]');
    var submitBtn = document.querySelector('button[form="contactForm"]') || form.querySelector('button[type="submit"]');
    var messagesBox = form.querySelector('.form-messages');

    var RECIPIENT_EMAIL = 'sales.mv@webgbl.com';

    // Helper: Show error below specific field
    function showFieldError(input, message) {
      if (!input) return;
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      var group = input.closest('.form-group');
      if (!group) return;

      var feedback = group.querySelector('.invalid-feedback');
      if (!feedback) {
        feedback = document.createElement('span');
        feedback.className = 'invalid-feedback';
        group.appendChild(feedback);
      }
      feedback.textContent = message;
      feedback.style.display = 'block';
    }

    // Helper: Clear error for specific field
    function clearFieldError(input) {
      if (!input) return;
      input.classList.remove('is-invalid');
      var group = input.closest('.form-group');
      if (!group) return;

      var feedback = group.querySelector('.invalid-feedback');
      if (feedback) {
        feedback.textContent = '';
        feedback.style.display = 'none';
      }
    }

    // Validation Functions
    function validateName() {
      if (!nameInput) return true;
      var val = nameInput.value.trim();
      if (!val) {
        showFieldError(nameInput, 'Please enter your name.');
        return false;
      }
      if (val.length < 2) {
        showFieldError(nameInput, 'Name must be at least 2 characters.');
        return false;
      }
      clearFieldError(nameInput);
      return true;
    }

    function validateEmail() {
      if (!emailInput) return true;
      var val = emailInput.value.trim();
      if (!val) {
        showFieldError(emailInput, 'Please enter your email address.');
        return false;
      }
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(val)) {
        showFieldError(emailInput, 'Please enter a valid email address (e.g., yourname@domain.com).');
        return false;
      }
      clearFieldError(emailInput);
      return true;
    }

    function validatePhone() {
      if (!phoneInput) return true;
      var val = phoneInput.value.trim();
      if (!val) {
        showFieldError(phoneInput, 'Please enter your phone number.');
        return false;
      }
      var digitsOnly = val.replace(/\D/g, '');
      var phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
      if (digitsOnly.length < 7 || !phoneRegex.test(val)) {
        showFieldError(phoneInput, 'Please enter a valid phone number (at least 7 digits).');
        return false;
      }
      clearFieldError(phoneInput);
      return true;
    }

    function validateSubject() {
      if (!subjectInput) return true;
      var val = subjectInput.value.trim();
      if (!val) {
        showFieldError(subjectInput, 'Please enter a subject.');
        return false;
      }
      if (val.length < 2) {
        showFieldError(subjectInput, 'Subject must be at least 2 characters.');
        return false;
      }
      clearFieldError(subjectInput);
      return true;
    }

    function validateMessage() {
      if (!messageInput) return true;
      var val = messageInput.value.trim();
      if (!val) {
        showFieldError(messageInput, 'Please enter your message.');
        return false;
      }
      if (val.length < 5) {
        showFieldError(messageInput, 'Message must be at least 5 characters.');
        return false;
      }
      clearFieldError(messageInput);
      return true;
    }

    // Real-time error removal on user input/change
    if (nameInput) {
      nameInput.addEventListener('input', function () {
        if (nameInput.classList.contains('is-invalid')) validateName();
      });
      nameInput.addEventListener('blur', validateName);
    }

    if (emailInput) {
      emailInput.addEventListener('input', function () {
        if (emailInput.classList.contains('is-invalid')) validateEmail();
      });
      emailInput.addEventListener('blur', validateEmail);
    }

    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        if (phoneInput.classList.contains('is-invalid')) validatePhone();
      });
      phoneInput.addEventListener('blur', validatePhone);
    }

    if (subjectInput) {
      subjectInput.addEventListener('input', function () {
        if (subjectInput.classList.contains('is-invalid')) validateSubject();
      });
      subjectInput.addEventListener('blur', validateSubject);
    }

    if (messageInput) {
      messageInput.addEventListener('input', function () {
        if (messageInput.classList.contains('is-invalid')) validateMessage();
      });
      messageInput.addEventListener('blur', validateMessage);
    }

    // Submit Handler
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Run all validations
      var isNameValid = validateName();
      var isEmailValid = validateEmail();
      var isPhoneValid = validatePhone();
      var isSubjectValid = validateSubject();
      var isMessageValid = validateMessage();

      var isValid = isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid;

      if (!isValid) {
        // Focus first invalid element
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Prevent duplicate submissions: Disable button & show spinner
      var originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.pointerEvents = 'none';
        submitBtn.innerHTML = 'Sending... <span class="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true" style="display:inline-block; width:14px; height:14px; border:2px solid currentColor; border-right-color:transparent; border-radius:50%; animation: wgSpin 0.75s linear infinite; vertical-align:middle;"></span>';
      }

      if (messagesBox) {
        messagesBox.innerHTML = '';
        messagesBox.style.display = 'none';
      }

      var payload = {
        name: nameInput ? nameInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        number: phoneInput ? phoneInput.value.trim() : '',
        subject: subjectInput ? subjectInput.value.trim() : '',
        message: messageInput ? messageInput.value.trim() : '',
        _subject: 'WebGlobal Contact Form: ' + (subjectInput ? subjectInput.value.trim() : 'New Inquiry'),
        _replyto: emailInput ? emailInput.value.trim() : '',
        _template: 'table'
      };

      var isSuccess = false;
      var statusMessage = '';
      var customError = '';

      try {
        // 1. Attempt PHP backend (for PHP/Apache/cPanel servers)
        var phpResponse = await fetch('mail.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        }).catch(function () { return null; });

        if (phpResponse && phpResponse.ok) {
          var phpData = await phpResponse.json().catch(function () { return null; });
          if (phpData && (phpData.success === true || phpData.success === 'true')) {
            isSuccess = true;
            statusMessage = phpData.message || ('Thank you! Your message has been sent successfully to ' + RECIPIENT_EMAIL + '.');
          }
        }

        // 2. Fallback to FormSubmit service (for static hosting like GitHub Pages)
        if (!isSuccess) {
          var formSubmitResponse = await fetch('https://formsubmit.co/ajax/' + RECIPIENT_EMAIL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          }).catch(function () { return null; });

          if (formSubmitResponse && formSubmitResponse.ok) {
            var fsData = await formSubmitResponse.json().catch(function () { return {}; });
            if (fsData.success === 'true' || fsData.success === true) {
              isSuccess = true;
              statusMessage = 'Thank you! Your message has been sent successfully to ' + RECIPIENT_EMAIL + '. We will get back to you shortly.';
            } else if (fsData.message && fsData.message.indexOf('Activation') !== -1) {
              isSuccess = true;
              statusMessage = 'Your inquiry was received. An activation email was sent to ' + RECIPIENT_EMAIL + ' to confirm this contact form. Once activated, messages arrive directly in your inbox.';
            } else {
              customError = fsData.message || '';
            }
          }
        }
      } catch (err) {
        console.error('Contact form submission error:', err);
      } finally {
        if (isSuccess) {
          if (messagesBox) {
            messagesBox.innerHTML = '<div style="background-color:#eafaf1; color:#0e6251; border:1px solid #a3e4d7; border-radius:8px; padding:12px 16px; margin-top:15px; font-size:14px; line-height:1.5;"><i class="fas fa-check-circle" style="margin-right:8px; color:#27ae60;"></i>' + statusMessage + '</div>';
            messagesBox.style.display = 'block';
          }
          form.reset();
          [nameInput, emailInput, phoneInput, subjectInput, messageInput].forEach(function (inp) {
            if (inp) clearFieldError(inp);
          });
        } else {
          var errText = customError || ('Could not complete automatic delivery. Please send your inquiry directly to <a href="mailto:' + RECIPIENT_EMAIL + '" style="color:#78281f; font-weight:bold; text-decoration:underline;">' + RECIPIENT_EMAIL + '</a> or try again.');
          if (messagesBox) {
            messagesBox.innerHTML = '<div style="background-color:#fdebd0; color:#78281f; border:1px solid #fad7a0; border-radius:8px; padding:12px 16px; margin-top:15px; font-size:14px; line-height:1.5;"><i class="fas fa-exclamation-triangle" style="margin-right:8px; color:#e67e22;"></i>' + errText + '</div>';
            messagesBox.style.display = 'block';
          }
        }

        // Always re-enable button and restore state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.pointerEvents = 'auto';
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  });
})();
