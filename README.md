# Jeffrey Zhu - Personal Portfolio Website

An interactive, responsive portfolio website showcasing the technical work, education, and projects of **Jeffrey Zhu** (B.S. in Computer Science & Applied Mathematics @ UNC-Chapel Hill).

## 🚀 Features

- **Hero & Metrics**: Highlighting academic honors (3.86 GPA, Dean's List), UNC School of Medicine IT experience, and key engineering domains.
- **Interactive Cryptographic Visualizer**: A live in-browser simulation of the **Signal Double-Ratchet Algorithm**, demonstrating Diffie-Hellman ratcheting, symmetric KDF chains, forward secrecy, and post-compromise security recovery.
- **Interactive AI Study Buddy Sandbox**: A live simulation of the **CSXL OpenAI Study Buddy tool** built with FastAPI and Red Hat Pods architecture.
- **Work Experience & ETL Flow**: Interactive visualizer of the 4-stage data pipeline developed at **UNC School of Medicine IT** (Ingestion $\rightarrow$ Cleansing $\rightarrow$ SQL/Informatica $\rightarrow$ Tableau Dashboards).
- **Coursework & Academics Matrix**: Dynamic filterable matrix across Computer Science, Applied Mathematics, and Systems & Security.
- **Skills Matrix**: Categorized and searchable tech stack badges (Python, Java, C, TypeScript, FastAPI, Docker, SQL Server, Tableau, Cryptography, etc.).
- **Connect & Contact Hub**: Quick email copy button with toast feedback, direct mail composer, and quick links to GitHub and LinkedIn.
- **Modern UI & Theming**: Dark/Light mode switcher with persistence, smooth scroll navigation, glassmorphism, responsive mobile drawer, and print/PDF stylesheet.

---

## 💻 Local Preview

You can open `index.html` directly in any modern browser, or run a lightweight local HTTP server:

```bash
# Using Python 3
python3 -m http.server 8000

# Open http://localhost:8000 in your browser
```

---

## 📁 Project Structure

```
portfolio website/
├── index.html               # Main website structure & semantic sections
├── css/
│   ├── style.css            # Design tokens, variables, typography & layout
│   ├── components.css       # Cards, widgets, timeline, buttons & badges
│   └── responsive.css       # Mobile responsiveness, modals & print styles
├── js/
│   ├── app.js               # Theme toggle, filters, scroll spy, modal & toasts
│   ├── ratchet-demo.js      # Signal Double-Ratchet Cryptographic visualizer
│   └── ai-study-demo.js     # CSXL AI Study Buddy simulation engine
└── README.md                # Project documentation & deployment guide
```
