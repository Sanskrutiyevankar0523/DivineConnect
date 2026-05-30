/* ============================================ */
/* DivineConnect — Complete App Logic v3        */
/* Role Login · User Dashboard · Pandit Dashboard */
/* ============================================ */

// =============================================
// DATA
// =============================================
const ceremonyPrices = {
    'griha-pravesh': { name: 'Griha Pravesh', icon: '🏠', price: 3500 },
    'vivah':         { name: 'Vivah', icon: '💒', price: 11000 },
    'satyanarayan':  { name: 'Satyanarayan Puja', icon: '🙏', price: 2500 },
    'mundan':        { name: 'Mundan', icon: '👶', price: 2100 },
    'naamkaran':     { name: 'Naamkaran', icon: '✨', price: 1800 },
    'ganesh-puja':   { name: 'Ganesh Puja', icon: '🐘', price: 2000 },
    'laxmi-puja':    { name: 'Laxmi Puja', icon: '🪷', price: 2200 },
    'shradh':        { name: 'Shradh', icon: '🕯️', price: 3000 },
};

const panditsData = [
    { id: 1, name: "Pandit Rajesh Sharma",   city: "Bangalore", state: "Karnataka",      rating: 4.9, reviews: 127, experience: 20, price: 2100, specializations: ["Griha Pravesh","Vivah","Satyanarayan"],         languages: ["Hindi","Sanskrit","English","Kannada"], featured: true,  verified: true, bio: "Third-generation Vedic priest from Varanasi, serving families across Bangalore." },
    { id: 2, name: "Pandit Arun Mishra",     city: "Delhi",     state: "NCR",            rating: 4.8, reviews: 89,  experience: 15, price: 1800, specializations: ["Satyanarayan","Ganesh Puja","Mundan"],            languages: ["Hindi","Sanskrit"],                     featured: true,  verified: true, bio: "Specializing in North Indian traditions with a focus on family-oriented ceremonies." },
    { id: 3, name: "Pandit Venkatesh Iyer",  city: "Bangalore", state: "Karnataka",      rating: 4.7, reviews: 64,  experience: 25, price: 3000, specializations: ["Vivah","Griha Pravesh","Naamkaran"],              languages: ["Tamil","Sanskrit","English"],            featured: true,  verified: true, bio: "25 years of experience in both South Indian and Pan-Indian ceremony traditions." },
    { id: 4, name: "Pandit Suresh Tiwari",   city: "Varanasi",  state: "Uttar Pradesh",  rating: 4.9, reviews: 203, experience: 30, price: 2500, specializations: ["Shradh","Satyanarayan","Vivah","Griha Pravesh"],  languages: ["Hindi","Sanskrit","Bhojpuri"],           featured: false, verified: true, bio: "Kashi's most sought-after pandit with 3 decades of devotional service." },
    { id: 5, name: "Pandit Ramchandra Joshi",city: "Mumbai",    state: "Maharashtra",    rating: 4.6, reviews: 45,  experience: 12, price: 2800, specializations: ["Ganesh Puja","Laxmi Puja","Satyanarayan"],        languages: ["Marathi","Hindi","Sanskrit","English"],  featured: false, verified: true, bio: "Bringing the divine closer to Mumbai's busy families with flexible scheduling." },
    { id: 6, name: "Pandit Krishnamurthy S.",city: "Chennai",   state: "Tamil Nadu",     rating: 4.8, reviews: 78,  experience: 18, price: 2200, specializations: ["Naamkaran","Griha Pravesh","Vivah"],              languages: ["Tamil","Sanskrit","Telugu","English"],   featured: false, verified: true, bio: "Expert in South Indian Vedic traditions with modern ceremony adaptations." },
];

const avatarGradients = [
    "linear-gradient(135deg, #C8A951, #A68A3E)",
    "linear-gradient(135deg, #7A2D3F, #5B1A2A)",
    "linear-gradient(135deg, #2E7D32, #1B5E20)",
];

// =============================================
// STATE
// =============================================
let currentWizardStep = 1;
let selectedCeremony  = null;
let currentProfilePandit = panditsData[0];
let savedMuhurats  = JSON.parse(localStorage.getItem('savedMuhurats')  || '{}');
let likedPandits   = JSON.parse(localStorage.getItem('likedPandits')   || '[]');
let isLoggedIn      = localStorage.getItem('isLoggedIn')      === 'true';
let isPanditLoggedIn= localStorage.getItem('isPanditLoggedIn')=== 'true';
let joinStep        = 1;

// =============================================
// BOOT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroParticles();
    initCounterAnimations();
    renderFeaturedPandits();
    renderPanditListing();
    initFilters();
    loadProfileData(currentProfilePandit);
    restoreLoginState();
    document.body.style.opacity = '1';
    setTimeout(initScrollAnimations, 200);
});
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.35s ease';

// =============================================
// TOAST
// =============================================
function showToast(msg, type = 'info') {
    const icons = { success:'✅', error:'❌', info:'💡' };
    const c = document.getElementById('toast-container');
    if (!c) return;
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span class="toast-icon">${icons[type]||'💡'}</span><span>${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => { t.classList.add('removing'); setTimeout(()=>t.remove(), 300); }, 3000);
}

// =============================================
// MODALS
// =============================================
function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('open');
    document.body.classList.add('modal-open');
}
function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (id === 'modal-login')        resetLoginModal();
    if (id === 'modal-booking')      resetBookingModal();
    if (id === 'modal-join-pandit')  resetJoinModal();
}
document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('open'))
        closeModal(e.target.id);
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape')
        document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
});

// =============================================
// NAV
// =============================================
function initNavigation() {
    const navbar   = document.getElementById('navbar');
    const hamburger= document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');
    window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));
    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
    });
}

function navigateTo(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-link').forEach(lk => {
        lk.classList.remove('active');
        if (lk.dataset.page === pageId) lk.classList.add('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('nav-links')?.classList.remove('open');

    if (pageId === 'muhurat') {
        const inp = document.getElementById('muhurat-input-section');
        const res = document.getElementById('muhurat-results-section');
        if (inp && res && res.style.display !== 'block') {
            inp.style.display = '';
            res.style.display = 'none';
        }
    }
    if (pageId === 'pandits')       applyFilters();
    if (pageId === 'user-profile')  renderSavedPandits();

    setTimeout(initScrollAnimations, 100);
}

function goToMyAccount() {
    if (isPanditLoggedIn) navigateTo('pandit-dashboard');
    else if (isLoggedIn)  navigateTo('user-profile');
    else openModal('modal-login');
}

// =============================================
// PARTICLES & ANIMATIONS
// =============================================
function initHeroParticles() {
    const c = document.getElementById('hero-particles');
    if (!c) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left   = Math.random() * 100 + '%';
        p.style.top    = Math.random() * 100 + '%';
        p.style.animationDelay    = Math.random() * 6 + 's';
        p.style.animationDuration = (4 + Math.random() * 4) + 's';
        const sz = (2 + Math.random() * 3) + 'px';
        p.style.width = p.style.height = sz;
        c.appendChild(p);
    }
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('.trust-number');
    if (!counters.length) return;
    let done = false;
    const obs = new IntersectionObserver(entries => {
        if (done) return;
        if (entries.some(e => e.isIntersecting)) {
            done = true;
            counters.forEach(counter => {
                const target = parseFloat(counter.dataset.target);
                const isFloat = counter.classList.contains('trust-rating');
                const start = performance.now();
                const dur = 2000;
                (function tick(now) {
                    const p = Math.min((now - start) / dur, 1);
                    const e = 1 - Math.pow(1 - p, 3);
                    counter.textContent = isFloat ? (target*e).toFixed(1) : Math.floor(target*e).toLocaleString();
                    if (p < 1) requestAnimationFrame(tick);
                })(performance.now());
            });
        }
    }, { threshold: 0.5 });
    const trust = document.querySelector('.hero-trust');
    if (trust) obs.observe(trust);
}

function initScrollAnimations() {
    const sels = ['.ceremony-card','.step-card','.pandit-card','.testimonial-card',
                  '.ai-feature-item','.muhurat-window','.review-card','.profile-section',
                  '.section-header','.booking-card','.portfolio-section','.pandit-stat-item'];
    sels.forEach(sel => {
        document.querySelectorAll(sel + ':not(.animate-in)').forEach((el, i) => {
            el.classList.add('animate-in');
            el.style.transitionDelay = (i * 70) + 'ms';
        });
    });
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.animate-in:not(.visible)').forEach(el => obs.observe(el));
}

// =============================================
// PANDIT CARD RENDERING
// =============================================
function createPanditCard(pandit) {
    const initials = pandit.name.split(' ').slice(1).map(n => n[0]).join('');
    const grad     = avatarGradients[pandit.id % avatarGradients.length];
    const tags     = pandit.specializations.slice(0, 3)
                       .map(s => `<span class="tag tag-neutral">${s}</span>`).join('');
    const stars    = '★'.repeat(Math.floor(pandit.rating)) + (pandit.rating % 1 >= 0.5 ? '½' : '');
    const liked    = likedPandits.includes(pandit.id);
    return `
    <div class="pandit-card" onclick="viewPanditProfile(${pandit.id})">
        <div class="pandit-card-header">
            <div class="pandit-card-avatar" style="background:${grad};display:flex;align-items:center;justify-content:center;">
                <span style="font-family:var(--font-serif);font-size:1.5rem;font-weight:700;color:var(--color-text-inverse);">${initials}</span>
            </div>
            <div class="pandit-card-info">
                <h3 class="pandit-card-name">${pandit.name}${pandit.verified?'<span class="pandit-card-verified">✓</span>':''}</h3>
                <p class="pandit-card-location">📍 ${pandit.city}, ${pandit.state}</p>
                <div class="pandit-card-rating">
                    <span class="pandit-card-stars">${stars}</span>
                    <span class="pandit-card-rating-num">${pandit.rating}</span>
                    <span class="pandit-card-rating-count">(${pandit.reviews})</span>
                </div>
            </div>
        </div>
        <div class="pandit-card-body">
            <div class="pandit-card-specializations">${tags}</div>
            <p class="pandit-card-experience">🕉️ ${pandit.experience} years experience</p>
        </div>
        <div class="pandit-card-footer">
            <div class="pandit-card-price">From <strong>₹${pandit.price.toLocaleString()}</strong></div>
            <div style="display:flex;gap:6px;align-items:center;">
                <button class="btn btn-ghost btn-sm" style="padding:6px 10px;font-size:1rem;"
                    onclick="event.stopPropagation();toggleLikePandit(${pandit.id})"
                    title="${liked?'Unsave':'Save'} pandit">${liked ? '❤️' : '🤍'}</button>
                <button class="btn btn-primary btn-sm"
                    onclick="event.stopPropagation();viewPanditProfile(${pandit.id})">View Profile</button>
            </div>
        </div>
    </div>`;
}

function renderFeaturedPandits() {
    const g = document.getElementById('featured-pandit-grid');
    if (g) g.innerHTML = panditsData.filter(p => p.featured).map(createPanditCard).join('');
}

function renderPanditListing(list = panditsData) {
    const g  = document.getElementById('pandit-listing-grid');
    const ct = document.getElementById('pandit-count');
    if (!g) return;
    if (list.length === 0) {
        g.innerHTML = `<div class="no-results" style="grid-column:1/-1;text-align:center;padding:60px 20px;">
            <div style="font-size:3rem;margin-bottom:12px;">🔍</div>
            <h3>No pandits found</h3>
            <p style="color:var(--color-text-muted);margin-top:8px;">Try adjusting your filters.</p></div>`;
        if (ct) ct.textContent = 'No pandits found';
    } else {
        g.innerHTML = list.map(createPanditCard).join('');
        if (ct) ct.textContent = `Showing ${list.length} pandit${list.length > 1 ? 's' : ''}`;
    }
}

function renderSavedPandits() {
    const g = document.getElementById('saved-pandits-grid');
    if (!g) return;
    const saved = panditsData.filter(p => likedPandits.includes(p.id));
    if (saved.length === 0) {
        g.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;">
            <div style="font-size:3rem;margin-bottom:12px;">🤍</div>
            <h3>No saved pandits yet</h3>
            <p style="color:var(--color-text-muted);margin-top:8px;">Browse pandits and tap 🤍 to save them.</p>
            <button class="btn btn-primary" onclick="navigateTo('pandits')" style="margin-top:20px;">Browse Pandits</button></div>`;
    } else {
        g.innerHTML = saved.map(createPanditCard).join('');
    }
    setTimeout(initScrollAnimations, 100);
}

function toggleLikePandit(id) {
    const idx = likedPandits.indexOf(id);
    if (idx > -1) { likedPandits.splice(idx, 1); showToast('Removed from saved 🤍', 'info'); }
    else          { likedPandits.push(id);        showToast('Pandit saved! ❤️', 'success'); }
    localStorage.setItem('likedPandits', JSON.stringify(likedPandits));
    renderFeaturedPandits();
    renderSavedPandits();
    applyFilters();
}

function viewPanditProfile(id) {
    const p = panditsData.find(p => p.id === id);
    if (p) { currentProfilePandit = p; loadProfileData(p); }
    navigateTo('pandit-profile');
}

function loadProfileData(pandit) {
    setText('.profile-name', pandit.name);
    setText('.rating-score', pandit.rating);
    setText('.rating-count', `(${pandit.reviews} reviews)`);
    setText('.badge-experience', `${pandit.experience} yrs experience`);
    const locEl = document.querySelector('.profile-location');
    if (locEl) locEl.innerHTML = `📍 ${pandit.city}, ${pandit.state}`;
    const bio = document.querySelector('.profile-bio p');
    if (bio) bio.textContent = pandit.bio;

    // Avatar
    const av = document.getElementById('profile-avatar');
    const img= document.getElementById('profile-avatar-img');
    if (av && img) {
        img.style.display = 'none';
        av.style.background = avatarGradients[pandit.id % avatarGradients.length];
        av.style.cssText += ';display:flex;align-items:center;justify-content:center;';
        const existing = av.querySelector('.avatar-initials');
        if (existing) existing.remove();
        const span = document.createElement('span');
        span.className = 'avatar-initials';
        span.textContent = pandit.name.split(' ').slice(1).map(n => n[0]).join('');
        span.style.cssText = 'font-family:var(--font-serif);font-size:2.5rem;font-weight:700;color:var(--color-maroon-dark);';
        av.appendChild(span);
    }
}
function setText(sel, val) {
    const el = document.querySelector(sel);
    if (el) el.textContent = val;
}

// =============================================
// FILTERS
// =============================================
function initFilters() {
    ['filter-ceremony','filter-city','filter-language','filter-price','sort-by'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const cer   = document.getElementById('filter-ceremony')?.value || '';
    const city  = document.getElementById('filter-city')?.value     || '';
    const lang  = document.getElementById('filter-language')?.value || '';
    const price = document.getElementById('filter-price')?.value    || '';
    const sort  = document.getElementById('sort-by')?.value         || 'relevance';

    const cerMap = { 'griha-pravesh':'Griha Pravesh','vivah':'Vivah','satyanarayan':'Satyanarayan','mundan':'Mundan','naamkaran':'Naamkaran' };

    let list = panditsData.filter(p => {
        if (cer  && cerMap[cer]  && !p.specializations.some(s => s.toLowerCase().includes(cerMap[cer].toLowerCase()))) return false;
        if (city && p.city.toLowerCase() !== city.toLowerCase()) return false;
        if (lang) {
            const L = lang.charAt(0).toUpperCase() + lang.slice(1);
            if (!p.languages.includes(L)) return false;
        }
        if (price === '0-2000'    && p.price >= 2000)           return false;
        if (price === '2000-5000' && (p.price < 2000 || p.price > 5000))   return false;
        if (price === '5000-10000'&& (p.price < 5000 || p.price > 10000))  return false;
        if (price === '10000+'    && p.price < 10000)           return false;
        return true;
    });

    if (sort === 'rating')     list.sort((a,b) => b.rating - a.rating);
    else if (sort === 'price-low')  list.sort((a,b) => a.price - b.price);
    else if (sort === 'price-high') list.sort((a,b) => b.price - a.price);
    else list.sort((a,b) => (b.featured - a.featured) || (b.rating - a.rating));

    renderPanditListing(list);
    setTimeout(initScrollAnimations, 100);
}

// =============================================
// MUHURAT WIZARD
// =============================================
function wizardNext() {
    if (currentWizardStep === 1 && !selectedCeremony) {
        showToast('Please select a ceremony first', 'error'); return;
    }
    if (currentWizardStep < 3) setWizardStep(currentWizardStep + 1);
}
function wizardBack() {
    if (currentWizardStep > 1) setWizardStep(currentWizardStep - 1);
}
function setWizardStep(n) {
    currentWizardStep = n;
    document.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`wizard-step-${n}`)?.classList.add('active');
    document.querySelectorAll('.wizard-progress .wizard-step').forEach(s => {
        const sn = parseInt(s.dataset.step);
        s.classList.toggle('active',   sn === n);
        s.classList.toggle('completed', sn < n);
    });
}

function submitMuhuratSearch() {
    document.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('wizard-loading')?.classList.add('active');
    const info = ceremonyPrices[selectedCeremony];
    const date = document.getElementById('wizard-date')?.value || '2026-06-15';
    const loc  = document.getElementById('wizard-location')?.value || 'Bangalore';
    const ds   = new Date(date + 'T00:00:00').toLocaleDateString('en-IN',{month:'long',day:'numeric',year:'numeric'});
    const sub  = document.querySelector('#muhurat-results-section .page-subtitle');
    if (sub && info) sub.innerHTML = `Auspicious timings for <strong>${info.name}</strong> on <strong>${ds}</strong> in <strong>${loc}</strong>`;

    setTimeout(() => {
        document.getElementById('wizard-loading')?.classList.remove('active');
        document.getElementById('muhurat-input-section').style.display = 'none';
        document.getElementById('muhurat-results-section').style.display = 'block';
        window.scrollTo({top:0,behavior:'smooth'});
        setTimeout(initScrollAnimations, 100);
    }, 2000);
}
function showMuhuratInput() {
    document.getElementById('muhurat-results-section').style.display = 'none';
    document.getElementById('muhurat-input-section').style.display   = '';
    setWizardStep(1);
    window.scrollTo({top:0,behavior:'smooth'});
}

// Wizard ceremony card click
document.addEventListener('click', e => {
    const wc = e.target.closest('.wizard-ceremony-card');
    if (wc) {
        document.querySelectorAll('.wizard-ceremony-card').forEach(c => c.classList.remove('selected'));
        wc.classList.add('selected');
        selectedCeremony = wc.dataset.ceremony;
        setTimeout(wizardNext, 400);
    }
});

// Home ceremony cards → muhurat wizard pre-selected
document.addEventListener('click', e => {
    const cc = e.target.closest('.ceremony-card');
    if (cc && !e.target.closest('.wizard-ceremony-card')) {
        selectedCeremony = cc.dataset.ceremony;
        navigateTo('muhurat');
        setTimeout(() => {
            const wc = document.querySelector(`.wizard-ceremony-card[data-ceremony="${selectedCeremony}"]`);
            if (wc) { document.querySelectorAll('.wizard-ceremony-card').forEach(c=>c.classList.remove('selected')); wc.classList.add('selected'); }
        }, 200);
    }
});

// Scroll indicator
document.addEventListener('click', e => {
    if (e.target.closest('.hero-scroll-indicator'))
        document.getElementById('ceremonies-section')?.scrollIntoView({behavior:'smooth'});
});

// =============================================
// SAVE / SHARE MUHURAT
// =============================================
function saveMuhurat(n) {
    const k = `muhurat-${n}`;
    if (savedMuhurats[k]) { delete savedMuhurats[k]; showToast('Muhurat unsaved', 'info'); }
    else                  { savedMuhurats[k] = true;  showToast('Muhurat saved! ✨', 'success'); }
    localStorage.setItem('savedMuhurats', JSON.stringify(savedMuhurats));
    updateSaveButtons();
}
function updateSaveButtons() {
    document.querySelectorAll('.muhurat-actions').forEach((actions, i) => {
        const btn = actions.querySelector('.btn-ghost');
        if (btn) btn.classList.toggle('btn-saved', !!savedMuhurats[`muhurat-${i+1}`]);
    });
}
function shareMuhurat() {
    navigator.clipboard?.writeText('https://divineconnect.in/muhurat/share/DC-2026')
        .then(()=>showToast('Link copied! 📋','success'))
        .catch(()=>showToast('Link copied! 📋','success'));
}

// =============================================
// LOGIN MODAL — ROLE CHOOSER
// =============================================
function selectLoginRole(role) {
    document.getElementById('login-role-chooser').style.display = 'none';
    if (role === 'user') {
        document.getElementById('login-user-flow').style.display  = '';
        document.getElementById('login-pandit-flow').style.display = 'none';
    } else {
        document.getElementById('login-pandit-flow').style.display = '';
        document.getElementById('login-user-flow').style.display   = 'none';
    }
}
function backToRoleChooser() {
    document.getElementById('login-role-chooser').style.display  = '';
    document.getElementById('login-user-flow').style.display     = 'none';
    document.getElementById('login-pandit-flow').style.display   = 'none';
}

function switchLoginTab(tab) {
    document.querySelectorAll('#login-user-flow .modal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#login-user-flow .login-tab-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`#login-user-flow .modal-tab[data-tab="${tab}"]`)?.classList.add('active');
    document.getElementById(`login-tab-${tab}`)?.classList.add('active');
}

// =============================================
// USER LOGIN
// =============================================
function sendOTP() {
    const phone = document.getElementById('login-phone')?.value;
    if (!phone || phone.length < 10) { showToast('Enter a valid 10-digit number','error'); return; }
    document.getElementById('phone-step-1').style.display = 'none';
    document.getElementById('phone-step-2').style.display = '';
    document.getElementById('otp-phone-display').textContent = `+91 ${phone}`;
    showToast('OTP sent! 📱','success');
    setTimeout(()=>document.getElementById('login-otp')?.focus(), 100);
}
function verifyOTP() {
    const otp = document.getElementById('login-otp')?.value;
    if (!otp || otp.length < 4) { showToast('Enter a valid OTP','error'); return; }
    isLoggedIn = true; isPanditLoggedIn = false;
    localStorage.setItem('isLoggedIn','true');
    localStorage.setItem('isPanditLoggedIn','false');
    const phone = document.getElementById('login-phone')?.value || '9876543210';
    localStorage.setItem('userPhone', phone);
    closeModal('modal-login');
    showToast('Welcome to DivineConnect! 🙏','success');
    updateNavLoggedIn('user');
    const nameEl  = document.getElementById('user-profile-name');
    const phoneEl = document.getElementById('user-profile-phone');
    if (nameEl)  nameEl.textContent  = 'Welcome, User';
    if (phoneEl) phoneEl.textContent = `+91 ${phone}`;
}
function googleLogin() {
    isLoggedIn = true; isPanditLoggedIn = false;
    localStorage.setItem('isLoggedIn','true');
    localStorage.setItem('isPanditLoggedIn','false');
    closeModal('modal-login');
    showToast('Signed in with Google! 🙏','success');
    updateNavLoggedIn('user');
}

// =============================================
// PANDIT LOGIN
// =============================================
function sendPanditOTP() {
    const phone = document.getElementById('pandit-login-phone')?.value;
    if (!phone || phone.length < 10) { showToast('Enter your registered number','error'); return; }
    document.getElementById('pandit-login-step-1').style.display = 'none';
    document.getElementById('pandit-login-step-2').style.display = '';
    document.getElementById('pandit-otp-phone-display').textContent = `+91 ${phone}`;
    showToast('OTP sent to your registered number! 📱','success');
    setTimeout(()=>document.getElementById('pandit-login-otp')?.focus(), 100);
}
function verifyPanditOTP() {
    const otp = document.getElementById('pandit-login-otp')?.value;
    if (!otp || otp.length < 4) { showToast('Enter a valid OTP','error'); return; }
    isPanditLoggedIn = true; isLoggedIn = false;
    localStorage.setItem('isPanditLoggedIn','true');
    localStorage.setItem('isLoggedIn','false');
    closeModal('modal-login');
    showToast('Welcome back, Pandit ji! 🙏','success');
    updateNavLoggedIn('pandit');
    navigateTo('pandit-dashboard');
}

// =============================================
// NAV STATE AFTER LOGIN
// =============================================
function updateNavLoggedIn(role) {
    const loginBtn = document.getElementById('nav-login-btn');
    const accountItem = document.getElementById('nav-account-item');
    if (loginBtn) {
        if (role === 'pandit') {
            loginBtn.outerHTML = `<button class="btn btn-primary nav-login" id="nav-login-btn"
                onclick="navigateTo('pandit-dashboard')"
                style="background:linear-gradient(135deg,var(--color-maroon),var(--color-maroon-dark));color:var(--color-gold-light);box-shadow:0 4px 12px rgba(91,26,42,0.3);">
                🙏 My Dashboard</button>`;
        } else {
            loginBtn.outerHTML = `<button class="btn btn-primary nav-login" id="nav-login-btn"
                onclick="navigateTo('user-profile')">
                👤 My Account</button>`;
        }
    }
    if (accountItem) {
        accountItem.style.display = '';
        const lnk = document.getElementById('nav-account-link');
        if (lnk) lnk.textContent = role === 'pandit' ? '🙏 Dashboard' : '👤 My Account';
    }
}

function restoreLoginState() {
    if (isPanditLoggedIn) updateNavLoggedIn('pandit');
    else if (isLoggedIn)  updateNavLoggedIn('user');
}

function resetLoginModal() {
    // Reset role chooser
    const chooser = document.getElementById('login-role-chooser');
    const uFlow   = document.getElementById('login-user-flow');
    const pFlow   = document.getElementById('login-pandit-flow');
    if (chooser) chooser.style.display = '';
    if (uFlow)   uFlow.style.display   = 'none';
    if (pFlow)   pFlow.style.display   = 'none';
    // Reset user fields
    const p1 = document.getElementById('phone-step-1');
    const p2 = document.getElementById('phone-step-2');
    if (p1) p1.style.display = '';
    if (p2) p2.style.display = 'none';
    const ph = document.getElementById('login-phone');
    const ot = document.getElementById('login-otp');
    if (ph) ph.value = '';
    if (ot) ot.value = '';
    // Reset pandit fields
    const pp1 = document.getElementById('pandit-login-step-1');
    const pp2 = document.getElementById('pandit-login-step-2');
    if (pp1) pp1.style.display = '';
    if (pp2) pp2.style.display = 'none';
    const pph = document.getElementById('pandit-login-phone');
    const pot = document.getElementById('pandit-login-otp');
    if (pph) pph.value = '';
    if (pot) pot.value = '';
    switchLoginTab('phone');
}

function logoutUser() {
    isLoggedIn = false;
    localStorage.setItem('isLoggedIn','false');
    const btn = document.getElementById('nav-login-btn');
    if (btn) btn.outerHTML = `<button class="btn btn-primary nav-login" id="nav-login-btn" onclick="openModal('modal-login')">Login</button>`;
    const item = document.getElementById('nav-account-item');
    if (item) item.style.display = 'none';
    navigateTo('home');
    showToast('Logged out','info');
}
function logoutPandit() {
    isPanditLoggedIn = false;
    localStorage.setItem('isPanditLoggedIn','false');
    const btn = document.getElementById('nav-login-btn');
    if (btn) btn.outerHTML = `<button class="btn btn-primary nav-login" id="nav-login-btn" onclick="openModal('modal-login')">Login</button>`;
    const item = document.getElementById('nav-account-item');
    if (item) item.style.display = 'none';
    navigateTo('home');
    showToast('Logged out from Pandit Portal','info');
}

// =============================================
// USER DASHBOARD TABS
// =============================================
function switchUserTab(tab) {
    document.querySelectorAll('#user-dashboard-tabs .dash-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    ['bookings','saved','profile'].forEach(t => {
        const p = document.getElementById(`user-tab-${t}`);
        if (p) p.classList.toggle('active', t === tab);
    });
    if (tab === 'saved') renderSavedPandits();
    setTimeout(initScrollAnimations, 100);
}

// =============================================
// PANDIT DASHBOARD TABS
// =============================================
function switchPanditTab(tab) {
    document.querySelectorAll('#pandit-dashboard-tabs .dash-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    ['upcoming','past','portfolio','settings'].forEach(t => {
        const p = document.getElementById(`pandit-tab-${t}`);
        if (p) p.classList.toggle('active', t === tab);
    });
    setTimeout(initScrollAnimations, 100);
}

// =============================================
// PORTFOLIO UPLOAD
// =============================================
function triggerPortfolioUpload() {
    document.getElementById('portfolio-file-input')?.click();
}
function handlePortfolioUpload(event) {
    const files = event.target.files;
    if (!files?.length) return;
    const grid = document.querySelector('#pandit-tab-portfolio .portfolio-grid');
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
            const item = document.createElement('div');
            item.className = 'portfolio-item newly-uploaded';
            item.innerHTML = `<img src="${e.target.result}" alt="Ceremony photo" style="width:100%;height:100%;object-fit:cover;"><span class="upload-badge">New ✓</span>`;
            if (grid) grid.prepend(item);
        };
        reader.readAsDataURL(file);
    });
    showToast(`${files.length} photo${files.length>1?'s':''} uploaded! 📸`, 'success');
    event.target.value = '';
}

// =============================================
// JOIN AS PANDIT MODAL
// =============================================
function joinNext() {
    if (joinStep === 1) {
        const name = document.getElementById('join-name')?.value;
        const phone= document.getElementById('join-phone')?.value;
        const city = document.getElementById('join-city')?.value;
        if (!name||!phone||!city) { showToast('Fill in all required fields','error'); return; }
    }
    if (joinStep === 2) {
        const exp  = document.getElementById('join-experience')?.value;
        const lang = document.getElementById('join-languages')?.value;
        if (!exp||!lang) { showToast('Fill in experience and languages','error'); return; }
    }
    joinStep++;
    updateJoinPanels();
}
function joinBack() { if (joinStep>1) { joinStep--; updateJoinPanels(); } }
function updateJoinPanels() {
    document.querySelectorAll('.join-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`join-step-${joinStep}`)?.classList.add('active');
    document.querySelectorAll('.join-progress .join-step').forEach(s => {
        const n = parseInt(s.dataset.step);
        s.classList.toggle('active', n === joinStep);
        s.classList.toggle('completed', n < joinStep);
    });
}
function submitJoinPandit() {
    const terms = document.getElementById('join-terms')?.checked;
    if (!terms) { showToast('Accept Terms of Service','error'); return; }
    document.querySelectorAll('.join-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('join-success')?.classList.add('active');
    showToast('Application submitted! 🎉','success');
}
function resetJoinModal() {
    joinStep = 1;
    document.querySelectorAll('.join-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('join-step-1')?.classList.add('active');
    document.querySelectorAll('.join-progress .join-step').forEach((s,i) => {
        s.classList.toggle('active', i===0);
        s.classList.remove('completed');
    });
    ['join-name','join-phone','join-email','join-city','join-experience','join-languages','join-bio','join-bank'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.querySelectorAll('#join-specializations input').forEach(cb => cb.checked = false);
    const t = document.getElementById('join-terms');
    if (t) t.checked = false;
}

// File upload area simulation
document.addEventListener('click', e => {
    const ua = e.target.closest('.file-upload-area');
    if (ua && !ua.classList.contains('has-file')) {
        ua.classList.add('has-file');
        ua.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><p>certification_vedic.pdf uploaded</p><span class="file-upload-hint">Click to replace</span>`;
        showToast('File uploaded','success');
    }
});

// =============================================
// BOOKING MODAL
// =============================================
function openBookingWithCeremony(slug) {
    const sel = document.getElementById('modal-booking-ceremony');
    if (sel) sel.value = slug;
    updateBookingPrice();
    openModal('modal-booking');
}
function updateBookingPrice() {
    const sel = document.getElementById('modal-booking-ceremony');
    if (!sel) return;
    const c = ceremonyPrices[sel.value];
    if (!c) return;
    const total = c.price + 99;
    setText('#price-ceremony', `₹${c.price.toLocaleString()}`);
    setText('#price-total',    `₹${total.toLocaleString()}`);
    const btn = document.getElementById('confirm-booking-btn');
    if (btn) btn.textContent = `Confirm & Pay ₹${total.toLocaleString()}`;
}
function confirmBooking() {
    const btn = document.getElementById('confirm-booking-btn');
    if (btn) { btn.textContent = 'Processing...'; btn.disabled = true; }
    setTimeout(() => {
        const num  = `DC-2026-${Math.floor(10000 + Math.random()*90000)}`;
        const cer  = ceremonyPrices[document.getElementById('modal-booking-ceremony')?.value];
        const date = document.getElementById('modal-booking-date')?.value;
        const time = document.getElementById('modal-booking-time')?.value;
        setText('#booking-number-display', num);
        setText('#booking-summary-text',  `${cer?.name||'Ceremony'} with ${currentProfilePandit.name}`);
        const d = date ? new Date(date+'T00:00:00').toLocaleDateString('en-IN',{month:'long',day:'numeric',year:'numeric'}) : '';
        setText('#booking-date-text', `${d} • ${time||'Morning'}`);
        document.getElementById('booking-form-body').style.display    = 'none';
        document.getElementById('booking-success-body').style.display = '';
        showToast(`Booking ${num} confirmed! 🎉`, 'success');
    }, 1200);
}
function resetBookingModal() {
    const fb = document.getElementById('booking-form-body');
    const sb = document.getElementById('booking-success-body');
    if (fb) fb.style.display = '';
    if (sb) sb.style.display = 'none';
    const btn = document.getElementById('confirm-booking-btn');
    if (btn) { btn.disabled = false; updateBookingPrice(); }
}

// =============================================
// PANDIT PROFILE PAGE
// =============================================
function shareProfile() {
    const url = `https://divineconnect.in/pandit/${currentProfilePandit.name.replace(/\s+/g,'-').toLowerCase()}`;
    navigator.clipboard?.writeText(url)
        .then(()=>showToast('Profile link copied! 📋','success'))
        .catch(()=>showToast('Profile link copied! 📋','success'));
}
function toggleVideo(el) {
    const ph = el.closest ? el.closest('.video-placeholder') : el;
    if (!ph) return;
    if (ph.classList.contains('playing')) {
        ph.classList.remove('playing');
        ph.querySelector('.video-playing-text')?.remove();
        const svg = ph.querySelector('.video-play-btn svg');
        if (svg) svg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    } else {
        ph.classList.add('playing');
        const span = document.createElement('span');
        span.className = 'video-playing-text';
        span.textContent = '▶ Playing... tap to pause';
        ph.appendChild(span);
        const svg = ph.querySelector('.video-play-btn svg');
        if (svg) svg.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    }
}
function selectAvailDay(el, day) {
    if (el.classList.contains('booked')) {
        showToast(`June ${day} is fully booked`, 'error');
    } else {
        document.querySelectorAll('.avail-day.selected').forEach(d => d.classList.remove('selected'));
        el.classList.add('selected');
        showToast(`Selected June ${day} ✅`, 'success');
    }
}
function sidebarMuhuratSearch() {
    const sel = document.querySelector('#sidebar-booking-card select, #sidebar-booking-card .form-select');
    if (sel) selectedCeremony = sel.value || 'griha-pravesh';
    navigateTo('muhurat');
    setTimeout(() => {
        const wc = document.querySelector(`.wizard-ceremony-card[data-ceremony="${selectedCeremony}"]`);
        if (wc) { document.querySelectorAll('.wizard-ceremony-card').forEach(c=>c.classList.remove('selected')); wc.classList.add('selected'); }
    }, 300);
}

// =============================================
// EXPLANATION TOGGLES
// =============================================
function toggleExplanation(el) {
    const content = el.nextElementSibling;
    const isOpen  = el.classList.contains('open');
    document.querySelectorAll('.explanation-toggle.open').forEach(t => {
        if (t !== el) { t.classList.remove('open'); t.nextElementSibling?.classList.remove('show'); }
    });
    el.classList.toggle('open', !isOpen);
    content?.classList.toggle('show', !isOpen);
}
