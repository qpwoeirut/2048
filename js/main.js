var Module = {  // using let will cause issues with redefinition of Module
    onRuntimeInitialized: function() {
        window.requestAnimationFrame(function () {
            _init_game();
            const gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
            const controller = new AiController(gameManager);
            console.log(gameManager)
            window.requestAnimationFrame(controller.loop)
        });
    }
};
