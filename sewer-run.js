const spelerAfbeelding = 'images/speler.png';
const achtergrondAfbeelding = 'images/achtergrond.png';
const valAfbeelding = 'images/val.png';
const val = new Image();
val.src = valAfbeelding;
const hart = new Image();
hart.src = 'images/hart.png';
const muziek = new Audio('../../../muziek/level%201.mp3');
muziek.loop = true;
muziek.volume = 0.35;

const startMuziek = () => {
    if (!muziek.paused) return;

    muziek.play().catch((error) => {
        console.error('De muziek kon niet worden afgespeeld:', error);
    });
};


const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const baan = new Image();
baan.src = achtergrondAfbeelding;

let scrollY = 0;
let previousFrame = 0;
let animationFrameId = 0;
let elapsedGameTime = 0;
let gamePaused = false;
let gameOver = false;
let levens = 3;
const spelDuurSeconden = 90;
const vallenStoppenNaSeconden = 87;

const afbeelding = document.getElementById('playerimage');
afbeelding.src = spelerAfbeelding;
const levensElement = document.getElementById('levens');
const gameOverElement = document.getElementById('game-over');
const endScreenImage = document.getElementById('end-screen-image');
const restartButton = document.getElementById('restart-button');
const timerElement = document.getElementById('timer');

const updateLevens = () => {
    const hartjes = levensElement.querySelectorAll('img');
    hartjes.forEach((hartje, index) => {
        hartje.hidden = index >= levens;
    });
    levensElement.setAttribute('aria-label', `Levens: ${levens}`);
};

updateLevens();

document.addEventListener('pointerdown', startMuziek, { once: true });
document.addEventListener('keydown', startMuziek);

let positieX = 287;
let canPress = true;
const speed = 215;
const minX = 71;
const maxX = 494;

const baanPosities = [71, 287, 494];
const vallen = [];
let tijdTotVolgendeVal = 1000;
const valBreedte = 110;
const valHoogte = 132;

const tekenFrame = (tijd) => {
   if (gamePaused || gameOver) return;

    const verstreken = previousFrame ? tijd - previousFrame : 0;
    previousFrame = tijd;
    elapsedGameTime += verstreken;
    timerElement.textContent = Math.floor(elapsedGameTime / 1000);
    if (elapsedGameTime >= spelDuurSeconden * 1000) {
        gameOver = true;
        endScreenImage.src = 'images/Escape.png';
        endScreenImage.alt = 'Escaped';
        gameOverElement.hidden = false;
        return;
    }

    const speedMultiplier = Math.min(Math.pow(1.005, elapsedGameTime / 180), 4.25);
    const gameVerstreken = verstreken * speedMultiplier;
    scrollY = (scrollY + gameVerstreken * 0.2) % canvas.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baan, 0, scrollY - canvas.height, canvas.width, canvas.height);
    ctx.drawImage(baan, 0, scrollY, canvas.width, canvas.height);

    const spelerBreedte = canvas.width * 0.15;
    const spelerHoogte = spelerBreedte * afbeelding.naturalHeight / afbeelding.naturalWidth;
    const spelerBoven = canvas.height * 0.966 - spelerHoogte;
    const ratHitbox = {
        left: positieX + spelerBreedte * 0.2,
        right: positieX + spelerBreedte * 0.8,
        top: spelerBoven + spelerHoogte * 0.2,
        bottom: spelerBoven + spelerHoogte * 0.85,
    };
    tijdTotVolgendeVal -= gameVerstreken;
    if (
        elapsedGameTime < vallenStoppenNaSeconden * 1000 &&
        val.complete &&
        val.naturalWidth > 0 &&
        tijdTotVolgendeVal <= 0
    ) {
        vallen.push({
            baan: Math.floor(Math.random() * baanPosities.length),
            y: -valHoogte,
        });
        tijdTotVolgendeVal = 750 + Math.random() * 1175;
    }

    for (let i = vallen.length - 1; i >= 0; i--) {
        const vallendeVal = vallen[i];
        vallendeVal.y += gameVerstreken * 0.2;

        const x = baanPosities[vallendeVal.baan] + spelerBreedte / 2 - valBreedte / 2;
        ctx.drawImage(val, x, vallendeVal.y, valBreedte, valHoogte);

        const valHitbox = {
            left: x + valBreedte * 0.28,
            right: x + valBreedte * 0.72,
            top: vallendeVal.y + valHoogte * 0.8,
            bottom: vallendeVal.y + valHoogte * 0.60,
        };
        const raaktRat =
            valHitbox.left < ratHitbox.right &&
            valHitbox.right > ratHitbox.left &&
            valHitbox.top < ratHitbox.bottom &&
            valHitbox.bottom > ratHitbox.top;

        if (raaktRat) {
            vallen.splice(i, 1);
            levens -= 1;
            updateLevens();

            if (levens <= 0) {
                gameOver = true;
                endScreenImage.src = 'images/Game over.png';
                endScreenImage.alt = 'Game over';
                gameOverElement.hidden = false;
                return;
            }
        } else if (vallendeVal.y > canvas.height) {
            vallen.splice(i, 1);
        }
    }

    animationFrameId = requestAnimationFrame(tekenFrame);
};

baan.addEventListener('load', () => {
    if (!gamePaused) {
        animationFrameId = requestAnimationFrame(tekenFrame);
    }
});

const herstartSpel = () => {
    cancelAnimationFrame(animationFrameId);
    vallen.length = 0;
    levens = 3;
    positieX = 287;
    scrollY = 0;
    previousFrame = 0;
    elapsedGameTime = 0;
    tijdTotVolgendeVal = 1000;
    gamePaused = false;
    gameOver = false;
    endScreenImage.src = 'images/Game over.png';
    endScreenImage.alt = 'Game over';
    gameOverElement.hidden = true;
    updateLevens();
    afbeelding.style.left = `${(positieX / canvas.width) * 100}%`;

    if (baan.complete && baan.naturalWidth > 0) {
        animationFrameId = requestAnimationFrame(tekenFrame);
    }
};

restartButton.addEventListener('click', herstartSpel);

afbeelding.style.left = `${(positieX / canvas.width) * 100}%`;

document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'r' && gameOver) {
        herstartSpel();
        return;
    }

    if (gamePaused || gameOver || !canPress) return;

    const toets = event.key.toLowerCase();

   if (toets === 'a' || toets === 'arrowleft') {
        positieX = Math.max(minX, positieX - speed);
    } else if (toets === 'd' || toets === 'arrowright') {
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
    if (event.repeat || gameOver) return;

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
