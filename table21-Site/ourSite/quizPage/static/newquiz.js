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
    alert("oh nooo")


    const correctAnswer = document.getElementsByClassName("correct");
    alert(correctAnswer)
    q = question.value
    ans1 = op1.value
    ans2 = op2.value
    ans3 = op3.value
    correctAns = correctAnswer.value
    toSave = [q, ans1, ans2, ans3, correctAns];



    if (!q || !ans1 || !ans2 || !ans3) {
        alert("something is empty!!!!!")

    }


    // check valid input

    // write to db




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