// this will be run in a web worker


var Module = {  // using let will cause issues with redefinition of Module
    onRuntimeInitialized: function () {
        _init_game();
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
    // this.strategy and this.heuristicId should be updated once the main thread is ready
    this.strategy = _random_player;
    this.heuristicId = 0;
}

AiController.prototype.update_strategy = function(strategyId, heuristicId) {
    switch (strategyId) {
        case 0:
            this.strategy = _random_player;
            break;
        case 1:
            this.strategy = _spam_corner_player;
            break;
        case 2:
            this.strategy = _ordered_player;
            break;
        case 3:
            this.strategy = _rotating_player;
            break;
        case 4:
            this.strategy = _rand_trials_player;
            this.heuristicId = heuristicId;
            _init_rand_trials_strategy(5, 5, this.heuristicId);
            break;
        case 5:
            this.strategy = _minimax_player;
            this.heuristicId = heuristicId;
            _init_minimax_strategy(0, this.heuristicId);
            break;
        case 6:
            this.strategy = _expectimax_player;
            this.heuristicId = heuristicId;
            _init_expectimax_strategy(0, this.heuristicId);
            break;
        case 7:
            this.strategy = _monte_carlo_player;
            _init_monte_carlo_strategy(10000);
            break;
    }
}

AiController.prototype.pick_move = function(board) {
    const move = this.strategy(board);

    return (move + 3) & 3;  // convert from LURD to URDL
}
