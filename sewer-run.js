const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('Canvas 2D context is not available.');
}

const baan = new Image();
baan.src = 'Schermafbeelding 2026-10-14 102459.png';

let scrollY = 0;
let previousFrame = 0;

baan.addEventListener('load', () => {
    const tekenFrame = (tijd) => {
        const verstreken = previousFrame ? tijd - previousFrame : 0;
        previousFrame = tijd;
        scrollY = (scrollY + verstreken * 0.2) % canvas.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baan, 0, scrollY - canvas.height, canvas.width, canvas.height);
        ctx.drawImage(baan, 0, scrollY, canvas.width, canvas.height);

        requestAnimationFrame(tekenFrame);
    };

    requestAnimationFrame(tekenFrame);
});

baan.addEventListener('error', () => {
    console.error(`Could not load game background: ${baan.src}`);
});

const afbeelding = document.getElementById('playerimage');
let positieX = 287;
const speed = 215;
const minX = 71;
const maxX = 494;

afbeelding.style.left = `${(positieX / canvas.width) * 100}%`;

document.addEventListener('keydown', (event) => {
    const toets = event.key.toLowerCase();

    if (toets === 'a') {
        positieX = Math.max(minX, positieX - speed);
    } else if (toets === 'd') {
        positieX = Math.min(maxX, positieX + speed);
    } else {
        return;
    }

    afbeelding.style.left = `${(positieX / canvas.width) * 100}%`;
});
