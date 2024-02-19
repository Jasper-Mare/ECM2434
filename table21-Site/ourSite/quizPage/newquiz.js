topic = document.getElementById("topic");
question = document.getElementById("question");
o1 = document.getElementById("op1");
o2 = document.getElementById("op2");
o3 = document.getElementById("op3");

function save(){
    toSave = [question.value, o1.value, o2.value, o3.value];
    question.value = "";
    o1.value = "";
    o2.value = "";
    o3.value = "";
}