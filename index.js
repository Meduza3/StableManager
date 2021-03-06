// Import the functions you need from the SDKs you need
import {
    initializeApp,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";

import {
    getAuth,
    connectAuthEmulator,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile,
    AuthErrorCodes,
    deleteUser
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
    onValue,
    get,
    off,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBKckU8koQgCrBeeLlgFe7S-N788VJglmw",
    authDomain: "stablemanager-55e4b.firebaseapp.com",
    databaseURL: "https://stablemanager-55e4b-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "stablemanager-55e4b",
    storageBucket: "stablemanager-55e4b.appspot.com",
    messagingSenderId: "84925096720",
    appId: "1:84925096720:web:bed05439206c89bce07b95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let db = getDatabase(app);

const auth = getAuth(app)

var uid = null;
var loggedInUser = null;
var onValueList = {}
var onValueListWeek = {}

onAuthStateChanged(auth, (user) => {
  if(user){
    console.log(user.displayName +" is signed in")
    loggedInUser = user.uid
    $("#displayName").html(auth.currentUser.displayName)
    $("#userGreetings").html(auth.currentUser.displayName)
  } else {
    $("#displayName").html("Login")
  }
})


const loginEmailPassword = async () => {
   try{
   const loginEmail = $("#emailInputLogin").val()
   const loginPassword = $("#passwordInputLogin").val()
   const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
   console.log(userCredential.user)
   $("#displayName").html(auth.currentUser.displayName)
   loginModal.hide()

} catch(error){
  console.log(error)
  if(error.code == AuthErrorCodes.INVALID_PASSWORD){
    $("#errorCodeLogin").html("Wrong password. Try Again.")
  } else if(error.code == AuthErrorCodes.INVALID_EMAIL){
    $("#errorCodeLogin").html(`Input a valid e-mail address.`)
  } else if(error.code == AuthErrorCodes.USER_DELETED){
    $("#errorCodeLogin").html(`No user found, please register first.`)
  } else if(error.code == AuthErrorCodes.WEAK_PASSWORD){
    $("#errorCodeLogin").html(`Your password needs to be at least 6 characters.`)
  }
}
}
const createAccount = async () => {

  try{
  const loginEmail = $("#emailInputRegister").val()
  const loginPassword = $("#passwordInputRegister").val()
  const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword)
   updateProfile(auth.currentUser, {
     displayName: $("#nameInputRegister").val()
   })
  $("#displayName").html(auth.currentUser.displayName)
  registerModal.hide()
  console.log(userCredential.user)
}
 catch(error){
  console.log(error)
    if(error.code == AuthErrorCodes.INVALID_EMAIL){
    $("#errorCodeRegister").html(`Input a valid e-mail address.`)
  } else if(error.code == AuthErrorCodes.WEAK_PASSWORD){
    $("#errorCodeRegister").html(`Your password needs to be at least 6 characters.`)
  }
}
}

$('#datepicker .input-group.date').datepicker({
    format: "mm/dd/yyyy",
    maxViewMode: 2,
    todayBtn: "linked",
    orientation: "bottom left",
    todayHighlight: true
});


changeDate(0);

$("#next").on("click", () => {
    changeDate(1)
});

$("#nextnext").on("click", () => {
    changeDate(7)
});

$("#previous").on("click", () => {
    changeDate(-1);
});

$("#previousprevious").on("click", () => {
    changeDate(-7);
});

var resModal = new bootstrap.Modal(document.getElementById('ReservationModal'))
var disModal = new bootstrap.Modal(document.getElementById('DisableModal'))
var canResAdminModal = new bootstrap.Modal(document.getElementById('cancelReservationAdminModal'))
var adminGateModal = new bootstrap.Modal(document.getElementById("adminGateModal"))
var controlPanelModal = new bootstrap.Modal(document.getElementById("controlPanelModal"))
var changePasswordModal = new bootstrap.Modal(document.getElementById("changePasswordModal"))
var announcementChangeModal = new bootstrap.Modal(document.getElementById("announcementChangeModal"))
var loginModal = new bootstrap.Modal(document.getElementById("loginModal"))
var pleaseLoginModal = new bootstrap.Modal(document.getElementById("pleaseLoginModal"))
var registerModal = new bootstrap.Modal(document.getElementById("registerModal"))
var userPanelModal = new bootstrap.Modal(document.getElementById("userPanelModal"))
var areYouSureDelete = document.getElementById('areYouSureDelete')
var areYouSureDeleteCollapse = new bootstrap.Collapse(areYouSureDelete, {
  toggle: false
})
var changeName = document.getElementById('changeName')
var changeNameCollapse = new bootstrap.Collapse(changeName, {
  toggle: false
})

$(".openLoginButton").on("click", function (){
  if(auth.currentUser){
  userPanelModal.show()
} else {
  pleaseLoginModal.hide()
  registerModal.hide()
  loginModal.show()
}
});

$("#signOutButton").on("click", signOutUser)
function signOutUser(){
  signOut(auth)
  loggedInUser = null
  loginModal.hide()
  userPanelModal.hide()
}
$("#confirmLoginButton").on("click", loginEmailPassword)

$("#openRegisterModalButton").on("click", registerModalShow)
function registerModalShow(){
  loginModal.hide()
  registerModal.show()
}

$("#confirmRegisterButton").on("click", createAccount)

$(".timeslot-button").on("click", showModalRes);

$("#adminGateButton").on("click", showModalAdminGate);

$("#disableButton").on("click", showModalDisable)
function showModalDisable(){
  controlPanelModal.hide()
  $(".disableDate").html($("#datepicker input").val())
  disModal.show()
}

$(".btnResClose").on("click", closeReserve);
$(".btnDisClose").on("click", closeDisable);
$("#editButton").on("click", function(){
  $("#timeslotId").html(e.target.name)
  canResAdminModal.hide()
  showModalRes()
});

$("#resButton").on("click", confirmReservation);

$("#canResButton").on("click", cancelReservation);

$("#disButton").on("click", confirmDisable);

$("#inputDatepicker").change(function() {
    trackDay()
});

$("#passwordChangeButton").on("click", showChangePassword)
function showChangePassword(){
  controlPanelModal.hide()
  changePasswordModal.show()
}

$(".backToAdminButton").on("click", function() {
  controlPanelModal.show()
})

$("#announcementChangeButton").on("click", showChangeAnnouncement)
function showChangeAnnouncement(){
  controlPanelModal.hide()
  announcementChangeModal.show()
}

$("#confirmAnnouncementChange").on("click", changeAnnouncement)
function changeAnnouncement(){
  let newAnnouncement = $("#announcementInput").val()
  set(announcementRef,newAnnouncement)
}

$("#deleteAccountButton").on("click", function() {
  areYouSureDeleteCollapse.toggle()
})

$("#noDelete").on("click", function() {
  areYouSureDeleteCollapse.toggle()
})

$("#yesDelete").on("click", function() {
  areYouSureDeleteCollapse.toggle()
  controlPanelModal.hide()
  deleteUser(auth.currentUser)
})

$("#changeDisplayNameButton").on("click", function(){
  changeNameCollapse.toggle()
})


$("#confirmChangeNameButton").on("click", function(){
  updateProfile(auth.currentUser, {
    displayName: $("#newNameInput").val()
  })
  $("#displayName").html(auth.currentUser.displayName)
  $("#userGreetings").html(auth.currentUser.displayName)
  changeNameCollapse.toggle()
})

  let passwordRef = ref(db, "password")
$("#confirmAdminPassword").on("click", checkAdmin)
function checkAdmin() {
  let password = $("#adminPasswordInput").val()
  onValue(passwordRef, (snapshot) =>{
  if(password == snapshot.val()){
    adminGateModal.hide()
    console.log("yay")
    document.querySelector("#adminGateButton").classList.remove("btn-danger")
    document.querySelector("#adminGateButton").classList.add("btn-success")
    controlPanelModal.show()
  }else{
    console.log("nay")
    }
  })
}

$("#confirmChangeAdminPassword").on("click", changePassword)
function changePassword(){
onValue(passwordRef, (snapshot) =>{
  if($("#oldAdminPasswordInput").val() == snapshot.val()){
    let newPass = $("#newAdminPasswordInput").val()
  set(passwordRef,newPass)
  }
})
}

function confirmDisable() {
    let dat = {
        "Name": "",
        "Horse": "Unavailible",
        "Type": "Unavailible"
    }
    let loc = ref(db, "day")
    let date = $("#datepicker input").val().replaceAll("/", "-")
    for (let i = 8; i < 20; i++) {
        loc = ref(db, (`day/${date}/${i}:00 - ${i+1}:00`))
        set(loc, dat)
    }
    closeDisable()
    trackDay()
}

var datedDate = null

function confirmReservation() {
    let dat = {
        "Name": $("#inputName").val(),
        "Horse": $("#inputHorse").val(),
        "Type": $('input[name="trainingOptions"]:checked').val(),
        "uid": auth.currentUser.uid
    }
    console.log($("#datepicker input").val().replaceAll("/", "-"))
    resModal.hide()
    let timeslot = $("#timeslotId").html()
    let date = $("#datepicker input").val().replaceAll("/", "-")

    datedDate = new Date($("#datepicker input").val())
    let weekDay = datedDate.getDay()

    if(document.getElementById("switchRecurrent").checked){
    const loca = ref(db, (`repeatingDays/${weekDay}/${timeslot}`))
    set(loca, dat)
    } else {
    const loca = ref(db, (`day/${date}/${timeslot}`))
    set(loca, dat)
  }

    trackDay()
}

function cancelReservation(){
  canResAdminModal.hide()
  let timeslot = $(".cancelDate").html()
  let date = $("#datepicker input").val().replaceAll("/", "-")
  let date2 = new Date($("#datepicker input").val())
  let weekDay = date2.getDay()
  const locWeek = ref(db, (`repeatingDays/${weekDay}/${timeslot}`))
  const loc = ref(db, (`day/${date}/${timeslot}`))
  set(loc,null)
  set(locWeek,null)
  trackDay()
}

function showModalAdminGate(e) {
  if(document.querySelector("#adminGateButton").classList.contains("btn-danger")){
    adminGateModal.show()
} else {
  controlPanelModal.show()
  }
}
var uidReRef = null
function showModalRes(e) {
  if(loggedInUser){
  if(e.target.classList.contains('btn-light')){
    $("#timeslotId").html(e.target.name)
    resModal.show()
    $("#inputName").val(auth.currentUser.displayName)
  } else if(document.querySelector("#adminGateButton").classList.contains("btn-success")){
    $(".cancelDate").html(e.target.name)
    canResAdminModal.show()
  } else {
    let hour = parseInt(e.target.id.slice(2))+7
    let date = $("#datepicker input").val().replaceAll("/", "-")
    let weekDay = new Date($("#datepicker input").val()).getDay()

    console.log(hour)
    uidRef = ref(db, "day/"+date+"/"+hour+":00 - "+(hour+1)+":00/uid")
    uidReRef = ref(db, "repeatingDays/"+weekDay+"/"+hour+":00 - "+(hour+1)+":00/uid")
    onValue(uidRef, (snapshot) =>{
    if(snapshot.val() == auth.currentUser.uid){
      console.log("UID Matches")
      $(".cancelDate").html(e.target.name)
      canResAdminModal.show()
    }
  })

  onValue(uidReRef, (snapshot) =>{
    if(snapshot.val() == auth.currentUser.uid){
      console.log("UID Matches")
      $(".cancelDate").html(e.target.name)
      canResAdminModal.show()
    }
  })
  }
}else{
  pleaseLoginModal.show()
}
  }


function closeReserve() {
    resModal.hide()
}

function closeDisable() {
    disModal.hide()
}

function changeDate(increment) {
    let dateCurrent = $("#datepicker input").val();
    let dateNew = new Date(dateCurrent);

    if (dateCurrent == "") {
        dateNew = new Date();
    }
    dateNew.setDate(dateNew.getDate() + increment);
    $("#datepicker input").val((dateNew.getMonth() + 1 + "").padStart(2, 0) + "/" + (dateNew.getDate() + "").padStart(2, 0) + "/" + dateNew.getFullYear());
    trackDay()
}

const loc = ref(db, "temp")
onValue(loc, (snapshot) => {
    const rand = Math.floor(Math.random() * 100)
    const oldRand = snapshot.val();
    console.log(`${oldRand} --> ${rand}`)
    set(loc, rand)
}, {
    onlyOnce: true
});

var uidRef = null
var announcementRef = ref(db, "Announcement")

onValue(announcementRef, (snapshot) => {
  $("#announcement").html(snapshot.val())
})



const typeColors = {"Jumping": "btn-success", "Unavailible": "btn-dark", "Dressage": "btn-primary", "Western": "btn-warning", "Lunge": "btn-secondary", "Free-Horse":"btn-info", "Vaulting":"btn-danger"}

function trackDay() {
    let date = $("#datepicker input").val().replaceAll("/", "-")
    for (let hour = 8; hour < 20; hour++) {

      document.querySelector(`#ts${hour-7}`).classList.remove("btn-dark","btn-primary","btn-success","btn-warning","btn-secondary","btn-info","btn-danger","btn-light")
      $(`#ts${hour-7}`).html(hour + ":00 - " + (hour + 1) + ":00")
      document.querySelector(`#ts${hour-7}`).classList.add("btn-light")

      let dateNew = new Date($("#datepicker input").val())
      let weekDay = dateNew.getDay()

      let weekDayRef = ref(db, "repeatingDays/"+weekDay+"/"+hour+":00 - "+(hour + 1) + ":00")
      if (onValueListWeek[hour-8]){
        off(onValueListWeek[hour-8])
      }
      onValueListWeek[hour-8] = weekDayRef
      onValue(weekDayRef, updateButton(hour))
      let  dayLoc = ref(db, "day/" + date + "/" + hour + ":00 - " + (hour + 1) + ":00")
      if (onValueList[hour-8]){
        off(onValueList[hour-8])
      }

        onValueList[hour-8] = dayLoc
        onValue(dayLoc, updateButton(hour))
    }
}

function updateButton(hour) {
  return (snapshot) => {
    let snapVal = snapshot.val()

    if (snapVal == null ||snapVal.Name == null ||snapVal.Type == null ||snapVal.Horse == null){
      return
    }

      document.querySelector(`#ts${hour-7}`).classList.remove("btn-dark","btn-primary","btn-success","btn-warning","btn-secondary","btn-info","btn-danger","btn-light")
      $(`#ts${hour-7}`).html(`${snapVal.Name} (${snapVal.Horse})`)
      document.querySelector(`#ts${hour-7}`).classList.add(typeColors[snapVal.Type]);
  }
}
