var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.isDeleting = false;
    this.tick();
};

TxtType.prototype.tick = function () {
    const i = this.loopNum % this.toRotate.length;
    const fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Create a wrapping element for the text
    const wrapElement = document.createElement('span');
    wrapElement.classList.add('wrap');
    wrapElement.innerHTML = this.txt;
    
    // Clear previous content and add the new content
    this.el.innerHTML = '';
    this.el.appendChild(wrapElement);

    // Calculate a slightly variable typing speed for more natural effect
    const baseSpeed = 100;
    const variability = 30;
    let delta = baseSpeed + Math.floor(Math.random() * variability * 2) - variability;

    if (this.isDeleting) {
        delta /= 2; // Deletion is faster
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period; // Pause at end of word
        setTimeout(() => {
            this.isDeleting = true;
            this.tick();
        }, delta);
        return;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500; // Pause before starting new word
        setTimeout(() => this.tick(), delta);
        return;
    }

    setTimeout(() => this.tick(), delta);
};

// Check for saved theme preference or default to dark
function getThemePreference() {
    return localStorage.getItem('theme') || 'dark';
}

// Apply the current theme to the body
function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
}

// Toggle between light and dark themes
function toggleTheme() {
    const currentTheme = getThemePreference();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    updateThemeIcon(newTheme);
}

// Update the theme toggle icon based on current theme
function updateThemeIcon(theme) {
    const themeIcons = document.querySelectorAll('#theme-toggle i, #mobile-theme-toggle i');
    themeIcons.forEach(icon => {
        if (theme === 'light') {
            icon.textContent = 'brightness_3'; // moon icon for dark mode
        } else {
            icon.textContent = 'brightness_7'; // sun icon for light mode
        }
    });
}

window.onload = function () {
    // Initialize typewriter effect
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }

    // Apply saved theme
    const currentTheme = getThemePreference();
    applyTheme(currentTheme);
    updateThemeIcon(currentTheme);
};

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Materialize components
    M.AutoInit();

    // Specifically initialize tooltips
    var tooltipElems = document.querySelectorAll('.tooltipped');
    var tooltipInstances = M.Tooltip.init(tooltipElems, {
        enterDelay: 300,
        exitDelay: 100,
        position: 'top'
    });

    // Set up sidenav for desktop and mobile
    var elems = document.querySelectorAll('.sidenav');
    var sidenavInstances = M.Sidenav.init(elems, {
        edge: 'left',
        draggable: true,
        preventScrolling: true,
        onOpenStart: function () {
            // Add class to show sidenav
            document.querySelector('.sidenav').classList.add('show-on-medium-and-down');
        },
        onCloseEnd: function () {
            // Remove class when sidenav is closed
            document.querySelector('.sidenav').classList.remove('show-on-medium-and-down');
        }
    });

    // Enhanced smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close sidenav if it's open
            var sidenav = M.Sidenav.getInstance(document.querySelector('.sidenav'));
            if (sidenav && sidenav.isOpen) {
                sidenav.close();
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if it's just "#"

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Get the navbar height to offset the scroll position
                const navbarHeight = document.querySelector('.navbar-fixed').offsetHeight;

                // Calculate the position to scroll to
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                // Smooth scroll to target
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Check screen size and adjust body class for desktop view
    function adjustLayout() {
        if (window.innerWidth > 992) {
            document.body.classList.add('has-fixed-sidenav');
        } else {
            document.body.classList.remove('has-fixed-sidenav');
        }
    }

    // Initial adjustment and listen for window resize
    adjustLayout();
    window.addEventListener('resize', adjustLayout);

    // Initialize scrollspy for smooth scrolling
    var scrollSpyElems = document.querySelectorAll('.scrollspy');
    M.ScrollSpy.init(scrollSpyElems, {
        scrollOffset: 70
    });

    // Setup theme toggle listeners
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('mobile-theme-toggle').addEventListener('click', toggleTheme);

    // Animate on scroll effect
    const fadeIns = document.querySelectorAll('.card, .skill-card, .project-card');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeIns.forEach(fadeIn => {
        observer.observe(fadeIn);
    });
});

// Image Modal Functionality with Zoom and Pan
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('imageCaption');
    const closeBtn = document.getElementsByClassName('image-modal-close')[0];

    // Zoom and pan variables
    let scale = 1;
    let panning = false;
    let pointX = 0;
    let pointY = 0;
    let start = { x: 0, y: 0 };
    let transformX = 0;
    let transformY = 0;

    // Add click event to all images that should be enlargeable
    const enlargeableImages = document.querySelectorAll('.profile-image, .card-image img, img[src*="project"]');
    
    enlargeableImages.forEach(function(img) {
        // Add clickable class for hover effect
        img.classList.add('clickable-image');
        
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
            
            // Reset zoom and pan
            resetZoomAndPan();
            
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        });
    });

    // Reset zoom and pan function
    function resetZoomAndPan() {
        scale = 1;
        transformX = 0;
        transformY = 0;
        modalImg.style.transform = `translate(-50%, -50%) scale(${scale})`;
        modalImg.style.cursor = 'zoom-in';
    }

    // Function to close modal with animation
    function closeModal() {
        modal.classList.add('closing');
        
        setTimeout(function() {
            modal.style.display = 'none';
            modal.classList.remove('closing');
            document.body.style.overflow = 'auto';
            resetZoomAndPan();
        }, 300); // Match the animation duration
    }

    // Zoom functionality with mouse wheel
    modalImg.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const rect = modalImg.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.min(Math.max(1, scale + delta), 3); // Limit scale between 1 and 3
        
        if (newScale !== scale) {
            const scaleChange = newScale / scale;
            
            // Adjust transform to zoom toward mouse position
            transformX = offsetX - (offsetX - transformX) * scaleChange;
            transformY = offsetY - (offsetY - transformY) * scaleChange;
            
            scale = newScale;
            updateTransform();
            
            // Update cursor based on zoom level
            modalImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
        }
    });

    // Double-click to zoom in/out
    modalImg.addEventListener('dblclick', function(e) {
        if (scale === 1) {
            // Zoom in to 2x at click position
            const rect = modalImg.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            
            scale = 2;
            transformX = offsetX - offsetX * 2;
            transformY = offsetY - offsetY * 2;
        } else {
            // Reset zoom
            scale = 1;
            transformX = 0;
            transformY = 0;
        }
        
        updateTransform();
        modalImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
    });

    // Panning functionality
    modalImg.addEventListener('mousedown', function(e) {
        if (scale > 1) {
            e.preventDefault();
            panning = true;
            start = { x: e.clientX - transformX, y: e.clientY - transformY };
            modalImg.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (!panning) return;
        e.preventDefault();
        
        transformX = e.clientX - start.x;
        transformY = e.clientY - start.y;
        updateTransform();
    });

    document.addEventListener('mouseup', function() {
        if (panning) {
            panning = false;
            modalImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
        }
    });

    // Touch support for mobile devices
    let initialDistance = 0;
    let initialScale = 1;

    modalImg.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            // Pinch zoom start
            e.preventDefault();
            initialDistance = getDistance(e.touches[0], e.touches[1]);
            initialScale = scale;
        } else if (e.touches.length === 1 && scale > 1) {
            // Pan start
            e.preventDefault();
            panning = true;
            start = { x: e.touches[0].clientX - transformX, y: e.touches[0].clientY - transformY };
        }
    });

    modalImg.addEventListener('touchmove', function(e) {
        e.preventDefault();
        
        if (e.touches.length === 2) {
            // Pinch zoom
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const newScale = Math.min(Math.max(1, initialScale * (currentDistance / initialDistance)), 3);
            
            if (newScale !== scale) {
                scale = newScale;
                updateTransform();
            }
        } else if (e.touches.length === 1 && panning) {
            // Pan
            transformX = e.touches[0].clientX - start.x;
            transformY = e.touches[0].clientY - start.y;
            updateTransform();
        }
    });

    modalImg.addEventListener('touchend', function(e) {
        if (e.touches.length === 0) {
            panning = false;
        }
    });

    // Helper function to get distance between two touch points
    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Update transform function
    function updateTransform() {
        modalImg.style.transform = `translate(calc(-50% + ${transformX}px), calc(-50% + ${transformY}px)) scale(${scale})`;
    }

    // Close modal when clicking the X
    closeBtn.addEventListener('click', function() {
        closeModal();
    });

    // Close modal when clicking outside the image (but not when zoomed and panning)
    modal.addEventListener('click', function(event) {
        if (event.target === modal && scale === 1) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Reset zoom with R key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'r' && modal.style.display === 'block') {
            resetZoomAndPan();
        }
    });
});