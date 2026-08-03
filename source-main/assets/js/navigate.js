document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navbarNav = document.querySelector('.navbar-nav');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle menu khi click hamburger
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navbarNav.classList.toggle('active');

        // Prevent body scroll khi menu mở
        if (navbarNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Đóng menu khi click vào nav item
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navbarNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Đóng menu khi click bên ngoài
    document.addEventListener('click', function(e) {
        if (navbarNav.classList.contains('active') &&
            !navbarNav.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navbarNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Đóng menu khi resize về desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navbarNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Smooth scroll khi click package card -> pricing section
    const packageCards = document.querySelectorAll('.package-card');
    const pricingSection = document.getElementById('pricing');

    if (packageCards.length > 0 && pricingSection) {
        packageCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                pricingSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }
});
