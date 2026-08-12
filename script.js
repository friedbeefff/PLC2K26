// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Tutup menu saat link diklik
document.querySelectorAll('.nav-links a').forEach(link => {
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

// ===== KONSOLE PESAN =====
console.log('🍄 AMICCO - Find Your Wonder! 🔨');
console.log('📞 Contact Person siap membantu!');
console.log('💡 Logo pakai background putih');
console.log('💡 Navbar: PLC 2K26 | Hero: AMICCO');
console.log('📱 Tombol WhatsApp: wa.me/6281234567890');

// ===== FUNGSI CUSTOM LOGO =====
function setLogo(newPath) {
    document.getElementById('logoImg').src = newPath;
    console.log('✅ Logo diganti ke:', newPath);
}