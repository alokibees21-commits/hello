/**
 * CENTURYPLY NEXT-GEN ADVANCED CATALOG (V4)
 * Featuring: Animations, Multimedia, Forms, and Advanced Navigation
 */
class FlipBookAdvanced {
    constructor() {
        this.book = document.getElementById('book');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pdfBtn = document.getElementById('pdfBtn');
        this.searchBtn = document.getElementById('searchBtn');
        this.cartBtn = document.getElementById('cartBtn');
        this.closeCart = document.getElementById('closeCart');
        this.cartDrawer = document.getElementById('cartDrawer');
        this.currNum = document.getElementById('currNum');
        this.totalNum = document.getElementById('totalNum');
        this.thumbRail = document.getElementById('thumbRail');
        this.audio = document.getElementById('ambientAudio');

        this.currentPage = 0;
        this.pages = [];
        this.products = [];
        this.cart = JSON.parse(localStorage.getItem('cp_cart')) || [];
        this.isMusicOn = false;

        this.init();
    }

    async init() {
        try {
            const r = await fetch('products.json');
            this.products = await r.json();
            this.render();
            this.setupEvents();
            this.updateCartUI();
            this.renderThumbnails();
            this.totalNum.innerText = this.pages.length;
        } catch (e) { console.error("Initialization Error:", e); }
    }

    render() {
        this.book.innerHTML = '';
        let sheetIdx = 1;

        // Spread 0: Cover Sheet (Page 1) | Collage 1 (Page 2)
        const group1 = this.products.slice(0, 4);
        const name1 = this.getCollectionName(0);
        this.addSheet(this.createCoverHTML(), this.createGrandeCollage(group1, name1, "LEFT", 0), sheetIdx++);

        // Intermediate Spreads: Details X (Page 3, 5, ...) | Collage X+1 (Page 4, 6, ...)
        for (let i = 0; i < 40; i += 4) { // 10 more sheets * 4 = 40 products
            const currentGroup = this.products.slice(i, i + 4);
            const currentName = this.getCollectionName(i);
            const nextGroup = this.products.slice(i + 4, i + 8);
            const nextName = this.getCollectionName(i + 4);

            const collIdx = i / 4;
            const frontDetails = this.createGrandeDetails(currentGroup, currentName, collIdx);

            let backContent;
            if (sheetIdx < 11) {
                backContent = this.createGrandeCollage(nextGroup, nextName, "LEFT", collIdx + 1);
            } else {
                backContent = this.createTOC_HTML();
            }

            this.addSheet(frontDetails, backContent, sheetIdx++);
            if (sheetIdx > 11) break;
        }

        // Final TOC page (if not added yet)
        if (this.products.length % 4 !== 0) {
            // Already added in loop above
        }

        this.pages = Array.from(this.book.querySelectorAll('.page'));
        this.updateState();
    }

    addSheet(frontHTML, backHTML, pageNum) {
        const p = document.createElement('div');
        p.className = 'page';
        p.innerHTML = `
            <div class="page-front">
                <div class="page-logo"><img src="images/logo.png" alt="CenturyPly"></div>
                ${frontHTML}
                <div class="page-number">P. ${pageNum * 2}</div>
            </div>
            <div class="page-back">
                <div class="page-logo"><img src="images/logo.png" alt="CenturyPly"></div>
                ${backHTML}
                <div class="page-number">P. ${pageNum * 2 - 1}</div>
            </div>`;
        this.book.appendChild(p);
    }

    getCollectionName(index) {
        const names = [
            "BOULEVARD MANSION", "BAYSIDE BUNGALOW", "CLUB CLASSICO",
            "URBAN GRANDEUR", "NATURE'S WHISPER", "MODERNIST RETREAT",
            "ROYAL HERITAGE", "COASTAL BREEZE", "GRAPHITE STUDIOS",
            "SILK ROAD", "VELVET HORIZON", "MARBLE EMPIRE",
            "FOREST REVERIE", "METRO VIBE", "SAHARA GOLD",
            "NORDIC LIGHT", "OAK VALLEY", "WALNUT CANYON",
            "IVORY TOWERS", "AZURE GLOSS", "CRIMSON PEAK"
        ];
        return names[Math.floor(index / 4)] || "SIGNATURE SERIES";
    }

    createGrandeCollage(prods, name, side, collectionIdx) {
        // Choose variant based on collection index (0-10)
        const variant = (collectionIdx % 11) + 1;

        let gridHTML = '';

        if (variant === 1) {
            gridHTML = `
            <div class="collage-variant-1">
                ${prods[0] ? `<div class="shape-box item-0"><img src="${prods[0].image}"><div class="shape-label"><span>${prods[0].name}</span>${prods[0].sku}</div></div>` : ''}
                ${prods[1] ? `<div class="shape-box item-1"><img src="${prods[1].image}"><div class="shape-label"><span>${prods[1].name}</span>${prods[1].sku}</div></div>` : ''}
            </div>`;
        } else if (variant === 2) {
            gridHTML = `
            <div class="collage-variant-2">
                ${prods[0] ? `<div class="shape-box item-0"><img src="${prods[0].image}"><div class="shape-label"><span>${prods[0].name}</span>${prods[0].sku}</div></div>` : ''}
                ${prods[1] ? `<div class="shape-box item-1"><img src="${prods[1].image}"><div class="shape-label"><span>${prods[1].name}</span>${prods[1].sku}</div></div>` : ''}
                ${prods[2] ? `<div class="shape-box item-2"><img src="${prods[2].image}"><div class="shape-label"><span>${prods[2].name}</span>${prods[2].sku}</div></div>` : ''}
                ${prods[3] ? `<div class="shape-box item-3"><img src="${prods[3].image}"><div class="shape-label"><span>${prods[3].name}</span>${prods[3].sku}</div></div>` : ''}
            </div>`;
        } else if (variant === 3) {
            gridHTML = `
            <div class="collage-variant-3">
                ${prods[0] ? `<div class="shape-box item-0"><img src="${prods[0].image}"><div class="shape-label"><span>${prods[0].name}</span>${prods[0].sku}</div></div>` : ''}
                ${prods[1] ? `<div class="shape-box item-1"><img src="${prods[1].image}"><div class="shape-label"><span>${prods[1].name}</span>${prods[1].sku}</div></div>` : ''}
                ${prods[2] ? `<div class="shape-box item-2"><img src="${prods[2].image}"><div class="shape-label"><span>${prods[2].name}</span>${prods[2].sku}</div></div>` : ''}
            </div>`;
        } else if (variant === 4) {
            gridHTML = `
            <div class="collage-variant-4">
                ${prods[0] ? `<div class="shape-box item-0"><img src="${prods[0].image}"><div class="shape-label"><span>${prods[0].name}</span>${prods[0].sku}</div></div>` : ''}
                ${prods[1] ? `<div class="shape-box item-1"><img src="${prods[1].image}"><div class="shape-label"><span>${prods[1].name}</span>${prods[1].sku}</div></div>` : ''}
                ${prods[2] ? `<div class="shape-box item-2"><img src="${prods[2].image}"><div class="shape-label"><span>${prods[2].name}</span>${prods[2].sku}</div></div>` : ''}
            </div>`;
        } else if (variant === 5) {
            gridHTML = `
            <div class="collage-variant-5">
                ${prods[0] ? `<div class="shape-box item-0"><img src="${prods[0].image}"><div class="shape-label"><span>${prods[0].name}</span>${prods[0].sku}</div></div>` : ''}
                ${prods[1] ? `<div class="shape-box item-1"><img src="${prods[1].image}"><div class="shape-label"><span>${prods[1].name}</span>${prods[1].sku}</div></div>` : ''}
                ${prods[2] ? `<div class="shape-box item-2"><img src="${prods[2].image}"><div class="shape-label"><span>${prods[2].name}</span>${prods[2].sku}</div></div>` : ''}
                ${prods[3] ? `<div class="shape-box item-3"><img src="${prods[3].image}"><div class="shape-label"><span>${prods[3].name}</span>${prods[3].sku}</div></div>` : ''}
            </div>`;
        } else if (variant === 6) {
            gridHTML = `
            <div class="collage-variant-6">
                ${prods[0] ? `<div class="shape-box item-0"><img src="${prods[0].image}"><div class="shape-label"><span>${prods[0].name}</span>${prods[0].sku}</div></div>` : ''}
                ${prods[1] ? `<div class="shape-box item-1"><img src="${prods[1].image}"><div class="shape-label"><span>${prods[1].name}</span>${prods[1].sku}</div></div>` : ''}
                ${prods[2] ? `<div class="shape-box item-2"><img src="${prods[2].image}"><div class="shape-label"><span>${prods[2].name}</span>${prods[2].sku}</div></div>` : ''}
            </div>`;
        } else if (variant === 7) {
            gridHTML = `
            <div class="collage-variant-7">
                ${prods[0] ? `<div class="shape-box item-0"><img src="${prods[0].image}"><div class="shape-label"><span>${prods[0].name}</span>${prods[0].sku}</div></div>` : ''}
                ${prods[1] ? `<div class="shape-box item-1"><img src="${prods[1].image}"><div class="shape-label"><span>${prods[1].name}</span>${prods[1].sku}</div></div>` : ''}
                ${prods[2] ? `<div class="shape-box item-2"><img src="${prods[2].image}"><div class="shape-label"><span>${prods[2].name}</span>${prods[2].sku}</div></div>` : ''}
            </div>`;
        } else if (variant === 8) {
            gridHTML = `
            <div class="collage-variant-8">
                ${prods[0] ? `<div class="shape-box item-0"><img src="${prods[0].image}"><div class="shape-label"><span>${prods[0].name}</span>${prods[0].sku}</div></div>` : ''}
                ${prods[1] ? `<div class="shape-box item-1"><img src="${prods[1].image}"><div class="shape-label"><span>${prods[1].name}</span>${prods[1].sku}</div></div>` : ''}
                ${prods[2] ? `<div class="shape-box item-2"><img src="${prods[2].image}"><div class="shape-label"><span>${prods[2].name}</span>${prods[2].sku}</div></div>` : ''}
                ${prods[3] ? `<div class="shape-box item-3"><img src="${prods[3].image}"><div class="shape-label"><span>${prods[3].name}</span>${prods[3].sku}</div></div>` : ''}
            </div>`;
        } else if (variant === 9) {
            gridHTML = `
            <div class="collage-variant-9">
                ${prods[0] ? `<div class="shape-box item-0"><img src="${prods[0].image}"><div class="shape-label"><span>${prods[0].name}</span>${prods[0].sku}</div></div>` : ''}
                ${prods[1] ? `<div class="shape-box item-1"><img src="${prods[1].image}"><div class="shape-label"><span>${prods[1].name}</span>${prods[1].sku}</div></div>` : ''}
            </div>`;
        } else if (variant === 10) {
            gridHTML = `
            <div class="collage-variant-10">
                ${prods[0] ? `<div class="shape-box item-0"><img src="${prods[0].image}"><div class="shape-label"><span>${prods[0].name}</span>${prods[0].sku}</div></div>` : ''}
                ${prods[1] ? `<div class="shape-box item-1"><img src="${prods[1].image}"><div class="shape-label"><span>${prods[1].name}</span>${prods[1].sku}</div></div>` : ''}
                ${prods[2] ? `<div class="shape-box item-2"><img src="${prods[2].image}"><div class="shape-label"><span>${prods[2].name}</span>${prods[2].sku}</div></div>` : ''}
            </div>`;
        } else {
            gridHTML = `
            <div class="collage-variant-11">
                ${prods[0] ? `<div class="shape-box item-0"><img src="${prods[0].image}"><div class="shape-label"><span>${prods[0].name}</span>${prods[0].sku}</div></div>` : ''}
                ${prods[1] ? `<div class="shape-box item-1"><img src="${prods[1].image}"><div class="shape-label"><span>${prods[1].name}</span>${prods[1].sku}</div></div>` : ''}
            </div>`;
        }

        return `
            <div class="grande-collage-page">
                <div style="text-align: right; border-bottom: 2px solid #000; padding-bottom: 10px;">
                    <span style="font-size: 14px; opacity: 0.6;">${name}</span>
                    <strong style="font-size: 22px; margin-left: 10px;">GRANDE <small>COLLECTION</small></strong>
                </div>
                <div style="flex: 1; margin-top: 30px; position: relative; overflow: hidden;">
                    ${gridHTML}
                </div>
            </div>
        `;
    }

    createGrandeDetails(prods, name, index) {
        const variant = (index % 6) + 1;
        const variantClass = variant === 1 ? '' : `variant-v${variant}`;

        return `
            <div class="grande-details-page ${variantClass}">
                <div class="grande-header">
                    <img src="images/logo.png" style="width: 100px; filter: ${(variant === 4 || variant === 5) ? 'none' : 'invert(0)'};">
                    <div class="grande-branding">
                        <h2>GRANDE</h2>
                        <span>UP YOUR GAME</span>
                    </div>
                </div>

                <div class="collection-desc">
                    <h3 style="color: var(--gold); font-size: 18px; margin-bottom: 10px;">${name}</h3>
                    <p>This palette brings grandness and spacious feel to any room. 
                       The deep textures and cinnamon tones add depth while the collection makes the space 
                       feel expansive and luxurious. Perfect for bold timeless interiors.</p>
                </div>

                <div class="qr-row">
                    ${prods.map(p => `
                        <div class="qr-item">
                            <canvas class="qr-target" data-slug="${p.slug}"></canvas>
                            <span>${p.sku}<br>${p.name}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="grande-footer">
                    <div>Size: 10'X4' | 1.25mm</div>
                    <div>Sustainable Folder Crafted with Recycled Paper</div>
                </div>
            </div>
        `;
    }

    addPage(html, id, pageNum) {
        const p = document.createElement('div');
        p.className = 'page';
        p.id = id;
        p.innerHTML = `
            <div class="page-front">
                <div class="page-logo"><img src="images/logo.png" alt="CenturyPly"></div>
                ${html}
                <div class="page-number">Page ${pageNum}</div>
            </div>`;
        this.book.appendChild(p);
    }

    createCoverHTML() {
        return `
            <div class="cover-content">
                <div class="v2-chip animate-entry">CINEMATIC EDITION</div>
                <h1 class="cover-title animate-entry animate-delay-1">CENTURYPLY<br>PREMIUM</h1>
                <p class="animate-entry animate-delay-2" style="text-transform: uppercase; letter-spacing: 4px; font-weight: 300; margin-bottom: 40px; opacity: 0.6;">Volume 2024 • Multisensory Experience</p>
                <div style="width: 40px; height: 1px; background: var(--gold); margin-bottom: 20px;"></div>
                <button onclick="document.getElementById('bulkOrderModal').classList.add('open')" class="atc-btn animate-entry animate-delay-3">Get Custom Samples</button>
                <p style="font-size: 11px; opacity: 0.4; margin-top: 30px;">PRESS ARROW KEYS TO BROWSE</p>
            </div>
        `;
    }

    createProductHTML(p) {
        const accent = p.finishColor?.toLowerCase().includes('gold') ? '#ffd700' : 'var(--gold)';
        return `
            <div class="product-inner">
                <div class="animate-entry" style="display: flex; justify-content: space-between; align-items: baseline;">
                    <div>
                        <h2 style="font-size: 24px; font-weight: 800; text-transform: uppercase;">${p.name}</h2>
                        <div class="price-tag" style="color: ${accent}">₹${p.price.toLocaleString()}</div>
                    </div>
                    <span style="font-weight: 800; font-size: 10px; color: ${accent}; opacity: 0.6;">SKU: ${p.sku}</span>
                </div>
                
                <div class="v2-image-box animate-entry animate-delay-1">
                    <img src="${p.image}" alt="${p.name}" class="zoom-target product-img-main">
                    <div class="video-bg-overlay"></div>
                </div>

                <p class="v2-desc animate-entry animate-delay-2">${p.description || "A masterfully crafted texture from our premium series."}</p>

                <div class="v2-specs animate-entry animate-delay-3" style="margin-bottom: 20px;">
                    <div class="spec-pill"><strong>Finish:</strong> ${p.finish}</div>
                    <div class="spec-pill"><strong>Size:</strong> ${p.size}</div>
                </div>

                <div class="animate-entry animate-delay-3" style="margin-top: auto; display: flex; align-items: center; justify-content: space-between;">
                    <!-- <button onclick="window.flipApp.addToCart('${p.sku}', this)" class="atc-btn" style="border-color:${accent}">Add to Cart</button> -->
                    <div style="display:flex; gap:10px;">
                        <canvas class="qr-target" data-slug="${p.slug}" style="width:40px; height:40px;"></canvas>
                        <button onclick="window.flipApp.openEnquiry('${p.name}')" class="icon-btn" style="font-size:24px;">📧</button>
                    </div>
                </div>
            </div>
        `;
    }

    createTOC_HTML() {
        return `
            <div class="grande-details-page">
                <div class="grande-header">
                    <img src="images/logo.png" style="width: 100px;">
                    <div class="grande-branding">
                        <h2 style="color:var(--primary)">MASTER INDEX</h2>
                        <span>COMPLETE DESIGN RANGE</span>
                    </div>
                </div>
                <div style="flex: 1; overflow-y: auto; padding-right: 15px; border-bottom: 2px solid rgba(255,255,255,0.1); margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px;">
                        ${this.products.map((p, i) => `
                            <div onclick="window.flipApp.goToProd('${p.slug}')" style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display:flex; justify-content: space-between; cursor:pointer;" class="toc-row">
                                <span style="font-weight:600; font-size: 11px;">${p.name}</span>
                                <span style="color:var(--primary); font-size:9px; font-weight: 800;">SKU: ${p.sku}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="grande-footer">
                    <div>Total Designs: 83</div>
                    <div>CenturyPly Premium Catalog 2024</div>
                </div>
            </div>
        `;
    }

    renderThumbnails() {
        this.thumbRail.innerHTML = '';
        // Cover
        const coverThumb = document.createElement('img');
        coverThumb.src = "https://via.placeholder.com/45x60/000000/FFFFFF?text=COVER";
        coverThumb.className = 'thumb-item';
        coverThumb.onclick = () => this.goTo(0);
        this.thumbRail.appendChild(coverThumb);

        this.products.forEach((p, i) => {
            const img = document.createElement('img');
            img.src = p.image;
            img.className = 'thumb-item';
            img.onclick = () => this.goTo(i + 1);
            this.thumbRail.appendChild(img);
        });

        // TOC
        const tocThumb = document.createElement('img');
        tocThumb.src = "https://via.placeholder.com/45x60/CB0616/000000?text=INDEX";
        tocThumb.className = 'thumb-item';
        tocThumb.onclick = () => this.goTo(this.pages.length - 1);
        this.thumbRail.appendChild(tocThumb);
    }

    setupEvents() {
        this.nextBtn.onclick = () => this.flip(1);
        this.prevBtn.onclick = () => this.flip(-1);
        if (this.cartBtn) this.cartBtn.onclick = () => this.cartDrawer.classList.add('open');
        if (this.closeCart) this.closeCart.onclick = () => this.cartDrawer.classList.remove('open');
        this.pdfBtn.onclick = () => this.export();

        // Modal Handlers
        document.getElementById('closeBulk').onclick = () => document.getElementById('bulkOrderModal').classList.remove('open');
        document.getElementById('musicToggle').onclick = () => this.toggleMusic();

        // Keyboard Nav
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.flip(1);
            if (e.key === 'ArrowLeft') this.flip(-1);
            if (e.key === 't') this.thumbRail.classList.toggle('visible');
        });

        // Auto-show thumb rail hint
        setTimeout(() => this.thumbRail.classList.add('visible'), 2000);
        setTimeout(() => this.thumbRail.classList.remove('visible'), 5000);

        // Search Overlay
        this.searchBtn.onclick = () => document.getElementById('searchOverlay').classList.add('open');
        document.getElementById('closeSearch').onclick = () => document.getElementById('searchOverlay').classList.remove('open');

        document.getElementById('searchInput').oninput = (e) => {
            const q = e.target.value.toLowerCase();
            const res = this.products.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
            document.getElementById('searchResults').innerHTML = res.map(p => `
                <div onclick="window.flipApp.goToProd('${p.slug}')" style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; cursor:pointer;">
                    <div style="font-weight:800; color:var(--gold);">${p.name}</div>
                    <div style="font-size:10px; opacity:0.6;">${p.sku}</div>
                </div>
            `).join('');
        };

        this.initInteractive();
    }

    toggleMusic() {
        this.isMusicOn = !this.isMusicOn;
        if (this.isMusicOn) {
            this.audio.play();
            document.getElementById('musicToggle').innerText = '⏸';
        } else {
            this.audio.pause();
            document.getElementById('musicToggle').innerText = '🎵';
        }
    }

    openEnquiry(name) {
        document.getElementById('bulkOrderModal').classList.add('open');
        const area = document.querySelector('#bulkOrderModal textarea');
        area.value = `Hi, I am interested in more details for the "${name}" laminate style. We are looking for [X] quantity for a [New Project].`;
    }

    initInteractive() {
        setTimeout(() => {
            document.querySelectorAll('.qr-target').forEach(c => {
                if (!c.dataset.done) {
                    QRCode.toCanvas(c, `https://centuryply.com/p/${c.dataset.slug}`, { width: 40, margin: 0 });
                    c.dataset.done = "true";
                }
            });

            document.querySelectorAll('.v2-image-box').forEach(box => {
                const img = box.querySelector('.zoom-target');
                box.onmousemove = (e) => {
                    const r = box.getBoundingClientRect();
                    const x = ((e.clientX - r.left) / r.width) * 100;
                    const y = ((e.clientY - r.top) / r.height) * 100;
                    img.style.transformOrigin = `${x}% ${y}%`;
                    img.style.transform = 'scale(2.5)';
                };
                box.onmouseleave = () => img.style.transform = 'scale(1)';
            });
        }, 1000);
    }

    flip(dir) {
        if (dir === 1 && this.currentPage < this.pages.length - 1) {
            this.pages[this.currentPage].classList.add('flipped');
            this.currentPage++;
        } else if (dir === -1 && this.currentPage > 0) {
            this.currentPage--;
            this.pages[this.currentPage].classList.remove('flipped');
        }
        this.updateState();
    }

    goTo(idx) {
        if (idx < 0 || idx >= this.pages.length) return;
        this.pages.forEach(p => p.classList.remove('flipped'));
        for (let i = 0; i < idx; i++) this.pages[i].classList.add('flipped');
        this.currentPage = idx;
        this.updateState();
        document.getElementById('searchOverlay').classList.remove('open');
    }

    goToProd(slug) {
        const idx = this.products.findIndex(p => p.slug === slug);
        if (idx !== -1) this.goTo(idx + 1);
    }

    updateState() {
        this.pages.forEach((p, i) => {
            p.classList.remove('active');
            if (i === this.currentPage) p.classList.add('active');

            // Re-trigger animations
            const entryElements = p.querySelectorAll('.animate-entry');
            entryElements.forEach(el => {
                el.classList.remove('animate-entry');
                void el.offsetWidth; // Force reflow
                el.classList.add('animate-entry');
            });
        });

        // Update Nav
        this.currNum.innerText = this.currentPage + 1;
        this.prevBtn.disabled = this.currentPage === 0;
        this.nextBtn.disabled = this.currentPage === this.pages.length - 1;

        // Update Thumbnails
        const thumbs = document.querySelectorAll('.thumb-item');
        thumbs.forEach((t, i) => {
            t.classList.toggle('active', i === this.currentPage);
            if (i === this.currentPage) t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });

        const rot = (this.currentPage / (this.pages.length - 1)) * 30 - 15;
        this.book.style.transform = `rotateY(${rot}deg)`;
    }

    addToCart(sku, btnElement) {
        const p = this.products.find(x => x.sku === sku);
        if (!p) return;

        // Flying Animation
        const img = btnElement.closest('.product-inner').querySelector('.product-img-main');
        const rect = img.getBoundingClientRect();
        const cartRect = this.cartBtn.getBoundingClientRect();

        const flyer = document.createElement('img');
        flyer.src = p.image;
        flyer.className = 'flying-item';
        flyer.style.setProperty('--start-x', `${rect.left}px`);
        flyer.style.setProperty('--start-y', `${rect.top}px`);
        flyer.style.setProperty('--end-x', `${cartRect.left}px`);
        flyer.style.setProperty('--end-y', `${cartRect.top}px`);

        document.body.appendChild(flyer);
        setTimeout(() => flyer.remove(), 1000);

        const existing = this.cart.find(x => x.sku === sku);
        if (existing) existing.qty++;
        else this.cart.push({ ...p, qty: 1 });

        this.saveCart();
        this.updateCartUI();
    }

    updateCartUI() {
        const container = document.getElementById('cartItems');
        const count = document.getElementById('cartCount');
        const total = document.getElementById('cartTotal');

        const totalQty = this.cart.reduce((s, x) => s + x.qty, 0);
        const totalPrice = this.cart.reduce((s, x) => s + (x.price * x.qty), 0);

        if (count) count.innerText = totalQty;
        if (total) total.innerText = totalPrice.toLocaleString();

        if (container) {
            container.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div style="flex: 1;">
                        <div style="font-weight: 800; font-size: 14px;">${item.name}</div>
                        <div style="font-size: 12px; color: var(--gold); opacity: 0.8;">₹${item.price.toLocaleString()} x ${item.qty}</div>
                    </div>
                    <button onclick="window.flipApp.removeFromCart('${item.sku}')" style="background:none; border:none; color:#ff4757; cursor:pointer;">&times;</button>
                </div>
            `).join('') || '<div style="text-align:center; padding: 40px 0; opacity: 0.5;">Empty cart. Explore our textures!</div>';
        }

        if (this.cart.length > 0 && this.cartBtn) {
            this.cartBtn.classList.add('animate-bounce'); // Simple CSS badge bounce would be nice but requires class
            setTimeout(() => this.cartBtn.classList.remove('animate-bounce'), 500);
        }
    }

    removeFromCart(sku) {
        this.cart = this.cart.filter(x => x.sku !== sku);
        this.saveCart();
        this.updateCartUI();
    }

    saveCart() {
        localStorage.setItem('cp_cart', JSON.stringify(this.cart));
    }

    async export() {
        this.pdfBtn.innerText = "...";
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        for (let i = 0; i < this.pages.length; i++) {
            const f = this.pages[i].querySelector('.page-front');
            const c = await html2canvas(f, { scale: 2 });
            if (i > 0) doc.addPage();
            doc.addImage(c.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 210, 297);
        }
        doc.save('CenturyPly_Premium_V4.pdf');
        this.pdfBtn.innerText = "📥";
    }
}

window.flipApp = new FlipBookAdvanced();
