topic = document.getElementById("topic");
question = document.getElementById("question");
o1 = document.getElementById("op1");
o2 = document.getElementById("op2");
o3 = document.getElementById("op3");

s1 = document.getElementById("s1");
s2 = document.getElementById("s2");
s3 = document.getElementById("s3");

function save(){
    toSave = [question.value, o1.value, o2.value, o3.value];
    question.value = "";
    o1.value = "";
    o2.value = "";
    o3.value = "";
}

function select(id){

    s1.classList = "choose"
    s2.classList = "choose"
    s3.classList = "choose"
    document.getElementById(id).classList.add("correct")
}