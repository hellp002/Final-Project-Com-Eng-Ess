import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDgGxs1Fk4bmCR5FxT7YWJO8-J42aoSOCE",
    authDomain: "final-proj-2c45d.firebaseapp.com",
    projectId: "final-proj-2c45d",
    storageBucket: "final-proj-2c45d.appspot.com",
    messagingSenderId: "464388461807",
    appId: "1:464388461807:web:4a077c0949dc7bc855f71a"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
 import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
    arrayUnion,
    arrayRemove,
    setDoc
} from 'https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js';



const db = getFirestore();
const user = collection(db, 'User');
const allRoom = collection(db, 'AllRoom');

const main = `
<button class="btn-lg btn-primary" id="join-game" onclick="joinGame()">Join New Game</button>

        <button class="btn-lg btn-danger" id="new-game">
          Create New Game (Need to Sign in)
        </button>

        <div class="user-controller">
          <button class="btn-lg btn-success" onclick="signIn()" id="signin">
            Sign in
          </button>
          <button class="btn-lg btn-success" id="logIn" onclick="logIn()">Log in</button>
        </div>
`;

const mainLogin = `
<button class="btn-lg btn-primary" id="join-game" onclick="joinGame()">Join New Game</button>

        <button class="btn-lg btn-danger" id="new-game" onclick = "newGame()">
          Create New Game
        </button>

        <div class="user-controller">
          <button class="btn-lg btn-success" onclick="logOut()" id="logout">
            Logout
          </button>
          <button class="btn-lg btn-success" id="rooms" onclick="checkRoom()">your Quiz</button>
        </div>
`;

const mainNewgame = `

<label>Number of Question</label><br />
<div id = "result"></div>
<input type="number" id="question" min="1" />
<button class="btn-lg btn-primary" id="submit" onclick = "submitQuestion()">Next</button>
<button class="btn-lg btn-danger" id="back" onclick = "toLoginMenu()">Go Back</button>   
`;

let mainControl = { 
                  id : "",
                  room : [],
}
let numQuestion;
// sign in
function signIn(){
  let new_line = document.createElement("br");
  let mainApp = document.getElementById('Main');
  mainApp.innerHTML = "";
  let main_sign = document.createElement("form");
  main_sign.setAttribute("action","");

  let user_label = document.createElement("label");
  user_label.innerText = "Username";
  let password_label = document.createElement("label");
  password_label.innerText = "Password";

  let user_input = document.createElement("input");
  user_input.type = "text";
  user_input.id = "username";

  let password_input = document.createElement("input");
  password_input.type = "password";
  password_input.id = "password";

  let submitBtn = document.createElement("button");
  submitBtn.textContent = "Sign In";
  submitBtn.onclick = submit_signIn_handler;
  submitBtn.className = "btn btn-primary";

  let backBtn = document.createElement("button");
  backBtn.textContent = "Back to Main Menu";
  backBtn.onclick = back;
  backBtn.className = "btn btn-danger";

  let signIn_result = document.createElement("div");
  signIn_result.id = "result";

  main_sign.appendChild(signIn_result);
  main_sign.appendChild(user_label);
  main_sign.appendChild(user_input);
  main_sign.appendChild(new_line);
  main_sign.appendChild(password_label);
  main_sign.appendChild(password_input);

  mainApp.appendChild(main_sign);
  mainApp.appendChild(submitBtn);
  mainApp.appendChild(backBtn);

}

async function getAllUsername(){
  const collection = await getDocs(user);
  const items = collection.docs.map((item) => ({
    ...item.data(),
      }));
  let username = [];
  for (let i in items){
    username.push(items[i]['username']);
  }
  return username;

}

async function submit_signIn_handler(){
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let allUser = await getAllUsername();
  let result = document.getElementById("result");
  
  if (username === "" ) {
    result.innerText = "Please input username";
    return;
  }

  if (password === ""){
    result.innerText = "Please input password";
    return; 
  }

  if (allUser.includes(username)){
    result.innerText = "This username is already sign in";
    return;
  }
  result.innerText = "Hi " + username + " Welcome to Quizz"; 
  await addDataToDatabase(username,password);
  back();


}

async function addDataToDatabase(username,password){
  let room = [];
  await addDoc(user, {
    username,
    password,
    room,
  })

}


function back(){
  document.getElementById("Main").innerHTML = main;
}


window.signIn = signIn;


// Log in
window.logIn = logIn;
function logIn(){
  let new_line = document.createElement("br");
  let mainApp = document.getElementById('Main');
  mainApp.innerHTML = "";
  let main_sign = document.createElement("form");
  main_sign.setAttribute("action","");

  let user_label = document.createElement("label");
  user_label.innerText = "Username";
  let password_label = document.createElement("label");
  password_label.innerText = "Password";

  let user_input = document.createElement("input");
  user_input.type = "text";
  user_input.id = "username";

  let password_input = document.createElement("input");
  password_input.type = "password";
  password_input.id = "password";

  let submitBtn = document.createElement("button");
  submitBtn.textContent = "Log In";
  submitBtn.onclick = submit_logIn_handler;
  submitBtn.className = "btn btn-primary";

  let backBtn = document.createElement("button");
  backBtn.textContent = "Back to Main Menu";
  backBtn.onclick = back;
  backBtn.className = "btn btn-danger";

  let signIn_result = document.createElement("div");
  signIn_result.id = "result";

  main_sign.appendChild(signIn_result);
  main_sign.appendChild(user_label);
  main_sign.appendChild(user_input);
  main_sign.appendChild(new_line);
  main_sign.appendChild(password_label);
  main_sign.appendChild(password_input);

  mainApp.appendChild(main_sign);
  mainApp.appendChild(submitBtn);
  mainApp.appendChild(backBtn);
}

async function submit_logIn_handler(){
  let data = await getUserAndPass();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let result = document.getElementById("result");

  if (data[0].includes(username) && data[1].includes(password)){
    for (let i = 0; i < data[0].length ; i++){
      if ((data[0][i] === username) && (data[1][i] === password)){
        mainControl.room = data[2][i];
        mainControl.id = data[3][i];
      }
    }

    toLoginMenu();

    return;
  }
  result.innerText = "This Username or Password doesn't exist";
}

async function getUserAndPass(){
  const collection = await getDocs(user);
  const items = collection.docs.map((item) => ({
    docId: item.id,
    ...item.data(),
      }));
  let username = [];
  let password = [];
  let room = [];
  let id = [];

  for (let i in items){
    username.push(items[i]['username']);
    password.push(items[i]['password']);
    room.push(items[i]['room']);
    id.push(items[i]['docId']);
  }

  return [username,password,room,id];
}
//to loginMainMenu
window.toLoginMenu = toLoginMenu;
function toLoginMenu(){
  document.getElementById("Main").style.textAlign = "";
  document.getElementById("Main").innerHTML = mainLogin;
  clearData();
}

//Logout
window.logOut = logOut;
function logOut(){
  mainControl.id = "";
  mainControl.room = [];
  back();
}

//create Newgame
window.newGame = newGame;
function newGame(){
  document.getElementById("Main").innerHTML = mainNewgame;
}

//
const afterSubmit = `
          <div id = "currentQuest"></div>
          <select id="types" onchange="onChangeType(this)" selected = "">
            <option value="">Choose your choice</option>
            <option value="4choice">4 Choice</option>
            <option value="2choice">2 Choice</option>
          </select>
          <div id = "choice"></div>
          <div id = "result"></div>
          <button class="btn-lg btn-primary" style = "height : 15%" id="submit" onclick = "submitQA()">Next</button>
          <button class="btn-lg btn-danger" style = "height : 15%" id="back" onclick = "toLoginMenu()">Go Back</button>   
`;
window.submitQuestion = submitQuestion;

//call when submit number of question
function submitQuestion(){
  let num = document.getElementById("question").value;
  numQuestion = Number(num);
  if (numQuestion <= 0) {
    document.getElementById("result").innerText = "You need to input more than 0";
    return;
  }
  clearQA();
}

//

const typeChoice = `
<label>Question</label> <input type="text" id="question" /> <br />
<label>Choice 1</label> <input type="text" id="choice1" /> <br />
<label>Choice 2</label> <input type="text" id="choice2" /> <br />
<label>Choice 3</label> <input type="text" id="choice3" /> <br />
<label>Choice 4</label> <input type="text" id="choice4" /> <br />
<label>Answer</label>
<select selected="" id="answer" selected = "">
  <option value="">--Choose Your Answer--</option>
  <option value="0">Choice 1</option>
  <option value="1">Choice 2</option>
  <option value="2">Choice 3</option>
  <option value="3">Choice 4</option>
</select>
<br />

`;
const typeChoice2 = `
<label>Question</label> <input type="text" id="question" /> <br />
<label>Choice 1</label> <input type="text" id="choice1" /> <br />
<label>Choice 2</label> <input type="text" id="choice2" /> <br />
<label>Answer</label>
<select selected="" id="answer" selected = "">
  <option value="">--Choose Your Answer--</option>
  <option value="0">Choice 1</option>
  <option value="1">Choice 2</option>
</select><br />
`;

window.onChangeType = onChangeType;
function onChangeType(types){
  let choice = document.getElementById("choice");
  switch(types.value){
    case "4choice":
      choice.innerHTML = typeChoice;
      break;
    
    case "2choice":
      choice.innerHTML = typeChoice2;
      break;

  }
}

// data for push into firebase
let question = [];
let choice = [];
let answer = [];
let currentQuestion = 1;
let Timer = 0;

function clearData(){
  question = [];
  choice = [];
  answer = [];
  currentQuestion = 1;
  Timer = 0;
  time = 0;
  timestart = null;
}
function addQuestion(){
  let questionToAdd = document.getElementById("question").value;
  question.push(questionToAdd);
}

function addChoice(){
  let allData = document.getElementsByTagName("input");
  let answers = [];
  for (let i = 1 ; i < allData.length ; i++){
    answers.push(allData[i].value);
  }
  let type = document.getElementById("types").value;
  let choiceToAdd = {
      type,
      answers }
  choice.push(choiceToAdd);
  
}

function addAnswer(){
  let answerToAdd = document.getElementById("answer").value;
  answer.push(Number(answerToAdd));
}

function clearQA(){
  let Main = document.getElementById("Main");
  Main.innerHTML = afterSubmit;
  document.getElementById("currentQuest").innerText = "Question Number " + currentQuestion;
}

window.submitQA = submitQA;
async function submitQA(){
  if (!document.getElementById("types").value){
      document.getElementById("result").innerText = "Please choose your choice";
      return;
  }
  if (!checkIfCanGoNext()){
      document.getElementById("result").innerText = "You need to fill all these choice";
      return;
  }
  document.getElementById("result").innerText = "";
  currentQuestion += 1;
  numQuestion -= 1;
  addQuestion();
  addChoice();
  addAnswer();

  if (numQuestion === 0){
    chooseTime();
    return;
  }
  clearQA();
}

function checkIfCanGoNext(){
  let check = document.getElementsByTagName("input");
  let check2 = document.getElementsByTagName("select");
  for (let i = 0; i<check.length; i++){
    if (!check[i].value){
      return false;
    }
  }
  if (!check2[1].value){
    return false;}
  return true;
}

// addTimer 

const timing = `
<label>Add Time for this quiz (Minute)</label><br />
<div id = "result"></div>
<input type="number" id="Timer" min="1" />
<button class="btn-lg btn-primary" id="submit" style = "height : 15%" onclick = "finishQuizMaker()">Next</button>
<button class="btn-lg btn-danger" id="back" style = "height : 15%" onclick = "toLoginMenu()">Go Back</button>
 `

function chooseTime(){
  document.getElementById("Main").innerHTML = timing;
 }

window.finishQuizMaker = finishQuizMaker;

function addTimer(Time){
  Timer = Time * 60;
}
async function finishQuizMaker(){
  let timess = Number(document.getElementById("Timer").value)
  if (timess <= 0){
    document.getElementById("result").innerText = "You cann't set Timer below 0 or equal 0";
    return;
  }

  addTimer(timess);
  let result = {};
  let numQ = currentQuestion - 1;

  let ref = await addDoc(allRoom, {
    Timer,
    answer,
    choice,
    question,
    result,
    numQ,
  })

  await updateRoom(ref);


  clearData();
  toLoginMenu();
  alert("Room " + ref.id + " has been create");
 
}

async function updateRoom(ref){

  let data = doc(db,"User",mainControl.id);
  await updateDoc(data, {room : arrayUnion(ref.id)})

}


//edit lobby
window.checkRoom = checkRoom;
async function checkRoom(){
  toShowListOfRoom();


}

const backs  = `<button onclick="toLoginMenu()" class="btn btn-warning left-down-btn" style = "width : auto;height : 10%">
Back
</button>`;
async function toShowListOfRoom(){
  let data = await getDoc(doc(db,'User',mainControl.id));
  let allRoomToShow = data.data()['room'];
  let Main = document.getElementById("Main");
  Main.innerHTML = "";
  for (let i = 0 ; i < allRoomToShow.length ; i++){
    let line = document.createElement("div");
    line.id = allRoomToShow[i];
    line.className = 'room-line'      //Te-edit-this
    
    let text = document.createElement("span");
    text.innerHTML =  "Room " + (i+1) + " : " + allRoomToShow[i];
   // text.style.fontSize = "32px";

    let btnzone = document.createElement("div");
    // btnzone.style.display = "inline-block"; //Te-edit-this
    // btnzone.style.position = "absolute";   //Te-edit-this
    // btnzone.style.left = "80%";            //Te-edit-this
    btnzone.id = "btn-zone";

    

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-lg btn-danger";
    deleteBtn.setAttribute("onclick","deleteBtn('" + allRoomToShow[i] + "')");

    deleteBtn.textContent = "Delete";

    let result = document.createElement("button");
    result.className = "btn-lg btn-success";
    result.setAttribute("onclick","result('" + allRoomToShow[i] + "')");
    result.textContent = "Result";

    Main.style.textAlign = "left";

    btnzone.appendChild(deleteBtn);
    btnzone.appendChild(result)

    line.appendChild(text);
    line.appendChild(btnzone);

    Main.appendChild(line);

  }
  Main.innerHTML += backs;
}


window.deleteBtn = deleteBtn;
async function deleteBtn(ref){
  const AllroomRef = doc(db, `AllRoom/${ref}`);
  const user = doc(db,'User',mainControl.id);

  await deleteDoc(AllroomRef);
  await updateDoc(user, {room : arrayRemove(ref)})

  document.getElementById(ref).remove();
}

window.joinGame = joinGame;


const JOINGAME = `
<div id = "result"></div>
<label>Your name : </label> <input type="text" id="name" /> <br />
<label>Room id : </label> <input type="text" id="token" /> <br />
<button class="btn-lg btn-success" id="submit" onclick = "joinRoom()">Join Room</button>
<button class="btn-lg btn-danger" id="back" onclick = "specialBack()">Go Back</button>  
`;
function joinGame(){
  document.getElementById("Main").innerHTML = JOINGAME;
}


window.specialBack = specialBack;
function specialBack(){
  if (!mainControl.id){
    back();
  } else {
    toLoginMenu();
  }
}

window.joinRoom = joinRoom;
async function joinRoom(){
  if (!checkIfCanJoin1()){
    return;
  }
  if (! (await checkIfCanJoin2())){
    return;
  }
  roomtester = document.getElementById("token").value
  await loadData();
  tester = document.getElementById("name").value;
  room = document.getElementById("token").value;
  enterTheGame();
  console.log(mainGame);

}

async function checkIfCanJoin2(){
  let result = document.getElementById("result");
  let name = document.getElementById("name").value;
  let token = document.getElementById("token").value;

  const allRoomId = await getDocs(allRoom);
  let roomId = [];
  allRoomId.docs.map((item) => (roomId.push(item.id)));
  if (!roomId.includes(token)){
    result.innerText = "That room id doesn't exists";
    return false;
  
  }
  const getRoom = await getDoc(doc(db,'AllRoom',token));
  console.log(getRoom.data());
  const arrayOfUser = getRoom.data()['result'];
  let allUseUser = [];
  for (let i = 0; i < Object.keys(arrayOfUser).length ; i++){
    allUseUser.push(arrayOfUser[i][0]);
  }
  if (allUseUser.includes(name)){
    result.innerText = "This user is already use";
    return false
  }
  return true;
}

function checkIfCanJoin1(){
  let result = document.getElementById("result");
  let name = document.getElementById("name").value;
  let token = document.getElementById("token").value;
  if (!name){
    result.innerText = "Please input your name";
    return false;
  } else if (!token){
    result.innerText = "Please input room id to join";
    return false
  }
  return true;
  
}

let mainGame;
async function loadData(){
  
  let dataRoom = await getDoc(doc(db,'AllRoom',roomtester));
  let roomField = {...dataRoom.data()}
  mainGame = roomField;
}
let time = 0;
let timestart;
let room = "";
let tester = "";
let nowQ = 0;
let result_collector = [];
let roomtester = "";


const Qchoice2 = `
<div id="timer"></div>
<div id="timelimit"></div>
<h2>Question Number <span id="nowQ"></span> : <span id = "question"></span></h2>
<button id="0" class = "btn-lg btn-primary" onclick="nextQ(this)"></button>
<button id="1" class = "btn-lg btn-danger" onclick="nextQ(this)"></button>
`

const Qchoice4 = `
<div id="timer"></div>
<div id="timelimit"></div>
<h2>Question Number <span id="nowQ"></span> : <span id = "question"></span></h2>
<button id="0" class = "btn-lg btn-primary" onclick="nextQ(this)"></button>
<button id="1" class = "btn-lg btn-success" onclick="nextQ(this)"></button>
<button id="2" class = "btn-lg btn-danger" onclick="nextQ(this)"></button>
<button id="3" class = "btn-lg btn-warning" onclick="nextQ(this)"></button>
`
async function enterTheGame(){
  startQ();
  timestart = setInterval(timeCount, 1000);
}

function timeCount(){
  console.log(time);
  time += 1;
  let showTime = document.getElementById("timer");
  if (showTime){
    showTime.innerText = "Current Use : " + Math.floor(time / 60) + " Minute(s) " + (time % 60 )+ " Second";
  }
  if (time >= mainGame['Timer']){
    alert("Time Up!");
    
    submitGame();
  }
}

// เวลาหมด || กด submit
async function submitGame(){

    //function นับคะแนน
    clearInterval(timestart);
    alert("Your score : " + checkResult());
    await pushScore();
    console.log(tester);
    mainGame = {};
    time = 0;
    nowQ = 0;
    tester = "";
    room = "";
    specialBack();
    result_collector = [];
}

async function pushScore(){
  
  let Tvalue = [tester,checkResult()];
  await loadData();
  let Tkey = Object.keys(mainGame['result']).length;
  mainGame['result'][Tkey] = Tvalue;
  roomtester = ""
  await setDoc(doc(db,"AllRoom",room),mainGame);
}

function checkResult(){
  let score = 0;
  for (let i = 0; i < result_collector.length ; i++){
    if (result_collector[i] === mainGame['answer'][i]){
      score += 1
    }
  }
  return score;
}

function startQ(){
  console.log("start");
  if (nowQ >= mainGame['numQ']){
    submitGame();
    console.log("done!");
    return;
  }
  let Question = mainGame['question'][nowQ];
  let choice = mainGame['choice'][nowQ];
  let allchoice = choice['answers'];
  let type = choice['type'];
  let Main = document.getElementById("Main");

  switch(type){
    case "2choice":
      Main.innerHTML = Qchoice2;
      document.getElementById("0").innerText = allchoice[0];
      document.getElementById("1").innerText = allchoice[1];
      break;
    case "4choice":
      Main.innerHTML = Qchoice4;
      document.getElementById("0").innerText = allchoice[0];
      document.getElementById("1").innerText = allchoice[1];
      document.getElementById("2").innerText = allchoice[2];
      document.getElementById("3").innerText = allchoice[3];
      break;

  }

  console.log(document.getElementById("nowQ"));
  nowQ += 1;
  document.getElementById("nowQ").innerText = nowQ + " / " + mainGame['numQ'];
  document.getElementById("question").innerText = Question;
  document.getElementById("timelimit").innerText = "Time Limit = " + Math.floor(mainGame['Timer']/60) + " Minute(s) " + mainGame['Timer']%60 + " Second" ;
}

window.nextQ = nextQ;
function nextQ(element){
  result_collector.push(Number(element.id));
  console.log(result_collector);
  startQ();
}

const backToShow  = `<button onclick="checkRoom()" class="btn btn-warning left-down-btn" style = "width : auto;height : 10%">
Back
</button>`;


window.result = result;

async function result(ref){
  // console.log(ref)
  const AllroomRef =  doc(db, "AllRoom" ,ref);
  let allRoomToShow = (await getDoc( AllroomRef)).data()['result'];
  // console.log(allRoomToShow.data())
  // const user = doc(db,'User',mainControl.id);
  // let data = await getDoc(doc(db,'User',mainControl.id));

  let Main = document.getElementById("Main");
  Main.innerHTML = "";

  for (let i = 0 ; i < Object.keys(allRoomToShow).length ; i++){
    let line = document.createElement("div");
    line.id = allRoomToShow[i][0];
    console.log(allRoomToShow[i])

    let text = document.createElement("span");
    text.innerHTML =  'User '+(i+1) + " : " + allRoomToShow[i][0]+" " + " ====>  " + allRoomToShow[i][1] ;
    text.style.fontSize = "32px";

    let btnzone = document.createElement("div");
    btnzone.style.display = "inline-block";
    btnzone.style.position = "absolute";
    btnzone.style.left = "85%";




    let result = document.createElement("button");
    result.className = "btn-lg btn-success";
    result.setAttribute("onclick","('" + allRoomToShow[i][0] + "result')");
    result.style.width = "auto";
    result.style.height = "50px";
    result.textContent = "Result";

    // btnzone.appendChild(deleteBtn);
    btnzone.appendChild(result);

    line.appendChild(text);
    // line.appendChild(btnzone);

    Main.appendChild(line);

  }

  Main.innerHTML += backToShow;




}