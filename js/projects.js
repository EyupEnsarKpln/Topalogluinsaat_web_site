/**
 * DYNAMIC PORTFOLIO MANAGEMENT (CMS-Ready)
 * Topaloğlu Yapı - Dynamically load projects from JSON & Lightbox Gallery
 */

document.addEventListener('DOMContentLoaded', async () => {
    const projectsGrid = document.getElementById('projectsGrid');
    const homeProjectsGrid = document.getElementById('homeProjectsGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // 1. Geliştirici & Çevrimdışı Modu için Yedek Proje Listesi
    const fallbackProjects = [
        {
            category: "restorasyon",
            tag: "Restorasyon",
            title: "Tarihi Konak Restorasyonu",
            desc: "Ortaköy, İstanbul / 2024",
            image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            details: "120 yıllık tarihi konağın rölöve ve restorasyon projesi kapsamında, tüm taşıyıcı ahşap karkas yapısı yenilenmiş, dış cephe kaplamaları orijinaline sadık kalınarak el işçiliği ile aslına uygun restore edilmiştir.",
            media: [
                {
                    type: "image",
                    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    caption: "Konağın aslına uygun olarak restore edilen ana cephesi."
                },
                {
                    type: "image",
                    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    caption: "Dış cephedeki ahşap oymacılık ve el işçiliği detayları."
                },
                {
                    type: "video",
                    url: "https://www.w3schools.com/html/mov_bbb.mp4",
                    caption: "Dış cephe kaplama işçiliği ve bitiş aşaması."
                }
            ]
        },
        {
            category: "demirdokum",
            tag: "Demir Döküm",
            title: "Özel Tasarım Döküm Giriş Kapısı",
            desc: "Tarabya, İstanbul / 2024",
            image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            details: "Müşterimizin özel talebi üzerine tasarlanan, yüksek dayanıklılığa sahip pik döküm villa giriş kapısı projesi. Kapının tüm motifleri el oyması modellerle hazırlanıp, dökümhanemizde tek parça halinde dökülmüştür.",
            media: [
                {
                    type: "image",
                    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    caption: "Pik döküm tekniğiyle üretilen villanın ana giriş kapısı."
                },
                {
                    type: "video",
                    url: "https://www.w3schools.com/html/movie.mp4",
                    caption: "Atölyemizde gerçekleştirilen döküm ve temizleme aşaması."
                }
            ]
        },
        {
            category: "tadilat",
            tag: "Tadilat",
            title: "Lüks Villa Komple Tadilatı",
            desc: "Çeşme, İzmir / 2023",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            details: "Çeşme'de yer alan özel villanın iç ve dış mekanlarının anahtar teslim komple renovasyonu. Projede sıhhi ve elektrik tesisatları yenilenmiş, modern iç mimari detaylarla yaşam alanları genişletilmiştir.",
            media: [
                {
                    type: "image",
                    url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    caption: "Modern tarzda yenilenen salon ve mutfak entegrasyonu."
                },
                {
                    type: "image",
                    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    caption: "Havuzbaşı dış mekan peyzaj ve mermer döşeme uygulamaları."
                }
            ]
        },
        {
            category: "restorasyon",
            tag: "Restorasyon",
            title: "Tescilli Yalı Yenileme",
            desc: "Beyoğlu, İstanbul / 2023",
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            details: "İstanbul Boğazı kıyısında yer alan tescilli yalının temel güçlendirme ve rölöve restorasyon uygulaması. Yapının zemin enjeksiyonları yapılmış ve orijinal dış ahşap süslemeleri aslına uygun olarak restore edilmiştir.",
            media: [
                {
                    type: "image",
                    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    caption: "Yalının boğaz cephesi restorasyon sonrası görünümü."
                }
            ]
        },
        {
            category: "demirdokum",
            tag: "Demir Döküm",
            title: "El İşçiliği Ferforje Korkuluk",
            desc: "Bebek, İstanbul / 2023",
            image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            details: "Özel bir rezidansın iç mekan dairesel merdiveni için tasarlanıp imal edilen döküm pirinç ve ferforje korkuluk çalışması. Motifler tamamen elde şekillendirilmiş olup, antik patine eskitme boya ile tamamlanmıştır.",
            media: [
                {
                    type: "image",
                    url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    caption: "Dairesel merdiven üstüne monte edilen ferforje korkuluk."
                }
            ]
        },
        {
            category: "tadilat",
            tag: "Tadilat",
            title: "Tarihi Taş Ev Renovasyonu",
            desc: "Alaçatı, İzmir / 2022",
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            details: "Alaçatı'nın geleneksel taş mimarisini koruyarak gerçekleştirdiğimiz yenileme çalışması. Yıkılmaya yüz tutmuş taş duvarlar yerel taşlarla örülmüş ve ahşap tavan kirişleri güçlendirilmiştir.",
            media: [
                {
                    type: "image",
                    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
                    caption: "Alaçatı taş işçiliği ve veranda restorasyonu."
                }
            ]
        }
    ];

    let projects = fallbackProjects;

    // 2. data/projects.json Verilerini Yükle
    try {
        const response = await fetch('data/projects.json');
        if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data.projects)) {
                projects = data.projects;
            }
        }
    } catch (err) {
        console.warn('data/projects.json dosyası yüklenemedi. Yedek liste kullanılıyor:', err);
    }

    // 3. Projeler Sayfasını Yükle (varsa)
    if (projectsGrid) {
        projectsGrid.innerHTML = '';
        projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card reveal';
            card.dataset.category = project.category;
            card.dataset.index = index;
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            card.style.transition = 'all 0.4s ease';

            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <span class="project-tag">${project.tag}</span>
                    <h3>${project.title}</h3>
                    <p>${project.desc}</p>
                </div>
            `;
            
            // Tıklama olayı ile Lightbox'ı aç
            card.addEventListener('click', () => {
                openProjectLightbox(project);
            });

            projectsGrid.appendChild(card);
        });

        // Giriş animasyonları
        setTimeout(() => {
            const cards = projectsGrid.querySelectorAll('.project-card');
            cards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            });
        }, 100);
    }

    // 4. Ana Sayfa "Öne Çıkan Projeler" Gridini Yükle
    if (homeProjectsGrid) {
        homeProjectsGrid.innerHTML = '';
        const featuredProjects = projects.slice(0, 3);
        
        featuredProjects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card reveal';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            card.style.transition = 'all 0.4s ease';

            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <span class="project-tag">${project.tag}</span>
                    <h3>${project.title}</h3>
                    <p>${project.desc}</p>
                </div>
            `;

            // Tıklama olayı ile Lightbox'ı aç
            card.addEventListener('click', () => {
                openProjectLightbox(project);
            });

            homeProjectsGrid.appendChild(card);
        });

        setTimeout(() => {
            const cards = homeProjectsGrid.querySelectorAll('.project-card');
            cards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            });
        }, 100);
    }

    // 5. Kategori Filtreleme Mantığı
    if (projectsGrid && filterButtons.length > 0) {
        const projectCards = projectsGrid.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.dataset.filter;

                projectCards.forEach(card => {
                    const category = card.dataset.category;

                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ============================================
    // LIGHTBOX GALLERY / MODAL MANTIĞI
    // ============================================
    let activeMediaIndex = 0;
    let activeMediaList = [];

    // Modal DOM yapısını hazırla
    function initLightboxDOM() {
        if (document.getElementById('projectModal')) return;

        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.id = 'projectModal';
        modal.innerHTML = `
            <div class="project-modal-backdrop"></div>
            <div class="project-modal-content">
                <button class="project-modal-close" aria-label="Kapat"><i class="fas fa-times"></i></button>
                
                <div class="project-modal-grid">
                    <!-- Sol/Üst Medya Görüntüleme -->
                    <div class="project-modal-media-side">
                        <div class="project-modal-active-media" id="modalActiveMedia"></div>
                        <button class="modal-nav-btn prev-btn" id="modalPrevBtn" aria-label="Önceki"><i class="fas fa-chevron-left"></i></button>
                        <button class="modal-nav-btn next-btn" id="modalNextBtn" aria-label="Sonraki"><i class="fas fa-chevron-right"></i></button>
                    </div>
                    
                    <!-- Sağ/Alt Detaylar -->
                    <div class="project-modal-details-side">
                        <div class="project-modal-header">
                            <span class="project-tag" id="modalProjectTag"></span>
                            <h2 id="modalProjectTitle"></h2>
                            <p class="project-desc" id="modalProjectDesc"></p>
                        </div>
                        
                        <div class="project-modal-body">
                            <h3>Proje Detayları</h3>
                            <p id="modalProjectDetails"></p>
                        </div>
                        
                        <div class="project-modal-thumbnails-wrapper" id="modalThumbnailsWrapper">
                            <h3>Proje Albümü</h3>
                            <div class="project-modal-thumbnails" id="modalThumbnails"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Kapatma Olayları
        const closeBtn = modal.querySelector('.project-modal-close');
        const backdrop = modal.querySelector('.project-modal-backdrop');
        
        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);

        // Gezinme Olayları
        document.getElementById('modalPrevBtn').addEventListener('click', navigatePrev);
        document.getElementById('modalNextBtn').addEventListener('click', navigateNext);

        // Klavye Kontrolleri
        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'ArrowRight') navigateNext();
            else if (e.key === 'ArrowLeft') navigatePrev();
            else if (e.key === 'Escape') closeLightbox();
        });
    }

    // Projeyi Aç
    function openProjectLightbox(project) {
        initLightboxDOM();
        const modal = document.getElementById('projectModal');
        
        // Detayları doldur
        document.getElementById('modalProjectTag').textContent = project.tag;
        document.getElementById('modalProjectTitle').textContent = project.title;
        document.getElementById('modalProjectDesc').textContent = project.desc;
        document.getElementById('modalProjectDetails').textContent = project.details || "Bu proje için detaylı açıklama henüz girilmedi.";

        // Albüm Medyalarını Ayarla
        activeMediaList = project.media && project.media.length > 0 
            ? project.media 
            : [{ type: 'image', url: project.image, caption: project.title }];
            
        activeMediaIndex = 0;

        // Thumbnails listesini doldur
        const thumbsContainer = document.getElementById('modalThumbnails');
        thumbsContainer.innerHTML = '';

        if (activeMediaList.length <= 1) {
            document.getElementById('modalThumbnailsWrapper').style.display = 'none';
            document.getElementById('modalPrevBtn').style.display = 'none';
            document.getElementById('modalNextBtn').style.display = 'none';
        } else {
            document.getElementById('modalThumbnailsWrapper').style.display = 'block';
            document.getElementById('modalPrevBtn').style.display = 'flex';
            document.getElementById('modalNextBtn').style.display = 'flex';

            activeMediaList.forEach((media, idx) => {
                const thumb = document.createElement('div');
                thumb.className = `modal-thumb ${idx === 0 ? 'active' : ''}`;
                
                // Thumbnail için görsel
                let imgUrl = media.type === 'image' ? media.url : project.image;
                thumb.innerHTML = `<img src="${imgUrl}" alt="Thumbnail ${idx}">`;

                // Eğer video ise simge ekle
                if (media.type === 'video') {
                    thumb.innerHTML += `<div class="modal-thumb-video-icon"><i class="fas fa-play-circle"></i></div>`;
                }

                thumb.addEventListener('click', () => {
                    setActiveMedia(idx);
                });
                thumbsContainer.appendChild(thumb);
            });
        }

        // Aktif Medyayı Göster — CSS zaten display:flex, sadece active class ekle
        requestAnimationFrame(() => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            setActiveMedia(0);
        });
    }

    // ─── URL'den Platform Otomatik Algılama ───────────────────────────────────
    function detectPlatform(url) {
        if (!url) return 'image';
        const u = url.toLowerCase();
        if (u.includes('youtube.com/shorts/'))                    return 'youtube-shorts';
        if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
        if (u.includes('instagram.com'))                          return 'instagram';
        if (u.includes('vimeo.com'))                              return 'vimeo';
        if (u.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i))            return 'video';
        return 'image'; // imgbb, unsplash ve diğer resim URL'leri
    }

    function buildEmbedElement(url, platform) {
        const iframe = document.createElement('iframe');
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        if (platform === 'youtube' || platform === 'youtube-shorts') {
            let videoId = '';
            if (platform === 'youtube-shorts') {
                const m = url.match(/shorts\/([^?&#]+)/);
                if (m) videoId = m[1];
            } else {
                const m = url.match(/(?:youtu\.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]{11})/);
                if (m) videoId = m[1];
            }
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`;

        } else if (platform === 'instagram') {
            // instagram.com/p/CODE veya /reel/CODE formatı
            const m = url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?#&]+)/);
            const code = m ? m[1] : '';
            iframe.src = `https://www.instagram.com/p/${code}/embed/captioned/`;
            iframe.allow = '';  // Instagram iframe için farklı
            iframe.setAttribute('scrolling', 'no');

        } else if (platform === 'vimeo') {
            const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
            const videoId = m ? m[1] : '';
            iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&color=FF6B00`;
        }

        return iframe;
    }

    // Aktif Medyayı Güncelle
    function setActiveMedia(index) {
        activeMediaIndex = index;
        const container = document.getElementById('modalActiveMedia');

        // Önceki medyayı temizle
        const prevVideo = container.querySelector('video');
        if (prevVideo) prevVideo.pause();
        const prevIframe = container.querySelector('iframe');
        if (prevIframe) prevIframe.src = ''; // oynatmayı durdur

        // Yumuşak geçiş
        container.classList.add('fade-out');

        setTimeout(() => {
            container.innerHTML = '';
            const mediaItem = activeMediaList[index];
            const url = mediaItem.url || '';

            // URL'den platformu otomatik algıla (type alanını da fallback olarak kullan)
            const platform = detectPlatform(url) !== 'image'
                ? detectPlatform(url)
                : (mediaItem.type === 'video' ? 'video' : 'image');

            if (platform === 'image') {
                const img = document.createElement('img');
                img.src = url;
                img.alt = mediaItem.caption || 'Proje Görseli';
                img.style.willChange = 'transform, opacity';
                container.appendChild(img);

            } else if (platform === 'video') {
                // Direkt video dosyası (.mp4 vb.)
                const video = document.createElement('video');
                video.src = url;
                video.controls = true;
                video.autoplay = true;
                video.playsInline = true;
                video.style.willChange = 'transform, opacity';
                video.style.maxWidth = '100%';
                video.style.maxHeight = '100%';
                container.appendChild(video);

            } else {
                // YouTube / YouTube Shorts / Instagram / Vimeo
                const iframe = buildEmbedElement(url, platform);
                container.appendChild(iframe);
            }

            // Altyazı güncelle
            let captionEl = document.getElementById('modalMediaCaption');
            if (!captionEl) {
                captionEl = document.createElement('div');
                captionEl.id = 'modalMediaCaption';
                captionEl.className = 'project-modal-caption';
                document.getElementById('modalProjectDetails').insertAdjacentElement('afterend', captionEl);
            }
            if (mediaItem.caption) {
                captionEl.textContent = mediaItem.caption;
                captionEl.style.display = 'block';
            } else {
                captionEl.style.display = 'none';
            }

            // Thumbnail aktifliğini güncelle
            document.querySelectorAll('.modal-thumb').forEach((thumb, idx) => {
                if (idx === index) {
                    thumb.classList.add('active');
                    thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } else {
                    thumb.classList.remove('active');
                }
            });

            container.classList.remove('fade-out');
        }, 200);
    }

    // Sonraki Medyaya Geç
    function navigateNext() {
        if (activeMediaList.length <= 1) return;
        const nextIdx = (activeMediaIndex + 1) % activeMediaList.length;
        setActiveMedia(nextIdx);
    }

    // Önceki Medyaya Geç
    function navigatePrev() {
        if (activeMediaList.length <= 1) return;
        const prevIdx = (activeMediaIndex - 1 + activeMediaList.length) % activeMediaList.length;
        setActiveMedia(prevIdx);
    }

    // Lightbox Kapat
    function closeLightbox() {
        const modal = document.getElementById('projectModal');
        if (!modal) return;

        // Video oynatılıyorsa durdur
        const container = document.getElementById('modalActiveMedia');
        const video = container.querySelector('video');
        if (video) video.pause();
        const iframe = container.querySelector('iframe');
        if (iframe) iframe.src = '';

        modal.classList.remove('active');
        document.body.style.overflow = '';

        // İçeriği animasyon bittikten sonra temizle
        setTimeout(() => {
            container.innerHTML = '';
        }, 350);
    }
});