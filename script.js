// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Tutup menu saat link diklik
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ===== SCROLL BACKGROUND - 3 TEMA DENGAN OPACITY =====
const bgMario = document.getElementById('bgMario');
const bgWreck = document.getElementById('bgWreck');
const bgWreckBlue = document.getElementById('bgWreckBlue');

function checkScrollForTheme() {
    const competitionSection = document.getElementById('competitions');
    const timelineSection = document.getElementById('timeline');
    
    if (!competitionSection || !timelineSection) return;
    
    // Ambil posisi section
    const competitionTop = competitionSection.offsetTop;
    const competitionHeight = competitionSection.offsetHeight;
    const competitionMiddle = competitionTop + (competitionHeight / 2);
    
    const timelineTop = timelineSection.offsetTop;
    const timelineHeight = timelineSection.offsetHeight;
    const timelineMiddle = timelineTop + (timelineHeight / 2);
    
    // Ambil posisi scroll saat ini (tengah viewport)
    const scrollY = window.scrollY + (window.innerHeight / 2);
    
    // Reset semua opacity dulu
    bgMario.style.opacity = '0';
    bgWreck.style.opacity = '0';
    bgWreckBlue.style.opacity = '0';
    
    // Tentukan tema berdasarkan posisi scroll
    if (scrollY < competitionMiddle) {
        // Tema MARIO (atas)
        bgMario.style.opacity = '1';
    } else if (scrollY >= competitionMiddle && scrollY < timelineMiddle) {
        // Tema WRECK-IT RALPH (tengah - oranye)
        bgWreck.style.opacity = '1';
    } else if (scrollY >= timelineMiddle) {
        // Tema WRECK-IT RALPH BIRU (bawah)
        bgWreckBlue.style.opacity = '1';
    }
}

// Event listener scroll
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            checkScrollForTheme();
            ticking = false;
        });
        ticking = true;
    }
});

// Panggil pertama kali saat halaman dimuat
window.addEventListener('load', () => {
    // Set default ke Mario
    bgMario.style.opacity = '1';
    bgWreck.style.opacity = '0';
    bgWreckBlue.style.opacity = '0';
    
    setTimeout(() => {
        checkScrollForTheme();
    }, 100);
});

// Panggil saat resize
window.addEventListener('resize', () => {
    checkScrollForTheme();
});

console.log('✨ AMICCO - Scroll background dengan 3 tema: Mario → Wreck-It Ralph → Wreck-It Ralph Blue');
console.log('📌 Scroll ke bawah untuk melihat perubahan background yang smooth!');