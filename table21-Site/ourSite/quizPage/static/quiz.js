// get the elements
question = document.getElementById("question");
op1 = document.getElementById("op1");
op2 = document.getElementById("op2");
op3 = document.getElementById("op3");
QN = document.getElementById("questionNum");
score = document.getElementById("score");
title = document.getElementById("topic");
title.textContent = "Sustainability quiz";



// list of questions in the form where the first one in each is the correct answer
//questions = [['what is the first char','a','b','c'],['what is the first char','d','e','f'],['what is the first char','g','h','i']];
questions = getQuestions(1);

if (questions == undefined) {
  alert("No questions!!!");
}
else {
  questionNumber = 1;
  scorecount = 0;
  // load the page when its first created
  nextquestion();
  addScore(1, 30); // this gotta go bro
}

questionNumber = 1;
scorecount = 0;
// load the page when its first created
nextquestion();
addScore(1, 30); // this gotta go bro

function getQuestions(locationID) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://127.0.0.1:8000/contentDB/getQuizzesByLocation?id=' + locationID, true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log(response);
          questions = response;
          return questions;
      }
  };
}

function getQuestions() {
  
}

// update questions and score
function nextquestion() {
  QN.textContent = "Q"+questionNumber;
  score.textContent = scorecount+"/3";
  question.textContent = questions[0][0];

  if (questions.length > 0) {
    order = shuffle([0,1,2]);
    choices = {0: questions[0][1], 1: questions[0][2], 2: questions[0][3]};

    op1.innerHTML = '<input type="radio" name="' + order[0] + '" onclick="choose(name)">' + choices[order[0]];
    op2.innerHTML = '<input type="radio" name="' + order[1] + '" onclick="choose(name)">' + choices[order[1]];
    op3.innerHTML = '<input type="radio" name="' + order[2] + '" onclick="choose(name)">' + choices[order[2]];
    questions.shift();
  } else {
    alert("No more questions");
  }
}

// on clicking an option increase score if correct then update page with next question
function choose(name) {
  if (name == 0) {scorecount ++;}
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
  request = 'http://127.0.0.1:8000/userDB/updateUser?id='+String(id)+'&score='+String(score)
  console.log(request);
  xhr.open('GET', request, true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log(response);
      }
  };
  xhr.send();
}