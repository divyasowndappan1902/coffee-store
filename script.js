// Navigation Hamburger Menu
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links li a").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
    }));
}

// Simple pagination interaction for Home Page
const dots = document.querySelectorAll(".dot");
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        dots.forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
    });
});

// --- ROLE SELECTOR LOGIC (Login & Signup) ---
const roleSelectors = document.querySelectorAll('.role-selector');

roleSelectors.forEach(selector => {
    const btns = selector.querySelectorAll('.role-btn');
    // Find the closest hidden input to store the role
    const hiddenInput = selector.parentElement.querySelector('#selectedRole');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            btns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            
            const selectedRole = btn.getAttribute('data-role');
            selector.setAttribute('data-active', selectedRole);
            
            if (hiddenInput) {
                hiddenInput.value = selectedRole;
            }
        });
    });
});

// --- FORM SUBMISSION ROUTING ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual submission
        const role = document.getElementById('selectedRole').value;
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value) {
            localStorage.setItem('userEmail', emailInput.value);
        }

        if (role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'customer-dashboard.html';
        }
    });
}

const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual submission
        const role = document.getElementById('selectedRole').value;
        const emailInput = document.getElementById('email');
        if (emailInput && emailInput.value) {
            localStorage.setItem('userEmail', emailInput.value);
        }

        window.location.href = 'login.html';
    });
}

// --- DYNAMIC EMAIL DISPLAY ---
document.addEventListener("DOMContentLoaded", () => {
    const emailDisplay = document.getElementById('user-email-display');
    if (emailDisplay) {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            emailDisplay.textContent = storedEmail;
        }
    }

    // --- DUMMY BUTTON REDIRECT ---
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('button, a');
        if (!target) return;

        // Ignore dashboard sidebar tabs and actual links
        if (target.tagName.toLowerCase() === 'a') {
            const href = target.getAttribute('href');
            const dataTarget = target.getAttribute('data-target');
            if (href === '#' && !dataTarget) {
                e.preventDefault();
                window.location.href = '404.html';
                return;
            }
        }

        // Ignore form submissions and known functional buttons
        if (target.tagName.toLowerCase() === 'button') {
            const type = target.getAttribute('type');
            if (type === 'submit' || target.closest('form')) return;
            if (target.classList.contains('role-btn') || 
                target.classList.contains('hamburger') || 
                target.classList.contains('dot')) return;
            
            // Redirect any other generic/dummy button
            e.preventDefault();
            window.location.href = '404.html';
        }
    });
});
