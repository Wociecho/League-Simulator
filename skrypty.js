const initiateButton = document.getElementById('initiateButton');
let relegationsNumber = 0;
let teamNumber = 0;

//klikniecie w przycisk po wpisaniu liczby druzyn i spadajacych

initiateButton.addEventListener('click', createLeague);

function createLeague(){

    //sprawdź czy liczba drużyn/spadki nie puste + czy liczba druzyn > spadki

    const tNoValue = document.querySelector(`[name="teamNumber"]`).value;
    const tDeValue = document.querySelector(`[name="degradationTeamNumber"]`).value;

    if (tNoValue == "" || tDeValue == "") {
        alert('Wprowadź poprawne wartości');
        return;
    }

    if (tNoValue*1 <= tDeValue*1) {
        alert('Liczba drużyn musi być większa niż liczba spadkowiczów');
        return;
    }

    if(tNoValue < 3) {
        alert('W lidze muszą uczestniczyć przynajmniej 3 zespoły');
        return;
    }

    document.getElementsByClassName('info')[0].style.display = "none";
    teamNumber = document.getElementsByName('teamNumber')[0].value * 1;
    const initiatePanel = document.getElementsByClassName('leagueData')[0];
    for (let i = 1; i <= teamNumber; i++) {
        initiatePanel.innerHTML += 
        "<div class='teamNameAndStrength'><label for='teamName" + i + "'>Nazwa druzyny " + i + ": <label><input type='text' name='teamName" + i + "' class='teamN'>" + 
        "<label for='teamStrength" + i + "'>Siła " + i + ": <label><input type='number' name='teamStrength" + i + "' class='teamS' min='1' max='4'></div>";
    }


    relegationsNumber = document.getElementsByName('degradationTeamNumber')[0].value * 1;
    

    initiatePanel.innerHTML += "<button class='confirm' id='initiateLeague' onclick='start()'>Rozpocznij</button>";
}

//tworzenie tablic dla nazw i sił drużyn i punktów

const teamsNames = document.getElementsByClassName('teamN');
const teamsStrengths = document.getElementsByClassName('teamS');
const tN = [];
const tS = [];
const tP = [];

//tablice dla zwycięstw, remisów, porażek

const tW = [];
const tD = [];
const tL = [];

//tabele GD GP

const tGF = [];
const tGA = [];

//historia

let addToHistory = "";
let seazonNumber = 0;

//klikniecie w przycisk po wpisaniu danych

function start(){

    const table = document.getElementsByClassName('table')[0];
    let tablehtml = "";

    //sprawdzenie czy poprawna wartość + przypisanie do tablic + stworzenie tabeli

    for(let i = 0; i < teamsNames.length; i++) {
        if (teamsNames[i].value == ""){
            alert('Sprawdź, czy wprowadzono wszystkie nazwy drużyn');
            return;
        }
        if (teamsStrengths[i].value != 1 && teamsStrengths[i].value != 2 && teamsStrengths[i].value != 3 && teamsStrengths[i].value != 4){
            alert('Sprawdź, czy wprowadzono wartości liczbowe (z przediału 1-4) dla siły każdej z drużyn');
            return;
        }
        tN[i] = teamsNames[i].value;
        tS[i] = teamsStrengths[i].value * 1;
        tP[i] = 0;
        tW[i] = 0;
        tD[i] = 0;
        tL[i] = 0;
        tGF[i] = 0;
        tGA[i] = 0;
        tablehtml += '<tr><td class="tablepos">' + (i+1) + '<td class="tabletn">' + tN[i] + '<td class="tablepts"> 0' + '<td class="tableW"> 0' + '<td class="tableD"> 0' + '<td class="tableL"> 0' + '<td class="tableGF"> 0' + '<td class="tableGA"> 0';
    }
    table.innerHTML += '<table class="leagueTable"><thead><tr><th class="tablepos">Pos.<th class="tabletn">Team name<th class="tablepts">PTS <th class="tableW">W <th class="tableD">D <th class="tableL">L <th class="tableGF">GF <th class="tableGA">GA<tbody>' + tablehtml + '</table><button class="confirm" onclick="simulateSeason()">Symulacja</button>';
    document.getElementsByClassName('allData')[0].style.display = "none";
    
    changeRelegationColor();
}

//zmiana koloru w tabeli dla ostatnich drużyn

function changeRelegationColor() {
    for(let i = 0; i < relegationsNumber; i++){
        document.querySelectorAll('.leagueTable tr')[teamNumber - i].style.backgroundColor = "rgb(173, 33, 33)";
    }
}

//klikniecie symuluj po tabeli poczatkowej
//odjecie z 1 petli ostatniej drużyny

function simulateSeason() {

    replaceRelegated();

    for (let i = 0; i < (tN.length - 1); i++) {
        for (let j = (tN.length - 1); j > i; j--){
            simulateMatches(i, j);
            simulateMatches(i, j);
        }
    }
    seazonNumber++;
    sortTable();
    addInputForNewTeams();

    document.getElementById('historyBtn').style.display = "block";
}

//symulator wyników

function simulateMatches(team1id, team2id) {

    let strengthT1 = tS[team1id];
    let strengthT2 = tS[team2id];
    let scoreT1 = 0;
    let scoreT2 = 0;

    for (let i = 0; i < 3; i++) {

        let rand1 = Math.floor(Math.random() * 3);
        let rand2 = Math.floor(Math.random() * 3);
        //jeżeli któryś silniejszy w 1 losowaniu przewaga
        if (strengthT1 != strengthT2 && i == 0) {
            if (strengthT1 > strengthT2) {
                if (rand1 > rand2) {
                    scoreT1 += rand1 - rand2;
                }
                if (rand1 == rand2) {
                    scoreT1 += 1;
                }
            }

            if (strengthT2 > strengthT1) {
                if (rand2 > rand1) {
                    scoreT2 += rand2 - rand1;
                }
                if (rand2 == rand1) {
                    scoreT2 += 1;
                }
            }
        }
        //jeżeli znaczna przewaga
        if (((strengthT1 - strengthT2) >= 2 || (strengthT2 - strengthT1) >= 2) && i == 1) {
            if (strengthT1 > strengthT2) {
                if (rand1 > rand2) {
                    scoreT1 += rand1 - rand2;
                }
                if (rand1 == rand2) {
                    scoreT1 += 1;
                }
            }

            if (strengthT2 > strengthT1) {
                if (rand2 > rand1) {
                    scoreT2 += rand2 - rand1;
                }
                if (rand2 == rand1) {
                    scoreT2 += 1;
                }
            }
        }
        //jeżeli taka sama siła / 2 ostatnie losowania
        else if (rand1 != rand2) {
            if (rand1 > rand2) {
                scoreT1 += rand1 - rand2;
            }
            if (rand2 > rand1) {
                scoreT2 += rand2 - rand1;
            }
        }

    }

        //dodanie bramek

        tGF[team1id] += scoreT1;
        tGA[team1id] += scoreT2;
        tGF[team2id] += scoreT2;
        tGA[team2id] += scoreT1;

        //dodanie punktów
        if (scoreT1 > scoreT2) {
            tP[team1id] += 3;
            tW[team1id]++;
            tL[team2id]++;
        }
        if (scoreT2 > scoreT1) {
            tP[team2id] += 3;
            tW[team2id]++;
            tL[team1id]++;
        }
        if (scoreT1 == scoreT2) {
            tP[team1id] += 1;
            tP[team2id] += 1;
            tD[team1id]++;
            tD[team2id]++;
        }
}

//układanie tabeli

function sortTable(){
    for (let i = 0; i < (tN.length - 1); i++) {
        for (let j = (tN.length - 1); j > i; j--){
            if(tP[i] == tP[j]) {
                if(tGF[j] - tGA[j] > tGF[i] - tGA[i]){
                    swapTeams(i, j);
                }
                if(tGF[j] - tGA[j] == tGF[i] - tGA[i]){
                    if(tGF[j] > tGF[i]){
                        swapTeams(i, j);
                    }
                }
            }
            if(tP[i] < tP[j]) {
                swapTeams(i, j);
            }
        }
    }

    //zmiana siły drużyn w zależności od miejsca

    for (let i = 0; i < tN.length; i++){
        strengthCheck(i);
    }

    document.getElementsByClassName('tablepts')[0].style.display = "table-cell";
    document.getElementsByClassName('tableW')[0].style.display = "table-cell";
    document.getElementsByClassName('tableD')[0].style.display = "table-cell";
    document.getElementsByClassName('tableL')[0].style.display = "table-cell";
    document.getElementsByClassName('tableGF')[0].style.display = "table-cell";
    document.getElementsByClassName('tableGA')[0].style.display = "table-cell";
    for (let i = 0; i < tN.length; i++) {
        document.getElementsByClassName('tablepts')[i+1].style.display = "table-cell";
        document.getElementsByClassName('tableW')[i+1].style.display = "table-cell";
        document.getElementsByClassName('tableD')[i+1].style.display = "table-cell";
        document.getElementsByClassName('tableL')[i+1].style.display = "table-cell";
        document.getElementsByClassName('tableGF')[i+1].style.display = "table-cell";
        document.getElementsByClassName('tableGA')[i+1].style.display = "table-cell";
        document.getElementsByClassName('tabletn')[i+1].innerHTML = tN[i];
        document.getElementsByClassName('tablepts')[i+1].innerHTML = tP[i];
        document.getElementsByClassName('tableW')[i+1].innerHTML = tW[i];
        document.getElementsByClassName('tableD')[i+1].innerHTML = tD[i];
        document.getElementsByClassName('tableL')[i+1].innerHTML = tL[i];
        document.getElementsByClassName('tableGF')[i+1].innerHTML = tGF[i];
        document.getElementsByClassName('tableGA')[i+1].innerHTML = tGA[i];
        tP[i] = 0;
        tW[i] = 0;
        tD[i] = 0;
        tL[i] = 0;
        tGF[i] = 0;
        tGA[i] = 0;
    }

    //dopisanie do historii
    addToHistory = "<tr><td>Season " + seazonNumber + "<td class='" + tN[0].replace(/\s+/g, '') + "' onclick='highlightH(\"" + tN[0].replace(/\s+/g, '') + "\")'>" + tN[0] + "<td class='" + tN[1].replace(/\s+/g, '') + "' onclick='highlightH(\"" + tN[1].replace(/\s+/g, '') + "\")'>" + tN[1] + "<td class='" + tN[2].replace(/\s+/g, '') + "' onclick='highlightH(\"" + tN[2].replace(/\s+/g, '') + "\")'>" + tN[2] + addToHistory;
    document.getElementsByClassName('history')[0].innerHTML = "<table class='historyTable'><thead><tr><th> <th>Champion <th>2nd place <th>3rd place <tbody>" + addToHistory + "</table>";
}

//funkcja zmieniająca zespoły

function swapTeams(i,j){
    [tN[i], tN[j]] = [tN[j], tN[i]];
    [tP[i], tP[j]] = [tP[j], tP[i]];
    [tS[i], tS[j]] = [tS[j], tS[i]];
    [tW[i], tW[j]] = [tW[j], tW[i]];
    [tD[i], tD[j]] = [tD[j], tD[i]];
    [tL[i], tL[j]] = [tL[j], tL[i]];
    [tGF[i], tGF[j]] = [tGF[j], tGF[i]];
    [tGA[i], tGA[j]] = [tGA[j], tGA[i]];
}

//wprowadzenie nazw zespołów które awansowały

function addInputForNewTeams(){
    let newTeamsinputs = "";
    for(let i = 0; i < relegationsNumber; i++){
        newTeamsinputs +=
        "<div class='teamNameAndStrength'><label for='teamName" + (i+1) +
        "'>Beniaminek " + (i+1) + ": <label><input type='text' name='teamName" +
        i + "' class='newTeam'></div>";
    }
    document.getElementsByClassName('newTeams')[0].innerHTML = newTeamsinputs;
}

function replaceRelegated() {
    if(relegationsNumber > 0){
        let newTeams = document.getElementsByClassName('newTeam');
        for(let i =0; i < newTeams.length; i++){
            if(newTeams[i].value == "" || newTeams[i].value == undefined){
                alert('wprowadź nazwy zespołów, które awansowały');
                return;
            }
            else {
                tN[tN.length-(i+1)] = newTeams[i].value;
                tS[tS.length-(i+1)] = 1;
            }
        }
    }
}

//podświetlanie zespołu w historii

function highlightH(tdClass) {
    const tableCells = document.querySelectorAll(".historyTable td");
    for(let i = 0; i < tableCells.length; i++){
        if(tableCells[i].classList.contains(tdClass) && !tableCells[i].classList.contains('highlightHistory')){
            tableCells[i].classList.add('highlightHistory');
        }
        else {
            tableCells[i].classList.remove('highlightHistory');
        }
    }
}

//przycisk pokazujący i chowający historię

document.getElementById('historyBtn').onclick = function(){showOrHideH()};

function showOrHideH() {
    if(document.getElementsByClassName('history')[0].style.height == "400px"){
        document.getElementsByClassName('history')[0].style.height = "0px";
        document.getElementsByClassName('history')[0].style.overflow = "hidden";
    }
    else {
        document.getElementsByClassName('history')[0].style.height = "400px";
        document.getElementsByClassName('history')[0].style.overflow = "auto";
    }
}

//zmiana sił w zależności od pozycji na koniec poprzedniego sezonu

function strengthCheck(teamID) {
    if (tS[teamID] == 4){
        if (teamID > Math.floor(tN.length/(100/20))) {
            tS[teamID]--;
        }
    }
    else if (tS[teamID] == 3){
        if (teamID < Math.floor(tN.length/(100/10))) {
            tS[teamID]++;
        }
        if (teamID > Math.floor(tN.length/(100/35))) {
            tS[teamID]--;
        }
    }
    else if (tS[teamID] == 2){
        if (teamID < Math.floor(tN.length/(100/20))) {
            tS[teamID]++;
        }
        if (teamID > Math.floor(tN.length/(100/55))) {
            tS[teamID]--;
        }
    }
    else if (tS[teamID] == 1){
        if (teamID < Math.floor(tN.length/(100/45))) {
            tS[teamID]++;
        }
    }
}