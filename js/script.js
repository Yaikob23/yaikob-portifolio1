/* =====================================================
   1. THEME SWITCHER (Dark, Light, Other)
   Runs immediately to prevent Flash of Unstyled Content (FOUC)
===================================================== */
(function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    document.addEventListener('DOMContentLoaded', () => {
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = savedTheme;
            themeSelect.addEventListener('change', (e) => {
                const chosenTheme = e.target.value;
                localStorage.setItem('theme', chosenTheme);
                applyTheme(chosenTheme);
            });
        }
    });
})();

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body?.setAttribute('data-theme', theme);
}

document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       2. MOBILE MENU TOGGLE
    ===================================================== */
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.querySelector(".navbar");

    if (menuToggle && navbar) {
        menuToggle.addEventListener("click", () => {
            const isExpanded = navbar.classList.toggle("show");
            menuToggle.setAttribute("aria-expanded", isExpanded);

            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars", !isExpanded);
                icon.classList.toggle("fa-xmark", isExpanded);
            }
        });

        // Close navbar when clicking any link
        navbar.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navbar.classList.remove("show");
                menuToggle.setAttribute("aria-expanded", "false");
                const icon = menuToggle.querySelector("i");
                if (icon) {
                    icon.classList.add("fa-bars");
                    icon.classList.remove("fa-xmark");
                }
            });
        });
    }

    /* =====================================================
       3. TYPING EFFECT
    ===================================================== */
    const typingElement = document.getElementById("typing");

    if (typingElement) {
        const words = [
            "Computer Science Student",
            "Banking IT Specialist",
            "Full-Stack Web Developer",
            "Python & ML Developer",
            "Network Support Technician"
        ];

        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeEffect() {
            const currentWord = words[wordIndex];

            if (!deleting) {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentWord.length) {
                    deleting = true;
                    setTimeout(typeEffect, 1500);
                    return;
                }
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }
            setTimeout(typeEffect, deleting ? 50 : 100);
        }

        typeEffect();
    }

    /* =====================================================
       4. NUMBER COUNTERS (Intersection Observer)
    ===================================================== */
    const counters = document.querySelectorAll(".counter");

    if (counters.length > 0) {
        const animateCounter = (counter) => {
            const target = Number(counter.dataset.target) || 0;
            let current = 0;
            const increment = Math.max(1, Math.ceil(target / 40));

            const update = () => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + "+";
                } else {
                    counter.textContent = current;
                    requestAnimationFrame(update);
                }
            };
            update();
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    /* =====================================================
       5. PROJECT FILTERING
    ===================================================== */
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projects = document.querySelectorAll(".project-item");

    if (filterButtons.length > 0 && projects.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                const filter = button.dataset.filter;

                projects.forEach(project => {
                    const category = project.dataset.category;
                    const isVisible = filter === "all" || (category && category.includes(filter));
                    project.style.display = isVisible ? "block" : "none";
                });
            });
        });
    }

    /* =====================================================
       6. BACK TO TOP BUTTON
    ===================================================== */
    const backToTop = document.getElementById("back-to-top");

    if (backToTop) {
        window.addEventListener("scroll", () => {
            backToTop.classList.toggle("show", window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* =====================================================
       7. CONTACT FORM SUBMISSION
    ===================================================== */
    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");

    if (contactForm && formMessage) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const subject = document.getElementById("subject")?.value.trim();
            const message = document.getElementById("message")?.value.trim();

            if (!name || !email || !subject || !message) {
                formMessage.textContent = "Please complete all required fields.";
                formMessage.style.color = "#ef4444";
                return;
            }

            formMessage.textContent = "Thank you! Your message has been submitted successfully.";
            formMessage.style.color = "#22c55e";
            contactForm.reset();
        });
    }

    /* =====================================================
       8. DYNAMIC COPYRIGHT YEAR
    ===================================================== */
    const year = document.getElementById("year");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    /* =====================================================
       10. FAMILY PORTAL AUTHENTICATION & GALLERY
    ===================================================== */
    const loginForm = document.getElementById("family-login-form");
    const loginSection = document.getElementById("family-login-section");
    const familyContent = document.getElementById("family-content");
    const loginError = document.getElementById("login-error");
    const logoutBtn = document.getElementById("logout-btn");

    const imageInput = document.getElementById("image-input");
    const cameraInput = document.getElementById("camera-input");
    const galleryGrid = document.getElementById("family-gallery");
    const photoCount = document.getElementById("photo-count");

    // 1. Check if already logged in this session
    if (sessionStorage.getItem("familyAuthenticated") === "true") {
        showFamilyGallery();
    }

    // 2. Handle Login Submit
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById("username").value.trim();
            const passwordInput = document.getElementById("password").value.trim();

            if (usernameInput === "Jabaa" && passwordInput === "Jabaa1234") {
                sessionStorage.setItem("familyAuthenticated", "true");
                if (loginError) loginError.textContent = "";
                showFamilyGallery();
            } else {
                if (loginError) {
                    loginError.textContent = "Dogoggora! Username yookaan Password sirrii miti. (Invalid credentials!)";
                    loginError.style.color = "#ef4444";
                }
            }
        });
    }

    // 3. Handle Logout (Lock Portal)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("familyAuthenticated");
            if (familyContent) familyContent.style.display = "none";
            if (loginSection) loginSection.style.display = "flex";
        });
    }

    // 4. Reveal Hidden Gallery Function
    function showFamilyGallery() {
        if (loginSection) loginSection.style.display = "none";
        if (familyContent) familyContent.style.display = "block";
        loadSavedPhotos();
    }

    // 5. Photo Upload & Capture Handlers
    if (imageInput) imageInput.addEventListener("change", handlePhotoUpload);
    if (cameraInput) cameraInput.addEventListener("change", handlePhotoUpload);

    function handlePhotoUpload(e) {
        const files = Array.from(e.target.files);
        let storedPhotos = JSON.parse(localStorage.getItem("familyPhotos") || "[]");

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const base64Img = event.target.result;
                storedPhotos.unshift(base64Img);
                try {
                    localStorage.setItem("familyPhotos", JSON.stringify(storedPhotos));
                    renderGallery(storedPhotos);
                } catch (err) {
                    alert("Storage limit reached for browser memory.");
                }
            };
            reader.readAsDataURL(file);
        });
    }

    function loadSavedPhotos() {
        const storedPhotos = JSON.parse(localStorage.getItem("familyPhotos") || "[]");
        renderGallery(storedPhotos);
    }

    function renderGallery(photos) {
        if (!galleryGrid) return;
        galleryGrid.innerHTML = "";

        if (photoCount) photoCount.textContent = photos.length;

        if (photos.length === 0) {
            galleryGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Suuraan hin jiru. Suuraa haaraa olfe'aa! (No photos uploaded yet. Upload or capture new memories above!)</p>`;
            return;
        }

        photos.forEach(src => {
            const item = document.createElement("div");
            item.className = "gallery-item";
            item.innerHTML = `<img src="${src}" alt="Family Photo" loading="lazy">`;
            galleryGrid.appendChild(item);
        });
    }

    /* =====================================================
       11. DYNAMIC PROFILE PHOTO UPLOADERS
    ===================================================== */
    const husbandInput = document.getElementById('husband-photo-input');
    const wifeInput = document.getElementById('wife-photo-input');

    if (husbandInput) {
        husbandInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const imgElement = document.getElementById('husband-photo-img');
                if (imgElement) imgElement.src = URL.createObjectURL(file);
            }
        });
    }

    if (wifeInput) {
        wifeInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const imgElement = document.getElementById('wife-photo-img');
                if (imgElement) imgElement.src = URL.createObjectURL(file);
            }
        });
    }
});

/* =====================================================
   9. PRELOADER HIDE (Window Loaded)
===================================================== */
window.addEventListener("load", () => {
    const preloader = document.querySelector(".preloader");
    if (preloader) {
        preloader.style.opacity = "0";
        preloader.style.pointerEvents = "none";
        setTimeout(() => preloader.remove(), 500);
    }
});