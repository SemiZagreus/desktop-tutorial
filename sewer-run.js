const spelerAfbeelding = 'images/speler.png';
const achtergrondAfbeelding = 'images/achtergrond.png';

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('Canvas 2D context is not available.');
}

const baan = new Image();
baan.src = achtergrondAfbeelding;

let scrollY = 0;
let previousFrame = 0;
let animationFrameId = 0;
let gamePaused = false;

const tekenFrame = (tijd) => {
    if (gamePaused) return;

    const verstreken = previousFrame ? tijd - previousFrame : 0;
    previousFrame = tijd;
    scrollY = (scrollY + verstreken * 0.2) % canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baan, 0, scrollY - canvas.height, canvas.width, canvas.height);
    ctx.drawImage(baan, 0, scrollY, canvas.width, canvas.height);

    animationFrameId = requestAnimationFrame(tekenFrame);
};

baan.addEventListener('load', () => {
    if (!gamePaused) {
        animationFrameId = requestAnimationFrame(tekenFrame);
    }
});

baan.addEventListener('error', () => {
    console.error(`Could not load game background: ${baan.src}`);
});

const afbeelding = document.getElementById('playerimage');
afbeelding.src = spelerAfbeelding;
let positieX = 287;
let canPress = true;
const speed = 215;
const minX = 71;
const maxX = 494;

afbeelding.style.left = `${(positieX / canvas.width) * 100}%`;

document.addEventListener('keydown', (event) => {
    if (gamePaused || !canPress) return;

    const toets = event.key.toLowerCase();

    if (toets === 'a') {
        positieX = Math.max(minX, positieX - speed);
    } else if (toets === 'd') {
        positieX = Math.min(maxX, positieX + speed);
    } else {
        return;
    }

    canPress = false;
    setTimeout(() => {
        canPress = true;
    }, 100);

    afbeelding.style.left = `${(positieX / canvas.width) * 100}%`;
});

document.addEventListener('keydown', (event) => {
    if (event.code !== 'Space') return;
    event.preventDefault();
    if (event.repeat) return;

    if (gamePaused) {
        gamePaused = false;
        previousFrame = 0;
        if (baan.complete && baan.naturalWidth > 0) {
            animationFrameId = requestAnimationFrame(tekenFrame);
        }
    } else {
        gamePaused = true;
        cancelAnimationFrame(animationFrameId);
    }
});
