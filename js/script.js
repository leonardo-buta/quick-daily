$(document).ready(function () {

    // SmartWizard initialize
    $('#smartwizard').smartWizard({
        theme: 'arrows',
        autoAdjustHeight: false,
        enableURLhash: false,
        leaveStep: function () { alert(); },
        transition: {
            animation: 'slide-swing',
            speed: '400',
        },
        lang: {
            next: 'Próximo',
            previous: 'Voltar'
        }
    });

    $("#smartwizard").on("showStep", function (e, anchorObject, stepIndex, stepDirection) {
        switch (stepIndex) {
            case 1:
                loadStep2();
                break;
            case 2:
                loadStep3();
                break;
            default:
                break;
        }
    });

    $("#smartwizard").on("leaveStep", function (e, anchorObject, currentStepIndex, nextStepIndex, stepDirection) {
        let shouldAdvanceStep = true;

        switch (currentStepIndex) {
            case 0:
                shouldAdvanceStep = checkEmptyParticipants();
                break;
            case 1:
                shouldAdvanceStep = chooseNextParticipant();
                break;
            default:
                break;
        }

        return shouldAdvanceStep;
    });
});

let participants = [];
let startTime;
let elapsedTime = 0;
let totalElapsedTime = 0;
let timerInterval;
let currentParticipantIndex = 0;

function loadStep3() {
    createResultsTable();
    updateTotalElapsed();
}

function chooseNextParticipant() {
    let shouldAdvanceStep = false;
    let notChosenparticipants = participants.filter((item) => { return !item.chosen });

    if (notChosenparticipants.length > 0) {
        let nextParticipant = Math.floor(Math.random() * notChosenparticipants.length);
        let index = participants.findIndex((item) => { return item.participant === notChosenparticipants[nextParticipant].participant });
        participants[index].chosen = true;


        document.getElementById('currentParticipant').innerHTML = notChosenparticipants[nextParticipant].participant;

        if (participants.length !== notChosenparticipants.length) {
            pause(currentParticipantIndex);
        }

        start();

        currentParticipantIndex = index;

    } else {
        pause();
        shouldAdvanceStep = true;
    }

    return shouldAdvanceStep;
}

function createResultsTable() {
    let tbody = document.getElementById('results').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    let row = tbody.insertRow();

    for (let data of participants) {
        row.insertCell(0).innerHTML = data.participant;
        row.insertCell(1).innerHTML = timeToString(data.time);
        row = tbody.insertRow();
    }
}

function loadStep2() {
    saveParticipants();
    chooseNextParticipant();
    totalElapsedTime = 0;
}

function saveParticipants() {
    participants = document.getElementById('participants').value.split('\n')
        .filter((item) => { return item.trim() !== '' })
        .map((item) => { return { participant: item.toUpperCase(), chosen: false, time: 0 }; });
}

function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let diffInMs = (diffInSec - ss) * 100;
    let ms = Math.floor(diffInMs);

    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");
    let formattedMS = ms.toString().padStart(2, "0");

    return `${formattedMM}:${formattedSS}:${formattedMS}`;
}

function print(txt) {
    document.getElementById("display").innerHTML = txt;
}

function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        print(timeToString(elapsedTime));
    }, 10);
}

function pause() {
    clearInterval(timerInterval);
    participants[currentParticipantIndex].time = elapsedTime;
    totalElapsedTime += elapsedTime;
    elapsedTime = 0;
}

function updateTotalElapsed() {
    document.getElementById('totalTime').innerHTML = 'Tempo total: ' + timeToString(totalElapsedTime);
}

function checkEmptyParticipants() {
    return document.getElementById('participants').value.trim() !== '';
}