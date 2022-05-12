window.requestAnimationFrame(function () {
    const playerWorker = new Worker("js/ai_controller.js");
    let workerReady = false;

    const gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

    const updateStrategy = () => {
        const strategyId = parseInt(document.querySelector('input[name="ai_strategy"]:checked').value);
        const heuristicId = parseInt(document.querySelector('input[name="ai_heuristic"]:checked').value);
        playerWorker.postMessage([0, strategyId, heuristicId]);
    }

    let nextMove = -1;
    playerWorker.onmessage = (e) => {
        if (!workerReady) {
            workerReady = true;
            updateStrategy();
            playerWorker.postMessage([1, gameManager.grid.toBitboard()]);
        } else {
            nextMove = e.data
        }
    }

    const MAX_WAIT_TIME = 8000;
    let lastMoveTime = 1000 - MAX_WAIT_TIME;
    const pauseTime = 100;
    const playGame = (timestamp) => {
        if (aiActive && workerReady && lastMoveTime + pauseTime <= timestamp && nextMove !== -1) {
            gameManager.move(nextMove);
            nextMove = -1;

            playerWorker.postMessage([1, gameManager.grid.toBitboard()]);
            lastMoveTime = timestamp;
        } else if (aiActive && lastMoveTime + MAX_WAIT_TIME <= timestamp) {
            console.warn("No move in the last 8 seconds!");
            playerWorker.postMessage([1, gameManager.grid.toBitboard()]);
            lastMoveTime = timestamp;
        }
        window.requestAnimationFrame(playGame);
    }

    let aiActive = true;
    const aiOn = document.getElementById("aiOn");
    aiOn.onchange = function() { aiActive = aiOn.checked }
    const aiOff = document.getElementById("aiOff");
    aiOff.onchange = function() { aiActive = !aiOff.checked }

    document.querySelectorAll('input[name="ai_strategy"]').forEach(elem => {
        elem.onchange = updateStrategy
    })
    document.querySelectorAll('input[name="ai_heuristic"]').forEach(elem => {
        elem.onchange = updateStrategy
    })

    window.requestAnimationFrame(playGame);
});
