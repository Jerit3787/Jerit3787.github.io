var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.isDeleting = false;
    this.isAnimating = true;
    this.tick();
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    var wrapElement = document.createElement('span');
    wrapElement.classList.add('wrap');
    wrapElement.innerHTML = this.txt;

    // Create a blinking cursor effect
    wrapElement.style.borderRight = '0.08em solid';
    wrapElement.style.animation = 'blink-caret 0.75s step-end infinite';

    this.el.innerHTML = '';
    this.el.appendChild(wrapElement);

    var that = this;
    var delta = 100; // Typing speed

    if (this.isDeleting) {
        delta /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = 2000; // Pause at end of word
        setTimeout(function () {
            that.isDeleting = true;
            that.tick();
        }, delta);
        return;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500; // Pause before starting new word
    }

    setTimeout(function () {
        that.tick();
    }, delta);
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