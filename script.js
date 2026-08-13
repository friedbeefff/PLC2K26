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

// Hitung mundur ke 1 Oktober 2026
function updateCountdown() {
    const targetDate = new Date('2026-10-01T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('countdown-timer').innerHTML = 
        `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ============================================
// LOADING SCREEN - VERSION 2 (PASTI JALAN!)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressFill = document.getElementById('progressFill');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const loadingTips = document.getElementById('loadingTips');
    
    // ===== TIPS YANG BERUBAH =====
    const tips = [
        { icon: '💡', text: 'Mario pertama kali muncul di tahun 1981!' },
        { icon: '🎮', text: 'Wreck-It Ralph adalah film Disney pertama tentang video game!' },
        { icon: '⭐', text: 'AMICCO singkatan dari "Amazing Mario & Wreck-It Creative Competition"!' },
        { icon: '🏆', text: 'Total hadiah AMICCO 2026 mencapai 10 Juta Rupiah!' },
        { icon: '🎯', text: 'Ada 8 lomba seru yang bisa kamu ikuti!' },
        { icon: '📅', text: 'Pendaftaran ditutup 20 September 2026!' },
        { icon: '🍄', text: 'Super Mushroom membuat Mario jadi besar!' },
        { icon: '🔨', text: 'Palu Wreck-It Ralph bisa menghancurkan apa saja!' },
    ];
    
    let tipIndex = 0;
    let progress = 0;
    
    // ===== UPDATE TIPS =====
    function updateTip() {
        const tip = tips[tipIndex % tips.length];
        loadingTips.innerHTML = `
            <span class="tip-icon">${tip.icon}</span>
            <span class="tip-text">${tip.text}</span>
        `;
        tipIndex++;
    }
    
    // Ganti tips setiap 2 detik
    setInterval(updateTip, 2000);
    updateTip();
    
    // ===== PROGRESS BAR - PASTI JALAN! =====
    function updateProgress() {
        // Tambah progress secara konsisten
        progress += 2; // Tambah 2% setiap kali
        
        // Kalau sudah lebih dari 100, set ke 100
        if (progress > 100) {
            progress = 100;
        }
        
        // Update tampilan
        progressFill.style.width = progress + '%';
        loadingPercentage.textContent = Math.floor(progress) + '%';
        
        // Efek visual saat progress tinggi
        if (progress > 50) {
            progressFill.style.background = 'linear-gradient(90deg, #FBD000, #E52521, #FBD000)';
        }
        if (progress > 80) {
            progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #FBD000, #4CAF50)';
            loadingPercentage.style.color = '#4CAF50';
        }
        
        // Cek apakah sudah selesai
        if (progress < 100) {
            // Lanjutkan dengan interval yang konsisten
            setTimeout(updateProgress, 50); // Update setiap 80ms
        } else {
            // ===== LOADING SELESAI =====
            loadingPercentage.textContent = '100%';
            loadingPercentage.style.color = '#4CAF50';
            
            // Tunggu sebentar lalu hilangkan loading screen
            setTimeout(() => {
                loadingPercentage.textContent = '✓ READY!';
                
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                    
                    // Animasi muncul hero
                    const hero = document.querySelector('.hero');
                    if (hero) {
                        hero.style.opacity = '0';
                        hero.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            hero.style.transition = 'all 1s ease';
                            hero.style.opacity = '1';
                            hero.style.transform = 'translateY(0)';
                        }, 100);
                    }
                }, 500);
            }, 300);
        }
    }
    
    // ===== MULAI LOADING =====
    document.body.style.overflow = 'hidden';
    
    // Mulai progress setelah 500ms
    setTimeout(() => {
        updateProgress();
    }, 500);
    
    // ===== FALLBACK: Jika loading terlalu lama =====
    // Timer keamanan: maksimal 6 detik
    setTimeout(() => {
        if (progress < 100) {
            // Paksa selesai
            progress = 100;
            progressFill.style.width = '100%';
            loadingPercentage.textContent = '100%';
            loadingPercentage.style.color = '#4CAF50';
            
            setTimeout(() => {
                loadingPercentage.textContent = '✓ READY!';
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }, 500);
            }, 300);
        }
    }, 6000);
});

// ============================================
// TYPING EFFECT - "Find Your Wonder"
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Tunggu loading screen selesai dulu
    const checkLoading = setInterval(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen.classList.contains('hidden')) {
            clearInterval(checkLoading);
            startTypingEffect();
        }
    }, 100);
    
    // Fallback: mulai setelah 5 detik jika loading screen bermasalah
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen.classList.contains('hidden')) {
            startTypingEffect();
        }
    }, 5000);
});

function startTypingEffect() {
    const textElement = document.getElementById('typingText');
    const cursorElement = document.getElementById('typingCursor');
    
    // Teks yang akan diketik
    const texts = [
        'Find Your Wonder',
        '✨ Find Your Wonder ✨'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    // Kecepatan typing (ms)
    const typeSpeed = 100;        // Kecepatan ngetik
    const deleteSpeed = 50;      // Kecepatan hapus
    const pauseDelay = 2000;     // Jeda sebelum hapus
    const waitBeforeType = 500;  // Jeda sebelum ngetik ulang
    
    function typeEffect() {
        const currentText = texts[textIndex % texts.length];
        
        if (!isDeleting) {
            // ===== MODE NGETIK =====
            if (charIndex < currentText.length) {
                // Tambah satu karakter
                textElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeEffect, typeSpeed);
            } else {
                // Teks selesai, tunggu sebentar lalu hapus
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                    setTimeout(typeEffect, deleteSpeed);
                }, pauseDelay);
            }
        } else {
            // ===== MODE HAPUS =====
            if (charIndex > 0) {
                // Hapus satu karakter
                textElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(typeEffect, deleteSpeed);
            } else {
                // Sudah terhapus semua, pindah ke teks berikutnya
                isDeleting = false;
                textIndex++;
                setTimeout(typeEffect, waitBeforeType);
            }
        }
    }
    
    // ===== MULAI TYPING =====
    // Bersihkan teks awal
    textElement.textContent = '';
    
    // Tunggu sebentar sebelum mulai
    setTimeout(() => {
        typeEffect();
    }, 500);
}

