const IMAGES_PER_CAROUSEL = 8;
const RADIUS = 400;
const AUTO_ROTATION_SPEED = 0.5;
let isAnimating = false;
const audio = new Audio('https://cdnjs.cloudflare.com/ajax/libs/himalaya/0.1.0/audio/background.mp3');
audio.loop = true;
function createItems(carousel) {
    for(let i = 0; i < IMAGES_PER_CAROUSEL; i++){
        const item = document.createElement('div');
        item.className = 'item';
        const offset = (i - Math.floor(IMAGES_PER_CAROUSEL / 2)) * 220;
        item.style.transform = `translateX(${offset}px) translateZ(0px)`;
        const img = document.createElement('img');
        img.src = `/api/placeholder/200/250`;
        img.alt = `Image ${i + 1}`;
        const playButton = document.createElement('button');
        playButton.className = 'play-button';
        playButton.innerHTML = "\u25B6";
        playButton.addEventListener('click', (e)=>{
            e.stopPropagation();
            alert(`Playing content ${i + 1}`);
        });
        item.appendChild(img);
        item.appendChild(playButton);
        carousel.appendChild(item);
        setTimeout(()=>{
            item.classList.add('visible');
        }, i * 200);
    }
}
function setPlanePosition() {
    document.querySelectorAll('.item').forEach((item, i)=>{
        const offset = (i - Math.floor(IMAGES_PER_CAROUSEL / 2)) * 220;
        item.style.transform = `translateX(${offset}px) translateZ(0px)`;
    });
}
function setCircularPosition() {
    document.querySelectorAll('.item').forEach((item, i)=>{
        const angle = i / IMAGES_PER_CAROUSEL * 360;
        item.style.transform = `rotateY(${angle}deg) translateZ(${RADIUS}px)`;
    });
}
function initializeCarousel(carousel) {
    let angle = 0;
    let isMouseDown = false;
    let startX;
    let startAngle;
    function autoRotate() {
        if (!isAnimating) return;
        if (!isMouseDown) angle += AUTO_ROTATION_SPEED;
        carousel.style.transform = `rotateY(${angle}deg)`;
        requestAnimationFrame(autoRotate);
    }
    carousel.addEventListener('mousedown', (e)=>{
        if (!isAnimating) return;
        isMouseDown = true;
        startX = e.pageX;
        startAngle = angle;
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e)=>{
        if (!isMouseDown || !isAnimating) return;
        const x = e.pageX;
        const dx = x - startX;
        angle = startAngle + dx * 0.5;
        e.preventDefault();
    });
    document.addEventListener('mouseup', ()=>{
        isMouseDown = false;
    });
    return {
        autoRotate
    };
}
const carousels = Array.from(document.querySelectorAll('.carousel')).map((carousel)=>{
    createItems(carousel);
    return initializeCarousel(carousel);
});
const musicControl = document.querySelector('.music-control');
musicControl.addEventListener('click', ()=>{
    if (!isAnimating) {
        isAnimating = true;
        audio.play();
        musicControl.textContent = 'Pause Music & Animation';
        setCircularPosition();
        carousels.forEach((carousel)=>carousel.autoRotate());
    } else {
        isAnimating = false;
        audio.pause();
        musicControl.textContent = 'Play Music & Start Animation';
        setPlanePosition();
    }
});

//# sourceMappingURL=index.83ef1be7.js.map
