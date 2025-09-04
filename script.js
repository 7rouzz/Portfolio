// Theme toggle with persistence
const themeBtn = document.getElementById('theme-btn');
themeBtn.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  updateThemeIcon();
});

// Update theme icon based on current theme
function updateThemeIcon() {
  if (document.documentElement.classList.contains('dark')) {
    themeBtn.textContent = '☀️';
  } else {
    themeBtn.textContent = '🌙';
  }
}

// Set initial theme from localStorage or preference
function initTheme() {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon();
}

// Preloader
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 400);
  }, 1000);
});

// Mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('change', () => {
  document.body.style.overflow = navToggle.checked ? 'hidden' : '';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.checked = false;
    document.body.style.overflow = '';
  });
});

// Modal functionality
function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Close modals with Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.show').forEach(modal => {
      closeModal(modal.id);
    });
  }
});

// Close modal when clicking outside content
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal.id);
    }
  });
});

// Project card click handlers
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', (e) => {
    // Don't trigger if clicking on a link or button
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    const projectId = card.getAttribute('data-project');
    openModal(`modal-${projectId}`);
  });
});

// Project detail button handlers
document.querySelectorAll('.project-details-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const projectId = btn.closest('.project-card').getAttribute('data-project');
    openModal(`modal-${projectId}`);
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    
    if (target) {
      const navHeight = document.querySelector('.nav').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Add shadow to navbar on scroll
function handleNavbarScroll() {
  const nav = document.querySelector('.nav');
  if (window.scrollY > 10) {
    nav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  } else {
    nav.style.boxShadow = 'none';
  }
}

// Animate skill bars when they come into view
function animateSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  skillBars.forEach(bar => {
    const rect = bar.getBoundingClientRect();
    const isInViewport = rect.top <= (window.innerHeight || document.documentElement.clientHeight) && 
                         rect.bottom >= 0;
    
    if (isInViewport && !bar.classList.contains('animated')) {
      const width = bar.getAttribute('data-width');
      bar.style.width = width;
      bar.classList.add('animated');
    }
  });
}

// Intersection Observer for animations
function initIntersectionObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // Observe elements that should animate in
  document.querySelectorAll('.skill-category, .project-card, .contact-item').forEach(el => {
    observer.observe(el);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  handleNavbarScroll();
  initIntersectionObserver();
  
  // Set up scroll event listeners
  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    animateSkillBars();
  });
  
  // Initial check for skill bars in viewport
  animateSkillBars();
});

// Add CSS for animation classes
const style = document.createElement('style');
style.textContent = `
  .skill-category, .project-card, .contact-item {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .skill-progress {
    transition: width 1.5s ease-in-out;
  }
`;
document.head.appendChild(style);