// ===== Form Step Navigation =====
let currentStep = 1;
let isInitialLoad = true;

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.style.display = 'none';
    });
    
    // Show current step
    const nextStep = document.getElementById('step' + stepNumber);
    nextStep.style.display = 'block';
    
    currentStep = stepNumber;
    updateProgressBars();
    
    // Smooth scroll to form (but not on initial load)
    if (!isInitialLoad) {
        setTimeout(() => {
            const formSection = document.querySelector('.funding-section');
            formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

// ===== Validate Step 1 =====
function validateStep1() {
    const fundingAmount = document.getElementById('fundingAmount').value;
    const fundingPurpose = document.querySelector('input[name="fundingPurpose"]:checked');
    const assetFinanceSelected = fundingPurpose && fundingPurpose.value === 'Asset Finance';
    const assetType = document.querySelector('input[name="assetType"]:checked');
    
    if (!fundingAmount) {
        showAlert('Please enter a funding amount', 'error');
        return false;
    }
    
    if (fundingAmount < 1000 || fundingAmount > 5000000) {
        showAlert('Amount must be between £1,000 and £5,000,000', 'error');
        return false;
    }
    
    if (!fundingPurpose) {
        showAlert('Please select a funding purpose', 'error');
        return false;
    }
    
    if (assetFinanceSelected && !assetType) {
        showAlert('Please select an asset type', 'error');
        return false;
    }
    
    return true;
}

// ===== Validate Step 2 =====
function validateStep2() {
    const importance = document.querySelector('input[name="importance"]:checked');
    
    if (!importance) {
        showAlert('Please select what is most important to you', 'error');
        return false;
    }
    
    return true;
}

// ===== Validate Step 3 =====
function validateStep3() {
    const annualTurnover = document.getElementById('annualTurnover').value;
    const tradingYears = document.querySelector('input[name="tradingYears"]:checked');
    const tradingYearsNo = document.querySelector('input[name="tradingYears"][value="No"]:checked');
    const tradingMonths = document.getElementById('tradingMonths').value;
    const homeowner = document.querySelector('input[name="homeowner"]:checked');
    
    if (!annualTurnover) {
        showAlert('Please enter your annual turnover', 'error');
        return false;
    }
    
    if (!tradingYears) {
        showAlert('Please select if you have been trading for 3+ years', 'error');
        return false;
    }
    
    if (tradingYearsNo && !tradingMonths) {
        showAlert('Please enter how many months you have been trading for', 'error');
        return false;
    }
    
    if (!homeowner) {
        showAlert('Please select if you are a homeowner in the UK', 'error');
        return false;
    }
    
    return true;
}

// ===== Button Event Listeners =====
document.addEventListener('DOMContentLoaded', function() {
    // Setup number input formatting
    setupNumberInputFormatting();
    
    // Add smooth transitions on page load
    const fundingForm = document.querySelector('.funding-form');
    if (fundingForm) {
        fundingForm.style.animation = 'fadeIn 0.6s ease-out';
    }
    
    const step1Continue = document.getElementById('step1Continue');
    const step2Back = document.getElementById('step2Back');
    const step2Continue = document.getElementById('step2Continue');
    const step3Back = document.getElementById('step3Back');
    
    if (step1Continue) {
        step1Continue.addEventListener('click', function() {
            if (validateStep1()) {
                showStep(2);
            }
        });
    }
    
    if (step2Back) {
        step2Back.addEventListener('click', function() {
            showStep(1);
        });
    }
    
    if (step2Continue) {
        step2Continue.addEventListener('click', function() {
            if (validateStep2()) {
                showStep(3);
            }
        });
    }
    
    if (step3Back) {
        step3Back.addEventListener('click', function() {
            showStep(2);
        });
    }
    
    // Get form reference
    const form = document.getElementById('fundingForm');
    
    // ===== Form Submission =====
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep3()) {
                // Add loading animation to button
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.style.opacity = '0.7';
                submitBtn.style.pointerEvents = 'none';
                submitBtn.innerHTML = '⏳ Processing...';
                
                // Simulate processing
                setTimeout(() => {
                    // Collect all form data
                    const formData = {
                        fundingAmount: document.getElementById('fundingAmount').value,
                        fundingPurpose: document.querySelector('input[name="fundingPurpose"]:checked').value,
                        assetType: document.querySelector('input[name="assetType"]:checked')?.value || 'N/A',
                        importance: document.querySelector('input[name="importance"]:checked').value,
                        annualTurnover: document.getElementById('annualTurnover').value,
                        tradingYears: document.querySelector('input[name="tradingYears"]:checked').value,
                        tradingMonths: document.getElementById('tradingMonths').value || 'N/A',
                        homeowner: document.querySelector('input[name="homeowner"]:checked').value
                    };
                    
                    // Store data and show success
                    localStorage.setItem('fundingFormData', JSON.stringify(formData));
                    submitBtn.innerHTML = '✓ Submitted!';
                    showAlert('Your application has been submitted successfully!', 'success');
                    
                    setTimeout(() => {
                        // Redirect to results page
                        window.location.href = 'results.html';
                    }, 1500);
                }, 1000);
            }
        });
    }
    
    // ===== Show/Hide Asset Type Question =====
    function toggleAssetTypeQuestion() {
        const assetFinanceSelected = document.querySelector('input[name="fundingPurpose"][value="Asset Finance"]:checked');
        const assetTypeGroup = document.getElementById('assetTypeGroup');
        
        if (assetFinanceSelected) {
            assetTypeGroup.style.display = 'block';
        } else {
            assetTypeGroup.style.display = 'none';
            document.querySelectorAll('input[name="assetType"]').forEach(radio => {
                radio.checked = false;
            });
        }
    }
    
    // ===== Show/Hide Trading Months Input =====
    function toggleTradingMonths() {
        const tradingYearsNo = document.querySelector('input[name="tradingYears"][value="No"]:checked');
        const tradingMonthsGroup = document.getElementById('tradingMonthsGroup');
        
        if (tradingYearsNo) {
            tradingMonthsGroup.style.display = 'block';
        } else {
            tradingMonthsGroup.style.display = 'none';
            document.getElementById('tradingMonths').value = '';
        }
    }
    
    // Add event listeners to funding purpose radios
    document.querySelectorAll('input[name="fundingPurpose"]').forEach(radio => {
        radio.addEventListener('change', function() {
            toggleAssetTypeQuestion();
            // Add animation to selected item
            this.closest('.radio-item').style.animation = 'pulse 0.4s ease';
        });
    });
    
    // Add event listeners to trading years radios
    document.querySelectorAll('input[name="tradingYears"]').forEach(radio => {
        radio.addEventListener('change', function() {
            toggleTradingMonths();
            // Add animation to selected item
            this.closest('.radio-item').style.animation = 'pulse 0.4s ease';
        });
    });
    
    // ===== Load Saved Form Data =====
    function loadFormData() {
        const savedData = localStorage.getItem('fundingFormData');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                
                // Populate Step 1 fields
                if (formData.fundingAmount) {
                    document.getElementById('fundingAmount').value = formData.fundingAmount;
                }
                if (formData.fundingPurpose) {
                    const fundingRadio = document.querySelector(`input[name="fundingPurpose"][value="${formData.fundingPurpose}"]`);
                    if (fundingRadio) fundingRadio.checked = true;
                }
                if (formData.assetType && formData.assetType !== 'N/A') {
                    const assetRadio = document.querySelector(`input[name="assetType"][value="${formData.assetType}"]`);
                    if (assetRadio) assetRadio.checked = true;
                }
                
                // Populate Step 2 fields
                if (formData.importance) {
                    const importanceRadio = document.querySelector(`input[name="importance"][value="${formData.importance}"]`);
                    if (importanceRadio) importanceRadio.checked = true;
                }
                
                // Populate Step 3 fields
                if (formData.annualTurnover) {
                    document.getElementById('annualTurnover').value = formData.annualTurnover;
                }
                if (formData.tradingYears) {
                    const tradingRadio = document.querySelector(`input[name="tradingYears"][value="${formData.tradingYears}"]`);
                    if (tradingRadio) tradingRadio.checked = true;
                }
                if (formData.tradingMonths && formData.tradingMonths !== 'N/A') {
                    document.getElementById('tradingMonths').value = formData.tradingMonths;
                }
                if (formData.homeowner) {
                    const homeownerRadio = document.querySelector(`input[name="homeowner"][value="${formData.homeowner}"]`);
                    if (homeownerRadio) homeownerRadio.checked = true;
                }
                
                // Trigger conditional field toggles
                toggleAssetTypeQuestion();
                toggleTradingMonths();
                
            } catch (e) {
                console.error('Error loading form data:', e);
            }
        }
    }
    
    // Load saved data on page load
    loadFormData();
    
    // Initialize - show step 1
    showStep(1);
    isInitialLoad = false;
});

// ===== Update Progress Bars =====
function updateProgressBars() {
    const progressBar1 = document.getElementById('progressBar1').querySelector('.progress-fill');
    const progressBar2 = document.getElementById('progressBar2').querySelector('.progress-fill');
    const progressBar3 = document.getElementById('progressBar3').querySelector('.progress-fill');
    
    if (currentStep >= 1) {
        progressBar1.style.width = '100%';
    } else {
        progressBar1.style.width = '0%';
    }
    
    if (currentStep >= 2) {
        progressBar2.style.width = '100%';
    } else {
        progressBar2.style.width = '0%';
    }
    
    if (currentStep >= 3) {
        progressBar3.style.width = '100%';
    } else {
        progressBar3.style.width = '0%';
    }
}

// ===== Alert System =====
function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `custom-alert custom-alert-${type}`;
    alert.textContent = message;
    
    alert.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        max-width: 400px;
    `;
    
    if (type === 'error') {
        alert.style.backgroundColor = '#ff6b5a';
        alert.style.color = '#ffffff';
    } else if (type === 'success') {
        alert.style.backgroundColor = '#10b981';
        alert.style.color = '#ffffff';
    } else {
        alert.style.backgroundColor = '#3b82f6';
        alert.style.color = '#ffffff';
    }
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// ===== Format Number with Commas =====
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ===== Format Input Fields with Live Formatting =====
function setupNumberInputFormatting() {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    numberInputs.forEach(input => {
        // Store original input value
        input.addEventListener('input', function() {
            // Keep the numeric value for form submission
            // Visual display will show formatted version via placeholder/label updates
            const value = this.value;
            
            if (value && this.id === 'fundingAmount') {
                this.dataset.formattedValue = formatNumber(value);
                // Update placeholder to show format
                const displayValue = formatNumber(value);
                if (this.value && this.value.length > 4) {
                    const event = new CustomEvent('formatted', { detail: { formatted: displayValue } });
                    this.dispatchEvent(event);
                }
            }
        });
        
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

// ===== Add Animations =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(30px);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.05);
            opacity: 0.8;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .radio-item {
        animation: none !important;
    }
`;
document.head.appendChild(style);

// ===== Authentication Functions =====

// Check if we're on the login page
function initializeAuthPage() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const socialButtons = document.querySelectorAll('.social-btn');

    // Toggle between login and signup forms
    if (toggleButtons.length > 0) {
        toggleButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const formType = this.getAttribute('data-toggle');
                
                // Hide all forms and toggle paragraphs
                document.querySelectorAll('.auth-form-new').forEach(form => {
                    form.classList.remove('active');
                });
                document.querySelectorAll('.auth-toggle p').forEach(p => {
                    p.style.display = 'none';
                });

                // Show selected form
                if (formType === 'signup') {
                    document.getElementById('signupForm').classList.add('active');
                    document.querySelectorAll('.auth-toggle p')[1].style.display = 'block';
                } else {
                    document.getElementById('loginForm').classList.add('active');
                    document.querySelectorAll('.auth-toggle p')[0].style.display = 'block';
                }

                // Clear messages
                const message = document.getElementById('authMessage');
                if (message) {
                    message.classList.remove('success', 'error');
                    message.textContent = '';
                }

                // Smooth scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    // Social login buttons
    if (socialButtons.length > 0) {
        socialButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const provider = this.classList.contains('twitter-btn') ? 'Twitter' : 'Facebook';
                showAuthMessage(`Redirecting to ${provider}...`, 'success', document.getElementById('authMessage'));
                // In real app, redirect to social login
                // window.location.href = `/auth/${provider.toLowerCase()}`;
            });
        });
    }

    // Password strength meter
    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword) {
        signupPassword.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(this);
        });
    }

    // Sign up form submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup(this);
        });
    }
}

// Update password strength indicator
function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    let strength = 0;

    if (!password) {
        strengthBar.style.width = '0%';
        return;
    }

    // Check password criteria
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password) && /[!@#$%^&*]/.test(password)) strength += 25;

    strengthBar.style.width = strength + '%';

    // Change color based on strength
    if (strength <= 25) {
        strengthBar.style.background = 'linear-gradient(90deg, #ff6b5a, #ff6b5a)';
    } else if (strength <= 50) {
        strengthBar.style.background = 'linear-gradient(90deg, #ff8c42, #ff8c42)';
    } else if (strength <= 75) {
        strengthBar.style.background = 'linear-gradient(90deg, #ffc857, #ffc857)';
    } else {
        strengthBar.style.background = 'linear-gradient(90deg, #2ecc71, #2ecc71)';
    }
}

// Handle login
function handleLogin(form) {
    const email = form.querySelector('#loginEmail').value.trim();
    const password = form.querySelector('#loginPassword').value;
    const messageEl = document.getElementById('authMessage');

    // Validate inputs
    if (!email || !password) {
        showAuthMessage('Please fill in all fields', 'error', messageEl);
        return;
    }

    if (!isValidEmail(email)) {
        showAuthMessage('Please enter a valid email address', 'error', messageEl);
        return;
    }

    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters', 'error', messageEl);
        return;
    }

    // Simulate API call
    setTimeout(() => {
        // Store user session (in real app, this would be a server call)
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');
        
        showAuthMessage('Login successful! Redirecting...', 'success', messageEl);
        
        setTimeout(() => {
            window.location.href = 'funding-form.html';
        }, 1500);
    }, 500);
}

// Handle sign up
function handleSignup(form) {
    const firstName = form.querySelector('#firstName').value.trim();
    const lastName = form.querySelector('#lastName').value.trim();
    const email = form.querySelector('#signupEmail').value.trim();
    const password = form.querySelector('#signupPassword').value;
    const confirmPassword = form.querySelector('#confirmPassword').value;
    const companyName = form.querySelector('#companyName').value.trim();
    const agreeTerms = form.querySelector('#agreeTerms').checked;
    const messageEl = document.getElementById('authMessage');

    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword || !companyName) {
        showAuthMessage('Please fill in all fields', 'error', messageEl);
        return;
    }

    if (!isValidEmail(email)) {
        showAuthMessage('Please enter a valid email address', 'error', messageEl);
        return;
    }

    if (password.length < 8) {
        showAuthMessage('Password must be at least 8 characters', 'error', messageEl);
        return;
    }

    if (password !== confirmPassword) {
        showAuthMessage('Passwords do not match', 'error', messageEl);
        return;
    }

    if (!agreeTerms) {
        showAuthMessage('You must agree to the Terms of Service', 'error', messageEl);
        return;
    }

    // Simulate API call
    setTimeout(() => {
        // Store user data (in real app, this would be a server call)
        const userData = {
            firstName,
            lastName,
            email,
            companyName,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');
        
        showAuthMessage('Account created successfully! Redirecting...', 'success', messageEl);
        
        setTimeout(() => {
            window.location.href = 'funding-form.html';
        }, 1500);
    }, 500);
}

// Show authentication message
function showAuthMessage(message, type, messageEl) {
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.classList.remove('success', 'error');
        messageEl.classList.add(type);
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize auth page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if on auth page
    if (document.querySelector('.auth-section-new')) {
        initializeAuthPage();
    }
});
