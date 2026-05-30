
# 🙏 DivineConnect

> **AI-powered Muhurat finding and verified Pandit booking for every sacred ceremony.**

DivineConnect bridges tradition and technology — helping families find auspicious timings (Muhurat) using Vedic astrology + AI, and instantly book verified Pandits for their ceremonies across India.

---

## ✨ Features

### For Devotees (Users)
| Feature | Description |
|---|---|
| 🔮 **AI Muhurat Finder** | 3-step wizard to find auspicious timings based on ceremony, date, location, Rashi & Nakshatra |
| 👨‍🦱 **Browse Pandits** | Filter by ceremony, city, language and price range across 500+ verified pandits |
| 📅 **Book a Pandit** | Complete booking flow with ceremony selection, date/time picker, and instant confirmation |
| ❤️ **Save Pandits** | Like and save favourite pandits for future ceremonies (persisted in localStorage) |
| 👤 **User Dashboard** | View upcoming & past bookings, saved pandits, and edit personal profile |
| 🔐 **Phone OTP Login** | Secure login via phone OTP or Google (simulated flow) |

### For Pandits
| Feature | Description |
|---|---|
| 🙏 **Pandit Portal Login** | Dedicated login flow — role chooser separates devotees from pandits |
| 📊 **Pandit Dashboard** | Upcoming ceremonies, past bookings with client ratings, earnings stats |
| 📸 **Portfolio Upload** | Upload real photos per ceremony type — Griha Pravesh, Vivah, Satyanarayan etc. |
| ⚙️ **Profile Settings** | Edit bio, specializations, languages, service area and bank details |
| ✅ **Accept / Decline** | Accept or decline incoming booking requests with one click |

### Platform
- 🎯 **Role-based login** — Beautiful "Who are you?" chooser screen (Devotee vs Pandit)
- 🔔 **Toast notifications** — Every action gives instant feedback (auto-dismiss, 3 types)
- 💳 **Booking Confirmation** — Price breakdown + unique booking ID (DC-2026-XXXXX)
- 📱 **Fully responsive** — Mobile-first design, works on all screen sizes
- 🌗 **Luxury design system** — Cormorant Garamond + DM Sans, Gold × Deep Maroon palette

---

## 🖼️ Pages

```
Home               → Hero, Ceremonies, How It Works, Featured Pandits, Testimonials
Muhurat Finder     → 3-step wizard → AI results with 3 auspicious windows
Browse Pandits     → Filterable/sortable pandit grid
Pandit Profile     → Full profile, video intro, ceremonies table, reviews, availability
User Dashboard     → My Bookings / Saved Pandits / My Profile tabs
Pandit Dashboard   → Upcoming / Past Bookings / Portfolio / Settings tabs
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (Semantic) |
| Styling | Vanilla CSS (Custom Design System, CSS Variables) |
| Logic | Vanilla JavaScript (ES6+, no frameworks) |
| Fonts | Google Fonts — Cormorant Garamond + DM Sans |
| Storage | localStorage (login state, saved pandits, saved muhurats) |
| Deployment | Netlify Drop (Static hosting) |

> **Zero dependencies.** No npm, no bundler, no framework — just HTML + CSS + JS.

---

## 📁 Project Structure

```
divineconnect/
│
├── index.html          # Full SPA — all 6 pages + modals in one file
├── styles.css          # Complete design system (~3900 lines)
│   ├── CSS Variables (colors, spacing, typography, shadows)
│   ├── Navigation, Hero, Ceremony Cards
│   ├── Muhurat Wizard & Results
│   ├── Pandit Listing & Profile
│   ├── Dashboard (User + Pandit)
│   ├── Modals (Login, Booking, Join as Pandit)
│   └── Responsive breakpoints
│
├── app.js              # All interactive logic (~550 lines)
│   ├── Data (panditsData, ceremonyPrices)
│   ├── Navigation & page routing
│   ├── Login system (Role chooser → OTP flow)
│   ├── Muhurat Wizard (3-step + loading + results)
│   ├── Pandit listing, filtering, sorting
│   ├── Booking modal flow
│   ├── User Dashboard tabs
│   ├── Pandit Dashboard tabs
│   ├── Portfolio photo upload
│   └── Toast, Modal, Animation utilities
│
└── README.md           # This file
```

---

## 🚀 Getting Started

### Run Locally

No build step needed. Just serve the folder with any static server:

```bash
# Option 1 — Node http-server
npx http-server ./divineconnect -p 8080 -c-1

# Option 2 — Python
python -m http.server 8080

# Option 3 — VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

Then open **http://localhost:8080**

---

## 🔐 Demo Login

The login is simulated (no real backend). Use any values:

| Role | How to Login |
|---|---|
| **Devotee** | Click Login → "I'm a Devotee" → any 10-digit phone → any OTP (4+ digits) |
| **Pandit** | Click Login → "I'm a Pandit" → any 10-digit phone → any OTP (4+ digits) |
| **Google** | Click Login → "I'm a Devotee" → "Continue with Google" |

After pandit login → lands on **Pandit Dashboard** automatically.  
After user login → nav shows **My Account** → leads to **User Dashboard**.

---

## 🎨 Design System

### Colors
```css
--color-gold:        #C8A951   /* Primary accent */
--color-maroon:      #5B1A2A   /* Primary brand */
--color-cream:       #FFF8F0   /* Background */
--color-text-primary:#2D1B0E   /* Body text */
```

### Typography
```css
--font-serif: 'Cormorant Garamond'  /* Headings, prices, big numbers */
--font-sans:  'DM Sans'             /* Body, labels, UI text */
```

### Key Components
- **Buttons**: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-lg`, `.btn-sm`
- **Tags**: `.tag-excellent`, `.tag-positive`, `.tag-neutral`, `.tag-caution`
- **Modals**: `.modal-overlay` + `.modal-card` (sm / md / lg)
- **Toasts**: Auto-dismiss, 3 types — success ✅ / error ❌ / info 💡
- **Dashboard Tabs**: `.dash-tab` + `.dash-panel.active`

---

## 📱 Ceremonies Supported

| Ceremony | Icon | Starting Price |
|---|---|---|
| Griha Pravesh | 🏠 | ₹3,500 |
| Vivah (Wedding) | 💒 | ₹11,000 |
| Satyanarayan Puja | 🙏 | ₹2,500 |
| Mundan | 👶 | ₹2,100 |
| Naamkaran | ✨ | ₹1,800 |
| Ganesh Puja | 🐘 | ₹2,000 |
| Laxmi Puja | 🪷 | ₹2,200 |
| Shradh | 🕯️ | ₹3,000 |

---

## 💰 Monetization Model (PRD v3)

| Stream | Description |
|---|---|
| Platform commission | 15% per booking |
| Priority listing | ₹999/month for pandits |
| Premium Muhurat | AI-enhanced report for families |
| NRI package | Outstation + online ceremony premium |
| Puja samagri | Material kit delivery (V2) |
| Corporate | Bulk bookings for offices/events |

---

## 🗺️ Roadmap

### MVP (Current)
- [x] AI Muhurat Finder wizard
- [x] Pandit browse, filter, sort
- [x] Full booking flow
- [x] User dashboard (bookings, saved, profile)
- [x] Pandit dashboard (upcoming, past, portfolio, settings)
- [x] Role-based login (devotee vs pandit)
- [x] Portfolio photo upload

### V2
- [ ] Real backend (Node.js + PostgreSQL)
- [ ] Actual OTP via Twilio / MSG91
- [ ] Payment gateway (Razorpay)
- [ ] Real Panchang API integration
- [ ] GPT-4o Muhurat explanations
- [ ] Pandit video intro upload (S3)
- [ ] Push notifications
- [ ] NRI / online ceremony support
- [ ] Mobile app (React Native)

---

## 👥 Personas

| Persona | Description |
|---|---|
| **Urban Devotee** | Tech-savvy professional, wants fast booking in 3 clicks |
| **Traditional Family** | Needs guidance on Muhurat, trusts verified pandits |
| **NRI** | Books ceremonies remotely for family in India |
| **Pandit** | Grows practice, manages schedule, showcases portfolio |

---

## 📄 License

MIT License — free to use, modify and distribute.

---

## 🙏 Acknowledgements

Built with the vision that every sacred ceremony deserves the right timing and the right guide.

> *"Yatra Dharma, Tatra Jaya"* — Where there is righteousness, there is victory.

---

Made with 🙏 in India · © 2026 DivineConnect
