/**
 * FM Interiors and Exteriors - Premium Japandi Script
 * Core JS for header state, mobile menu toggle, active section scrollspy,
 * timeline reveal, and requestAnimationFrame eased mouse parallax.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. MOBILE NAVIGATION TOGGLE ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking outside the mobile menu
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && e.target !== hamburger) {
      closeMenu();
    }
  });


  // --- 2. STICKY NAVBAR ON SCROLL ---
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header class
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Call once on load in case of refresh
  handleScroll();


  // --- 3. SCROLL ACTIVE LINK SPY ---
  // Sections to track and their corresponding nav links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const scrollSpy = () => {
    const scrollY = window.scrollY;
    const headerHeight = header.offsetHeight;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 20;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', scrollSpy, { passive: true });


  // --- 4. BACK TO TOP CLICK HANDLER ---
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  // --- 5. TIMELINE SCROLL REVEAL ANIMATION ---
  const revealItems = document.querySelectorAll('.timeline-item');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    const revealOnScroll = () => {
      const triggerBottom = window.innerHeight * 0.85;
      revealItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        if (itemTop < triggerBottom) {
          item.classList.add('revealed');
        }
      });
    };
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll(); // run once
  }


  // --- 6. MOUSE PARALLAX ANTI-GRAVITY EFFECT (requestAnimationFrame) ---
  const agViewport = document.getElementById('ag-viewport');
  const agElements = document.querySelectorAll('.ag-element');

  // Mouse coordinate values
  let mouseX = 0;
  let mouseY = 0;

  // Current animation coordinates (for easing)
  let currentX = 0;
  let currentY = 0;

  // Easing factor (lower is smoother/slower)
  const easing = 0.08;

  // Parallax sensitivity multiplier
  const sensitivity = 25;

  // Detect motion preferences and device properties
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.innerWidth > 768;

  if (agViewport && !isReducedMotion && isDesktop) {
    // Listen for mouse movements in the hero area (viewport or window)
    window.addEventListener('mousemove', (e) => {
      // Calculate mouse offset coordinates relative to window center (-0.5 to 0.5)
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
    }, { passive: true });

    // Core animation loop
    const animateParallax = () => {
      // Linear interpolation (lerp) for smooth easing
      currentX += (mouseX - currentX) * easing;
      currentY += (mouseY - currentY) * easing;

      agElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-speed')) || 1.0;
        
        // Calculate translation
        const tx = currentX * speed * sensitivity;
        const ty = currentY * speed * sensitivity;

        // Apply 3D translate for GPU acceleration and prevent repaints
        element.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });

      // Keep loop running
      requestAnimationFrame(animateParallax);
    };

    // Start loop
    requestAnimationFrame(animateParallax);
  }
});
