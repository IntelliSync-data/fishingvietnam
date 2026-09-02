// ===== API CONFIGURATION =====
const API_ENDPOINT = 'https://app.fishingvietnam.com/api/inquiry';
const PROFILE_API_ENDPOINT = 'https://app.fishingvietnam.com/api/profile';
const POLLING_INTERVAL = 5000;
const POLLING_TIMEOUT = 300000;

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

let currentPackage = 'basic';
let paymentPollingInterval = null;
let paymentPollingTimeout = null;
let countdownInterval = null;

document.addEventListener('DOMContentLoaded', function () {
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
        tab.addEventListener('click', function () {
            // Get data-package value
            const packageName = this.getAttribute('data-package');
            selectPackageTab(packageName);
        });
    });

    // ===== BOOKING FORM SUBMISSION =====
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
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
                    finalizeSubmission();
                    const notes = `${nameTrimmed}, ${phoneTrimmed}${specialRequests ? ', ' + specialRequests : ''}`;
                    showPaymentOptionModal({
                        package_id: PACKAGE_IDS[currentPackage] || 3,
                        email: emailTrimmed,
                        notes: notes,
                        payment_method_id: 3
                    });
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
        contactForm.addEventListener('submit', function (e) {
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
    return fetch(`${PROFILE_API_ENDPOINT}/create`, {
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

// ===== CHECK PAYMENT STATUS =====
function checkPaymentStatus(userProfileId, transactionCode) {
    return fetch(`${PROFILE_API_ENDPOINT}/check-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            params: {
                user_profile_id: userProfileId,
                transaction_code: transactionCode
            }
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    });
}

// ===== STOP PAYMENT POLLING =====
function stopPaymentPolling() {
    if (paymentPollingInterval) {
        clearInterval(paymentPollingInterval);
        paymentPollingInterval = null;
    }
    if (paymentPollingTimeout) {
        clearTimeout(paymentPollingTimeout);
        paymentPollingTimeout = null;
    }
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

// ===== PAYMENT OPTION MODAL =====
function showPaymentOptionModal(profileParams) {
    const existing = document.getElementById('paymentOptionModal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'paymentOptionModal';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7); z-index: 10001;
        display: flex; align-items: center; justify-content: center;
        animation: fadeIn 0.25s ease;
    `;

    overlay.innerHTML = `
        <div style="
            background: #0C2E45; border-radius: 16px; max-width: 500px; width: 90%;
            padding: 48px 40px; text-align: center; position: relative;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4); animation: modalSlideUp 0.3s ease;
            border: 1px solid rgba(213, 174, 68, 0.2);
        ">
            <button id="closePaymentOption" style="
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
                     stroke="#D5AA44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
            </div>
            <h3 style="
                font-family: 'Canela Deck', Georgia, serif; font-size: 24px;
                color: #D5AA44; margin: 0 0 12px; font-weight: 400;
            ">Select Payment Option</h3>
            <p style="
                font-family: 'Montserrat', sans-serif; font-size: 14px;
                color: rgba(255, 255, 255, 0.65); line-height: 1.6; margin: 0 0 32px;
            ">Choose how you would like to pay for your booking</p>
            <div style="display: flex; flex-direction: column; gap: 14px;">
                <button id="payFullBtn" style="
                    background: #D5AA44; color: #0C2E45; border: none; border-radius: 10px;
                    padding: 18px 24px; cursor: pointer; transition: all 0.2s;
                    font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 15px;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                " onmouseover="this.style.background='#e0b94d'; this.style.transform='translateY(-1px)'"
                   onmouseout="this.style.background='#D5AA44'; this.style.transform='none'">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                         stroke="#0C2E45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    Pay Full Amount (100%)
                </button>
                <button id="payHalfBtn" style="
                    background: transparent; color: #D5AA44; border: 1.5px solid #D5AA44;
                    border-radius: 10px; padding: 18px 24px; cursor: pointer; transition: all 0.2s;
                    font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 15px;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                " onmouseover="this.style.background='rgba(213,174,68,0.1)'; this.style.transform='translateY(-1px)'"
                   onmouseout="this.style.background='transparent'; this.style.transform='none'">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                         stroke="#D5AA44" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                    </svg>
                    Pay 50% Deposit
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function closeModal() {
        overlay.style.animation = 'fadeOut 0.25s ease';
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 250);
    }

    overlay.querySelector('#closePaymentOption').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    function handlePaymentChoice(halfPayment) {
        closeModal();
        const params = { ...profileParams, half_payment: halfPayment };
        showPaymentLoadingModal();
        createProfilePackage(params)
            .then(data => {
                removePaymentLoadingModal();
                if (data.result && data.result.success) {
                    // Open PayPal in new tab
                    if (data.result.redirect_url) {
                        window.open(data.result.redirect_url, '_blank');
                    }
                    showWaitingPaymentModal(data.result);
                    const bookingForm = document.getElementById('bookingForm');
                    if (bookingForm) bookingForm.reset();
                } else {
                    showNotification(data.result?.error || 'Failed to create payment. Please try again!', 'error');
                }
            })
            .catch(() => {
                removePaymentLoadingModal();
                showNotification('An error occurred. Please try again!', 'error');
            });
    }

    overlay.querySelector('#payFullBtn').addEventListener('click', () => handlePaymentChoice(false));
    overlay.querySelector('#payHalfBtn').addEventListener('click', () => handlePaymentChoice(true));
}

// ===== LOADING MODAL =====
function showPaymentLoadingModal() {
    const existing = document.getElementById('paymentLoadingModal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'paymentLoadingModal';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7); z-index: 10002;
        display: flex; align-items: center; justify-content: center;
    `;
    overlay.innerHTML = `
        <div style="
            background: #0C2E45; border-radius: 16px; padding: 48px;
            text-align: center; border: 1px solid rgba(213, 174, 68, 0.2);
        ">
            <div style="
                width: 48px; height: 48px; border: 3px solid rgba(213,174,68,0.2);
                border-top-color: #D5AA44; border-radius: 50%; margin: 0 auto 20px;
                animation: spin 0.8s linear infinite;
            "></div>
            <p style="
                font-family: 'Montserrat', sans-serif; font-size: 15px;
                color: rgba(255,255,255,0.8); margin: 0;
            ">Creating payment...</p>
        </div>
    `;
    document.body.appendChild(overlay);
}

function removePaymentLoadingModal() {
    const el = document.getElementById('paymentLoadingModal');
    if (el) el.remove();
}

// ===== WAITING PAYMENT MODAL =====
function showWaitingPaymentModal(paymentData) {
    const existing = document.getElementById('waitingPaymentModal');
    if (existing) existing.remove();

    stopPaymentPolling();

    const overlay = document.createElement('div');
    overlay.id = 'waitingPaymentModal';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7); z-index: 10001;
        display: flex; align-items: center; justify-content: center;
        animation: fadeIn 0.25s ease;
    `;

    const amountUSD = paymentData.amount_usd != null
        ? `$${new Intl.NumberFormat('en-US').format(paymentData.amount_usd)} USD`
        : `${new Intl.NumberFormat('en-US').format(paymentData.amount)} VND`;

    overlay.innerHTML = `
        <div style="
            background: #0C2E45; border-radius: 16px; max-width: 460px; width: 90%;
            padding: 44px 40px; text-align: center; position: relative;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4); animation: modalSlideUp 0.3s ease;
            border: 1px solid rgba(213, 174, 68, 0.2);
        ">
            <button id="closeWaitingModal" style="
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
                width: 64px; height: 64px; border: 3px solid rgba(213,174,68,0.2);
                border-top-color: #D5AA44; border-radius: 50%; margin: 0 auto 24px;
                animation: spin 0.8s linear infinite;
            "></div>

            <h3 style="
                font-family: 'Canela Deck', Georgia, serif; font-size: 22px;
                color: #D5AA44; margin: 0 0 8px; font-weight: 400;
            ">Waiting for Payment</h3>
            <p style="
                font-family: 'Montserrat', sans-serif; font-size: 13px;
                color: rgba(255,255,255,0.55); margin: 0 0 24px; line-height: 1.6;
            ">Please complete the payment on PayPal.<br>This page will update automatically.</p>

            <div style="
                background: rgba(213, 174, 68, 0.08); border-radius: 10px;
                padding: 16px; margin: 0 0 20px;
                border: 1px solid rgba(213, 174, 68, 0.15);
            ">
                <div style="
                    font-family: 'Montserrat', sans-serif; font-size: 13px;
                    color: rgba(255,255,255,0.55); margin-bottom: 4px;
                ">Amount</div>
                <div style="
                    font-family: 'Montserrat', sans-serif; font-size: 24px;
                    color: #D5AA44; font-weight: 700;
                ">${amountUSD}</div>
            </div>

            <div id="waitingCountdown" style="
                font-family: 'Montserrat', sans-serif; font-size: 14px;
                color: rgba(255,255,255,0.6); display: flex; align-items: center;
                justify-content: center; gap: 6px; margin-bottom: 16px;
            ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Expires in <span id="waitingTimer" style="font-weight: 600; color: #D5AA44;">05:00</span>
            </div>

            <button id="openPaypalBtn" style="
                background: transparent; color: #D5AA44; border: 1.5px solid rgba(213,174,68,0.4);
                border-radius: 8px; padding: 12px 24px; cursor: pointer; transition: all 0.2s;
                font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 13px;
            " onmouseover="this.style.background='rgba(213,174,68,0.1)'"
               onmouseout="this.style.background='transparent'">
                Open PayPal Again
            </button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Start countdown
    let remaining = 300;
    const timerEl = overlay.querySelector('#waitingTimer');
    const countdownEl = overlay.querySelector('#waitingCountdown');

    countdownInterval = setInterval(() => {
        remaining--;
        const m = String(Math.floor(remaining / 60)).padStart(2, '0');
        const s = String(remaining % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
        if (remaining <= 60) {
            timerEl.style.color = '#e74c3c';
            countdownEl.style.color = 'rgba(231, 76, 60, 0.8)';
        }
        if (remaining <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }, 1000);

    // Re-open PayPal button
    overlay.querySelector('#openPaypalBtn').addEventListener('click', () => {
        if (paymentData.redirect_url) {
            window.open(paymentData.redirect_url, '_blank');
        }
    });

    // Start polling
    paymentPollingInterval = setInterval(async () => {
        try {
            const resp = await checkPaymentStatus(paymentData.user_profile_id, paymentData.transaction_id);
            if (resp.result && resp.result.success) {
                if (resp.result.status === 'confirmed') {
                    stopPaymentPolling();
                    closeWaiting();
                    showPaymentSuccessModal();
                } else if (resp.result.status === 'expired') {
                    stopPaymentPolling();
                    closeWaiting();
                    showNotification('Payment expired. Please try again.', 'error');
                }
            }
        } catch (e) {
            console.error('Payment polling error:', e);
        }
    }, POLLING_INTERVAL);

    paymentPollingTimeout = setTimeout(() => {
        stopPaymentPolling();
        closeWaiting();
        showNotification('Payment expired. Please try again.', 'error');
    }, POLLING_TIMEOUT);

    function closeWaiting() {
        stopPaymentPolling();
        overlay.style.animation = 'fadeOut 0.25s ease';
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 250);
    }

    overlay.querySelector('#closeWaitingModal').addEventListener('click', closeWaiting);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeWaiting();
    });
}

// ===== PAYMENT SUCCESS MODAL =====
function showPaymentSuccessModal() {
    const existing = document.getElementById('paymentSuccessModal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'paymentSuccessModal';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7); z-index: 10001;
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
            <button id="closePaymentSuccess" style="
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
                width: 80px; height: 80px; margin: 0 auto 24px;
                background: rgba(39, 174, 96, 0.15); border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
            ">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                     stroke="#27AE60" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h3 style="
                font-family: 'Canela Deck', Georgia, serif; font-size: 26px;
                color: #27AE60; margin: 0 0 16px; font-weight: 400;
            ">Payment Successful!</h3>
            <p style="
                font-family: 'Montserrat', sans-serif; font-size: 15px;
                color: rgba(255, 255, 255, 0.75); line-height: 1.7; margin: 0;
            ">Thank you for your payment. Our team will contact you shortly to confirm your booking details.</p>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    function closeModal() {
        overlay.style.animation = 'fadeOut 0.25s ease';
        setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = '';
        }, 250);
    }

    overlay.querySelector('#closePaymentSuccess').addEventListener('click', closeModal);
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
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}
