/* ========== IMPORTS ========== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js"
import { getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile  } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"
import { getFirestore, 
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    serverTimestamp} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"


/* ========== FIREBASE SETUP ========== */
const firebaseConfig = {
    apiKey: "AIzaSyCpQ81liexQS4EuiSJTXlqlPs5xlMcfQc4",
    authDomain: "habitual-102f5.firebaseapp.com",
    projectId: "habitual-102f5",
    storageBucket: "habitual-102f5.appspot.com",
    messagingSenderId: "364027472490",
    appId: "1:364027472490:web:5304f78feaca867f4fb813",
    measurementId: "G-9EVVQKWXY4"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app)
const db = getFirestore(app);


/* ========== VARIABLES ========== */
let habitList = []

const currentDate = document.querySelector('.current-date'),
daysTag = document.querySelector('.days'),
prevNextIcon = document.querySelectorAll('.prev-next-icon')

// Getting new date, current month and year
let date = new Date(), 
currYear = date.getFullYear(), 
currMonth = date.getMonth()

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const colors = ['', 'pink', 'blue', 'orange', 'green', 'purple']


/* ========== ELEMENTS ========== */
/* == UI - Views == */
const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

/* == Logged out elements == */
const signInWithGoogleBtn = document.getElementById('sign-in-with-google-btn')
const signInBtn = document.getElementById('sign-in-btn')
const createAccountBtn = document.getElementById('create-account-btn')

const emailInput = document.getElementById("email-input")
const passwordInput = document.getElementById("password-input")

const errorMessage = document.getElementById("error-message")

/* == Logged in elements == */
const signOutBtn = document.getElementById('sign-out-btn')

const userSection = document.getElementById('user-section')
const userProfilePicture = document.getElementById('user-profile-picture')
const userName = document.getElementById("user-name")
const userEmail = document.getElementById("user-email")

const userSectionEdit = document.getElementById('user-section-edit')
const displayNameInput = document.getElementById('display-name-input')
const photoUrlInput = document.getElementById('photo-url-input')
const updateProfileBtn = document.getElementById('update-profile-btn')

const calendarModal = document.getElementById('calendar-modal')

const habitsList = document.getElementById('habits') // Habit list element -> Rename habitListEl
const deleteAllHabitsBtn = document.getElementById('delete-all-habits-btn')
const warningModal = document.getElementById('warning-modal')
const closeWarningModalBtn = document.getElementById('close-warning-modal-btn')
const confirmDeleteAllBtn = document.getElementById('confirm-delete-all-btn')

/* == Habit elements == */
const addHabitButton = document.getElementById('add-habit')
const habitForm = document.getElementById('habit-form')
const habitNameInput = document.getElementById('habit-name')
const habitFrequencyInput = document.getElementById('habit-frequency')
const habitTrackingInput = document.getElementById('habit-tracking')
const habitDetailsInput = document.getElementById('habit-details')
const colorBtns = document.getElementsByClassName("color-btn")


/* ========== FUNCTIONS ========== */
/* == Habit functions == */
function replaceNewlinesWithBrTags(inputString) {
    // Challenge: Use the replace method on inputString to replace newlines with break tags and return the result
    return inputString.replace(/\n/g, "<br>")

}

function clearAll(element) {
    element.innerHTML = ''
}

// Render habits to screen
function renderHabits(){
    for (let habit of habitList){
        renderHabit(habit)
    }
}

function renderHabit(habit) {
    const habitLi = document.createElement("li")
    habitLi.className = `habit ${colors[habit.colorState]}`
    const habitBody = createHabitBody(habit)
    const habitHeader = createHabitHeader(habit, habitBody)

    habitLi.appendChild(habitHeader)
    habitLi.appendChild(habitBody)

    habitsList.appendChild(habitLi)
}

function createHabitHeader(habit, habitBody) {
    /*
        <div class="habit-header">
        </div>
    */
    const headerDiv = document.createElement("div")
    headerDiv.className = "habit-header"
    
        /* 
            <h3 class="habit-name">Sleep</h3>
        */
        const headerName = document.createElement("h3")
        headerName.className = "habit-name"
        headerName.textContent = habit.habitName

        headerName.addEventListener('click', function() {
            habitBody.classList.toggle('grid')
        })

        headerDiv.appendChild(headerName)
        
        /* 
            <div>
            </div>
        */
        const doneBtnWrapper = document.createElement("div")
            /*
                ${numberInput}
                <button class="done-btn">Done</button>
            */
            doneBtnWrapper.appendChild(createHabitDoneBtn(habit))

        headerDiv.appendChild(doneBtnWrapper)
        
    return headerDiv
}

function createHabitBody(habit) {
    /*
        <div class="habit-details">
        <div>
    */
    const habitBody = document.createElement("div")
    habitBody.className = "habit-details"
        /*
            <div>
                <h4>Frequency</h4>
                <p class="habit-frequency">${frequency}</p>
            </div>
        */
        const frequencyDiv = document.createElement("div")
            const frequencyHeading = document.createElement("h4")
            frequencyHeading.innerText = 'Frequency'
            frequencyDiv.appendChild(frequencyHeading)
            const frequency = document.createElement("p")
            frequency.innerText = habit.frequency
            frequencyDiv.appendChild(frequency)
        habitBody.appendChild(frequencyDiv)
        /*
            <div>
                <h4>Tracking</h4>
                <p class="habit-tracking">${tracking}</p>
            </div>
        */
        const trackingDiv = document.createElement("div")
            const trackingHeading = document.createElement("h4")
            trackingHeading.innerText = 'Tracking'
            trackingDiv.appendChild(trackingHeading)
            const tracking = document.createElement("p")
            tracking.innerText = habit.tracking
            trackingDiv.appendChild(tracking)
        habitBody.appendChild(trackingDiv)
        /*
            <div class="span-2">
                <h4>Details</h4>
                <p>${replaceNewlinesWithBrTags(details)}</p>
            </div>
        */
        const detailsDiv = document.createElement("div")
            const detailsHeading = document.createElement("h4")
            detailsHeading.innerText = 'Details'
            detailsDiv.appendChild(detailsHeading)
            const details = document.createElement("p")
            details.innerText = habit.details
            detailsDiv.appendChild(details)
        habitBody.appendChild(detailsDiv)

        habitBody.appendChild(createHabitFooter(habit))
    
    return habitBody
}

function createHabitDoneBtn(habit) {
    const button = document.createElement("button")
    button.textContent = "Done"

    button.addEventListener("click", function(event) {
        console.log('done button clicked')
        pushDateToDoneDates(habit)
        fetchOnceAndRenderHabitsFromDB()
    })
    
    return button
}

async function pushDateToDoneDates(habit) {
    const date = getCurrentDate()
    const doneDates = habit.doneDates
    
    // If date doesn't exist, push date to doneDates
    if (doneDates.slice(-1) != date){
        doneDates.push(date)
    }

    const habitRef = doc(db, "habits", habit.habitId)

    await updateDoc(habitRef, {
        doneDates: doneDates
    })
}

function createHabitEditBtn(habit) {
    const habitId = habit.uid
    
    /* 
        <button class="edit-btn">Edit</button>
    */
    const button = document.createElement("button")
    button.textContent = "Edit"
    button.classList.add("edit-btn")
    button.addEventListener("click", function() {
        const newDetails = prompt("Edit the details", habit.details)
        
        if (newDetails) {
            updatePostInDB(habitId, newDetails)
        }
    })
    
    return button
}

function createHabitDeleteBtn(habit) {
    const habitId = habit.uid
    /* 
        <button class="delete-btn">Delete</button>
    */
    const button = document.createElement('button')
    button.textContent = 'Delete'
    button.className = "delete-btn"
    button.addEventListener('click', function() {
        console.log("Delete habit")
        //deletePostFromDB(habitId)
    })
    return button
}

function createHabitFooter(habit) {
    /* 
        <div class="margin-top span-2">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
        </div>
    */
    const footerDiv = document.createElement("div")
    footerDiv.className = "margin-top span-2"
    
    footerDiv.appendChild(createHabitEditBtn(habit))
    footerDiv.appendChild(createHabitDeleteBtn(habit))
    
    return footerDiv
}

/* == Calendar functions == */
// Function to render the calendar
function renderCalendar() {
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(), // Get first day of month
    lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(), // Get last date of month
    lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay(), // Get last day of month
    lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate() // Get last date of previous month

    let liTag = ""

    // creating li of previous month last days
    for (let i = firstDayOfMonth; i > 0; i--) { 
        // Get the date
        const day = lastDateOfLastMonth -i + 1
        const month = months[new Date(currYear, currMonth-1, 1).getMonth()]
        const year = new Date(currYear, currMonth-1, 1).getFullYear()
        const checkdate = `${day}${month}${year}`
        const isToday = "inactive"
        const id = `p${day}`

        liTag += getLiTagHTML(id, isToday, day, checkdate)
    }

    // creating li of all days of current month
    for (let i = 1; i <= lastDateOfMonth; i++) { 
        const isToday = i === new Date().getDate() && currMonth === new Date().getMonth()
                        && currYear === new Date().getFullYear() ? "active" : ""

        // Get the date
        const day = i
        const month = months[new Date(currYear, currMonth, 1).getMonth()]
        const year = new Date(currYear, currMonth, 1).getFullYear()
        const checkdate = `${day}${month}${year}`
        const id = `c${day}`

        liTag += getLiTagHTML(id, isToday, day, checkdate)
    }

    // creating li of next month first days
    for (let i = lastDayOfMonth; i < 6; i++) { 
        const day = i - lastDayOfMonth + 1
        const month = months[new Date(currYear, currMonth+1, 1).getMonth()]
        const year = new Date(currYear, currMonth+1, 1).getFullYear()
        const id = `n${day}`
        const isToday = "inactive"
        const checkdate = `${day}${month}${year}`
        liTag += getLiTagHTML(id, isToday, day, checkdate)
    }

    currentDate.innerText = `${months[currMonth]}  ${currYear}`
    daysTag.innerHTML = liTag
}

// Function to get HTML for calendar list item
function getLiTagHTML(id, isToday, day, checkdate){
    let ticksHTML = ''
    for (let habit of habitList) {

        let inactive = 'tick-inactive'
        if (habit.doneDates.includes(checkdate)) {
            inactive = ''
        }

        const colorState = habit.colorState
        const color = colorState === 1 ? "pink" : 
                        colorState === 2 ? "blue" :
                        colorState === 3 ? "orange" :
                        colorState === 4 ? "green" :
                        "purple"
        ticksHTML += `<div class="tick tick-${color} ${inactive}"></div>`
    }

    return `
        <li id="${id}" class="date-li ${isToday}">
            <div class="date-wrapper">${day}</div>
            <div class="ticks">
                ${ticksHTML}
            </div>
        </li>
    `
}

// Function to render calendar modal
function renderCalendarModal(date){
    const calendarModalHeaderDate = document.getElementById('calendar-modal-header-date')
    const calendarModalHeaderDay = document.getElementById('calendar-modal-header-day')
    const day = days[date.getDay()]
    const dt = date.getDate()
    const mnt = fullMonths[date.getMonth()]
    const yr = date.getFullYear()
    calendarModalHeaderDay.innerText = day
    calendarModalHeaderDate.innerText = `${mnt} ${dt}, ${yr}`
}

function getCurrentDate() {
    const newDate = new Date()
    const day = newDate.getDate()
    const month = months[newDate.getMonth()]
    const year = newDate.getFullYear()
    const date = `${day}${month}${year}`

    return date
}

/* ========== MAIN CODE ========== */
// Fetch db and render calendar / habits
fetchOnceAndRenderHabitsFromDB()


/* ========== EVENT LISTENERS ========== */

/* == Logged out view == */
signInWithGoogleBtn.addEventListener("click", authSignInWithGoogle)
signInBtn.addEventListener('click', authSignInWithEmail)
createAccountBtn.addEventListener('click', authCreateAccountWithEmail)

/* == Logged == in view */
signOutBtn.addEventListener("click", authSignOut)

userSection.addEventListener('click', function(){
    toggleBlockElement(userSectionEdit)
})

updateProfileBtn.addEventListener('click', function(){
    authUpdateProfile()
})

// Delete All button
deleteAllHabitsBtn.addEventListener('click', function(){
    // Show warning modal
    if (habitList.length != 0){
        warningModal.style.display = 'flex'
    }
})

// Close warning module button
closeWarningModalBtn.addEventListener('click', function(){
    // Hide warning modal
    warningModal.style.display = 'none'
})

// Confirm delete all
confirmDeleteAllBtn.addEventListener('click', function(){
    // Hide warning modal
    warningModal.style.display = 'none'
    clearAll(HabitsList)
    renderCalendar()
})


// Add event listeners to Previous and Next calendar icons
prevNextIcon.forEach(icon => {
    icon.addEventListener('click', () => {
        currMonth = icon.id === 'prev' ? currMonth - 1 : currMonth + 1

        if(currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth)
            currYear = date.getFullYear() // updating current year with new date year
            currMonth = date.getMonth() // updating current month with new date month
        }

        // Update calendar
        renderCalendar()
    })
})


/* == New habits event listeners == */

// Show the form when the + Add Habit button is clicked
addHabitButton.addEventListener('click', () => {
    habitForm.style.display = 'block'

})

for (let colorBtn of colorBtns) {
    colorBtn.addEventListener("click", selectColor)
}

// Handle the form submission (save habit)
habitForm.addEventListener('submit', (event) => {
    event.preventDefault()
    
    const habitName = habitNameInput.value.trim().toLowerCase()
    const frequency = habitFrequencyInput.value.trim().toLowerCase()
    const tracking = habitTrackingInput.value.trim().toLowerCase()
    const details = habitDetailsInput.value
    const user = auth.currentUser

    if (colorState) { // Ensuring color selection
        addHabitToDB(habitName, frequency, tracking, details, user)
        clearInputField(habitNameInput)
        clearInputField(habitFrequencyInput)
        clearInputField(habitTrackingInput)
        clearInputField(habitDetailsInput)
        resetAllColorBtns(colorBtns)
        habitForm.style.display = "none"
    }
    fetchOnceAndRenderHabitsFromDB()
})

/* === State === */

let colorState = 0

/* === Element Listeners === */

// Document event listeners
document.addEventListener('click', async function(event){
    // Calendar click events
    // Show calendar modal when clicking on a day
    if (event.target.classList.contains('date-li')){
        // Get date from calendar list item id
        const dayToShow = event.target.id.slice(1)
        const monthToShow = months.indexOf(currentDate.innerText.slice(0, 3))
        const yearToShow = currentDate.innerText.slice(4)
        const dateToShow = new Date(yearToShow, monthToShow, dayToShow)
        renderCalendarModal(dateToShow)
        calendarModal.style.display = 'block'
    }

    // Hide calendar modal when clicking on the calendar modal header
    else if (event.target.classList.contains('calendar-modal-header')){
        calendarModal.style.display = 'none'
    }
})

// Footer
// Set copyright year
document.getElementById("current-year").innerText = currYear


/* === Main Code === */

onAuthStateChanged(auth, (user) => {
    if (user) {
        showProfilePicture(userProfilePicture, user)
        showUserName(userName, user)
        showUserEmail(userEmail, user)
        showLoggedInView()
    } else {
        showLoggedOutView()
    }
})

showLoggedOutView()

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            // console.log('Signed in with Google')
        }).catch((error) => {
            console.error(error.message)
            errorMessage.innerText = error.message
        })
}

function authSignInWithEmail() {
    const email = emailInput.value
    const password = passwordInput.value

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        clearAuthFields()
        showLoggedInView()
    })
    .catch((error) => {
        console.error(error.message)
        errorMessage.innerText = error.message
    })
}

function authCreateAccountWithEmail() {
   const email = emailInput.value
   const password = passwordInput.value

   createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            clearAuthFields()
            showLoggedInView()
        })
        .catch((error) => {
            console.error(error.message)
            errorMessage.innerText = error.message
    })
}

function authSignOut() {
    signOut(auth)
        .then(() => {
            showLoggedOutView()
        }).catch((error) => {
            console.error(error.message)
        })
}

function authUpdateProfile() {
    const newDisplayName = displayNameInput.value
    const newPhotoUrl = photoUrlInput.value

    updateProfile(auth.currentUser, {
        displayName: newDisplayName, 
        photoURL: newPhotoUrl
    }).then(() => {
        showProfilePicture(userProfilePicture, auth.currentUser)
        showUserName(userName, auth.currentUser)
        toggleBlockElement(userSectionEdit)
    }).catch((error) => {
        console.error(error.message)
    })
}

/* = Functions - Firebase - Cloud Firestore = */

async function addHabitToDB(habitName, frequency, tracking, details, user) {
    try {
        const docRef = await addDoc(collection(db, "habits"), {
            habitId : '',
            habitName: habitName,
            uid: user.uid,
            timeAdded: serverTimestamp(),
            frequency: frequency,
            tracking: tracking,
            details: details,
            colorState: colorState,
            doneDates: [],
            numbers: [],
            timestamps: [],
            durations: []
          })

          // Set habitId
          const habitRef = doc(db, "habits", `${docRef.id}`);
            await updateDoc(habitRef, {
                habitId: docRef.id
            })

    } catch (error) {
        console.error(error.message)
    }
}

async function fetchOnceAndRenderHabitsFromDB() {
    clearAll(habitsList)
    const habitsRef = collection(db, "habits")

    const querySnapshot = await getDocs(habitsRef)
    habitList = []
    querySnapshot.forEach((doc) => {
        if (doc.data().uid === auth.currentUser.uid) {
            habitList.push(doc.data())
        }
    })
    renderCalendar()
    renderHabits()
}

/* == Functions - UI Functions == */

function showLoggedOutView() {
    hideView(viewLoggedIn)
    showView(viewLoggedOut)
}

function showLoggedInView() {
    hideView(viewLoggedOut)
    showView(viewLoggedIn)
}

function showView(view) {
    view.style.display = "flex"
}

function hideView(view) {
    view.style.display = "none"
}

function showFlexElement(element) {
    element.style.display = 'flex'
}

function toggleBlockElement(element) {
    element.classList.toggle('showBlock')
    element.classList.toggle('hide')
}

function clearInputField(field) {
	field.value = ""
}

function clearAuthFields() {
	clearInputField(emailInput)
	clearInputField(passwordInput)
}

function showProfilePicture(imgElement, user) {
    const photoURL = user.photoURL;

    if (photoURL){
        imgElement.src = photoURL
    } else {
        imgElement.src = "/images/default-profile-picture.jpeg"
    }
}

function showUserName(element, user) {
    const displayName = user.displayName;
    if (displayName) {
        element.innerText = displayName
    } else {
        element.innerText = "New User"
    }
}

function showUserEmail(element, user) {
    const email = user.email;
    if (email) {
        element.innerText = email
    } else {
        element.innerText = "No email"
    }
}

/* = Functions - UI Functions - Color = */

function selectColor(event) {
    const selectedColorBtnId = event.currentTarget.id
    
    changeColorAfterSelection(selectedColorBtnId, colorBtns)
    
    const chosenColorValue = returnColorValueFromColorBtnID(selectedColorBtnId)
    
    colorState = chosenColorValue
}

function changeColorAfterSelection(selectedColorBtnId, colorBtns) {
    for (let colorBtn of colorBtns) {
        if (selectedColorBtnId === colorBtn.id) {
            colorBtn.classList.remove("unselected-color")          
            colorBtn.classList.add("selected-color")
        } else {
            colorBtn.classList.remove("selected-color")
            colorBtn.classList.add("unselected-color")
        }
    }
}

function resetAllColorBtns(colorBtns) {
    for (let colorBtn of colorBtns) {
        colorBtn.classList.remove("selected-emoji")
        colorBtn.classList.remove("unselected-emoji")
    }
    
    colorState = 0
}

function returnColorValueFromColorBtnID(elementId) {
    return Number(elementId.slice(6))
}