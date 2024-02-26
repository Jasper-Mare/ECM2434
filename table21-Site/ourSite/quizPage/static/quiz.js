// get the elements
question = document.getElementById("question_text");
op1 = document.getElementById("op1");
op2 = document.getElementById("op2");
op3 = document.getElementById("op3");
QN = document.getElementById("questionNum");
score = document.getElementById("score");
exit = document.getElementById("save");
title = document.getElementById("topic");
title.textContent = "Sustainability quiz";

// list of questions in the form where the first one in each is the correct answer
//questions = [['what is the first char','a','b','c'],['what is the first char','d','e','f'],['what is the first char','g','h','i']];

try {
  const urlParams = new URLSearchParams(window.location.search);
  const locationID = urlParams.get('id');
  if (locationID == null) {throw "no location id";}
  DoQuiz(locationID);
}
catch {
  alert("error: no location id");
  window.location.href = "/map/";
}

function DoQuiz(locationID) {
  const xhr = new XMLHttpRequest();
  request = '/contentDB/getQuizzesByLocation?id=' + locationID
  console.log(request);
  xhr.open('GET', request, true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          questions = response["quizzes"];

          questionNumber = 1;
          scorecount = 0;
          totalquestions = 1;
          // load the page when its first created
          nextquestion();
      }
  };
  xhr.send();
}

// update questions and score
function nextquestion() {
  if (questionNumber > totalquestions) {
    finish();
    return;
  }
  QN.textContent = "Q"+questionNumber;
  score.textContent = scorecount+"/"+totalquestions;
  question.textContent = questions[0]["question"];
  correct = questions[0]["correct_answer"];

  if (questions.length > 0) {
    order = shuffle([0,1,2]);
    choices = {0: questions[0]["answer0"], 1: questions[0]["answer1"], 2: questions[0]["answer2"]};

    op1.innerHTML = '<input type="radio" name="' + order[0] + '" onclick="choose(name)">' + choices[order[0]];
    op2.innerHTML = '<input type="radio" name="' + order[1] + '" onclick="choose(name)">' + choices[order[1]];
    op3.innerHTML = '<input type="radio" name="' + order[2] + '" onclick="choose(name)">' + choices[order[2]];
    questions.shift();
  } else {
    finish();
  }
}

// on clicking an option increase score if correct then update page with next question
function choose(name) {
  if (name == correct) {scorecount ++;}
  questionNumber ++;
  nextquestion();
}

// function to shuffle a list used in making sure the correct answer isnt in the same place and the questions are in a random order
function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}


function addScore(id, score) {
  const xhr = new XMLHttpRequest();
  request = 'http://127.0.0.1:8000/userDB/getUserById?id='+String(id)
  console.log(request);

  xhr.open('GET', request, true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        currentscore = parseInt(response["score"]);

        const xhr2 = new XMLHttpRequest();
        request = '/userDB/updateUser?id='+String(id)+'&score='+String(score+currentscore)
        console.log(request);

        xhr2.open('GET', request, true);
        xhr2.onreadystatechange = function() {
            if (xhr2.readyState === 4 && xhr2.status === 200) {
                const response = JSON.parse(xhr2.responseText);
                console.log(response);
            }
        };
        xhr2.send();
      }
  };
  xhr.send();
}

function finish() {
  addScore(getCookie("login"), scorecount);
  question.textContent = "You scored " + scorecount + " out of " + totalquestions;
  op1.style.display = "none";
  op2.style.display = "none";
  op3.style.display = "none";
  exit.style.display = "block";
}

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