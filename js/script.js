$(document).ready(function () {

    // SmartWizard initialize
    $('#smartwizard').smartWizard({
        theme: 'progress',
        lang: {
            next: 'Próximo',
            previous: 'Voltar'
        }
    });

});

var participants = [];

function goToStep2() {
    participants = document.getElementById('w3review').value.split('\n').map((item) => {
        return { participant: item, chosen: false, time: 0 };
    });
}

function goToStep3() {
    createResultsTable();
}

function chooseNext() {

    let notChosenparticipants = participants.filter((item) => { return !item.chosen });
    let nextParticipant = Math.floor(Math.random() * notChosenparticipants.length);

    let index = participants.findIndex((item) => { return item.participant === notChosenparticipants[nextParticipant].participant });
    participants[index].chosen = true;

    document.getElementById('currentParticipant').innerHTML = notChosenparticipants[nextParticipant].participant;
}

function createResultsTable() {

    let table = document.getElementById('results').getElementsByTagName('tbody')[0];
    let row = table.insertRow();

    for (let data of participants) {
        row.insertCell(0).innerHTML = data.participant;
        row.insertCell(1).innerHTML = data.time;
        row = table.insertRow();
    }
}