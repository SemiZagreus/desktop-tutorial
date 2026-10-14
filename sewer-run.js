const afbeelding = document.getElementById('playerimage');
let positieX = afbeelding ? afbeelding.offsetLeft : 0;
const speed = 265;

document.addEventListener('keydown', (event) => {
    if (!afbeelding) return;

    const toets = event.key.toLowerCase();

    if (toets === 'a') {
        positieX -= speed;
    } else if (toets === 'd') {
        positieX += speed;
    } else {
        return;
    }

    afbeelding.style.left = positieX + 'px';
});
