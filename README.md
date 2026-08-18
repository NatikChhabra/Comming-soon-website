# Numen — Coming Soon Website

A minimalist "coming soon" landing page for **Numen**, designed to make an indelible first impression and capture waitlist emails.

---

## 🌐 Live URLs & Domain Setup

- **GitHub Pages URL (Requested by GoDaddy):**  
  `https://natikchhabra.github.io/Comming-soon-website/`  
  Format: `natikchhabra.github.io/Comming-soon-website`
- **Custom Domain:**  
  `https://numen.site`

---

## 🗄️ Database Setup (Supabase)

This website uses **Supabase** (free PostgreSQL) to store waitlist subscribers.

### 1. Create a Supabase Project (Takes 1 minute)
1. Sign up or log in at [supabase.com](https://supabase.com).
2. Click **New Project** and name it `numen-waitlist`.

### 2. Run Database Schema
1. In your Supabase dashboard, click **SQL Editor** from the left navigation.
2. Copy and paste the contents of [`db/supabase_schema.sql`](./db/supabase_schema.sql).
3. Click **Run**. Your `waitlist_signups` table, security policies, and counter functions are now live!

### 3. Connect Keys
1. In Supabase, go to **Project Settings** -> **API**.
2. Copy:
   - **Project URL**
   - **anon / public Key**
3. Open `src/config.ts` and paste them, or set them as environment variables / GitHub Repository Secrets (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).

### 4. How to View & Export the Waitlist
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard).
2. Select your project and click **Table Editor** on the left menu.
3. Click **waitlist_signups** to see:
   - Every email entered
   - Timestamp of registration
   - ID
4. Click **Export to CSV** in the top right to download your list anytime.

---

## 🔗 Connecting GoDaddy Domain (`numen.site`)

### Method 1: GoDaddy Domain Forwarding (Simple)
If GoDaddy asks for forwarding destination:
- Destination URL: `https://natikchhabra.github.io/Comming-soon-website/`
- Forwarding type: **301 (Permanent)**
- Forward with masking: Optional (keeps `numen.site` in address bar)

### Method 2: Direct DNS Mapping (Recommended for Native HTTPS)
In GoDaddy DNS Management for `numen.site`:
1. Add **A Records** (Points apex domain `numen.site` to GitHub Pages IP addresses):
   - Type: `A`, Name: `@`, Value: `185.199.108.153`
   - Type: `A`, Name: `@`, Value: `185.199.109.153`
   - Type: `A`, Name: `@`, Value: `185.199.110.153`
   - Type: `A`, Name: `@`, Value: `185.199.111.153`
2. Add **CNAME Record**:
   - Type: `CNAME`, Name: `www`, Value: `natikchhabra.github.io`
3. In GitHub Repository: Go to **Settings** -> **Pages** -> **Custom domain** -> type `numen.site` and check **Enforce HTTPS**.

---

## 🔒 GitHub Repository Privacy Notice

- **GitHub Pages on GitHub Free:** GitHub Pages is available for **Public** repositories on free accounts. If you switch this repository to **Private** on GitHub Free, GitHub Pages hosting will pause (requires GitHub Pro for private repos).
- **If you need a Private Repo on a Free plan:** You can import this private GitHub repository into **Netlify** or **Vercel** for free with 1 click, and connect `numen.site`.

---

## 🛠️ Local Development & Build

```bash
npm install
npm run dev     # Starts local preview at http://localhost:3000
npm run build   # Builds static prerendered files to dist/client
```
