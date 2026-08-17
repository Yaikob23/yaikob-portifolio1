/* ==========================================================================
   FAMILY PORTAL, EMAIL OTP (yaikobtesgera0@gmail.com) & FIREBASE CLOUD SYNC
   ========================================================================== */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

const CLOUD_NAME = "tzy7gqj4";
const UPLOAD_PRESET = "ml_default1";
const EMAIL_SERVICE_ID = "service_ku9qmpm";
const EMAIL_TEMPLATE_ID = "template_cxinbxf";
const EMAIL_PUBLIC_KEY = "5EInSEbKF57IddxHf";
const RECIPIENT_EMAIL = "yaikobtesgera0@gmail.com";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAiEfeNw7sC247oKn2YMf0YTgtxbs0Ni0",
  authDomain: "jabaafamilyportal.firebaseapp.com",
  projectId: "jabaafamilyportal",
  storageBucket: "jabaafamilyportal.firebasestorage.app",
  messagingSenderId: "276094709061",
  appId: "1:276094709061:web:019258bcfc9c0687f2622c"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateFooterYear();
    initFamilyPortal();
});

/* --------------------------------------------------------------------------
   1. DYNAMIC THEME SWITCHER & UTILITIES
   -------------------------------------------------------------------------- */
function initTheme() {
    const savedTheme = localStorage.getItem('jabaa_theme') || 'dark';
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) themeSelect.value = savedTheme;
    changeTheme(savedTheme);

    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            changeTheme(e.target.value);
        });
    }
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

function updateFooterYear() {
    const yearSpan = document.getElementById('jabaa-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/* --------------------------------------------------------------------------
   2. FAMILY AUTHENTICATION, EMAIL OTP & FIREBASE CLOUD GALLERY
   -------------------------------------------------------------------------- */
function initFamilyPortal() {
    const loginForm = document.getElementById("family-login-form");
    const otpForm = document.getElementById("family-otp-form");
    const loginSection = document.getElementById("family-login-section");
    const familyContent = document.getElementById("family-content");
    const loginError = document.getElementById("login-error");
    const otpError = document.getElementById("otp-error");
    const logoutBtn = document.getElementById("logout-btn");
    const resendBtn = document.getElementById("resend-otp-btn");

    const imageInput = document.getElementById("image-input");
    const cameraInput = document.getElementById("camera-input");

    // Lightbox Elements
    const lightboxModal = document.getElementById("image-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");

    let generatedOtp = "";
    let currentImageIndex = 0;
    let currentPhotoList = [];

    // Touch and Drag tracking variables
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startPosX = 0;
    let currentTranslateX = 0;

    if (sessionStorage.getItem("familyAuthenticated") === "true") {
        showFamilyGallery();
    }

    // Step 1: Username & Password Verification -> Sends Real Email OTP
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById("username").value.trim();
            const passwordInput = document.getElementById("password").value.trim();

            if (usernameInput === "Jabaa" && passwordInput === "Jabaa1234") {
                if (loginError) loginError.textContent = "";
                
                generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
                
                const now = new Date();
                now.setMinutes(now.getMinutes() + 15);
                const expiryTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const templateParams = {
                    passcode: generatedOtp,
                    time: expiryTime,
                    to_email: RECIPIENT_EMAIL,
                    email: RECIPIENT_EMAIL,
                    to_name: "Yaikob"
                };

                emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams, EMAIL_PUBLIC_KEY)
                    .then((response) => {
                        console.log("SUCCESS!", response.status, response.text);
                        alert("📧 A 4-digit verification code has been successfully emailed to yaikobtesgera0@gmail.com!");
                        loginForm.style.display = "none";
                        if (otpForm) otpForm.style.display = "block";
                    }, (error) => {
                        console.error("FAILED...", error);
                        if (loginError) {
                            loginError.textContent = "Email dispatch failed: " + JSON.stringify(error);
                            loginError.style.color = "#ef4444";
                        }
                    });

            } else {
                if (loginError) {
                    loginError.textContent = "Dogoggora! Username yookaan Password sirrii miti.";
                    loginError.style.color = "#ef4444";
                }
            }
        });
    }

    // Step 2: OTP Code Verification
    if (otpForm) {
        otpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const enteredOtp = document.getElementById("otp-code").value.trim();

            if (enteredOtp === generatedOtp) {
                sessionStorage.setItem("familyAuthenticated", "true");
                if (otpError) otpError.textContent = "";
                showFamilyGallery();
            } else {
                if (otpError) {
                    otpError.textContent = "OTP code dogoggora dha! (Invalid OTP code)";
                    otpError.style.color = "#ef4444";
                }
            }
        });
    }

    // Resend OTP code functionality
    if (resendBtn) {
        resendBtn.addEventListener("click", () => {
            generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
            
            const now = new Date();
            now.setMinutes(now.getMinutes() + 15);
            const expiryTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const templateParams = {
                passcode: generatedOtp,
                time: expiryTime,
                to_email: RECIPIENT_EMAIL,
                email: RECIPIENT_EMAIL,
                to_name: "Yaikob"
            };

            emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams, EMAIL_PUBLIC_KEY)
                .then(() => {
                    alert("📧 A new verification code has been resent to yaikobtesgera0@gmail.com!");
                }, (error) => {
                    alert("Failed to resend email code: " + JSON.stringify(error));
                });
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("familyAuthenticated");
            if (familyContent) familyContent.style.display = "none";
            if (loginSection) loginSection.style.display = "flex";
            if (otpForm) otpForm.style.display = "none";
            if (loginForm) loginForm.style.display = "block";
            loginForm.reset();
            if (otpForm) otpForm.reset();
        });
    }

    // Lightbox Close Controls
    if (lightboxClose) {
        lightboxClose.addEventListener("click", () => {
            if (lightboxModal) lightboxModal.style.display = "none";
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener("click", (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.style.display = "none";
            }
        });
    }

    // --- SWIPE & DRAG GESTURE LOGIC FOR LIGHTBOX ---
    if (lightboxImg) {
        lightboxImg.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxImg.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        }, { passive: true });

        lightboxImg.addEventListener('mousedown', (e) => {
            isDragging = true;
            startPosX = e.clientX;
            lightboxImg.style.transition = 'none';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentTranslateX = e.clientX - startPosX;
            lightboxImg.style.transform = `translateX(${currentTranslateX}px)`;
        });

        window.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            lightboxImg.style.transition = 'transform 0.15s ease-out';
            
            const dragThreshold = 70;
            if (currentTranslateX < -dragThreshold) {
                showNextImage();
            } else if (currentTranslateX > dragThreshold) {
                showPrevImage();
            }
            
            currentTranslateX = 0;
            lightboxImg.style.transform = 'translateX(0px)';
        });
    }

    function handleSwipeGesture() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            showNextImage();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            showPrevImage();
        }
    }

    function showNextImage() {
        if (currentPhotoList.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % currentPhotoList.length;
            if (lightboxImg) {
                lightboxImg.style.opacity = '0.3';
                lightboxImg.src = currentPhotoList[currentImageIndex];
                setTimeout(() => { lightboxImg.style.opacity = '1'; }, 100);
            }
        }
    }

    function showPrevImage() {
        if (currentPhotoList.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + currentPhotoList.length) % currentPhotoList.length;
            if (lightboxImg) {
                lightboxImg.style.opacity = '0.3';
                lightboxImg.src = currentPhotoList[currentImageIndex];
                setTimeout(() => { lightboxImg.style.opacity = '1'; }, 100);
            }
        }
    }

    function showFamilyGallery() {
        if (loginSection) loginSection.style.display = "none";
        if (familyContent) familyContent.style.display = "block";
        loadSavedPhotosFromFirebase();
    }

    // Cloudinary Upload & Firebase Sync Listeners
    if (imageInput) imageInput.addEventListener("change", uploadToCloudinary);
    if (cameraInput) cameraInput.addEventListener("change", uploadToCloudinary);

    function uploadToCloudinary(e) {
        const files = Array.from(e.target.files);

        files.forEach(file => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", UPLOAD_PRESET);

            fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(async data => {
                if (data.secure_url) {
                    try {
                        // Save image link to Firebase Firestore Database so all phones sync
                        await addDoc(collection(db, "family_photos"), {
                            url: data.secure_url,
                            createdAt: new Date()
                        });

                        // Reload gallery to display new photo across phones
                        loadSavedPhotosFromFirebase();
                    } catch (err) {
                        console.error("Firebase save error: ", err);
                        alert("Failed to save image reference to cloud database.");
                    }
                } else {
                    alert("Cloudinary Upload Error: Verify unsigned preset settings.");
                }
            })
            .catch(err => alert("Connection Failed: " + err));
        });
    }

    async function loadSavedPhotosFromFirebase() {
        try {
            const q = query(collection(db, "family_photos"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const photos = [];
            querySnapshot.forEach((doc) => {
                photos.push(doc.data().url);
            });
            renderGallery(photos);
        } catch (err) {
            console.error("Error loading photos from Firebase: ", err);
        }
    }

    function renderGallery(photos) {
        currentPhotoList = photos;
        const galleryGrid = document.getElementById("family-gallery");
        const photoCount = document.getElementById("photo-count");

        if (!galleryGrid) return;
        galleryGrid.innerHTML = "";

        if (photoCount) photoCount.textContent = photos.length;

        if (photos.length === 0) {
            galleryGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Suuraan hin jiru. Suuraa haaraa olfe'aa! (No photos uploaded yet.)</p>`;
            return;
        }

        photos.forEach((src, index) => {
            const item = document.createElement("div");
            item.className = "gallery-item";
            
            const img = document.createElement("img");
            img.src = src;
            img.alt = "Family Memory";
            img.loading = "lazy";

            img.addEventListener("click", () => {
                currentImageIndex = index;
                if (lightboxModal && lightboxImg) {
                    lightboxImg.src = src;
                    lightboxModal.style.display = "flex";
                }
            });

            item.appendChild(img);
            galleryGrid.appendChild(item);
        });
    }
}