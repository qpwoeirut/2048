const gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, DummyStorageManager);
main(gameManager);

const gameEditor = {
    gameManager: gameManager,

    incrementTile(row, col) {
        const currentTile = this.gameManager.grid.getTileOrOne(row, col);
        currentTile.value <<= 1;
        this.gameManager.grid.insertTile(currentTile);
    },

    decrementTile(row, col) {
        const currentTile = this.gameManager.grid.getTileOrOne(row, col);
        if (currentTile.value === 2) {
            this.gameManager.grid.removeTile(currentTile);
        } else if (currentTile.value > 2) {
            currentTile.value >>= 1;
            this.gameManager.grid.insertTile(currentTile);
        }
    },

    doTileChange(button, row, col) {
        this.gameManager.prepareTiles();
        switch (button) {
            case 0:
                this.incrementTile(row, col);
                break;
            case 1:
                this.decrementTile(row, col);
                break;
        }
        this.gameManager.actuate();
    }
}

const getPosition = (elem) => {
    for (const className of elem.classList) {
        if (className.startsWith("tile-position")) {
            // className should be of form tile-position-r-c
            const col = parseInt(className.split("-")[2]) - 1;
            const row = parseInt(className.split("-")[3]) - 1;
            return [row, col]
        }
    }
    console.log(elem);
    throw "Tile position not found!";
}
// querySelectorAll will return elements in document order
document.querySelectorAll(".grid-cell").forEach((elem, index) => {
    const boundDoTileChange = gameEditor.doTileChange.bind(gameEditor);
    elem.onclick = (e) => boundDoTileChange(e.button, index >> 2, index & 3);
})
document.querySelector(".tile-container").onclick = (e) => {
    const target = e.target;
    const tile = target.classList.contains("tile-inner") ? target.parentElement : target;
    const [row, col] = getPosition(tile);
    gameEditor.doTileChange(e.button, row, col);
}
