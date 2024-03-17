window.addEventListener('resize', changeScreen);
document.addEventListener('DOMContentLoaded',function(){
    changeScreen();
    var userID = getCookie("login"); // get the userID from the cookie
    if (userID == undefined || userID == "") { // if they are not logged in redirect them to the login page
        document.cookie = "login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" // set it to an expired date so its deleted
        window.location.href = "/login/";
    }
    else{
        const xhr = new XMLHttpRequest(); //start http using ID retrieved from cookie
        const request = '/userDB/getUserById?id='+String(userID)
        xhr.open('GET', request, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                //when json response comes from http request check access_level of user
                const access = response.access_level;
                //if user doesn't have authority hide button
                if(access == "USER"){
                    document.getElementById("admin").classList.add("hidden");
                }
            }
        };
        //send request
        xhr.send();
        }  
})

function changeScreen(){
    const bar = document.getElementById("bar");
    width = window.innerWidth;
    if(width<550){
        bar.classList.add("fixed-bottom");
    }
    else{
        bar.classList.remove("fixed-bottom");
    }
   
}

function playMusic() {
    // function to play Henry's music he created
    const item = document.getElementById("play");
        if (null == item) {
            const container = document.getElementById("sound");
            const funAudio = document.createElement("audio");
            funAudio.id = "play";
            funAudio.src = "../static/henrys jam.mp3";
            funAudio.loop = true;
            funAudio.autoplay = true;
            funAudio.volume = 0.2;
            container.appendChild(funAudio);
            funAudio.play();
        }
        
    }
    

function getCookie(cname) {
    // function to get the cookie of a given name
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
//Function getCookie() gets code from: https://www.w3schools.com/js/js_cookies.asp

function logOut() {
    document.cookie = "login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" // set it to an expired date so its deleted
    window.location.href = "/login/";
}
