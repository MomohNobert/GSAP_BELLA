gsap.registerPlugin(ScrollTrigger);

function initNavigation() {
    const mainNavLinks = gsap.utils.toArray('.main-nav a')
    const mainNavLinksReverse = gsap.utils.toArray('.main-nav a').reverse()
    mainNavLinks.forEach(link => {
        link.addEventListener('mouseleave', e => {
            link.classList.add('animate-out');
            setTimeout(() => {
                link.classList.remove('animate-out')
            }, 300)
        })
    })

    function navAnimation(direction){
        const scrollingDown = direction === 1
        const links = scrollingDown ? mainNavLinks : mainNavLinksReverse
        return gsap.to(links, { 
            duration: 0.3, 
            stagger: 0.05, 
            autoAlpha: () => scrollingDown ? 0 : 1, 
            y: () => scrollingDown ? 20 : 1,
            ease: 'Power4.out'
        })
    }

    ScrollTrigger.create({
        start: 100,
        end: 'bottom bottom-=20',
        toggleClass: {
            targets: 'body',
            className: 'has-scrolled'
        },
        onEnter: ({ direction }) => navAnimation(direction),
        onLeaveBack: ({ direction }) => navAnimation(direction),
    })
}

function initHeaderTilt() {
    document.querySelector('header').addEventListener('mousemove', moveImages)
}

function moveImages(e) {
    const { offsetX, offsetY, target } = e;
    const { clientWidth, clientHeight } = target;

    const xPos = (offsetX/clientWidth) - 0.5;
    const yPos = (offsetY/clientHeight) - 0.5;

    const leftImages = gsap.utils.toArray('.hg__left .hg__image');
    const rightImages = gsap.utils.toArray('.hg__right .hg__image');

    const modifier = (index) => (index + 1)*1.2

    rightImages.forEach((image, index) => {
        gsap.to(image, {
            duration: 1.2,
            x: xPos*20*modifier(index),
            y: yPos*30*modifier(index),
            rotationY: xPos*40,
            rotationX: yPos*10
        })
    })

    leftImages.forEach((image, index) => {
        gsap.to(image, {
            duration: 1.2,
            x: -xPos*20*modifier(index),
            y: -yPos*30*modifier(index),
            rotationY: -xPos*40,
            rotationX: -yPos*10
        })
    })

    gsap.to('.decor__circle', {
        duration: 1.7,
        x: 100*xPos,
        y: 120*yPos,
        ease: 'Power4.out'
    })
}

function initHoverReveal() {
    const sections = document.querySelectorAll('.rg__column');
    sections.forEach(section => {
        section.imageBlock = section.querySelector('.rg__image');
        section.mask = section.querySelector('.rg__image--mask');
        section.text = section.querySelector('.rg__text');
        section.textCopy = section.querySelector('.rg__text--copy')

        gsap.set(section.imageBlock, { yPercent: -101})
        gsap.set(section.mask, { yPercent: 100})

        section.addEventListener('mouseenter', createHoverReveal)
        section.addEventListener('mouseleave', createHoverReveal)
    })
}

function getTextHeight(textCopy) {
    return textCopy.clientHeight;
}

function createHoverReveal(e) {
    const { mask, imageBlock, text, textCopy } = e.target;

    let tl = gsap.timeline({
        defaults: {
            duration: 0.7,
            ease: 'Power4.out'
        }
    })

    if (e.type === 'mouseenter') {
        tl
        .to([mask, imageBlock], {yPercent: 0})
        .to(text, {y: () => -getTextHeight(textCopy)/2})
    } else if (e.type === 'mouseleave') {
        tl
        .to(mask, {yPercent: 0})  
        .to(imageBlock, {yPercent: -101}, 0)
        .to(text, {y: 0})
    }

    return tl
}



function init(){ 
    // start here
    initNavigation()
    initHeaderTilt()
    initHoverReveal()
}

window.addEventListener('load', function(){
    init();
});
