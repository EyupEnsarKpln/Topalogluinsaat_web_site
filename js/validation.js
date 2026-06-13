// WEB3FORMS YAPILANDIRMASI
// Canlı e-posta almak için https://web3forms.com/ adresinden ücretsiz bir access key alıp buraya yazın.
const WEB3FORMS_ACCESS_KEY = "07f3b776-30dd-480d-8c26-2375d00ef64b";

const FormValidator = {
    sanitize: (input) => {
        if (typeof input !== 'string') return '';
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;')
            .replace(/&/g, '&amp;')
            .replace(/on\w+\s*=/gi, 'data-blocked=')
            .replace(/javascript:/gi, 'blocked:')
            .replace(/data:text\/html/gi, 'blocked:')
            .replace(/src\s*=\s*["']data:/gi, 'data-blocked=')
            .trim()
            .substring(0, 5000);
    },

    isValidEmail: (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) return false;
        const suspicious = ['tempmail', '10minutemail', 'guerrillamail', 'throwaway'];
        const domain = email.split('@')[1].toLowerCase();
        return !suspicious.some(s => domain.includes(s));
    },

    isValidPhone: (phone) => {
        const cleaned = phone.replace(/[\s\-\+\(\)]/g, '');
        return /^[0-9]{10,13}$/.test(cleaned);
    },

    showError: (input, message) => {
        const formGroup = input.closest('.form-group');
        const errorEl = formGroup.querySelector('.error-message');
        input.classList.add('error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    },

    clearError: (input) => {
        const formGroup = input.closest('.form-group');
        const errorEl = formGroup.querySelector('.error-message');
        input.classList.remove('error');
        if (errorEl) {
            errorEl.classList.remove('show');
        }
    },

    validate: (formData) => {
        const errors = {};
        const data = {};

        const name = FormValidator.sanitize(formData.get('name') || '');
        if (name.length < 2 || name.length > 100) {
            errors.name = 'Ad soyad 2-100 karakter arasında olmalıdır.';
        } else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(name)) {
            errors.name = 'Ad soyad sadece harf içerebilir.';
        }
        data.name = name;

        const email = FormValidator.sanitize(formData.get('email') || '');
        if (!email) {
            errors.email = 'E-posta adresi zorunludur.';
        } else if (!FormValidator.isValidEmail(email)) {
            errors.email = 'Geçerli bir e-posta adresi girin.';
        }
        data.email = email;

        const phone = FormValidator.sanitize(formData.get('phone') || '');
        if (phone && !FormValidator.isValidPhone(phone)) {
            errors.phone = 'Geçerli bir telefon numarası girin.';
        }
        data.phone = phone;

        const subject = FormValidator.sanitize(formData.get('subject') || '');
        if (subject.length > 200) {
            errors.subject = 'Konu 200 karakterden kısa olmalıdır.';
        }
        data.subject = subject;

        const message = FormValidator.sanitize(formData.get('message') || '');
        if (message.length < 10) {
            errors.message = 'Mesaj en az 10 karakter olmalıdır.';
        } else if (message.length > 2000) {
            errors.message = 'Mesaj 2000 karakterden kısa olmalıdır.';
        }
        data.message = message;

        return { valid: Object.keys(errors).length === 0, errors, data };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
                FormValidator.clearError(input);
            });

            const formData = new FormData(contactForm);

            // 1. Client-side security checks
            if (window.SiteSecurity) {
                if (!window.SiteSecurity.checkHoneypot(formData)) {
                    console.warn('Bot detected by honeypot!');
                    alert('Güvenlik kontrolü başarısız. Lütfen sayfayı yenileyip tekrar deneyin.');
                    return;
                }

                const rateCheck = window.SiteSecurity.checkRateLimit();
                if (!rateCheck.allowed) {
                    alert(rateCheck.reason);
                    return;
                }

                const csrfToken = formData.get(window.SiteSecurity.config.csrfTokenName);
                if (!window.SiteSecurity.validateCSRF(csrfToken)) {
                    alert('Güvenlik tokeni geçersiz. Lütfen sayfayı yenileyip tekrar deneyin.');
                    return;
                }
            }

            // 2. Client-side format validation
            const validation = FormValidator.validate(formData);

            if (!validation.valid) {
                Object.keys(validation.errors).forEach(field => {
                    const input = contactForm.querySelector(`[name="${field}"]`);
                    if (input) {
                        FormValidator.showError(input, validation.errors[field]);
                    }
                });

                const firstError = contactForm.querySelector('.error');
                if (firstError) firstError.focus();
                return;
            }

            // 2.5 hCaptcha Doğrulaması (Canlı moddaysak)
            const isLiveMode = WEB3FORMS_ACCESS_KEY !== "YOUR_WEB3FORMS_ACCESS_KEY_HERE" && !!WEB3FORMS_ACCESS_KEY;
            const hCaptchaResponse = formData.get('h-captcha-response') || (typeof hcaptcha !== 'undefined' ? hcaptcha.getResponse() : '');
            
            if (isLiveMode && !hCaptchaResponse) {
                alert('Lütfen güvenlik kontrolünü (robot olmadığınızı doğrulayın) tamamlayın.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';

            // Verileri al
            const nameVal = formData.get('name');
            const emailVal = formData.get('email');
            const phoneVal = formData.get('phone') || 'Belirtilmedi';
            const subjectVal = formData.get('subject') || 'Yeni İletişim Formu Mesajı';
            const messageVal = formData.get('message');

            try {
                // Eğer key varsayılan olarak bırakıldıysa, geliştirici test modunda simüle et ve localStorage'a kaydet
                if (!isLiveMode) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Simüle edilmiş gecikme

                    const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
                    submissions.push({
                        date: new Date().toLocaleString('tr-TR'),
                        name: nameVal,
                        email: emailVal,
                        phone: phoneVal,
                        subject: subjectVal,
                        message: messageVal
                    });
                    localStorage.setItem('contact_submissions', JSON.stringify(submissions));

                    console.log('--- FORM GÖNDERİMİ (GELİŞTİRİCİ MODU) ---');
                    console.log('Ad Soyad:', nameVal);
                    console.log('E-posta:', emailVal);
                    console.log('Telefon:', phoneVal);
                    console.log('Konu:', subjectVal);
                    console.log('Mesaj:', messageVal);
                    console.log('-----------------------------------------');

                    contactForm.reset();
                    alert('GELİŞTİRİCİ TEST MODU:\nMesajınız tarayıcı hafızasına (localStorage) başarıyla kaydedildi!\n\nCanlı e-posta alabilmek için lütfen "js/validation.js" dosyasındaki WEB3FORMS_ACCESS_KEY değerini güncelleyin.');

                    if (window.SiteSecurity) {
                        window.SiteSecurity.state.lastSubmitTime = Date.now();
                        window.SiteSecurity.state.attemptCount = 0;
                    }
                    return;
                }

                // 3. Web3Forms API'sine AJAX post
                const payload = {
                    access_key: WEB3FORMS_ACCESS_KEY,
                    name: nameVal,
                    email: emailVal,
                    phone: phoneVal,
                    subject: `[Topaloğlu Yapı İletişim] ${subjectVal}`,
                    message: messageVal,
                    from_name: "Topaloğlu Yapı Web Sitesi",
                    "h-captcha-response": hCaptchaResponse
                };

                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                let result;
                try {
                    result = await response.json();
                } catch (err) {
                    throw new Error('E-posta servisinden geçersiz yanıt alındı.');
                }

                if (response.ok && result.success) {
                    contactForm.reset();
                    alert('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız!');

                    // Update client-side security states
                    if (window.SiteSecurity) {
                        window.SiteSecurity.state.lastSubmitTime = Date.now();
                        window.SiteSecurity.state.attemptCount = 0;
                    }
                } else {
                    alert(result.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert(error.message || 'Bir bağlantı hatası oluştu. Lütfen daha sonra tekrar deneyin.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                // Reset hCaptcha
                if (typeof hcaptcha !== 'undefined') {
                    hcaptcha.reset();
                }

                // 4. Refresh CSRF token for the next submission
                if (window.SiteSecurity && typeof window.SiteSecurity.initCSRF === 'function') {
                    window.SiteSecurity.initCSRF();
                }
            }
        });

        contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.addEventListener('blur', () => {
                FormValidator.clearError(input);
                const formData = new FormData(contactForm);
                const validation = FormValidator.validate(formData);
                if (validation.errors[input.name]) {
                    FormValidator.showError(input, validation.errors[input.name]);
                }
            });
        });
    }
});