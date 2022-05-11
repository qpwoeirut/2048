function AiController(game) {
    this.game = game;
    this.active = true;
    this.strategy = _expectimax_player;
    this.heuristicId = 2;
    this.last_move = 0;
    this.pause_time = 1;  // time to pause between moves, in ms

    this.update_strategy();

    document.querySelectorAll('input[name="ai_strategy"]').forEach(elem => {
        elem.onchange = this.update_strategy;
    })
    document.querySelectorAll('input[name="ai_heuristic"]').forEach(elem => {
        elem.onchange = this.update_strategy;
    })
}

AiController.prototype.update_strategy = function() {
    const strategyId = parseInt(document.querySelector('input[name="ai_strategy"]:checked').value);
    const heuristicId = parseInt(document.querySelector('input[name="ai_heuristic"]:checked').value);
    console.log(strategyId)
    console.log(heuristicId)
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
            _init_minimax_strategy(4, this.heuristicId);
            break;
        case 6:
            this.strategy = _expectimax_player;
            this.heuristicId = heuristicId;
            _init_expectimax_strategy(4, this.heuristicId);
            break;
        case 7:
            this.strategy = _monte_carlo_player;
            _init_expectimax_strategy(5000);
            break;
    }
}

AiController.prototype.loop = function(timestamp) {
    console.log(timestamp)
    if (!this.active || this.last_move + this.pause_time <= timestamp) {  // pause time hasn't passed yet
        this.last_move = timestamp;

        const board = this.game.grid.toBitboard();
        const move = this.strategy(board);
        this.game.move((move + 3) & 3);  // convert from LURD to URDL
    }

    window.requestAnimationFrame(this.loop);
}
