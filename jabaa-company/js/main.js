/* ==========================================================================
   1. GLOBAL STATE & DOM INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCounters();
    updateFooterYear();
    calculateCourseTotal(); // Compute initial prices
});

/* Mobile Menu Toggle */
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navbar.classList.contains('active')) {
            icon.className = 'fas fa-xmark';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
}

/* ==========================================================================
   2. DYNAMIC THEME SWITCHER
   ========================================================================== */
function initTheme() {
    const savedTheme = localStorage.getItem('jabaa_theme') || 'dark';
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) themeSelect.value = savedTheme;
    changeTheme(savedTheme);
}

function changeTheme(themeValue) {
    const htmlTag = document.documentElement;
    if (themeValue === 'device') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlTag.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        htmlTag.setAttribute('data-theme', themeValue);
    }
    localStorage.setItem('jabaa_theme', themeValue);
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect && themeSelect.value === 'device') {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

/* ==========================================================================
   3. COURSE SELECTION & ESTIMATOR CALCULATOR (OLD VS NEW)
   ========================================================================== */
function selectCourse(element) {
    const cards = document.querySelectorAll('.course-card');
    cards.forEach(card => card.classList.remove('selected'));

    element.classList.add('selected');
    const radio = element.querySelector('input[type="radio"]');
    if (radio) {
        radio.checked = true;
    }

    calculateCourseTotal();
}

function calculateCourseTotal() {
    const selectedRadio = document.querySelector('input[name="course_choice"]:checked');
    const studentCountSelect = document.getElementById('student-count');
    const costDisplay = document.getElementById('estimated-cost');
    const oldCostDisplay = document.getElementById('estimated-old-cost');
    const summaryTitle = document.getElementById('summary-course-title');

    if (!selectedRadio || !costDisplay) return;

    const basePrice = parseFloat(selectedRadio.getAttribute('data-price')) || 0;
    const oldBasePrice = parseFloat(selectedRadio.getAttribute('data-old-price')) || basePrice;
    const courseTitle = selectedRadio.value;
    const studentCount = parseInt(studentCountSelect ? studentCountSelect.value : 1, 10);

    // Group volume discount logic
    let discountRate = 0;
    if (studentCount === 2) discountRate = 0.05;
    else if (studentCount >= 5 && studentCount < 10) discountRate = 0.10;
    else if (studentCount >= 10) discountRate = 0.15;

    // Subtotal calculations
    const oldTotal = oldBasePrice * studentCount;
    const subtotalNew = basePrice * studentCount;
    const finalNewTotal = subtotalNew * (1 - discountRate);

    if (summaryTitle) summaryTitle.textContent = courseTitle;
    if (oldCostDisplay) oldCostDisplay.textContent = `${oldTotal.toLocaleString('en-US')} ETB`;
    costDisplay.textContent = `${finalNewTotal.toLocaleString('en-US')} ETB`;
}

/* ==========================================================================
   4. DIRECT TELEGRAM REGISTRATION SENDER (@jabaakeessan)
   ========================================================================== */
function submitCourseRegistration() {
    const name = document.getElementById('student-name').value.trim();
    const phone = document.getElementById('student-phone').value.trim();
    const email = document.getElementById('student-email').value.trim();
    const schedule = document.getElementById('preferred-schedule').value;
    const trainees = document.getElementById('student-count').value;
    const selectedRadio = document.querySelector('input[name="course_choice"]:checked');
    const statusDiv = document.getElementById('registration-status');

    if (!name || !phone || !email) {
        statusDiv.style.color = '#ef4444';
        statusDiv.textContent = 'Please fill out your name, phone, and email before submitting.';
        return;
    }

    const courseTitle = selectedRadio ? selectedRadio.value : 'N/A';
    const oldTotal = document.getElementById('estimated-old-cost').textContent;
    const newTotal = document.getElementById('estimated-cost').textContent;

    // Build plain text payload for Telegram
    const messagePayload = 
`🎓 *NEW COURSE REGISTRATION*

👤 *Student Name:* ${name}
📞 *Phone / Telegram:* ${phone}
📧 *Email:* ${email}
📚 *Course Chosen:* ${courseTitle}
👥 *Trainees:* ${trainees}
⏰ *Preferred Schedule:* ${schedule}

💰 *Original Price:* ${oldTotal}
🔥 *Discounted Total:* ${newTotal}

----------------------------------
*Sent via Jabaa Enterprise Portal*`;

    statusDiv.style.color = '#10b981';
    statusDiv.textContent = 'Redirecting to Telegram @jabaakeessan...';

    // Telegram link with URI-encoded text parameter
    const telegramUrl = `https://t.me/jabaakeessan?text=${encodeURIComponent(messagePayload)}`;
    
    setTimeout(() => {
        window.open(telegramUrl, '_blank');
        statusDiv.textContent = 'Telegram opened! Press "Send" to deliver your registration to @jabaakeessan.';
    }, 800);
}

/**
  General contact form handler
 */
function handleContactSubmit() {
    const name = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    const message = document.getElementById('c-message').value.trim();
    const statusDiv = document.getElementById('c-status');

    if (!name || !email || !message) {
        statusDiv.style.color = '#ef4444';
        statusDiv.textContent = 'All fields are required.';
        return;
    }

    statusDiv.style.color = '#10b981';
    statusDiv.textContent = `Message sent successfully! We will contact you shortly, ${name}.`;

    setTimeout(() => {
        document.getElementById('jabaa-contact-form').reset();
        statusDiv.textContent = '';
    }, 4000);
}

/* ==========================================================================
   5. PORTFOLIO MODAL CONTROLLER
   ========================================================================== */
function openPortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('portfolio-modal');
    if (e.target === modal) {
        closePortfolioModal();
    }
});

/* ==========================================================================
   6. UTILITIES (ANIMATED COUNTERS & FOOTER DATES)
   ========================================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace(/[^0-9.]/g, '');
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc).toLocaleString() + '+';
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target.toLocaleString() + (target === 99 ? '.9%' : '+');
            }
        };
        updateCount();
    });
}

function updateFooterYear() {
    const yearSpan = document.getElementById('jabaa-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
