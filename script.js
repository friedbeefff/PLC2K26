// ============================================
// HAMBURGER MENU
// ============================================
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

// ============================================
// SCROLL BACKGROUND - 2 LAYER SMOOTH
// ============================================
const bgMario = document.getElementById('bgMario');
const bgWreck = document.getElementById('bgWreck');

function updateBackgroundShade() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - windowHeight;
    
    let progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    progress = Math.min(Math.max(progress, 0), 1);
    
    // Smooth easing
     eased = progress < 0.5 ? 
        2 * progress * progress : 
        -1 + (4 - 2 * progress) * progress;
    
    bgMario.style.opacity = 1 - eased;
    bgWreck.style.opacity = eased;
}

// ===== EVENT LISTENER SCROLL =====
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateBackgroundShade();
            ticking = false;
        });
        ticking = true;
    }
});

// ===== INITIAL - PASTIKAN DI ATAS =====
window.addEventListener('load', () => {
    // Reset scroll ke atas
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Set default ke gelap
    bgMario.style.opacity = '1';
    bgWreck.style.opacity = '0';
    
    // Tunggu sebentar baru update
    setTimeout(() => {
        updateBackgroundShade();
    }, 300);
});

// ===== RESIZE =====
window.addEventListener('resize', () => {
    updateBackgroundShade();
});

console.log('🌊 Smooth shades biru: Gelap → Terang (continuous)');

// ============================================
// COUNTDOWN TIMER
// ============================================
function updateCountdown() {
     targetDate = new Date('2026-10-01T00:00:00').getTime();
     now = new Date().getTime();
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
// LOADING SCREEN - VERSION FAST
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressFill = document.getElementById('progressFill');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const loadingTips = document.getElementById('loadingTips');
    
    const tips = [
        { icon: '💡', text: 'Mario pertama kali muncul di tahun 1981!' },
        { icon: '🎮', text: 'Wreck-It Ralph adalah film Disney pertama tentang video game!' },
        { icon: '🏆', text: 'Total hadiah AMICCO 2026 mencapai 10 Juta Rupiah!' },
        { icon: '🎯', text: 'Ada 8 lomba seru yang bisa kamu ikuti!' },
        { icon: '📅', text: 'Pendaftaran ditutup 20 September 2026!' },
        { icon: '🍄', text: 'Super Mushroom membuat Mario jadi besar!' },
        { icon: '🔨', text: 'Palu Wreck-It Ralph bisa menghancurkan apa saja!' },
    ];
    
    let tipIndex = 0;
    let progress = 0;
    
    function updateTip() {
        const tip = tips[tipIndex % tips.length];
        loadingTips.innerHTML = `
            <span class="tip-icon">${tip.icon}</span>
            <span class="tip-text">${tip.text}</span>
        `;
        tipIndex++;
    }
    
    setInterval(updateTip, 1500);
    updateTip();
    
    function updateProgress() {
        progress += 5;
        
        if (progress > 100) {
            progress = 100;
        }
        
        progressFill.style.width = progress + '%';
        loadingPercentage.textContent = Math.floor(progress) + '%';
        
        if (progress > 50) {
            progressFill.style.background = 'linear-gradient(90deg, #FBD000, #E52521, #FBD000)';
        }
        if (progress > 80) {
            progressFill.style.background = 'linear-gradient(90deg, #4CAF50, #FBD000, #4CAF50)';
            loadingPercentage.style.color = '#4CAF50';
        }
        
        if (progress < 100) {
            setTimeout(updateProgress, 50);
        } else {
            loadingPercentage.textContent = '100%';
            loadingPercentage.style.color = '#4CAF50';
            
            setTimeout(() => {
                loadingPercentage.textContent = '✓ READY!';
                
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                    
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
                }, 400);
            }, 300);
        }
    }
    
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        updateProgress();
    }, 300);
    
    setTimeout(() => {
        if (progress < 100) {
            progress = 100;
            progressFill.style.width = '100%';
            loadingPercentage.textContent = '100%';
            loadingPercentage.style.color = '#4CAF50';
            
            setTimeout(() => {
                loadingPercentage.textContent = '✓ READY!';
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }, 400);
            }, 300);
        }
    }, 4000);
});

// ============================================
// TYPING EFFECT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const checkLoading = setInterval(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen.classList.contains('hidden')) {
            clearInterval(checkLoading);
            startTypingEffect();
        }
    }, 100);
    
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen.classList.contains('hidden')) {
            startTypingEffect();
        }
    }, 5000);
});

function startTypingEffect() {
    const textElement = document.getElementById('typingText');
    
    const texts = [
        'Ready, Set, Yahooo',
        '✨ Ready, Set, Yahooo ✨'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseDelay = 2500;
    const waitBeforeType = 500;
    
    function typeEffect() {
        const currentText = texts[textIndex % texts.length];
        
        if (!isDeleting) {
            if (charIndex < currentText.length) {
                textElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeEffect, typeSpeed);
            } else {
                setTimeout(() => {
                    isDeleting = true;
                    setTimeout(typeEffect, deleteSpeed);
                }, pauseDelay);
            }
        } else {
            if (charIndex > 0) {
                textElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(typeEffect, deleteSpeed);
            } else {
                isDeleting = false;
                textIndex++;
                setTimeout(typeEffect, waitBeforeType);
            }
        }
    }
    
    textElement.textContent = '';
    
    setTimeout(() => {
        typeEffect();
    }, 500);
}
