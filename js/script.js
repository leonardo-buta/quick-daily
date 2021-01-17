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
            default:
                break;
        }
    });

    $("#smartwizard").on("leaveStep", function (e, anchorObject, currentStepIndex, nextStepIndex, stepDirection) {
        let shouldAdvanceStep = true;

        switch (currentStepIndex) {
            case 1:
                shouldAdvanceStep = chooseNextParticipant();
                break;
            default:
                break;
        }

        return shouldAdvanceStep;
    });
});

var participants = [];

function goToStep3() {
    createResultsTable();
}

function chooseNextParticipant() {
    let shouldAdvanceStep = false;
    let notChosenparticipants = participants.filter((item) => { return !item.chosen });

    if (notChosenparticipants.length > 0) {
        let nextParticipant = Math.floor(Math.random() * notChosenparticipants.length);
        let index = participants.findIndex((item) => { return item.participant === notChosenparticipants[nextParticipant].participant });
        participants[index].chosen = true;

        document.getElementById('currentParticipant').innerHTML = notChosenparticipants[nextParticipant].participant;
    } else {
        shouldAdvanceStep = true;
    }

    return shouldAdvanceStep;
}

function createResultsTable() {

    let tbody = document.getElementById('results').getElementsByTagName('tbody')[0];
    let row = tbody.insertRow();

    for (let data of participants) {
        row.insertCell(0).innerHTML = data.participant;
        row.insertCell(1).innerHTML = data.time;
        row = tbody.insertRow();
    }
}

function loadStep2() {
    saveParticipants();
    chooseNextParticipant();
}

function loadStep3() {
    alert('passo 3');
}

function saveParticipants() {
    participants = document.getElementById('w3review').value.split('\n').map((item) => {
        return { participant: item, chosen: false, time: 0 };
    });
}
