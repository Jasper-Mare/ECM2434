topic = document.getElementById("topic");
question = document.getElementById("question");
op1 = document.getElementById("op1");
op2 = document.getElementById("op2");
op3 = document.getElementById("op3");

b1 = document.getElementById("b1");
b2 = document.getElementById("b2");
b3 = document.getElementById("b3");
value = 1;

function save() {
    correctAnswer = document.querySelector(".correct").id;
    correctAnswer = parseInt(correctAnswer[1])-1;
    q = question.value
    ans1 = op1.value
    ans2 = op2.value
    ans3 = op3.value
    toSave = [q, ans1, ans2, ans3, correctAnswer];
    locationID = 0;
    console.log(toSave);

    if (isempty(q) || isempty(ans1) || isempty(ans2) || isempty(ans3)) {
        alert("something is empty!!!!!")
    }


    const xhr = new XMLHttpRequest();
    request = 'http://127.0.0.1:8000/contentDB/createQuiz?question='+q+'&answer0='+ans1+'&answer1='+ans2+'&answer2='+ans3+'&correct_answer='+correctAnswer+'&points=10&location_id='+locationID;
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

function select(id) {
    b1.classList = "choose"
    b2.classList = "choose"
    b3.classList = "choose"
    document.getElementById(id).classList.add("correct")

}

function isempty(string) {
    hold = string.trim();
    return (hold == null || hold == '');
}