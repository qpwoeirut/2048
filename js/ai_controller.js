// this will be run in a web worker


var Module = {  // using let will cause issues with redefinition of Module
    onRuntimeInitialized: function () {
        Module.td0_load_best();

        postMessage("ready!");

        const controller = new AiController();

        onmessage = function(e) {
            const messageType = e.data[0];
            if (messageType === 0) {
                controller.update_strategy(e.data[1], e.data[2]);
            } else if (messageType === 1) {
                const move = controller.pick_move(e.data[1]);
                postMessage(move);
            }
        }
    }
};

importScripts("players.js");


function AiController() {
    // this.player and this.heuristicId should be updated once the main thread is ready
    this.player = new Module.RandomPlayer();
    this.heuristicId = 0;
}

AiController.prototype.update_strategy = function(strategyId, heuristicId) {
    this.player.delete();
    switch (strategyId) {
        case 0:
            this.player = new Module.RandomPlayer();
            break;
        case 1:
            this.player = new Module.SpamCornerPlayer();
            break;
        case 2:
            this.player = new Module.OrderedPlayer();
            break;
        case 3:
            this.player = new Module.RotatingPlayer();
            break;
        case 4:
            this.player = new Module.RandomTrialsStrategy(5, 5, heuristicId);
            this.heuristicId = heuristicId;
            break;
        case 5:
            this.player = new Module.MinimaxStrategy(-1, heuristicId);
            this.heuristicId = heuristicId;
            break;
        case 6:
            this.player = new Module.ExpectimaxStrategy(-1, heuristicId);
            this.heuristicId = heuristicId;
            break;
        case 7:
            this.player = new Module.MonteCarloPlayer(10000);
            break;
        case 8:
            this.player = Module.TD0.best_model;
            break;
    }
}

AiController.prototype.pick_move = function(board) {
    const move = this.player.pick_move(board);

    return (move + 3) & 3;  // convert from LURD to URDL
}
