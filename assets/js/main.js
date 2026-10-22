// Header: same top bar on every page, always visible
const header = document.getElementById('header');
if (header) {
  header.classList.add('show');
}

// Mobile menu
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('[data-stagger]').forEach(list => {
  [...list.children].forEach((child, i) => child.style.setProperty('--i', i));
});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const backToTop = document.getElementById('backToTop');
if (backToTop) {
  const toggleBackToTop = () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  };

  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
}

// WhatsApp enquiry form
const form = document.getElementById('waForm');
const errorBox = document.getElementById('waError');
const whatsappNumber = '27665955511';

function setFieldError(field, isInvalid) {
  if (!field) return;
  field.classList.toggle('invalid', isInvalid);
  field.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
}

function normalizePhoneNumber(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return { valid: true, value: '' };
  }

  const digits = trimmed.replace(/\D/g, '');

  if (!digits) {
    return { valid: false, value: '', message: 'Please enter a valid phone number.' };
  }

  let normalized = digits;

  if (normalized.startsWith('0')) {
    normalized = '27' + normalized.slice(1);
  }

  if (/^27\d{9,10}$/.test(normalized)) {
    return { valid: true, value: normalized };
  }

  return {
    valid: false,
    value: '',
    message: 'Please enter a valid South African phone number, for example 066 595 5511.'
  };
}

function buildWhatsAppMessage({ name, business, phone, service, message }) {
  const cleanName = name.trim();
  const cleanBusiness = business.trim();
  const cleanPhone = phone.trim();
  const cleanService = service.trim();
  const cleanMessage = message.trim();

  const parts = [
    'Hello Inkwazi Digital,',
    '',
    `My name is ${cleanName}.`,
  ];

  if (cleanBusiness) {
    parts.push(`Business name: ${cleanBusiness}`);
  }

  if (cleanPhone) {
    parts.push(`Phone number: ${cleanPhone}`);
  }

  parts.push(`I need help with: ${cleanService}`);
  parts.push('');
  parts.push('Message:');
  parts.push(cleanMessage);

  return encodeURIComponent(parts.join('\n'));
}

if (form) {
  const nameField = form.querySelector('[name="name"]');
  const businessField = form.querySelector('[name="business"]');
  const phoneField = form.querySelector('[name="phone"]');
  const serviceField = form.querySelector('[name="service"]');
  const messageField = form.querySelector('[name="message"]');

  form.addEventListener('submit', event => {
    event.preventDefault();

    if (errorBox) {
      errorBox.hidden = true;
      errorBox.textContent = '';
    }

    let hasErrors = false;

    const name = nameField ? nameField.value.trim() : '';
    const business = businessField ? businessField.value.trim() : '';
    const service = serviceField ? serviceField.value.trim() : '';
    const message = messageField ? messageField.value.trim() : '';
    const phone = phoneField ? phoneField.value.trim() : '';

    if (!name) {
      hasErrors = true;
      if (nameField) setFieldError(nameField, true);
    } else if (nameField) {
      setFieldError(nameField, false);
    }

    if (serviceField) {
      if (!service) {
        hasErrors = true;
        setFieldError(serviceField, true);
      } else {
        setFieldError(serviceField, false);
      }
    }

    if (messageField) {
      if (message.length < 10) {
        hasErrors = true;
        setFieldError(messageField, true);
      } else {
        setFieldError(messageField, false);
      }
    }

    if (phoneField && phone) {
      const phoneCheck = normalizePhoneNumber(phone);
      if (!phoneCheck.valid) {
        hasErrors = true;
        setFieldError(phoneField, true);

        if (errorBox) {
          errorBox.textContent = phoneCheck.message;
          errorBox.hidden = false;
        }
      } else {
        setFieldError(phoneField, false);
      }
    } else if (phoneField) {
      setFieldError(phoneField, false);
    }

    if (hasErrors) {
      if (errorBox && !errorBox.textContent) {
        errorBox.textContent = 'Please complete the required fields before sending your message.';
        errorBox.hidden = false;
      }
      return;
    }

    const normalizedPhoneNumber = phone ? normalizePhoneNumber(phone).value : '';
    const messageText = buildWhatsAppMessage({
      name,
      business,
      phone: normalizedPhoneNumber || phone,
      service,
      message,
    });

    const url = `https://wa.me/${whatsappNumber}?text=${messageText}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    form.reset();
    ['name', 'business', 'phone', 'service', 'message'].forEach(fieldName => {
      const input = form.querySelector(`[name="${fieldName}"]`);
      if (input) {
        setFieldError(input, false);
      }
    });
  });
}
