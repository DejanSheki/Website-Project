let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
    // Init controller
    controller = new ScrollMagic.Controller();

    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');

    // Loop over each slide
    sliders.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector('.reveal-img');
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');

        // GSAP
        const slideTl = gsap.timeline({ defaults: { duration: 1, ease: "power2.inOut" } });
        slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' });
        slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1');
        slideTl.fromTo(revealText, { x: "0%" }, { x: '100%' }, '-=0.75');
        // slideTl.fromTo(nav, { y: '-100%' }, { y: '0%' }, '-= 0.5');

        // Create scene
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
        })
            .setTween(slideTl)
            .addTo(controller);

        // New animation
        const pageTl = gsap.timeline();
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        pageTl.fromTo(nextSlide, { y: '0%' }, { y: '50%' });
        pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
        pageTl.fromTo(nextSlide, { y: '50%' }, { y: '0%' }, '-=0.5');

        // New scene
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: "100%",
            triggerHook: 0
        })
            .setPin(slide, { pushFollowers: false })
            .setTween(pageTl)
            .addTo(controller)
    });
}

// Cursor
const mouse = document.querySelector(".cursor");
const mouseText = mouse.querySelector('span');
const burger = document.querySelector('.burger');

// document.addEventListener('mousemove', (e) => {
//     console.log(e.clientY);
//     mouse.style.cssText = `
//     left: ${e.clientX - 25}px;
//     top: ${e.clientY - 25} px;
//     `;
// });
function cursor(e) {
    mouse.style.top = `${e.clientY}px`;
    mouse.style.left = `${e.clientX}px`;
}
function activeCursor(e) {
    const item = e.target;
    if (item.id === "logo" || item.classList.contains("burger")) {
        mouse.classList.add("nav-active");
        gsap.to(".center", 0.1, { width: '0rem', heigth: '0rem' });
    } else {
        mouse.classList.remove("nav-active");
        gsap.to(".center", 0.1, { width: '0.5rem', heigth: '0.5rem' });
    }
    if (item.classList.contains("explore")) {
        mouse.classList.add("explore-active");
        gsap.to(".title-swipe", 1, { y: '0%' });
        gsap.to(".center", 0.1, { width: '0rem', heigth: '0rem' });
        mouseText.innerText = 'Tap';
    } else {
        mouse.classList.remove("explore-active");
        mouseText.innerText = '';
        gsap.to(".title-swipe", 1, { y: '100%' });
    }
}
function navToggle(e) {
    if (!e.target.classList.contains('active')) {
        e.target.classList.add('active');
        gsap.to('body', 0.5, { cursor: 'auto' });
        gsap.to('.center', 0.5, { background: "var(--black)" });
        gsap.to('.line1', 0.5, { rotate: '45', y: 5, background: "var(--black)" });
        gsap.to('.line2', 0.5, { rotate: '-45', y: -5, background: 'var(--black)' });
        gsap.to('#logo', 0.5, { color: 'var(--black)' });
        gsap.to('.nav-bar', 1, { clipPath: 'circle(2500px at 100% -10%)' });
        document.body.classList.add('hide');
    } else {
        e.target.classList.remove('active');
        gsap.to('body', 0.5, { cursor: 'none' });
        gsap.to('.center', 0.5, { background: "var(--white)" });
        gsap.to('.line1', 0.5, { rotate: '0', y: 0, background: "var(--white)" });
        gsap.to('.line2', 0.5, { rotate: '0', y: 0, background: 'var(--white)' });
        gsap.to('#logo', 0.5, { color: 'var(--white)' });
        gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%)' });
        document.body.classList.remove('hide');
    }
}

// Barba page transitions
const logo = document.querySelector('#logo');
barba.init({
    views: [
        {
            namespace: "home",
            beforeEnter() {
                animateSlides();
                logo.href = './index.html';
            },
            beforeLeave() {
                slideScene.destroy();
                pageScene.destroy();
                controller.destroy();
            }
        },
        {
            namespace: "fashion",
            beforeEnter() {
                logo.href = '../index.html';
                detailAnimation();
            },
            beforeLeave() {
                controller.destroy();
                detailScene.destroy();
            }
        }
    ],
    transitions: [
        {
            leave({ current, next }) {
                let done = this.async();

                const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
                tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
                tl.fromTo('.swipe', 0.75, { x: '-100%' }, { x: '0%', onComplete: done }, '-=0.5');
            },
            enter({ current, next }) {

                let done = this.async();
                window.scrollTo(0, 0);
                const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
                tl.fromTo('.swipe', 0.75, { x: '0%' },
                    { x: '100%', stagger: 0.25, onComplete: done });
                tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
                tl.fromTo(
                    '.nav-header',
                    1,
                    { y: "-100%" },
                    { y: '0%', ease: 'power2.inOut' }, "-=1.5"
                );
            }
        }
    ]
});

// Pages animation
function detailAnimation() {
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll('.detail-slide');
    slides.forEach((slide, index, slides) => {
        const slideTl = gsap.timeline({ defaults: { duration: 1 } });
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        const nextImg = nextSlide.querySelector('img');
        slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
        slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
        slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });

        // Scene
        detailScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0
        })
            .setPin(slide, { pushFollowers: false })
            .setTween(slideTl)
            .addTo(controller);
    });
}

burger.addEventListener('click', navToggle);
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);


