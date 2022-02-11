// Importing the necessary functions from Google Firebase
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


// My Firebase configuration
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


//Function which controls which user is currently signed in
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user.displayName + " is signed in")
    loggedInUser = user.uid //Pass the user's unique ID as a variable for use in other functions
    $("#displayName").html(auth.currentUser.displayName) //If a user is logged in, get the user's name and display it in the corner
    $("#userGreetings").html(auth.currentUser.displayName)
  } else {
    $("#displayName").html("Login") //If no user is logged in, display the login button
  }
})


const loginEmailPassword = async () => {
  try {
    const loginEmail = $("#emailInputLogin").val()
    const loginPassword = $("#passwordInputLogin").val()
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword) //Check with the database if such an user exists
    console.log(userCredential.user)
    $("#displayName").html(auth.currentUser.displayName)
    loginModal.hide()

  } catch (error) {
    console.log(error)
    if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
      $("#errorCodeLogin").html("Wrong password. Try Again.")
    } else if (error.code == AuthErrorCodes.INVALID_EMAIL) {
      $("#errorCodeLogin").html(`Input a valid e-mail address.`)
    } else if (error.code == AuthErrorCodes.USER_DELETED) {
      $("#errorCodeLogin").html(`No user found, please register first.`)
    } else if (error.code == AuthErrorCodes.WEAK_PASSWORD) {
      $("#errorCodeLogin").html(`Your password needs to be at least 6 characters.`)
    }
  } //Catch the possible errors with incorrect login - password combination and display the errors to the user
}

const createAccount = async () => {

  try {
    const loginEmail = $("#emailInputRegister").val()
    const loginPassword = $("#passwordInputRegister").val()
    const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword) //Create a new user
    updateProfile(auth.currentUser, {
      displayName: $("#nameInputRegister").val()
    }) //Set the displayed name of the newly created user
    $("#displayName").html(auth.currentUser.displayName)
    registerModal.hide()
    console.log(userCredential.user)
  } catch (error) {
    console.log(error)
    if (error.code == AuthErrorCodes.INVALID_EMAIL) {
      $("#errorCodeRegister").html(`Input a valid e-mail address.`)
    } else if (error.code == AuthErrorCodes.WEAK_PASSWORD) {
      $("#errorCodeRegister").html(`Your password needs to be at least 6 characters.`)
    }
  } //Catch the possible errors with incorrect login - password combination and display the errors to the user
}

$('#datepicker .input-group.date').datepicker({
  format: "mm/dd/yyyy",
  maxViewMode: 2,
  todayBtn: "linked",
  orientation: "bottom left",
  todayHighlight: true
});


changeDate(0); //Initial date will be set to the current date

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
//The buttons with arrows modify the date by a day or by a weekDay

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
var recurringReservationsModal = new bootstrap.Modal(document.getElementById('recurringReservationsModal'))
var areYouSureDeleteCollapse = new bootstrap.Collapse(areYouSureDelete, {
  toggle: false
})
var changeName = document.getElementById('changeName')
var changeNameCollapse = new bootstrap.Collapse(changeName, {
  toggle: false
})

$(".openLoginButton").on("click", function() {
  if (auth.currentUser) {
    userPanelModal.show() //if a user is logged in, show their user panel
  } else {
    pleaseLoginModal.hide() //Hide a potential please login modal
    registerModal.hide() //Hide the potential registration Modal
    loginModal.show() //Show the login modal
  }
});

$("#signOutButton").on("click", signOutUser)

function signOutUser() {
  signOut(auth)
  loggedInUser = null
  loginModal.hide()
  userPanelModal.hide()
} //Sign out the current user through the database


$("#confirmLoginButton").on("click", loginEmailPassword)

$("#openRegisterModalButton").on("click", registerModalShow)

function registerModalShow() {
  loginModal.hide()
  registerModal.show()
}

$("#confirmRegisterButton").on("click", createAccount)

$(".timeslot-button").on("click", showModalRes);

$("#adminGateButton").on("click", showModalAdminGate);

$("#disableButton").on("click", showModalDisable)

function showModalDisable() {
  controlPanelModal.hide()
  $(".disableDate").html($("#datepicker input").val())
  disModal.show()
}

$(".btnResClose").on("click", closeReserve);
$(".btnDisClose").on("click", closeDisable);

$("#resButton").on("click", confirmReservation);

$("#canResButton").on("click", cancelReservation);

$("#disButton").on("click", confirmDisable);

$("#inputDatepicker").change(function() {
  trackDay()
});

$("#passwordChangeButton").on("click", showChangePassword)

function showChangePassword() {
  controlPanelModal.hide()
  changePasswordModal.show()
}

$(".backToAdminButton").on("click", function() {
  controlPanelModal.show()
})

$("#announcementChangeButton").on("click", showChangeAnnouncement)

function showChangeAnnouncement() {
  controlPanelModal.hide()
  announcementChangeModal.show()
}

$("#confirmAnnouncementChange").on("click", changeAnnouncement)

function changeAnnouncement() {
  let newAnnouncement = $("#announcementInput").val()
  set(announcementRef, newAnnouncement)
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

$("#changeDisplayNameButton").on("click", function() {
  changeNameCollapse.toggle()
})


$("#confirmChangeNameButton").on("click", function() {
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
  onValue(passwordRef, (snapshot) => {
    if (password == snapshot.val()) {
      adminGateModal.hide()
      console.log("yay")
      document.querySelector("#adminGateButton").classList.remove("btn-danger")
      document.querySelector("#adminGateButton").classList.add("btn-success")
      controlPanelModal.show()
    } else {
      console.log("nay")
    }
  })
}

$("#confirmChangeAdminPassword").on("click", changePassword)

function changePassword() {
  onValue(passwordRef, (snapshot) => {
    if ($("#oldAdminPasswordInput").val() == snapshot.val()) {
      let newPass = $("#newAdminPasswordInput").val()
      set(passwordRef, newPass)
    }
  })
}

function confirmDisable() { //Disable the entire day through admin panel
  let dat = {
    "Name": "",
    "Horse": "Unavailible",
    "Type": "Unavailible"
  } //Prepare the data
  let loc = ref(db, "day")
  let date = $("#datepicker input").val().replaceAll("/", "-") //Get the date from the datepicker
  for (let hour = 8; hour < 20; hour++) {
    loc = ref(db, (`day/${date}/${hour}:00 - ${hour+1}:00`))
    set(loc, dat)
  }  //Set the prepared data to all the timeslots
  closeDisable()
  trackDay() //Update the displayed days
}

var datedDate = null

function confirmReservation() {
  let dat = {
    "Name": $("#inputName").val(),
    "Horse": $("#inputHorse").val(),
    "Type": $('input[name="trainingOptions"]:checked').val(),
    "uid": auth.currentUser.uid
  } //Prepare the data to put into the database
  console.log($("#datepicker input").val().replaceAll("/", "-"))
  resModal.hide()
  let timeslot = $("#timeslotId").html() //Get the hour location by reading the text on the button
  let date = $("#datepicker input").val().replaceAll("/", "-") //Get the day location by reading the text on the date input
  datedDate = new Date($("#datepicker input").val())
  let weekDay = datedDate.getDay() //Get the week day location using the javascript Date funcion
  if (document.getElementById("switchRecurrent").checked) { //If the reservation is meant to repeat weekly
    const loca = ref(db, (`repeatingDays/${weekDay}/${timeslot}`)) //Put the prepared data into this place in the database
    set(loca, dat)
  } else { //If the reservation is meant to only happen once
    const loca = ref(db, (`day/${date}/${timeslot}`)) //Put the prepared data into this place in the database
    set(loca, dat)
  }
  trackDay() //Update the displayed days
}

function cancelReservation() {
  canResAdminModal.hide()
  let timeslot = $(".cancelDate").html() //Get the hour location by reading the text on the button
  let date = $("#datepicker input").val().replaceAll("/", "-") //Get the day location by reading the text on the date input
  let date2 = new Date($("#datepicker input").val())
  let weekDay = date2.getDay() //Get the week day location using the javascript Date funcion
  const locWeek = ref(db, (`repeatingDays/${weekDay}/${timeslot}`))
  const loc = ref(db, (`day/${date}/${timeslot}`))
  set(loc, null) //Delete the one-time reservation from the database by setting it to null
  set(locWeek, null) //Delete the recurring reservation from the database by setting it to null
  trackDay() //Update the displayed days
}

function showModalAdminGate(e) {
  if (document.querySelector("#adminGateButton").classList.contains("btn-danger")) {
    adminGateModal.show()
  } else {
    controlPanelModal.show()
  }
}

var uidReRef = null

function showModalRes(e) { //This function happens when a user clicks on one of the timeslot buttons
  if (loggedInUser) { //If there is a logged in user...
    if (e.target.classList.contains('btn-light')) { //... And there is no reservation on the timeslot
      $("#timeslotId").html(e.target.name) //Pass on the current hour to the menu which is going to get displayed
      resModal.show() //Display the reservation menu
      $("#inputName").val(auth.currentUser.displayName) //Automatically set the "Name" field to the users name
    } else if (document.querySelector("#adminGateButton").classList.contains("btn-success")) { //If there already is a reservation there, but the user is an admin...
      $(".cancelDate").html(e.target.name) //...Pass on the current hour to the menu which is going to get displayed
      canResAdminModal.show() //Open the cancellation menu
    } else { //If there already is a reservation on the timeslot and the user is not an admin...
      let hour = parseInt(e.target.id.slice(2)) + 7
      let date = $("#datepicker input").val().replaceAll("/", "-")
      let weekDay = new Date($("#datepicker input").val()).getDay()
      //Prepare the locations
      uidRef = ref(db, "day/" + date + "/" + hour + ":00 - " + (hour + 1) + ":00/uid") //The location for normal reservations
      uidReRef = ref(db, "repeatingDays/" + weekDay + "/" + hour + ":00 - " + (hour + 1) + ":00/uid")//The location for recurring reservations

      onValue(uidRef, (snapshot) => {//If the current user is the same user which made the reservation, allow them to cancel it.
        if (snapshot.val() == auth.currentUser.uid) {
          $(".cancelDate").html(e.target.name)
          canResAdminModal.show()
        }
      })

      onValue(uidReRef, (snapshot) => {//If the current user is the same user which made the recurring reservation, allow them to cancel it.
        if (snapshot.val() == auth.currentUser.uid) {
          $(".cancelDate").html(e.target.name)
          canResAdminModal.show()
        }
      })
    }
  } else {//If the user is not logged in, ask them to log in
    pleaseLoginModal.show()
  }
}


function closeReserve() {
  resModal.hide()
}

function closeDisable() {
  disModal.hide()
}

function changeDate(increment) { //A function to change the displayed date by a passed on increment
  let dateCurrent = $("#datepicker input").val(); //Get the current date from the datepicker input
  let dateNew = new Date(dateCurrent); //Conver the date which is already in the javascript date format to a javascript date object

  if (dateCurrent == "") { //if the current date is empty, for example on initialization
    dateNew = new Date(); //set the date to a new date without a parameter, which defaults it to the current date
  }
  dateNew.setDate(dateNew.getDate() + increment); //Modify the date object by the invrement
  $("#datepicker input").val((dateNew.getMonth() + 1 + "").padStart(2, 0) + "/" + (dateNew.getDate() + "").padStart(2, 0) + "/" + dateNew.getFullYear());
  //Convert the modified javascript date object back to plain text, format it and put it into the input field
  trackDay() //Update the displayed reservations for the new date
}

var uidRef = null
var announcementRef = ref(db, "Announcement")

onValue(announcementRef, (snapshot) => {
  $("#announcement").html(snapshot.val())
})


//A dictionary for the colors of the buttons
const typeColors = {
  "Jumping": "btn-success",
  "Unavailible": "btn-dark",
  "Dressage": "btn-primary",
  "Western": "btn-warning",
  "Lunge": "btn-secondary",
  "Free-Horse": "btn-info",
  "Vaulting": "btn-danger"
}

function trackDay() {//Modify all the buttons on screens to comply with the selected date
  let date = $("#datepicker input").val().replaceAll("/", "-") //Get the date from the datepicker input
  for (let hour = 8; hour < 20; hour++) { //Run a for loop 12 times, once for each timeslot on the selected day

    document.querySelector(`#ts${hour-7}`).classList.remove("btn-dark", "btn-primary", "btn-success", "btn-warning", "btn-secondary", "btn-info", "btn-danger", "btn-light")
    //Delete all the colours from the buttons
    $(`#ts${hour-7}`).html(hour + ":00 - " + (hour + 1) + ":00")
    //Set all the buttons text to the default
    document.querySelector(`#ts${hour-7}`).classList.add("btn-light")
    //Colour all buttons white

    let dateNew = new Date($("#datepicker input").val()) //Convert the date variable to a javascript Date object
    let weekDay = dateNew.getDay() //Get the weekday from the javascript date object

    let weekDayRef = ref(db, "repeatingDays/" + weekDay + "/" + hour + ":00 - " + (hour + 1) + ":00")
    if (onValueListWeek[hour - 8]) {
      off(onValueListWeek[hour - 8])
    } //If there already is a listener object setup to listen at this location, disable it.

    onValueListWeek[hour - 8] = weekDayRef
    onValue(weekDayRef, updateButton(hour)) //Colour and change text on all the buttons with recurring database entries

    let dayLoc = ref(db, "day/" + date + "/" + hour + ":00 - " + (hour + 1) + ":00")
    if (onValueList[hour - 8]) {
      off(onValueList[hour - 8])
    } //If there already is a listener object setup to listen at this location, disable it.

    onValueList[hour - 8] = dayLoc
    onValue(dayLoc, updateButton(hour)) //Colour and change text on all the buttons with recurring database entries
  }
}

function updateButton(hour) {
  return (snapshot) => {
    let snapVal = snapshot.val()

    if (snapVal == null || snapVal.Name == null || snapVal.Type == null || snapVal.Horse == null) {
      return
    } //If the database entry is in any way invalid, stop performing the function.

    document.querySelector(`#ts${hour-7}`).classList.remove("btn-dark", "btn-primary", "btn-success", "btn-warning", "btn-secondary", "btn-info", "btn-danger", "btn-light")
    $(`#ts${hour-7}`).html(`${snapVal.Name} (${snapVal.Horse})`) //Change the text on the button to display the horse owner and the horse
    document.querySelector(`#ts${hour-7}`).classList.add(typeColors[snapVal.Type]); //Colour the button according to the type of training using the dictionary set up before
  }
}
