// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== COUNTDOWN =====
function updateCountdown() {
    const targetDate = new Date('2026-09-20');
    const now = new Date();
    const diff = targetDate - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const timer = document.getElementById('countdown-timer');
    if (timer) {
        if (days > 0) {
            timer.textContent = `⏳ Hari tersisa: ${days}`;
        } else {
            timer.textContent = '🎉 Pendaftaran ditutup!';
        }
    }
}
updateCountdown();

// ===== QUESTION BLOCK INTERAKTIF =====
const questionBlock = document.querySelector('.question-block');
if (questionBlock) {
    questionBlock.addEventListener('click', function() {
        this.textContent = '✨';
        setTimeout(() => {
            this.textContent = '❓';
        }, 1000);
    });
}

// ===== CONSOLE LOG =====
console.log('🍄 AMICCO - Find Your Wonder! 🔨');
console.log('📅 Timeline 2 Gelombang siap!');
console.log('💡 Jangan lupa ganti link Google Docs, Google Forms, dan WhatsApp!');