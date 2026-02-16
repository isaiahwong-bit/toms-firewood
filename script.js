// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
});

// ===== MOBILE NAVIGATION =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Create overlay element
const overlay = document.createElement('div');
overlay.classList.add('nav-overlay');
document.body.appendChild(overlay);

function toggleMenu() {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
  overlay.classList.toggle('visible');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
}

navToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (navMenu.classList.contains('open')) {
      toggleMenu();
    }
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink);

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    // Open clicked (if it wasn't already open)
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// ===== SCROLL ANIMATIONS =====
function createObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatable = document.querySelectorAll(
    '.section-header, .product-card, .feature-item, .testimonial-card, ' +
    '.faq-item, .delivery-map, ' +
    '.delivery-areas, .contact-info, .contact-form-wrapper, .addon-banner, .cta-content'
  );

  animatable.forEach((el, index) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 0.1}s`;
    observer.observe(el);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createObserver);
} else {
  createObserver();
}

// ===== CART SYSTEM =====
let cart = [];

const cartCountEl = document.getElementById('cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const cartDrawerItems = document.getElementById('cart-drawer-items');
const cartDrawerFooter = document.getElementById('cart-drawer-footer');
const cartTotalValue = document.getElementById('cart-total-value');
const cartOverlay = document.getElementById('cart-overlay');
const cartDrawerClose = document.getElementById('cart-drawer-close');
const navCartBtn = document.getElementById('nav-cart');
const orderSummary = document.getElementById('order-summary');
const orderDataInput = document.getElementById('order-data');
const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Update nav count
  cartCountEl.textContent = totalItems;
  if (totalItems > 0) {
    cartCountEl.classList.add('visible');
  } else {
    cartCountEl.classList.remove('visible');
  }

  // Update drawer
  if (cart.length === 0) {
    cartDrawerItems.innerHTML = '<p class="cart-empty-msg">Your order is empty.</p>';
    cartDrawerFooter.style.display = 'none';
  } else {
    cartDrawerFooter.style.display = 'block';
    cartDrawerItems.innerHTML = cart.map((item, i) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <span class="cart-item-name">${item.product}</span>
          <span class="cart-item-detail">${item.size} &times; ${item.qty}</span>
        </div>
        <span class="cart-item-price">$${item.price * item.qty}</span>
        <button class="cart-item-remove" data-index="${i}" type="button" aria-label="Remove">&times;</button>
      </div>
    `).join('');

    // Attach remove listeners
    cartDrawerItems.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.index), 1);
        updateCartUI();
      });
    });

    cartTotalValue.textContent = `$${totalPrice}`;
  }

  // Update contact form order summary
  if (cart.length === 0) {
    orderSummary.innerHTML = '<p class="order-empty">No items yet — <a href="#products">add firewood above</a></p>';
    orderDataInput.value = '';
  } else {
    let html = cart.map(item =>
      `<div class="order-line">
        <span class="order-line-name">${item.product} — ${item.size} &times; ${item.qty}</span>
        <span class="order-line-price">$${item.price * item.qty}</span>
      </div>`
    ).join('');
    html += `<div class="order-total-line">
      <span>Estimated Total</span>
      <span class="order-line-price">$${totalPrice}</span>
    </div>`;
    orderSummary.innerHTML = html;

    // Set hidden input
    const orderText = cart.map(item =>
      `${item.product} - ${item.size} x${item.qty} ($${item.price * item.qty})`
    ).join('\n');
    orderDataInput.value = orderText + `\nEstimated Total: $${totalPrice}`;
  }
}

function toggleCartDrawer() {
  cartDrawer.classList.toggle('open');
  cartOverlay.classList.toggle('visible');
  document.body.style.overflow = cartDrawer.classList.contains('open') ? 'hidden' : '';
}

function closeCartDrawer() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('visible');
  document.body.style.overflow = '';
}

navCartBtn.addEventListener('click', toggleCartDrawer);
cartOverlay.addEventListener('click', closeCartDrawer);
cartDrawerClose.addEventListener('click', closeCartDrawer);

cartCheckoutBtn.addEventListener('click', () => {
  closeCartDrawer();
});

// Quantity +/- buttons
document.querySelectorAll('.qty-minus').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('.qty-input');
    const val = parseInt(input.value) || 1;
    if (val > 1) input.value = val - 1;
  });
});

document.querySelectorAll('.qty-plus').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.parentElement.querySelector('.qty-input');
    const val = parseInt(input.value) || 1;
    const max = parseInt(input.max) || 10;
    if (val < max) input.value = val + 1;
  });
});

// Add to cart buttons
document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const controls = btn.closest('.cart-add-controls');
    const product = controls.dataset.product;
    const qtyInput = controls.querySelector('.qty-input');
    const qty = parseInt(qtyInput.value) || 1;

    let size, price;

    // Kindling has a fixed size/price in data attribute
    if (btn.dataset.size) {
      const parts = btn.dataset.size.split('|');
      size = parts[0];
      price = parseInt(parts[1]);
    } else {
      const sizeSelect = controls.querySelector('.cart-size');
      const parts = sizeSelect.value.split('|');
      size = parts[0];
      price = parseInt(parts[1]);
    }

    // Check if same product + size already in cart
    const existing = cart.find(item => item.product === product && item.size === size);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ product, size, price, qty });
    }

    updateCartUI();

    // Button feedback
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('added');
    }, 1200);

    // Reset qty
    qtyInput.value = 1;
  });
});

// Initial render
updateCartUI();

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Message Sent!';
  submitBtn.style.background = 'var(--color-success)';
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.style.background = '';
    submitBtn.disabled = false;
    contactForm.reset();
    cart = [];
    updateCartUI();
  }, 3000);
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
