/**
 * ADVANCED SECURITY MODULE
 * Topal Oğlu Yapı - Client-side Security Layer
 * 
 * Özellikler:
 * - Honeypot (Bot tuzağı)
 * - Rate limiting (Spam koruması)
 * - Agresif XSS filtreleme
 * - Clickjacking koruması
 * - CSRF Token simülasyonu
 * - Input obfuscation
 * - Console uyarıları
 */

(function () {
    'use strict';

    const Security = {
        // Yapılandırma
        config: {
            minSubmitInterval: 10000,     // 10 saniye (spam koruması)
            maxAttempts: 3,               // Maksimum deneme
            lockoutDuration: 300000,      // 5 dakika kilit (300000ms)
            honeypotFieldName: 'website', // Botlar bunu doldurur
            csrfTokenName: '_csrf_token',
        },

        // State
        state: {
            lastSubmitTime: 0,
            attemptCount: 0,
            lockedUntil: 0,
            csrfToken: null
        },

        // Rastgele token üret (CSRF simülasyonu)
        generateToken: () => {
            const array = new Uint8Array(32);
            if (window.crypto && window.crypto.getRandomValues) {
                window.crypto.getRandomValues(array);
            } else {
                // Fallback
                for (let i = 0; i < 32; i++) {
                    array[i] = Math.floor(Math.random() * 256);
                }
            }
            return btoa(String.fromCharCode.apply(null, array));
        },

        // CSRF Token oluştur ve sakla
        initCSRF: () => {
            // Tamamen istemci tarafında güvenli token oluştur
            Security.state.csrfToken = Security.generateToken();
            sessionStorage.setItem(Security.config.csrfTokenName, Security.state.csrfToken);

            // Formlara gizli token ekle
            document.querySelectorAll('form').forEach(form => {
                let tokenInput = form.querySelector(`input[name="${Security.config.csrfTokenName}"]`);
                if (!tokenInput) {
                    tokenInput = document.createElement('input');
                    tokenInput.type = 'hidden';
                    tokenInput.name = Security.config.csrfTokenName;
                    form.appendChild(tokenInput);
                }
                tokenInput.value = Security.state.csrfToken;
            });
        },

        // CSRF Token doğrula
        validateCSRF: (token) => {
            const stored = sessionStorage.getItem(Security.config.csrfTokenName);
            return token === stored && token !== null && token.length > 20;
        },

        // Honeypot (Bot tuzağı) oluştur
        initHoneypot: () => {
            document.querySelectorAll('form').forEach(form => {
                // Eğer zaten varsa ekleme
                if (form.querySelector(`input[name="${Security.config.honeypotFieldName}"]`)) return;

                const honeypot = document.createElement('div');
                honeypot.style.cssText = 'position:absolute;left:-9999px;top:-9999px;opacity:0;pointer-events:none;';
                honeypot.innerHTML = `
          <label for="${Security.config.honeypotFieldName}">Website</label>
          <input type="text" id="${Security.config.honeypotFieldName}" name="${Security.config.honeypotFieldName}" tabindex="-1" autocomplete="off">
        `;
                form.appendChild(honeypot);
            });
        },

        // Honeypot kontrolü (bot mu?)
        checkHoneypot: (formData) => {
            const value = formData.get(Security.config.honeypotFieldName);
            return value === null || value === '';
        },

        // Rate limiting kontrolü
        checkRateLimit: () => {
            const now = Date.now();

            // Kilit kontrolü
            if (Security.state.lockedUntil > now) {
                const remaining = Math.ceil((Security.state.lockedUntil - now) / 1000);
                return { allowed: false, reason: `Çok fazla deneme. Lütfen ${remaining} saniye bekleyin.` };
            }

            // Süre kontrolü
            if (now - Security.state.lastSubmitTime < Security.config.minSubmitInterval) {
                Security.state.attemptCount++;

                if (Security.state.attemptCount >= Security.config.maxAttempts) {
                    Security.state.lockedUntil = now + Security.config.lockoutDuration;
                    return { allowed: false, reason: 'Çok fazla deneme. 5 dakika bekleyin.' };
                }

                const wait = Math.ceil((Security.config.minSubmitInterval - (now - Security.state.lastSubmitTime)) / 1000);
                return { allowed: false, reason: `Lütfen ${wait} saniye bekleyin.` };
            }

            return { allowed: true };
        },

        // Agresif XSS temizleme (Geliştirilmiş)
        sanitize: (input) => {
            if (typeof input !== 'string') return '';

            let clean = input
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;')
                .replace(/&/g, '&amp;')
                // Event handlerları temizle (onclick, onerror, vb.)
                .replace(/on\w+\s*=/gi, 'data-blocked=')
                // javascript: protokolünü engelle
                .replace(/javascript:/gi, 'blocked:')
                // data:text/html engelle
                .replace(/data:text\/html/gi, 'blocked:')
                // Base64 şüpheli içerik
                .replace(/src\s*=\s*["']data:/gi, 'data-blocked=')
                .trim();

            // Çok uzun input engelle
            if (clean.length > 5000) {
                clean = clean.substring(0, 5000);
            }

            return clean;
        },

        // Email validasyonu (Katı)
        isValidEmail: (email) => {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regex.test(email)) return false;

            // Şüpheli domainler
            const suspicious = ['tempmail', '10minutemail', 'guerrillamail', 'throwaway'];
            const domain = email.split('@')[1].toLowerCase();
            return !suspicious.some(s => domain.includes(s));
        },

        // Telefon validasyonu (Türkiye formatı)
        isValidPhone: (phone) => {
            const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
            // 10-13 hane, sadece rakam
            return /^[0-9]{10,13}$/.test(cleaned);
        },

        // Clickjacking koruması (Frame içinde açılırsa uyarı)
        initClickjackProtection: () => {
            if (window.self !== window.top) {
                // Site frame içinde açılmış
                console.warn('Güvenlik Uyarısı: Bu site frame içinde açıldı.');
                // İsteğe bağlı: top.location = self.location;
            }
        },

        // Konsol uyarısı (Developer Tools açılırsa)
        initConsoleWarning: () => {
            const warning = `
╔════════════════════════════════════════════════════════════╗
║  GÜVENLİK UYARISI                                          ║
║  Bu tarayıcı konsolu yalnızca geliştiriciler içindir.    ║
║  Buraya yapıştırdığınız herhangi bir kod hesabınızı       ║
║  tehlikeye atabilir.                                       ║
╚════════════════════════════════════════════════════════════╝
      `;

            console.log('%c' + warning, 'color: #e67e22; font-size: 14px; font-weight: bold;');

            // Object.defineProperty ile console temizliğini zorla
            setInterval(() => {
                console.clear();
                console.log('%c' + warning, 'color: #e67e22; font-size: 14px; font-weight: bold;');
            }, 60000); // Her 1 dakika
        },

        // Form güvenliği başlat
        initFormSecurity: () => {
            document.querySelectorAll('form').forEach(form => {
                form.addEventListener('submit', (e) => {
                    // AJAX ile yönetilen formları atla (validation.js bu formları kendi yönetir)
                    if (form.id === 'contactForm') {
                        return;
                    }

                    const formData = new FormData(form);

                    // 1. Honeypot kontrolü
                    if (!Security.checkHoneypot(formData)) {
                        e.preventDefault();
                        console.warn('Bot tespit edildi! Form engellendi.');
                        alert('Güvenlik kontrolü başarısız. Lütfen tarayıcınızı yenileyin.');
                        return false;
                    }

                    // 2. Rate limit kontrolü
                    const rateCheck = Security.checkRateLimit();
                    if (!rateCheck.allowed) {
                        e.preventDefault();
                        alert(rateCheck.reason);
                        return false;
                    }

                    // 3. CSRF kontrolü
                    const csrfToken = formData.get(Security.config.csrfTokenName);
                    if (!Security.validateCSRF(csrfToken)) {
                        e.preventDefault();
                        alert('Güvenlik tokeni geçersiz. Sayfayı yenileyin.');
                        return false;
                    }

                    // 4. Input sanitization
                    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
                    inputs.forEach(input => {
                        if (input.value) {
                            input.value = Security.sanitize(input.value);
                        }
                    });

                    // Başarılı gönderim
                    Security.state.lastSubmitTime = Date.now();
                    Security.state.attemptCount = 0;

                    // Token yenile
                    Security.initCSRF();
                });
            });
        },

        // Genel başlatma
        init: () => {
            Security.initCSRF();
            Security.initHoneypot();
            Security.initClickjackProtection();
            Security.initFormSecurity();

            // Console uyarısı sadece production'da
            if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
                Security.initConsoleWarning();
            }
        }
    };

    // DOM hazır olduğunda başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', Security.init);
    } else {
        Security.init();
    }

    // Global erişim (diğer scriptler için)
    window.SiteSecurity = Security;
})();