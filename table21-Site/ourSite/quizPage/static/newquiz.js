topic = document.getElementById("topic");
question = document.getElementById("question");
op1 = document.getElementById("op1");
op2 = document.getElementById("op2");
op3 = document.getElementById("op3");

b1 = document.getElementById("s1");
b2 = document.getElementById("s2");
b3 = document.getElementById("s3");

function save() {
    correctAnswer = document.getElementByClass("correct")
    q = question.value
    ans1 = op1.value
    ans2 = op2.value
    ans3 = op3.value
    correctAns = correctAnswer.value
    toSave = [q, ans1, ans2, ans3, correctAns];

    if (q == "" || ans1 == "" || ans2 == "" || ans3 == "" || correctAns == "") {

    }

    // check valid input

    // write to db



    question.value = "";
    op1.value = "";
    op2.value = "";
    op3.value = "";


}

function select(id) {
    s1.classList = "choose"
    s2.classList = "choose"
    s3.classList = "choose"
    document.getElementById(id).classList.add("correct")
}