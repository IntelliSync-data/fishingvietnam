// ===== API CONFIGURATION =====
const API_ENDPOINT = 'https://app.fishingvietnam.com/api/inquiry';
const PROFILE_API_ENDPOINT = 'https://app.fishingvietnam.com/api/profile/create';

const PACKAGE_IDS = {
    'basic': 3,
    'platinum': 4,
    'platinum-elite': 5
};

const PACKAGE_LABELS = {
    'basic': 'Kayak Adventures',
    'platinum': 'Platinum Fishing Experience',
    'platinum-elite': 'Premium Elite Expedition'
};

let currentPackage = 'basic'; // Track current selected package

document.addEventListener('DOMContentLoaded', function() {
    // Get all package tabs
    const packageTabs = document.querySelectorAll('.package-tab');
    const bookingSection = document.querySelector('.booking-section');
    const bookingForm = document.getElementById('bookingForm');

    // Function to select package tab
    function selectPackageTab(packageName) {
        // Remove active class from all package tabs
        packageTabs.forEach(t => t.classList.remove('active'));

        // Find tab with matching data-package attribute
        const targetTab = Array.from(packageTabs).find(tab =>
            tab.getAttribute('data-package') === packageName
        );

        if (targetTab) {
            // Add active class to selected tab
            targetTab.classList.add('active');

            // Remove all old package classes from booking-section
            bookingSection.className = 'booking-section';

            // Add new package class to booking-section
            bookingSection.classList.add(packageName);

            // Update current package
            currentPackage = packageName;
        }
    }

    // Read URL param on page load
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');

    // List of valid packages
    const validPackages = ['basic', 'platinum', 'platinum-elite'];

    // Select package from URL param or default to 'basic'
    if (packageParam && validPackages.includes(packageParam)) {
        selectPackageTab(packageParam);
    } else {
        selectPackageTab('basic'); // Default
    }

    // Add click event for each package tab
    packageTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get data-package value
            const packageName = this.getAttribute('data-package');
            selectPackageTab(packageName);
        });
    });

    // ===== BOOKING FORM SUBMISSION =====
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Basic validation
            if (!data.name || !data.email || !data.phone || !data.date) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Invalid email address!', 'error');
                return;
            }

            // Phone validation
            const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(data.phone)) {
                showNotification('Invalid phone number!', 'error');
                return;
            }

            // Submit button
            const submitBtn = this.querySelector('.form-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<div class="form-btn-text">Sending...</div>';
            submitBtn.disabled = true;

            const packageLabel = PACKAGE_LABELS[currentPackage] || currentPackage;
            const adults = data.adults || '1';
            const children = data.children || '0';
            const specialRequests = (data.message || '').trim();
            const message = `${packageLabel} - ${adults} Adults + ${children} Children${specialRequests ? ' - ' + specialRequests : ''}`;

            // Format date as datetime string (YYYY-MM-DD 00:00:00)
            const consultationDatetime = data.date ? `${data.date} 00:00:00` : '';

            const payload = {
                name: data.name.trim(),
                email: data.email.trim(),
                phone: data.phone.trim(),
                message: message,
                consultation_datetime: consultationDatetime,
                source_code: 'website'
            };

            const finalizeSubmission = () => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            };

            const emailTrimmed = data.email.trim();
            const nameTrimmed = data.name.trim();
            const phoneTrimmed = data.phone.trim();

            submitToAPI(payload)
                .then(() => {
                    // Create profile package after inquiry succeeds
                    const notes = `${nameTrimmed}, ${phoneTrimmed}${specialRequests ? ', ' + specialRequests : ''}`;
                    return createProfilePackage({
                        package_id: PACKAGE_IDS[currentPackage] || 3,
                        email: emailTrimmed,
                        notes: notes,
                        payment_method_id: 1
                    });
                })
                .then(() => {
                    showSuccessModal(emailTrimmed);
                    bookingForm.reset();
                    finalizeSubmission();
                })
                .catch(() => {
                    showNotification('An error occurred. Please try again!', 'error');
                    finalizeSubmission();
                });
        });
    }

    // ===== CONTACT FORM SUBMISSION =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Basic validation
            if (!data.name || !data.email || !data.phone || !data.message) {
                showNotification('Please fill in all required fields!', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Invalid email address!', 'error');
                return;
            }

            // Phone validation
            const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(data.phone)) {
                showNotification('Invalid phone number!', 'error');
                return;
            }

            // Submit button
            const submitBtn = this.querySelector('.form-btn');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<div class="form-btn-text">Sending...</div>';
            submitBtn.disabled = true;

            const payload = {
                name: data.name.trim(),
                email: data.email.trim(),
                phone: data.phone.trim(),
                message: (data.message || '').trim(),
                source_code: 'website'
            };

            const finalizeSubmission = () => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            };

            submitToAPI(payload)
                .then(() => {
                    showNotification('Thank you for contacting us! We will get back to you soon.', 'success');
                    contactForm.reset();
                    finalizeSubmission();
                })
                .catch(() => {
                    showNotification('An error occurred. Please try again!', 'error');
                    finalizeSubmission();
                });
        });
    }
});

// ===== SUBMIT TO API =====
function submitToAPI(payload) {
    return fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    });
}

// ===== CREATE PROFILE PACKAGE (JSONRPC) =====
function createProfilePackage(params) {
    return fetch(PROFILE_API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            params: params
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        if (data.result && !data.result.success) {
            throw new Error(data.result.error || 'Profile creation failed');
        }
        return data;
    });
}

// ===== SUCCESS MODAL =====
function showSuccessModal(email) {
    // Remove existing modal if any
    const existing = document.getElementById('bookingSuccessModal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'bookingSuccessModal';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.6); z-index: 10001;
        display: flex; align-items: center; justify-content: center;
        animation: fadeIn 0.25s ease;
    `;

    overlay.innerHTML = `
        <div style="
            background: #0C2E45; border-radius: 16px; max-width: 460px; width: 90%;
            padding: 48px 40px; text-align: center; position: relative;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3); animation: modalSlideUp 0.3s ease;
            border: 1px solid rgba(213, 174, 68, 0.2);
        ">
            <button id="closeSuccessModal" style="
                position: absolute; top: 14px; right: 14px; background: none;
                border: none; cursor: pointer; width: 32px; height: 32px;
                display: flex; align-items: center; justify-content: center;
                border-radius: 50%; transition: background 0.2s;
            " onmouseover="this.style.background='rgba(255,255,255,0.1)'"
               onmouseout="this.style.background='none'">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                     stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <div style="
                width: 72px; height: 72px; margin: 0 auto 24px;
                background: rgba(213, 174, 68, 0.15); border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
            ">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                     stroke="#D5AA44" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h3 style="
                font-family: 'Canela Deck', Georgia, serif; font-size: 26px;
                color: #D5AA44; margin: 0 0 16px; font-weight: 400;
            ">Booking Submitted Successfully</h3>
            <p style="
                font-family: 'Montserrat', sans-serif; font-size: 15px;
                color: rgba(255, 255, 255, 0.75); line-height: 1.6; margin: 0;
            ">Fishing VietNam will review and notify you via email at
                <strong style="color: #D5AA44;">${email}</strong>
            </p>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Close handlers
    function closeModal() {
        overlay.style.animation = 'fadeOut 0.25s ease';
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 250);
    }

    overlay.querySelector('#closeSuccessModal').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handler);
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span style="font-size: 1.5em; margin-right: 0.5em;">${type === 'success' ? '✓' : '⚠'}</span>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#0c2e45' : '#dc3545'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.9em;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification animations
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes modalSlideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}
