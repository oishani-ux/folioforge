# 🚀 Folio Forge | Form-Based Portfolio Generator

> **Folio Forge** is an intuitive, web-based portfolio generator that instantly turns user inputs into clean, modern, and ready-to-share portfolio websites. Featuring real-time live preview, multiple customizable templates, dynamic entries, and one-click export capabilities.

---

## 📌 Project Overview

* **Project Title:** Folio Forge
* **Domain:** Web Development / Full-Stack Application
* **Type:** College Group Project (2-Person Team)

### 👥 Team Details
| Student Name | Roll Number | Role / Responsibilities |
| :--- | :--- | :--- |
| **[Student 1 Name]** | `[Roll No 1]` | Frontend Development, UI/UX Design, Live Preview Engine |
| **[Student 2 Name]** | `[Roll No 2]` | Backend Architecture, Database, Deployment & API Integration |

---

## ✨ Key Features & Level Breakdown

### 🟢 Level 1 (Core Fundamentals)
* **Interactive Input Form:** Input sections for Name, Tagline, About Me, Skills, Projects, and Social Links.
* **Real-time Live Preview:** Watch the portfolio layout render live on screen as you type.
* **Template Selector:** Choose from 2 distinct presentation templates.
* **Single-File HTML Export:** Download the generated portfolio directly as a standalone HTML file.

### 🟡 Level 2 (Enhanced Customization & Export)
* **Expanded Template Suite:** 3+ polished templates with customizable color themes and font families.
* **Dynamic Form Fields:** Dynamically add or remove project items on the fly.
* **Media Uploads:** Upload and display custom profile photos.
* **Auto-Save Drafts:** Automatic `localStorage` state saving to prevent data loss on page refresh.
* **ZIP Package Export:** Export portfolios as a structured ZIP file (`index.html`, `style.css`, image assets) optimized for mobile responsiveness.

### 🔴 Level 3 (Full-Stack & Cloud Integration)
* **User Authentication:** Account management storing saved user portfolios securely in a database.
* **Public Web Hosting:** Publish portfolios directly to a unique public URL (e.g., `/u/username`).
* **GitHub API Integration:** Automatically fetch and import public repositories into the project section using a GitHub username.
* **SEO & Analytics:** Pre-configured social meta tags (Open Graph) and a basic view counter for published links.
* **Cloud Deployment:** Fully deployed, publicly accessible web application.

---

## 🛠️ Tech Stack

### Frontend
* **UI Framework/Library:** HTML5, CSS3 / Tailwind CSS, JavaScript (ES6+) / React.js
* **Live Rendering:** Reactive State Management / DOM Syncing
* **Exporting Tools:** JSZip, FileSaver.js

### Backend & Database *(Level 2/3)*
* **Server Runtime:** Node.js / Express.js (or Python FastAPI/Flask)
* **Database:** MongoDB / PostgreSQL
* **Authentication:** JWT (JSON Web Tokens) / OAuth

### External APIs & Deployment
* **APIs:** GitHub REST API (Project Import)
* **Hosting:** Vercel / Render / Netlify

---

## 🏗️ System Architecture & Workflow

```text
[ User Form Inputs / GitHub Import ] 
                  │
                  ▼
   [ Real-Time Live Preview Engine ]
                  │
       ┌──────────┴──────────┐
       ▼                     ▼
[ Local Export ]      [ Server / Cloud ]
   - Single HTML         - User Auth / DB Storage
   - ZIP Package         - Public URL Generation (/u/username)