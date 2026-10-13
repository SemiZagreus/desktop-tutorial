class Background {
    constructor(gamewidth, gameheight){
        this.gamewidth = gamewidth;
        this.gameheight = gameheight;
        this.image = document.getElementById('background'); //rename background naar de foto's naam
        this.x = 0
        this.y = 0
        this.width = 2000
        this.height = 2000 // herplaats dit met de hoogte en breedte van de background
    }
    draw(context){
        context.drawImage(this.image)
    }
}
