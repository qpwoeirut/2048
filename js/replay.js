const gameManager = new GameManager(4, DummyKeyboardInputManager, HTMLActuator, DummyStorageManager);
// clear grid
gameManager.grid = new Grid(gameManager.size);
gameManager.actuate();

const replayTool = {
    gameManager: gameManager,
    currentIndex: 0,
    gameRecord: "",

    getPosition: (c) => {
        const index = c.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
        const x = index % 4;
        const y = Math.floor(index / 4);
        return {x: 3 - x, y: 3 - y};
    },
    getValue: (c) => /^[A-Z]*$/.test(c) ? 4 : 2,  // placing down a 4 is recorded as an uppercase character
    getMove: (c) => "urdl".indexOf(c),
    // recalculating the grid each time is inefficient but should be fast enough
    calculateGrid: function(index) {
        const localGameManager = new GameManager(4, DummyKeyboardInputManager, DummyActuator, DummyStorageManager);
        localGameManager.grid = new Grid(localGameManager.size);  // clear grid
        for (let i = 0; i < index; ++i) {
            if (i === 0 || i % 2 === 1) {
                const position = this.getPosition(this.gameRecord[i]);
                const value = this.getValue(this.gameRecord[i]);
                const tile = new Tile(position, value);
                localGameManager.grid.insertTile(tile);
            } else {
                const move = this.getMove(this.gameRecord[i]);
                if (move === -1) {
                    alert("Record is invalid at position " + i);
                }
                localGameManager.move(move, false);
            }
        }
        return localGameManager.grid;
    },
    copyValues: function(sourceGrid, targetGrid) {
        sourceGrid.eachCell((x, y, tile) => {
            if (tile) {
                if (targetGrid.cells[x][y]) {
                    targetGrid.cells[x][y].value = tile.value;
                } else {
                    targetGrid.insertTile(tile)
                }
            } else {
                targetGrid.removeTile(new Tile({x: x, y: y}, 0));
            }
        });
    },
    goBack: function() {
        if (this.currentIndex === 0) return;
        this.copyValues(this.calculateGrid(--this.currentIndex), this.gameManager.grid);
        this.gameManager.prepareTiles();  // the animations look backwards, so let's just disable them
        this.gameManager.actuate();
    },
    goForward: function() {
        if (this.currentIndex === this.gameRecord.length) return;
        if (this.currentIndex === 0 || this.currentIndex % 2 === 1) {
            const position = this.getPosition(this.gameRecord[this.currentIndex]);
            const value = this.getValue(this.gameRecord[this.currentIndex]);
            const tile = new Tile(position, value);
            this.gameManager.prepareTiles();
            this.gameManager.grid.insertTile(tile);
            this.gameManager.actuate();
        } else {
            const move = this.getMove(this.gameRecord[this.currentIndex]);
            if (move === -1) {
                alert(`Record is invalid at position ${this.currentIndex}. Move is not one of "urdl".`);
            }
            if (this.gameManager.move(move, false) === false) {
                alert(`Record is invalid at position ${this.currentIndex}. Move doesn't change board.`);
            }
        }


        this.currentIndex++;
    },
    updateRecord: function() {
        this.gameRecord = document.getElementById("gameRecord").value;
        this.currentIndex = 0;
        this.gameManager.grid = new Grid(this.gameManager.size);
        this.gameManager.actuate();
    }
}

document.getElementById("goBackButton").onclick = replayTool.goBack.bind(replayTool);
document.getElementById("goForwardButton").onclick = replayTool.goForward.bind(replayTool);
document.getElementById("gameRecord").onchange = replayTool.updateRecord.bind(replayTool);

replayTool.updateRecord()