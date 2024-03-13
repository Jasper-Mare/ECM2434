// written by Jacob
// get document elements
topic = document.getElementById("topic");
question = document.getElementById("question");
locationtable = document.getElementById("locationtable");

// option fields
op1 = document.getElementById("op1");
op2 = document.getElementById("op2");
op3 = document.getElementById("op3");

// buttons for correct elements 
b1 = document.getElementById("b1");
b2 = document.getElementById("b2");
b3 = document.getElementById("b3");

// add the locations to the dropdown menu from the database
getLocations();

// function to check that a question is valid and then add it to the database
function save() {
    // get all the information from the input fields
    correctAnswer = document.querySelector(".correct").id;
    correctAnswer = parseInt(correctAnswer[1])-1;
    q = question.value
    ans1 = op1.value
    ans2 = op2.value
    ans3 = op3.value
    toSave = [q, ans1, ans2, ans3, correctAnswer];
    locationID = locationtable.value;
    console.log(toSave);

    // make sure that they have filled in all inputs
    if (isempty(q) || isempty(ans1) || isempty(ans2) || isempty(ans3)) {
        alert("something is empty!!!!!")
    }


    // send the information to the database
    const xhr = new XMLHttpRequest();
    request = '/contentDB/createQuiz?question='+q+'&answer0='+ans1+'&answer1='+ans2+'&answer2='+ans3+'&correct_answer='+correctAnswer+'&points=10&location_id='+locationID;
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
        }
    };
    xhr.send();


    // clear input boxes
    question.value = "";
    op1.value = "";
    op2.value = "";
    op3.value = "";
}

// function to select the correct answer
function select(id) {
    // resets classes of all buttons
    b1.classList = "btn choose";
    b2.classList = "btn choose";
    b3.classList = "btn choose";
    // adds the correct class to the selected button
    document.getElementById(id).classList.add("correct");
}

// function to check if an input box is empty
function isempty(string) {
    hold = string.trim();
    return (hold == null || hold == '');
}

// function to get all the locations from the database and add them to the dropdown menu
function getLocations() {
    const xhr = new XMLHttpRequest();
    request = '/contentDB/getAllLocations';
    xhr.open('GET', request, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            locations = response["locations"];
            for (i = 0; i < locations.length; i++) {
                locationtable.innerHTML += "<option value='" + locations[i]["id"] + "'>" + locations[i]["name"] + "</option>";
            }
        }
    };

    xhr.send();
}