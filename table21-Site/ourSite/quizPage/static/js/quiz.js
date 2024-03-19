// Written by Jacob
// get the elements
question = document.getElementById("question_text");
op1 = document.getElementById("op1"); // options
op2 = document.getElementById("op2");
op3 = document.getElementById("op3");
QN = document.getElementById("questionNum");
score = document.getElementById("score");
exit = document.getElementById("save");
title = document.getElementById("topic");
title.textContent = "Sustainability quiz";

userID = getCookie("login"); // get the userID from the cookie
if (userID == undefined || userID == "") { // if they are not logged in redirect them to the login page
  alert("Please login to take the quiz");
  window.location.href = "/login/";
}

try { // get the location id from the url
  const urlParams = new URLSearchParams(window.location.search);
 //----------------change code back ----------------//
  const locationID = urlParams.get('id');
  //const locationID = 6
  if (locationID == null) {
    alert("error: no location id");
    window.location.href = "/map/";
  } // if there is no id in the url throw an error

  // get the location name from the location id
  request = '/contentDB/getLocationById?id=' + locationID // get the location name that is stored in the database
  getRequest(request)
    .then(response => {
      place.textContent = response["name"]; // use the name variable of the returned json
    })

    DoQuiz(locationID); // start the quiz once variables are set and checks are made
}


catch { // if location cannot be found redirect to the map page
  alert("error: no location id");
  window.location.href = "/map/";
}

// function to set the quiz questions and start the quiz
function DoQuiz(locationID) {
  request = '/contentDB/getQuizzesByLocation?id=' + locationID // get the questions from the database based on the location id
  getRequest(request)
  .then(response => {
    questions = shuffle(response["quizzes"]); // the order of the questions is randomised
    console.log(questions);

    questionNumber = 1;
    scorecount = 0;
    totalquestions = 1;

    nextquestion();
  });
}

// update questions and score
function nextquestion() {
  // update the page elements
  QN.textContent = "Q"+questionNumber;
  score.textContent = scorecount+"/"+totalquestions;
  if (questionNumber <= totalquestions && questions.length > 0) { // check that there is still questions to be asked
    question.textContent = questions[0]["question"];
    correct = questions[0]["correct_answer"]; // get the index of the correct answer

    order = shuffle([0,1,2]); // get a random order to ask the three options (so that the correct answer isn't always the same position)
    choices = {0: questions[0]["answer0"], 1: questions[0]["answer1"], 2: questions[0]["answer2"]}; // get all the answers from the json

    // add the option button htmls
    op1.innerHTML = '<input class="form-check-input" type="radio" name="' + order[0] + '" onclick="choose(name)">' + choices[order[0]];
    op2.innerHTML = '<input class="form-check-input" type="radio" name="' + order[1] + '" onclick="choose(name)">' + choices[order[1]];
    op3.innerHTML = '<input class="form-check-input" type="radio" name="' + order[2] + '" onclick="choose(name)">' + choices[order[2]];
    questions.shift();

  } else { // if there are no more questions finish
    finish();
  }
}

// on clicking an option increase score if correct then update page with next question
function choose(name) {
  if (name == correct) {scorecount ++;} // if they clicked the right answer increase the score
  questionNumber ++;
  nextquestion(); // call the next function even if there are no more questions
}

// function to shuffle a list used in making sure the correct answer isnt in the same place and the questions are in a random order
function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

// function to add the score to the user in the database
function addScore(id, score) {
  // get the current score of the user
  request = 'http://127.0.0.1:8000/userDB/getUserById?id='+String(id) // get user details from their id
  getRequest(request)
  .then(response => {
    currentscore = parseInt(response["score"]); // get the score attribute from the json

    // add the score to the current score
    request = '/userDB/updateUser?id='+String(id)+'&score='+String(score+currentscore) // use updateUser in contentDB
    getRequest(request)
    .then(response => {
      console.log(response);
    })
  })
}

// function to display the score when the quiz is finished
function finish() {
  addScore(userID, scorecount);
  question.textContent = "You scored " + scorecount + " out of " + totalquestions;
  op1.style.display = "none";
  op2.style.display = "none";
  op3.style.display = "none";

  // advance the user's target location
  // fetch the all the locations
  var locations = [];
  var currentLocationId = -1;

  function waitForLocations() {
    console.log("wait for locations", locations, currentLocationId);

    if (locations.length == 0 || currentLocationId === -1) {
        // locations aren't loaded, so wait
        setTimeout(() => {
            waitForLocations();
        },100);
    } else {
      //the locations are loaded and we have the user's location
      advanceLocation();
    }
  }

  function advanceLocation() {
    console.log("advance location");
    const currentLocationIndex = locations.findIndex((e) => { return e == currentLocationId; });
    var newLocationId;

    // if it is the last one or beyond the list, wrap around
    if (currentLocationIndex >= locations.length - 1) { newLocationId = locations[0]; }
    else { 
      // go to the next location
      newLocationId = locations[currentLocationIndex+1];
    }

    console.log(currentLocationIndex, currentLocationId, newLocationId);
    fetch("/userDB/updateUserTargetLocation?id="+userID+"&location="+newLocationId,{method: "GET"});
  }

  fetch("/contentDB/getAllLocations", {method: "GET"})
  .then((response) => response.json())
  .then((json) => {
    console.log("locations got back", locations);
    json["locations"].forEach(e => {
      locations.push(e["id"]);
    });
  })

  // fetch the location the user is at
  fetch("/userDB/getUserTargetLocation?id="+userID, {method: "GET"})
  .then((response) => response.json())
  .then((json) => {
    console.log("player location got back:", json);
    currentLocationId = json["location"];
  })

  // wait for the fetches to ccome back
  waitForLocations();
}

// function to get the cookie of a given name
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

// function to make a get request and return the response
async function getRequest(request) {
  try {
    const response = await fetch(request);
    if (!response.ok) {
      throw new Error('Request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}