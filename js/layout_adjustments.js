  function adjustHeroPadding() {
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    const contactHero = document.querySelector('.contact-hero');
    if (navbar && hero) {
        const navHeight = navbar.offsetHeight;
        hero.style.paddingTop = navHeight + 'px';
        hero.style.minHeight = `calc(100vh - ${navHeight}px)`;
    }
    else if (navbar && contactHero) {
        const navHeight = navbar.offsetHeight;
        contactHero.style.paddingTop = navHeight + 'px';
        contactHero.style.minHeight = `calc(100vh - ${navHeight}px)`;
    }
}

// Run on load and resize
window.addEventListener('load', adjustHeroPadding);
window.addEventListener('resize', adjustHeroPadding);

  function adjustAboutHeroPadding() {
    const navbar = document.querySelector('.navbar');
    const aboutHero = document.querySelector('.about-hero');
    if (navbar && aboutHero) {
        const navHeight = navbar.offsetHeight;
        aboutHero.style.paddingTop = navHeight + 'px';
        // aboutHero.style.minHeight = `calc(100vh - ${navHeight}px)`;
    }
}

// Run on load and resize
window.addEventListener('load', adjustAboutHeroPadding);
window.addEventListener('resize', adjustAboutHeroPadding);
