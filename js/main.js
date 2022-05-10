var Module = {  // using let will cause issues with redefinition of Module
    onRuntimeInitialized: function() {
        window.requestAnimationFrame(function () {
            const gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
            _init_game();
            setInterval(function () {
                const board = gameManager.grid.toBitboard();
                const move = _ordered_player(board);
                gameManager.move((move + 3) & 3);  // convert from LURD to URDL
            }, 10);
        });
    }
};
