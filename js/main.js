window.requestAnimationFrame(function () {
    const playerWorker = new Worker("js/ai_controller.js");
    let workerReady = false;

    const gameManager = new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

    const updateStrategy = () => {
        const strategyId = parseInt(document.querySelector('input[name="ai_strategy"]:checked').value);
        const heuristicId = parseInt(document.querySelector('input[name="ai_heuristic"]:checked').value);
        playerWorker.postMessage([0, strategyId, heuristicId]);
    }

    let nextMove = -1;  // -1 is waiting for response, -2 is waiting for game to restart
    playerWorker.onmessage = (e) => {
        if (!workerReady) {
            workerReady = true;
            updateStrategy();
            playerWorker.postMessage([1, gameManager.grid.toBitboard()]);
        } else {
            nextMove = e.data
        }
    }
    playerWorker.onerror = console.error;

    let aiActive = true;
    const aiOn = document.getElementById("aiOn");
    aiOn.onchange = function() { aiActive = aiOn.checked }
    const aiOff = document.getElementById("aiOff");
    aiOff.onchange = function() { aiActive = !aiOff.checked }

    const pauseTimeElem = document.getElementById("pauseTime");
    let pauseTime = pauseTimeElem.checkValidity() ? parseInt(pauseTimeElem.value) : 50;
    pauseTimeElem.onchange = (e) => {
        if (pauseTimeElem.checkValidity()) {
            pauseTime = parseInt(pauseTimeElem.value);
        }
    }

    document.querySelectorAll('input[name="ai_strategy"]').forEach(elem => {
        elem.onchange = updateStrategy
    })
    document.querySelectorAll('input[name="ai_heuristic"]').forEach(elem => {
        elem.onchange = updateStrategy
    })

    const MAX_WAIT_TIME = 8000;
    let lastMoveTime = 4000 - MAX_WAIT_TIME;
    const playGame = (timestamp) => {
        if (aiActive && workerReady && !gameManager.isGameTerminated() && lastMoveTime + pauseTime <= timestamp && nextMove !== -1) {
            if (0 <= nextMove && nextMove < 4) {
                gameManager.move(nextMove);
            }
            nextMove = -1;

            if (!gameManager.isGameTerminated()) {
                playerWorker.postMessage([1, gameManager.grid.toBitboard()]);
                lastMoveTime = timestamp;
            } else {
                nextMove = -2;
            }
        } else if (aiActive && !gameManager.isGameTerminated() && lastMoveTime + MAX_WAIT_TIME <= timestamp) {
            console.warn("No move in the last 8 seconds!");
            playerWorker.postMessage([1, gameManager.grid.toBitboard()]);
            lastMoveTime = timestamp;
        }
        window.requestAnimationFrame(playGame);
    }

    window.requestAnimationFrame(playGame);
});
