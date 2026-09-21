# House Of Karma (Leh, Ladakh) — Client Handbook & Operations Guide

Welcome to the official system manual for **House Of Karma**, a boutique backpacker hostel web platform and booking engine located in Leh, Ladakh (11,500 ft).

This document explains **everything** about how the platform functions, how guests book beds and private rooms, how payments work, how the two-way calendar sync keeps Booking.com and Airbnb aligned without double-bookings, and how staff manage reservations through the Admin Dashboard.

---

## 1. Quick Reference: Official Contact Information

All guest communication touchpoints, header navigation, footer, WhatsApp floating button, and confirmation screens are standardized with the official property contact:

* **Official Contact Number (Calling & WhatsApp):** `+91 60066 19569`
* **Direct WhatsApp Click-to-Chat Link:** `https://wa.me/916006619569`
* **Official Desk Email:** `hello@houseofkarma.in`
* **Physical Address:** Fort Road, Leh, Ladakh 194101 (5 min walk to Leh Main Bazaar, 10 min drive to IXL Airport)

---

## 2. Step-by-Step Guest Journey: How Booking Works

The website provides a frictionless, 3-step direct booking flow designed for solo backpackers, bikers, digital nomads, and group travelers on mobile and desktop.

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐     ┌────────────────────────┐
│  1. Discovery   │ ──> │  2. Dates & Room     │ ──> │  3. Guest Details    │ ──> │  4. Checkout & Receipt │
│  Hero & Badges  │     │  Interactive Picker  │     │  Govt ID & Contact   │     │  Razorpay / WhatsApp   │
└─────────────────┘     └──────────────────────┘     └──────────────────────┘     └────────────────────────┘
```

### Step 1: Browsing & Quick Availability
1. **Homepage Hero Bar:**
   * Guests can immediately pick check-in and check-out dates, select their room type (**Dorm Pod** vs. **Private Himalayan Room**), and specify guest count.
   * Clicking **"Check Availability"** automatically loads the booking engine with their selected dates pre-populated.
2. **Room Category Showcase:**
   * Guests can also scroll to the **"Where You'll Stay"** section and click **"Book Now"** on any specific card:
     * **Mixed Dorm Pod (8-bed):** Privacy curtains, personal lockbox, reading light, universal plug points (₹599/night).
     * **Female Dorm Pod (6-bed):** Female-only floor, dedicated lockers, reading light, warm linens (₹699/night).
     * **Private Himalayan Room (Standard):** Mountain view, ensuite heated bath, work desk, room heater (₹2,499/night).
     * **Private Himalayan Room (Deluxe):** Private balcony, valley panorama, room heater, premium bedding (₹3,499/night).

---

### Step 2: Interactive Date Selection & Live Overlap Check
1. The guest arrives at `/book`.
2. The interactive calendar (`react-day-picker`) highlights today and prevents picking past dates.
3. The system contacts the backend API (`/api/availability`):
   * It checks all existing **Confirmed** and **Pending** website bookings.
   * It checks all **Blocked Dates** (dates closed by the manager or synced from Booking.com via iCal).
4. If the selected dates are free, the system displays the breakdown and enables the **"Continue to Guest Details"** button.

---

### Step 3: Guest Details Collection
The guest provides their information via `/book`:
* **Full Name** (as per Government ID)
* **Email Address** (receives booking voucher)
* **Phone / WhatsApp Number** (for Leh road condition alerts and pickup coordination)
* **Nationality** (Indian / International)
* **Government ID Type & Number** (Aadhaar, Passport, Voter ID, Driving License) — required by local Ladakh tourism protocols.

---

### Step 4: Transparent Pricing Breakdown
Before payment, a clear summary is displayed in the sidebar:
* **Base Accommodation:** `Price Per Night × Number of Nights`
* **Local Taxes (GST):** 12% for rooms under ₹7,500/night; 18% for luxury tiers.
* **Total Payable Amount:** Clearly formatted in Indian Rupees (INR).
* **Transparent Amenities Included:** 24/7 Hot Water (Solar + Geyser), High-Speed Starlink Wi-Fi, Heated Blankets, In-house Oxygen Support.

---

### Step 5: Secure Payment Options
Guests can choose between two flexible payment methods:

#### Option A: Pay Online (Instant Confirmation via Razorpay)
1. Guest clicks **"Pay Online"**.
2. The server creates a cryptographically secured Razorpay order (`/api/payment/create-order`).
3. Razorpay’s checkout opens directly on screen, accepting:
   * **UPI:** Google Pay, PhonePe, Paytm, BHIM.
   * **Cards:** Credit/Debit (Visa, Mastercard, RuPay, Amex).
   * **Netbanking & Wallets**.
4. Upon successful payment, Razorpay sends back a signature (`razorpay_signature`).
5. The backend verifies the HMAC SHA256 cryptographic signature (`/api/payment/verify`) and immediately updates the booking status to **CONFIRMED**.

#### Option B: Pay at Property / Advance UPI Deposit
1. Designed for backpackers who prefer paying on arrival or making an advance UPI deposit via WhatsApp.
2. Clicking **"Pay at Property"** confirms the booking in the system and redirects to the confirmation page.
3. The guest receives a one-tap button to message the desk on WhatsApp with their booking reference code.

---

### Step 6: Confirmation Screen & Ladakh Acclimatization Care
The guest is redirected to `/book/confirmation?bookingId=...`:
* **Unique Booking Reference:** Formatted as `HOK-XXXXXX`.
* **Complete Stay Summary:** Room name, Check-in date, Check-out date, Guest name, Amount.
* **Ladakh High-Altitude Advisory (11,500 ft):** Informs travelers of the mandatory 24–48 hour rest protocol upon landing at Leh (IXL) airport.
* **One-Tap WhatsApp Connect:** A green CTA button opening `https://wa.me/916006619569` with a pre-formatted message:
  > *"Hello House Of Karma! I have a reservation (Ref: HOK-123456) for Mixed Dorm Pod from 22 Sep to 25 Sep. My name is Tenzin. Could you please confirm road & check-in details?"*
* **Direct Call Button:** `tel:+916006619569` for instant voice assistance.

---

## 3. Two-Way Calendar Sync (iCal / .ics Protocol)

To eliminate double-bookings between direct website reservations and Online Travel Agencies (OTAs like **Booking.com**, **Airbnb**, and **Hostelworld**), House Of Karma uses the open **RFC 5545 iCal (.ics)** protocol.

```
 ┌─────────────────────────────────────────────────────────────┐
 │                    TWO-WAY CALENDAR SYNC                    │
 └─────────────────────────────────────────────────────────────┘

       [Direct Website Booking]                   [Booking.com / Airbnb]
                  │                                         │
                  ▼                                         ▼
         Prisma SQLite Database                     OTA Calendar Feed (.ics)
                  │                                         │
                  ▼                                         ▼
   OUTBOUND FEED (/api/calendar/export)           INBOUND SYNC (/api/calendar-sync)
                  │                                         │
                  ▼                                         ▼
      Booking.com imports .ics                  Hostel blocks OTA dates
     and closes dates on OTA!                   on direct booking engine!
```

### 1. Outbound Synchronization (Hostel Website ➜ Booking.com)
* Every room has its own live iCal subscription URL:
  * Mixed Dorm: `https://yourdomain.com/api/calendar/export/dorm-pod-mixed`
  * Female Dorm: `https://yourdomain.com/api/calendar/export/dorm-pod-female`
  * Private Standard: `https://yourdomain.com/api/calendar/export/private-standard`
  * Private Deluxe: `https://yourdomain.com/api/calendar/export/private-deluxe`
* **How to configure in Booking.com Extranet:**
  1. Log into your Booking.com Partner Hub.
  2. Navigate to **Rates & Availability** ➜ **Sync Calendars**.
  3. Click **Add Calendar Connection**.
  4. Paste the House Of Karma Outbound Feed URL for that specific room.
  5. Whenever a guest books on your website, Booking.com reads this feed and automatically closes those dates.

### 2. Inbound Synchronization (Booking.com ➜ Hostel Website)
* **How to configure in House Of Karma Admin:**
  1. In Booking.com Extranet, click **Export Calendar** and copy the `.ics` link provided by Booking.com.
  2. Log into House Of Karma Admin at `/admin/calendar`.
  3. Under **"iCal Feed Management"**, select the room and paste the Booking.com `.ics` URL.
  4. Click **"Sync Now"** (or let the automated scheduler run).
  5. The platform downloads the OTA events, parses the dates using `node-ical`, and records them in the database as `source: "OTA_SYNC"` blocked dates.
  6. Guests browsing the website will now see those dates as unavailable.

---

## 4. Admin Dashboard Operations Guide

Staff and managers have a dedicated, password-protected portal to run daily hostel operations.

### How to Access the Admin Portal
* **URL:** `https://yourdomain.com/admin/login` (or `http://localhost:3000/admin/login` during testing)
* **Default Admin Username:** `admin`
* **Default Admin Password:** `changeme123` *(configurable in `.env`)*
* **Security:** Authenticated using Edge-compatible JWT signed cookies with HTTP-only protection.

---

### Admin Features & Controls

| Screen | URL | Purpose & Actions |
|:-------|:----|:------------------|
| **Dashboard** | `/admin/dashboard` | **Real-time Overview:** Total monthly bookings, confirmed stays, monthly revenue, pending reservations, and a live table of today's check-ins and recent bookings. |
| **Bookings Manager** | `/admin/bookings` | **Reservations Table:** Search guests by name or reference ID. Filter by status (Confirmed, Pending, Cancelled). View contact numbers, dates, payment status, and cancel or approve bookings. |
| **Calendar & iCal** | `/admin/calendar` | **Availability & Channel Management:**<br>1. **Visual Room Calendar:** View all booked and blocked dates on a clean grid.<br>2. **Manual Date Blocking:** Block dates for repairs, winter off-season, or offline group walk-ins.<br>3. **iCal Channel Manager:** Copy Outbound feeds for Booking.com and paste Inbound feeds from OTAs. |

---

## 5. Technology Stack & Architecture

| Layer | Technology | Details |
|:------|:-----------|:--------|
| **Core Framework** | **Next.js 15 (App Router)** | Fast server-side rendering, React 19, small JavaScript bundle for flaky 4G/5G connections in high-altitude Ladakh. |
| **Styling** | **Tailwind CSS v4** | Himalayan vernacular theme tokens: Terracotta (`#B85C38`), Sandstone (`#E0C097`), Timber (`#5C3D2E`), Slate (`#4A5568`), Off-White (`#FAF6F1`), and Charcoal (`#2D3748`). |
| **Typography** | **Google Fonts** | `Playfair Display` for editorial mountain headings paired with `Plus Jakarta Sans` for body readability. |
| **Database & ORM** | **Prisma 6 + SQLite (WAL Mode)** | Self-contained, lightweight, zero-maintenance relational storage in `prisma/hostel.db`. |
| **Payments** | **Razorpay Node SDK + Checkout.js** | Native INR payments supporting UPI QR, Cards, Netbanking, and Pay-at-Property. |
| **Calendar Sync** | **ical-generator & node-ical** | Industry-standard RFC 5545 iCal synchronization for Booking.com & Airbnb. |
| **Authentication** | **jose (JWT) & bcryptjs** | Secure password hashing and Edge-compatible encrypted session tokens. |

---

## 6. How to Run & Deploy the Project

### Running Locally on Development Machine
1. Open PowerShell or Terminal in the project root:
   ```bash
   cd c:\Users\hp\Documents\tenzin_workspace\houseOfKarma
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser:
   * **Guest Website:** `http://localhost:3000`
   * **Direct Booking:** `http://localhost:3000/book`
   * **Admin Portal:** `http://localhost:3000/admin/login`

### Building for Production
Verify compilation and static site generation anytime:
```bash
npm run build
npm start
```

### Database Maintenance Commands
* Reset / Seed database with default rooms & admin:
  ```bash
  npx tsx prisma/seed.ts
  ```
* Open visual database browser:
  ```bash
  npx prisma studio
  ```

---

## 7. Brand Identity & Animated Loading System

### 1. Logo Display Across Every Page
The House Of Karma brand identity (the geometric terracotta-and-black HOK emblem and logotype) is prominently and crisply displayed across every single page of the application:
* **Desktop & Mobile Navbar:** Features the razor-sharp HOK emblem with dynamic contrast (adapting automatically between the dark mountain hero image and scrolled white header).
* **Mobile Navigation Drawer:** Features a centered HOK brand header when visitors open the hamburger menu on their phones.
* **Footer:** Displays the authentic terracotta HOK emblem with clean white typography on dark charcoal across all pages.
* **Direct Booking Flow (`/book`):** Displays the brand emblem at the top of the date & room selection flow.
* **Booking Confirmation Receipt (`/book/confirmation`):** Displays the brand emblem right above the booking reference voucher.
* **Admin Login & Sidebar:** Features the HOK emblem on the login card and at the top of the admin navigation sidebar.
* **Browser Tabs & Mobile Home Screens:** Configured with high-resolution `icon.png` (192x192) so guests see the House Of Karma logo in browser bookmarks and mobile tabs.

### 2. Branded Buffering & Page Loading Animation
Instead of generic, boring spinning wheels, any page buffering or data loading displays the custom **BrandedLoader**:
* Displays the pulsing House Of Karma geometric emblem with a warm ambient terracotta glow.
* Shows reassuring mountain travel messages (*"Loading your mountain sanctuary..."* / *"House Of Karma · Leh, Ladakh"*).
* Features a smooth terracotta progress bar indicating live network activity.
* Automatically triggers during page transitions, direct booking availability checks, and reservation confirmation retrieval.

---

## 8. Client Summary & Handover Checklist

* [x] **Brand & Identity:** House Of Karma logo placed clearly on every page (Navbar, Mobile Menu, Footer, Booking, Receipt, Admin, Browser Tabs).
* [x] **Branded Buffering Animation:** Custom pulsing HOK emblem loader for seamless page and booking transitions.
* [x] **Contact Updated Everywhere:** Phone & WhatsApp set to `+91 60066 19569` across layout, footer, floating button, booking flow, and confirmation.
* [x] **Direct Booking Engine:** Complete 3-step date, room, and guest booking flow.
* [x] **Real Asset Imagery:** Authentic photographs integrated across Hero, Rooms, Cafe, Courtyard, and Nomad Lounge.
* [x] **Payment Gateway:** Razorpay integrated with online UPI/card payment + Pay at Property option.
* [x] **Two-Way iCal Calendar Sync:** RFC 5545 export and import endpoints ready for Booking.com.
* [x] **Admin Operations Portal:** Dashboard, Bookings Manager, and Calendar Date Blocking live.
* [x] **High-Altitude Essentials:** Ladakh trust badges (Hot water, Starlink Wi-Fi, Heating, Oxygen) and Acclimatization guide prominently displayed.
* [x] **Production Build Verified:** All routes, static pages, and server components compile with zero errors.

