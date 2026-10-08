// MARK: - Interface elements

const weightRange = document.getElementById("weightRange");
const weightOutput = document.getElementById("weightOutput");

const targetRepsInput = document.getElementById("targetReps");
const targetSetsInput = document.getElementById("targetSets");

const connectButton = document.getElementById("connectButton");
const setWeightButton = document.getElementById("setWeightButton");
const startTrainingButton =
    document.getElementById("startTrainingButton");
const nextSetButton = document.getElementById("nextSetButton");
const stopMotorButton = document.getElementById("stopMotorButton");
const returnCableButton =
    document.getElementById("returnCableButton");

const connectionStatus =
    document.getElementById("connectionStatus");
const trainingState = document.getElementById("trainingState");
const deviceMessage = document.getElementById("deviceMessage");

const setProgress = document.getElementById("setProgress");
const repProgress = document.getElementById("repProgress");
const repProgressBar = document.getElementById("repProgressBar");

const liveSpeed = document.getElementById("liveSpeed");
const peakSpeed = document.getElementById("peakSpeed");
const setTime = document.getElementById("setTime");
const completedRepsDisplay =
    document.getElementById("completedReps");

const lastRange = document.getElementById("lastRange");
const averageSpeed = document.getElementById("averageSpeed");
const lastPeakSpeed = document.getElementById("lastPeakSpeed");

const recommendedWeight =
    document.getElementById("recommendedWeight");
const velocityLoss = document.getElementById("velocityLoss");
const recommendationReason =
    document.getElementById("recommendationReason");

const speedChart = document.getElementById("speedChart");
const chartContext = speedChart.getContext("2d");


// MARK: - Workout state

const workout = {
    connected: false,
    training: false,

    weightKg: 8,
    targetReps: 10,
    targetSets: 4,

    currentSet: 1,
    completedReps: 0,

    liveSpeed: 0,
    peakSpeed: 0,
    lastRepPeakSpeed: 0,

    elapsedSeconds: 0,
    movementPhase: 0
};

const speedHistory = new Array(80).fill(0);

let simulationTimer = null;


// MARK: - Formatting

function formatNumber(value, digits = 1) {
    return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
}

function formatWeight(value) {
    return `${formatNumber(value)} kg`;
}


// MARK: - Interface updates

function updateWeightDisplay() {
    weightOutput.textContent =
        formatWeight(weightRange.value);
}

function updateWorkoutProgress() {
    setProgress.textContent =
        `Set ${workout.currentSet} of ${workout.targetSets}`;

    repProgress.textContent =
        `${workout.completedReps} / ${workout.targetReps}`;

    completedRepsDisplay.textContent =
        workout.completedReps;

    const progress =
        (workout.completedReps / workout.targetReps) * 100;

    repProgressBar.style.width =
        `${Math.min(progress, 100)}%`;
}

function updateMetrics() {
    liveSpeed.textContent =
        formatNumber(workout.liveSpeed);

    peakSpeed.textContent =
        formatNumber(workout.peakSpeed);

    setTime.textContent =
        formatNumber(workout.elapsedSeconds);
}

function setDeviceMessage(message) {
    deviceMessage.textContent = message;
}


// MARK: - Connection simulation

function updateConnectionInterface() {
    if (workout.connected) {
        connectionStatus.textContent = "Simulation connected";
        connectionStatus.classList.remove("disconnected");
        connectionStatus.classList.add("connected");

        connectButton.textContent = "Disconnect";
        setDeviceMessage("SIMULATION_CONNECTED");
    } else {
        connectionStatus.textContent = "Disconnected";
        connectionStatus.classList.remove("connected");
        connectionStatus.classList.add("disconnected");

        connectButton.textContent = "Connect";
        setDeviceMessage("Waiting for connection");
    }
}

connectButton.addEventListener("click", function () {
    workout.connected = !workout.connected;

    if (!workout.connected) {
        stopSimulation("Disconnected");
    }

    updateConnectionInterface();
});


// MARK: - Workout configuration

weightRange.addEventListener("input", updateWeightDisplay);

setWeightButton.addEventListener("click", function () {
    if (!workout.connected) {
        setDeviceMessage("CONNECT_FIRST");
        return;
    }

    workout.weightKg = Number(weightRange.value);
    workout.targetReps =
        Math.max(1, Number(targetRepsInput.value));
    workout.targetSets =
        Math.max(1, Number(targetSetsInput.value));

    workout.currentSet = 1;
    workout.completedReps = 0;

    recommendedWeight.textContent =
        formatWeight(workout.weightKg);

    updateWorkoutProgress();

    setDeviceMessage(
        `WORKOUT_CONFIGURED: ${formatWeight(workout.weightKg)}, ` +
        `${workout.targetReps} reps, ${workout.targetSets} sets`
    );

    setWeightButton.textContent = "Settings Applied";

    window.setTimeout(function () {
        setWeightButton.textContent = "Set Weight";
    }, 1500);
});


// MARK: - Training simulation

startTrainingButton.addEventListener("click", function () {
    if (!workout.connected) {
        setDeviceMessage("CONNECT_FIRST");
        return;
    }

    if (workout.training) {
        return;
    }

    startSet();
});

nextSetButton.addEventListener("click", function () {
    if (workout.currentSet >= workout.targetSets) {
        return;
    }

    workout.currentSet += 1;
    workout.completedReps = 0;

    nextSetButton.hidden = true;

    updateWorkoutProgress();
    startSet();
});

function startSet() {
    workout.training = true;
    workout.completedReps = 0;
    workout.liveSpeed = 0;
    workout.peakSpeed = 0;
    workout.lastRepPeakSpeed = 0;
    workout.elapsedSeconds = 0;
    workout.movementPhase = 0;

    speedHistory.fill(0);

    trainingState.textContent = "Training";
    startTrainingButton.disabled = true;

    updateWorkoutProgress();
    updateMetrics();
    drawSpeedChart();

    setDeviceMessage(
        `SET_${workout.currentSet}_ACTIVE`
    );

    simulationTimer = window.setInterval(
        simulateTrainingSample,
        100
    );
}

function simulateTrainingSample() {
    workout.elapsedSeconds += 0.1;

    const previousPhase = workout.movementPhase;
    workout.movementPhase += 0.18;

    const fatigue =
        1 - (workout.completedReps * 0.018);

    const movement =
        Math.abs(Math.sin(workout.movementPhase));

    const randomVariation =
        Math.random() * 4 - 2;

    workout.liveSpeed = Math.max(
        0,
        movement * 55 * fatigue + randomVariation
    );

    workout.peakSpeed = Math.max(
        workout.peakSpeed,
        workout.liveSpeed
    );

    workout.lastRepPeakSpeed = Math.max(
        workout.lastRepPeakSpeed,
        workout.liveSpeed
    );

    speedHistory.push(workout.liveSpeed);
    speedHistory.shift();

    const completedMovementCycle =
        previousPhase < Math.PI * 2 &&
        workout.movementPhase >= Math.PI * 2;

    if (completedMovementCycle) {
        workout.movementPhase -= Math.PI * 2;
        completeRepetition();
    }

    updateMetrics();
    drawSpeedChart();
}

function completeRepetition() {
    workout.completedReps += 1;

    const simulatedRange =
        38 + Math.random() * 8;

    const simulatedAverageSpeed =
        workout.lastRepPeakSpeed * 0.62;

    lastRange.textContent =
        `${formatNumber(simulatedRange)} cm`;

    averageSpeed.textContent =
        `${formatNumber(simulatedAverageSpeed)} cm/s`;

    lastPeakSpeed.textContent =
        `${formatNumber(workout.lastRepPeakSpeed)} cm/s`;

    updateWorkoutProgress();

    workout.lastRepPeakSpeed = 0;

    if (workout.completedReps >= workout.targetReps) {
        finishSet();
    }
}

function finishSet() {
    stopSimulation("SET_COMPLETE");

    calculateRecommendation();

    if (workout.currentSet < workout.targetSets) {
        trainingState.textContent = "Set complete";
        nextSetButton.hidden = false;

        setDeviceMessage(
            `SET_${workout.currentSet}_COMPLETE`
        );
    } else {
        trainingState.textContent = "Workout complete";
        nextSetButton.hidden = true;

        setDeviceMessage("WORKOUT_COMPLETE");
    }
}

function stopSimulation(message) {
    if (simulationTimer !== null) {
        window.clearInterval(simulationTimer);
        simulationTimer = null;
    }

    workout.training = false;
    workout.liveSpeed = 0;

    startTrainingButton.disabled = false;

    updateMetrics();

    if (message) {
        setDeviceMessage(message);
    }
}


// MARK: - Adaptive recommendation

function calculateRecommendation() {
    const finalSpeed =
        Number.parseFloat(lastPeakSpeed.textContent) || 0;

    let loss = 0;

    if (workout.peakSpeed > 0) {
        loss =
            ((workout.peakSpeed - finalSpeed) /
                workout.peakSpeed) * 100;
    }

    loss = Math.max(0, Math.min(loss, 100));

    let nextWeight = workout.weightKg;
    let reason = "Resistance remains unchanged.";

    if (loss < 10) {
        nextWeight += 0.5;
        reason =
            "Low velocity loss: increase resistance slightly.";
    } else if (loss > 20) {
        nextWeight -= 0.5;
        reason =
            "High fatigue: reduce resistance slightly.";
    } else {
        reason =
            "Suitable effort: keep the same resistance.";
    }

    nextWeight = Math.max(4, Math.min(nextWeight, 30));

    velocityLoss.textContent =
        `${formatNumber(loss)}%`;

    recommendedWeight.textContent =
        formatWeight(nextWeight);

    recommendationReason.textContent = reason;
}


// MARK: - Motor-control simulation

stopMotorButton.addEventListener("click", function () {
    stopSimulation("MOTOR_STOPPED");
    trainingState.textContent = "Stopped";
});

returnCableButton.addEventListener("click", function () {
    if (!workout.connected) {
        setDeviceMessage("CONNECT_FIRST");
        return;
    }

    setDeviceMessage("RETURNING_CABLE");

    window.setTimeout(function () {
        setDeviceMessage("RETURN_TO_START_COMPLETE");
    }, 1500);
});


// MARK: - Speed graph

function drawSpeedChart() {
    const width = speedChart.width;
    const height = speedChart.height;

    const padding = 24;
    const maximumSpeed = 70;

    chartContext.clearRect(0, 0, width, height);

    chartContext.beginPath();

    speedHistory.forEach(function (speed, index) {
        const x =
            padding +
            (index / (speedHistory.length - 1)) *
            (width - padding * 2);

        const y =
            height -
            padding -
            (speed / maximumSpeed) *
            (height - padding * 2);

        if (index === 0) {
            chartContext.moveTo(x, y);
        } else {
            chartContext.lineTo(x, y);
        }
    });

    chartContext.strokeStyle = "#20a4ff";
    chartContext.lineWidth = 4;
    chartContext.lineJoin = "round";
    chartContext.lineCap = "round";
    chartContext.stroke();
}


// MARK: - Initial page setup

updateWeightDisplay();
updateConnectionInterface();
updateWorkoutProgress();
updateMetrics();
drawSpeedChart();