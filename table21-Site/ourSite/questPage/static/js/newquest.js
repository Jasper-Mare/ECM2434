// written by Ruby
// get document elements
topic = document.getElementById("topicQuest");
question = document.getElementById("questionQuest");



// function to check that a question is valid and then add it to the database
function save() {
    q = question.value
    toSave = [q];
    console.log(toSave);

    // make sure that they have filled in all inputs
    if (isempty(q)) {
        const text = "Field is empty" ;
        document.getElementById("errorMessageQuest").innerHTML = `
        <div class="alert py-1 alert-danger alert-dismissible fade show" role="alert">` + text + 
        `<button type="button" class="btn-close py-1" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
    }


    // send the information to the database
    const xhr = new XMLHttpRequest();
    request = '/contentDB/createQuest?task='+q+'&points=10';
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
}


// function to check if an input box is empty
function isempty(string) {
    hold = string.trim();
    return (hold == null || hold == '');
}
