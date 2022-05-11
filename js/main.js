var Module = {  // using let will cause issues with redefinition of Module
    onRuntimeInitialized: function() {
        window.requestAnimationFrame(function () {
            _init_game();
            const gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
            const controller = new AiController(gameManager);

            const aiOn = document.getElementById("aiOn");
            aiOn.onchange = function() { controller.active = aiOn.checked; }
            const aiOff = document.getElementById("aiOff");
            aiOff.onchange = function() { controller.active = !aiOff.checked; }

            document.querySelectorAll('input[name="ai_strategy"]').forEach(elem => {
                elem.onchange = controller.update_strategy.bind(controller);
            })
            document.querySelectorAll('input[name="ai_heuristic"]').forEach(elem => {
                elem.onchange = controller.update_strategy.bind(controller);
            })

            window.setInterval(controller.loop.bind(controller), 100);
        });
    }
};
