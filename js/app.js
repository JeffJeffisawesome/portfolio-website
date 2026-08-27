/**
 * Jeffrey Zhu - Main Application Logic
 * Handles theme switching, mobile drawer, interactive filters, modal viewers, ETL pipeline flow, and copy toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initCourseworkFilter();
  initSkillsFilter();
  initETLPipelineExplorer();
  initEmailCopy();
  initContactForm();
  initProjectModals();
});

/* ==========================================================================
   Theme Toggle (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'dark');

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`);
    });
  }
}

function updateThemeIcon(theme) {
  const iconContainer = document.getElementById('theme-toggle-icon');
  if (!iconContainer) return;
  
  if (theme === 'light') {
    // Show Moon icon for light mode
    iconContainer.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  } else {
    // Show Sun icon for dark mode
    iconContainer.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  }
}

/* ==========================================================================
   Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   Scroll Spy & Active Navbar Link
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   Coursework Filtering Matrix
   ========================================================================== */
function initCourseworkFilter() {
  const filterBtns = document.querySelectorAll('.course-filter-btn');
  const courseItems = document.querySelectorAll('.course-item');

  if (!filterBtns.length || !courseItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      courseItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter || (filter === 'systems' && item.getAttribute('data-subcat') === 'systems')) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Skills Search & Dynamic Filter
   ========================================================================== */
function initSkillsFilter() {
  const searchInput = document.getElementById('skill-search-input');
  const skillPills = document.querySelectorAll('.skill-pill');

  if (!searchInput || !skillPills.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    skillPills.forEach(pill => {
      const text = pill.textContent.toLowerCase();
      if (text.includes(query)) {
        pill.style.display = 'inline-flex';
        pill.style.borderColor = query ? 'var(--carolina-blue-light)' : 'var(--border-subtle)';
      } else {
        pill.style.display = 'none';
      }
    });
  });
}

/* ==========================================================================
   Interactive UNC School of Medicine IT ETL Pipeline Explorer
   ========================================================================== */
function initETLPipelineExplorer() {
  const stageCards = document.querySelectorAll('.etl-stage-card');
  const detailsPanel = document.getElementById('etl-details-text');

  const stageDescriptions = {
    '1': '<strong>Step 1: Automated Extraction & FTP Ingestion:</strong> Python ingestion scripts execute scheduled jobs to query external REST APIs and download millions of PubMed XML/JSON baseline records via automated FTP endpoints.',
    '2': '<strong>Step 2: Cleansing & Parsing:</strong> Custom Python data pipelines sanitize messy bibliographic data, eliminate duplicates, extract normalized author/mesh metadata, and validate schema integrity.',
    '3': '<strong>Step 3: Enterprise Informatica & SQL Server ETL:</strong> Informatica workflows orchestrate enterprise-scale dimensional transformations into relational SQL Server data warehouses across hundreds of thousands of patient and research records.',
    '4': '<strong>Step 4: Tableau Decision Dashboards:</strong> Automated views and stored procedures feed 3 high-impact Tableau dashboards, providing School of Medicine executives with real-time operational analytics and research insights.'
  };

  if (!stageCards.length || !detailsPanel) return;

  stageCards.forEach(card => {
    card.addEventListener('click', () => {
      stageCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const stage = card.getAttribute('data-stage');
      if (stageDescriptions[stage]) {
        detailsPanel.innerHTML = stageDescriptions[stage];
      }
    });
  });
}

/* ==========================================================================
   Email Copy & Toast Notifications
   ========================================================================== */
function initEmailCopy() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = 'jeffjeffisawesome@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  });
}

function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-emerald);">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ==========================================================================
   Contact Form Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    const mailtoUrl = `mailto:jeffjeffisawesome@gmail.com?subject=Contact%20from%20Portfolio%20(${encodeURIComponent(name)})&body=${encodeURIComponent(message)}%0A%0AFrom:%20${encodeURIComponent(name)}%20(${encodeURIComponent(email)})`;
    
    window.location.href = mailtoUrl;
    showToast('Opening default email client...');
    form.reset();
  });
}

/* ==========================================================================
   Project Architecture Modals
   ========================================================================== */
function initProjectModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  const overlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      overlays.forEach(modal => modal.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });

  overlays.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}
