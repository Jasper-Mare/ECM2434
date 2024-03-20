// Written by Ruby
// get the elements
question = document.getElementById("question_text");
QN = document.getElementById("questionNum");
score = document.getElementById("score");
exit = document.getElementById("save");
title = document.getElementById("topic");
title.textContent = "Sustainability quest";

userID = getCookie("login"); // get the userID from the cookie
if (userID == undefined || userID == "") { // if they are not logged in redirect them to the login page
  alert("Please login to take the quest");
  window.location.href = "/login/";
}


function DoQuest() {
  request = '/contentDB/getAllQuests' // get the quests from the database 
  getRequest(request)
  .then(response => {
    questions = shuffle(response["quests"]); // the order of the questions is randomised

    questionNumber = 1;
    scorecount = 0;
    totalquestions = 10;

    nextquestion();
  });
}

// update questions and score
function nextquestion() {
  // update the page elements
  score.textContent = "Points: 10";
  if (questionNumber <= totalquestions && questions.length > 0) { // check that there is still questions to be asked
    question.textContent = questions[0]["task"];
    questions.shift();
    choose(name)

  } else { // if there are no more questions finish
    //finish();
  }
}

// on clicking an option increase score if correct then update page with next question
function choose(name) {
  scorecount =10; // if they clicked the right answer increase the score by 10
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
  request = '/userDB/getUserById?id='+String(id) // get user details from their id
  getRequest(request)
  .then(response => {
    currentscore = parseInt(response["score"]); // get the score attribute from the json

    // add the score to the current score
    request = '/userDB/updateUser?id='+String(id)+'&score='+String(score+currentscore) // use updateUser in contentDB
    getRequest(request)
  })
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

function finish() {
  addScore(userID, scorecount);
  console.log("finish");

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
    fetch("/userDB/updateUserTargetLocation?id="+userID+"&location="+newLocationId,{method: "GET"}).then((response) => {
      // once the change has happened, redirect
      window.location.href="/map/";
    });
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

DoQuest();