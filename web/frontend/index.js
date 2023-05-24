//Login
loginSubmit =  document.getElementById('login_button');
async function doGetRequest(login_user,login_password) {
    try {
        let res = await axios.get('http://localhost:8000/login.php?username='+login_user+'&password='+login_password);
        return res.data;
    } catch (error) {
        return {"Exist":'false'};
    }
}

loginSubmit.addEventListener("click", async function(e) {
    let login_user = document.getElementById("login_user").value;
    let login_password = document.getElementById("login_password").value;
    e.preventDefault();
    let data = await doGetRequest(login_user,login_password);
    if (data['Exist'] == 'true') {
        display("sectionhomepage");
        let now = new Date();
        let time = now.getTime();
        let expireTime = time + 1000 * 60 * 60; // 1 hour
        now.setTime(expireTime);
        document.cookie = "auth="+login_user +";expires="+ now.toGMTString();
        document.getElementById("loginicon").src = "./login.png";
        document.getElementById('error_getstarted').innerHTML = '';
        localStorage.setItem("isloggedin",'true');
        localStorage.setItem("username",login_user);
    }
    else {
        document.getElementById("login_error").style.color = "red";
        document.getElementById("login_error").innerHTML = "error";
    }
})
// signup
signupButton = document.getElementById("signupbutton");
async function doPostRequest() {
    let login_user = document.getElementById("signup_name").value;
    let login_email = document.getElementById("signup_email").value;
    let login_password = document.getElementById("signup_password").value;
    let login_mobile = document.getElementById("signup_mobile").value;
    try {
        let res = await axios.post('http://localhost:8000/signup.php',{
            username: login_user,
            email: login_email,
            mobile: login_mobile,
            password: login_password,
        })
        return res.data;
    } catch (error) {
        return {"Message":'false'};
    }
}
signupButton.addEventListener("click", async function(e) {
    e.preventDefault();
    let data = await doPostRequest();
    if (data['Message'] == 'done') {
        display('sectionloginpage');
    }
    else {
        document.getElementById("signup_error").style.color = "red";
        document.getElementById("signup_error").innerHTML = "error while signing up";
    }
})

async function getUserInfo(user){
    try {
        let res = await axios.get('http://localhost:8000/get_user_info.php?username='+user);
        return res.data;
    } catch (error) {
        return {"Exist":'false'};
    }
}
loginIcon = document.getElementById("loginicon");
loginIcon.addEventListener("click",async ()=>{
    loggedin = localStorage.getItem("isloggedin");
    user = localStorage.getItem('username');
    events = document.getElementById("show_events");
    events.setAttribute("hidden","false");
    if (loggedin == 'true') {
        res = await getUserInfo(user);
        if (res['Exist'] != 'false') {
            document.getElementById('logged_user').innerHTML = user;
            document.getElementById('logged_email').innerHTML = res['Exist'][0]['email'];
            document.getElementById('logged_mobile').innerHTML = res['Exist'][0]['mobile'];
            display('sectionloggedin');
        }
    }
    else {
        display('sectionloginpage');
    }
})

function getStarted() {
    loggedin = localStorage.getItem("isloggedin");
    if (loggedin == 'true') {
        display('sectioneventspage');
        addEvent();
    }
    else {
        document.getElementById('error_getstarted').style.color = 'red';
        document.getElementById('error_getstarted').innerHTML = 'You must login to see events';
        display('sectionhomepage');
    }
}

logout = document.getElementById('logout');
logout.addEventListener("click",()=>{
    localStorage.setItem("isloggedin",'false');
    localStorage.setItem("username",'');
    let now = new Date(new Date() - 1000);
    document.cookie = "auth="+login_user +";expires="+ now.toGMTString();
    display('sectionhomepage');
    document.getElementById("loginicon").src = 'https://www.kindpng.com/picc/m/192-1925162_login-icon-png-transparent-png.png'
})

async function doGetEventRequest(user,event) {
    try {
        let res = await axios.get('http://localhost:8000/events_registered.php?username='+user+'&event='+event);
        return res.data;
    } catch (error) {
        return {"Exist":'false'};
    }
}

async function singleEvent(event) {
    user = localStorage.getItem('username');
    data = await doGetEventRequest(user,event);
    if (data['Exist'] == 'already_exist') {
        document.getElementById('register_button').disabled = true;
        document.getElementById('register_button').innerHTML = "registered";
        document.getElementById('register_button').style.backgroundColor = "green"
    }
    else {
        document.getElementById('register_button').disabled = false;
        document.getElementById('register_button').innerHTML = "register";
        document.getElementById('register_button').style.backgroundColor = "firebrick"
    }
}

function home() {
    events = document.getElementById("show_events");
    events.setAttribute("hidden","false");
    display('sectionhomepage');
}

async function doGetAllEvents(user) {
    try {
        let res = await axios.get('http://localhost:8000/get_events.php?username='+user);
        return res.data;
    } catch (error) {
        return {"Exist":'false'};
    }
}

async function showEvents() {
    events = document.getElementById("show_events");
    events.removeAttribute("hidden");
    display('show_events');
    username = localStorage.getItem("username");
    if (localStorage.getItem("isloggedin") == "true"){
        res = await doGetAllEvents(username);
        items = '<br>'
        if (res['Exist'] != false && res['Exist'].length > 0){
            for (let index = 0; index < res['Exist'].length; index++) {
                time_now = Date.now();
                const date = new Date();
                date.setTime(res['Exist'][index]["timestamp"])
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                diff = (Number(time_now) - Number(res['Exist'][index]["timestamp"]))/1000;
                time = Math.floor(diff/86400);
                if(time == 0 ){
                    time = "Today"
                }
                else{
                    time = time + " days ago"
                }
                items += `<a onclick=display("${"section_"+res['Exist'][index]["event"]}") class="list-group-item list-group-item-action active" aria-current="true"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">${res['Exist'][index]["event"]} Event</h5><small>${time}</small></div><p class="mb-1">The group name is ${res['Exist'][index]["group_name"]}. And ${res['Exist'][index]["group_num"]} members in group.(${res['Exist'][index]["group_mem"]}). Registered email is ${res['Exist'][index]["email"]} and mobile number is ${res['Exist'][index]["mobile"]} </p><small>${date.toLocaleString()}</small></a><br>`;
            }
        }
        else {
            items = '<div class="d-flex align-items-center justify-content-center"><b style="color:red">No Events Registered</b></div>'
        }
        document.getElementById('show_events').innerHTML = items;
    }
    else {
        document.getElementById('show_events').innerHTML = `<div class="d-flex align-items-center justify-content-center"><b style="color:red">You must login</b></div>`
    }
}

async function getAllLiveEvents(){
    try {
        let res = await axios.get('http://localhost:8000/get_live_events.php');
        return res.data;
    } catch (error) {
        return {"Exist":'false'};
    }
}

async function addEvent(){
    res = await getAllLiveEvents();
    if (res['Exist'] != 'false'){
        document.getElementById('events').innerHTML = ''
        for (let index = 0; index < res['Exist'].length; index++) {
            like_button = `<button id="like_button_${index}" onClick="updateLike(\'${res['Exist'][index]['event_name']}\',${res['Exist'][index]['event_likes']},${index})">&#9825;${res['Exist'][index]['event_likes']}</button>`
            localStorage.setItem(res['Exist'][index]['event_name'],index)
            eventPageHTML = `<div id="eventCard"><img src=${res['Exist'][index]['event_img']} onClick="eventMainPage(\'${res['Exist'][index]['event_name']}\',\'${res['Exist'][index]['event_img']}\',\'${res['Exist'][index]['event_time']}\',${res['Exist'][index]['event_price']},\'${res['Exist'][index]["event_venue"]}\',\'${res['Exist'][index]["event_desc"]}\')"/><p class="eventdate">${res['Exist'][index]['event_time']} </p><h3 class="eventname">${res['Exist'][index]['event_name']}</h3><p class="eventvenue">${res['Exist'][index]["event_venue"]}</p><p class="registrationfee"> registration fee: Rs. ${res['Exist'][index]['event_price']}</p>${like_button}</div>`
            document.getElementById('events').innerHTML += eventPageHTML
        }
    }
}

function eventMainPage(event_name,event_img,event_time,event_price,event_venue,event_desc){
    document.getElementById("concert_image").src = event_img
    document.getElementById("concert_name").innerHTML = event_name
    document.getElementById("concert_date").innerHTML = event_time
    document.getElementById("concert_venue").innerHTML = event_venue
    document.getElementById("concert_desc").innerHTML = event_desc
    document.getElementById("concert_fee").innerHTML = event_price
    display('section_event')
    singleEvent(event_name)
    register = document.getElementById('register_button')
    register.addEventListener("click", ()=>{
        document.getElementById("section_registration").innerHTML = `<div class="bg-container20 d-flex flex-row justify-content-center"><img src="" /><div class="headingregistrationcard"><h4 id="register_event_name"> - </h4><div class="d-flex flex-row justify-content-center"><p id="register_event_time"> - </p><p id="register_event_venue"> - </p></div></div></div><div class="bg-container30 d-flex flex-row justify-content-center"><div class="textregistrationcard"><h3> Fill the details</h3><form><p><input type="text" id="register_email" placeholder="Email" required></p><p><input type="number" id="register_mobile" placeholder="mobile number" required></p><p><input type="text" id="register_groupname" placeholder="Group Name" required></p><label> no.of members in the group:</label><select id="register_groupnum"><option> 1</option><option> 2</option><option> 3</option><option> 4</option><option> 5</option><option> 6</option><option> 7</option><option> 8</option><option> 9</option></select><br><label> Names of the group members:</label><input type="text" id="register_groupmem" required><br></form></div></div><div class="bg-container40"><div class="proceedcard d-flex flex-row justify-content-center"><h5 id="proceedprice"> </h5><button class="proceedbutton" id="registration_proceed" onClick="registerEvent(\'${event_name}\')"> Proceed</button></div></div>`
        document.getElementById("register_event_name").innerHTML = event_name
        document.getElementById("register_event_time").innerHTML = event_time
        document.getElementById("register_event_venue").innerHTML = event_venue
        document.getElementById("proceedprice").innerHTML = "₹"+event_price
    })
}

async function registerPost(event,username,email,mobile,groupname,groupnum,groupmem,time) {
    try {
        let res = await axios.post('http://localhost:8000/register.php',{
            username: username,
            email: email,
            mobile: mobile,
            event: event,
            groupname: groupname,
            groupnum: groupnum,
            groupmem: '{'+groupmem+'}',
            timestamp: String(time)
        })
        return res.data;
    } catch (error) {
        return {"Message":'false'};
    }
}

async function registerEvent(event) {
    let name1 = localStorage.getItem('username');
    let email1 = document.getElementById("register_email").value;
    let mobile1 = document.getElementById("register_mobile").value;
    let groupname1 = document.getElementById("register_groupname").value;
    let groupnum1 = document.getElementById("register_groupnum").value;
    let groupmem1 = document.getElementById("register_groupmem").value;
    let time1 = Date.now();
    console.log("Im in registerEvent Func ",event)
    data = await registerPost(event,name1,email1,mobile1,groupname1,groupnum1,groupmem1,time1);
    if (data['Message'] == 'done') {
        alert("Registration to "+event+"is done...")
    }
    else {
        alert("Not Registered");
    }
    display('sectioneventspage');
    return data;
}

async function likePost(username,like){
    try {
        let res = await axios.post('http://localhost:8000/update_like.php',{
            event_name: username,
            event_likes: like,
        })
        return res.data;
    } catch (error) {
        return {"Message":'false'};
    }
}

async function updateLike(event_name,like,index) {
    console.log("updateLike ",event_name,like+1)
    data = await likePost(event_name,like+1)
    document.getElementById("like_button_"+index).innerHTML = "&#10084; "+String(like+1)
    if (data['Message'] != 'done') {
        alert("Like not updated")
    }
}
