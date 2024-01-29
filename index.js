// Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js"
import { getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"

/* === Firebase Setup === */
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

// Variables
let habitList = []

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

/* Logged out */
const signInWithGoogleBtn = document.getElementById('sign-in-with-google-btn')
const signInBtn = document.getElementById('sign-in-btn')
const createAccountBtn = document.getElementById('create-account-btn')
const emailInput = document.getElementById("email-input")
const passwordInput = document.getElementById("password-input")


/* Logged in */
const signOutBtn = document.getElementById('sign-out-btn')
const calendarModal = document.getElementById('calendar-modal')

const habitsList = document.getElementById('habits') // Habit list element -> Rename habitListEl
const deleteAllHabitsBtn = document.getElementById('delete-all-habits-btn')
const warningModal = document.getElementById('warning-modal')
const closeWarningModalBtn = document.getElementById('close-warning-modal-btn')
const confirmDeleteAllBtn = document.getElementById('confirm-delete-all-btn')


// ********** FUNCTIONS **********
// Set Local Storage
function setLocalStorage(){
    localStorage.setItem('habitList', JSON.stringify(habitList))
}


// Clear localStorage
function clearLocalStorage(){
    localStorage.clear() 
}

// Clear habitsList
function clearHabitsList(){
    habitsList.innerHTML = ''
}

function fetchLocalStorage(){
    habitList = JSON.parse(localStorage.getItem('habitList'))
    // If no Local Storage -> Set local storage to empty list
    if (!habitList) {
        localStorage.setItem('habitList', JSON.stringify([]))
        habitList = JSON.parse(localStorage.getItem('habitList'))
    }
}

// ********** HABITS **********
// Render habits to screen
function renderHabits(){
    // Reset habits list to empty element
    habitsList.innerHTML = ''
    for (habit of habitList){
        // Create element and render to screen
        const listItem = document.createElement('li')
        listItem.classList.add('habit') // Add the habit class for general styling
        listItem.classList.add(`${habit.color}`) // Add color class for specific styling
        listItem.innerHTML = getHabitHTML(habit.habitName, habit.frequency, habit.tracking, habit.details)
        habitsList.appendChild(listItem)
    }
}

// ********** CALENDAR **********
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


// Run app
// Get items from local storage
fetchLocalStorage()
// Render calendar to screen
renderCalendar()
// Render habits to screen
renderHabits()

// ********** EVENT LISTENERS **********

/* Logged out */
signInWithGoogleBtn.addEventListener("click", authSignInWithGoogle)
signInBtn.addEventListener('click', authSignInWithEmail)
createAccountBtn.addEventListener('click', authCreateAccountWithEmail)

/* Logged in */
signOutBtn.addEventListener("click", authSignOut)

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
    // Clear local storage and habits list
    clearLocalStorage()
    clearHabitsList()
    // Set Local storage to empty list   
    fetchLocalStorage() 
    renderCalendar()
})


// Function to render the calendar
function renderCalendar() {
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(), // Get first day of month
    lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(), // Get last date of month
    lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay(), // Get last day of month
    lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate() // Get last date of previous month

    let liTag = ""

    for (let i = firstDayOfMonth; i > 0; i--) { // creating li of previous month last days
        // Get the date
        const day = lastDateOfLastMonth -i + 1
        const month = months[new Date(currYear, currMonth, 1).getMonth()]
        const year = new Date(currYear, currMonth, 1).getFullYear()
        const checkdate = `${day}${month}${year}`
        const active = 'inactive'
        const id = `p${day}`
        let pinkTick = ""
        let blueTick = ""
        let orangeTick = ""

        if (habitList.length != 0){
            // Determine if habits are done or not
            // pink habit:
            habitList.forEach(habit => {
                if (habit.color === 'pink'){
                    // If date is in habit.doneDates, show pink tick
                    if (habit.doneDates.includes(checkdate)){
                        pinkTick = 'tick-pink'
                    }
                } else if (habit.color === 'blue'){
                    // If date is in habit.doneDates, show pink tick
                    if (habit.doneDates.includes(checkdate)){
                        blueTick = 'tick-blue'
                    }
                } else if (habit.color === 'orange'){
                    // If date is in habit.doneDates, show pink tick
                    if (habit.doneDates.includes(checkdate)){
                        orangeTick = 'tick-orange'
                    }
                }
            })
        }


        liTag += getLiTagHTML(id, active, day, pinkTick, blueTick, orangeTick)
    }

    for (let i = 1; i <= lastDateOfMonth; i++) { // creating li of all days of current month
        let active = i === date.getDate() && currMonth === new Date().getMonth()
                        && currYear === new Date().getFullYear() ? "active" : ""

        // Get the date
        const day = i
        const month = months[new Date(currYear, currMonth, 1).getMonth()]
        const year = new Date(currYear, currMonth, 1).getFullYear()
        const checkdate = `${day}${month}${year}`
        const id = `c${day}`

        // Determine if habits are done or not
        // pink habit:
        let pinkTick = ''
        for (habit of habitList){
            if (habit.color === 'pink'){
                // If date is in habit.doneDates, show pink tick
                if (habit.doneDates.includes(checkdate)){
                    pinkTick = 'tick-pink'
                }
            }
        }

        // Blue habit:
        let blueTick = ''
        for (habit of habitList){
            if (habit.color === 'blue'){
                // If date is in habit.doneDates, show pink tick
                if (habit.doneDates.includes(checkdate)){
                    blueTick = 'tick-blue'
                }
            }
        }

        // Orange habit:
        let orangeTick = ''
        for (habit of habitList){
            if (habit.color === 'orange'){
                // If date is in habit.doneDates, show pink tick
                if (habit.doneDates.includes(checkdate)){
                    orangeTick = 'tick-orange'
                }
            }
        }

        liTag += getLiTagHTML(id, active, day, pinkTick, blueTick, orangeTick)
    }

    for (let i = lastDayOfMonth; i < 6; i++) { // creating li of next month first days
        const day = i - lastDayOfMonth + 1
        const id = `n${day}`
        const active = 'inactive'
        const pinkTick = ''
        const blueTick = ''
        const orangeTick = ''
        liTag += getLiTagHTML(id, active, day, pinkTick, blueTick, orangeTick)
    }

    currentDate.innerText = `${months[currMonth]}  ${currYear}`
    daysTag.innerHTML = liTag
}

// Function to get HTML for calendar list item
function getLiTagHTML(id, active, day, pinkTick, blueTick, orangeTick){
    return `
        <li id="${id}" class="date-li ${active}">
            <div class="date-wrapper">${day}</div>
            <div class="ticks">
                <div class="tick ${pinkTick}"></div>
                <div class="tick ${blueTick}"></div>
                <div class="tick ${orangeTick}"></div>
            </div>
        </li>
    `
}

// Previous and Next calendar icons
prevNextIcon.forEach(icon => {
    icon.addEventListener('click', () => {
        currMonth = icon.id === 'prev' ? currMonth - 1 : currMonth + 1

        if(currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth)
            currYear = date.getFullYear() // updating current year with new date year
            currMonth = date.getMonth() // updating current month with new date month
        }

        renderCalendar()
    })
})

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


// ********** NEW HABITS **********

// Add event listeners to document
document.addEventListener('DOMContentLoaded', () => {
    const addHabitButton = document.getElementById('add-habit')
    const habitForm = document.getElementById('habit-form')
    const habitNameInput = document.getElementById('habit-name')
    const habitFrequencyInput = document.getElementById('habit-frequency')
    const habitTrackingInput = document.getElementById('habit-tracking')
    const habitDetailsInput = document.getElementById('habit-details')

    // Function to add a habit to the list
    function addHabit(habitName, frequency, tracking, details) {
        let colorList = [0, 0, 0] // pink, blue, orange

        // Check for existing habits and add to color list
        for (habit of habitsList.children) {
            if (habit.classList.contains('pink')) {
                colorList[0] = 1
            }
            if (habit.classList.contains('blue')) {
                colorList[1] = 1
            }
            if (habit.classList.contains('orange')) {
                colorList[2] = 1
            }
        }

        // set color
        let color = ''
        if (colorList[0] === 0) {
            color = 'pink'
        }
        else if (colorList[1] === 0) {
            color = 'blue'
        }
        else if (colorList[2] === 0) {
            color = 'orange'
        }

        // Create element and render to screen
        const listItem = document.createElement('li')
        listItem.classList.add('habit') // Add the habit class for general styling
        listItem.classList.add(`${color}`) // Add color class for specific styling
        listItem.innerHTML = getHabitHTML(habitName, frequency, tracking, details)
        habitsList.appendChild(listItem)


        // Save habit to Local Storage
        habitList.push({
            habitName: `${habitName}`,
            frequency: `${frequency}`,
            tracking: `${tracking}`,
            details: `${details}`,
            color: `${color}`,
            doneDates: [],
            numbers: []
        })
        setLocalStorage()
    }

    // Show the form when the + New Habit button is clicked
    addHabitButton.addEventListener('click', () => {
        if (JSON.parse(localStorage.getItem('habitList')).length < 3){
            habitForm.style.display = 'block'
        } else {
            // Show max habits message
            let maxMessage = document.getElementById('max-message')
            maxMessage.style.display = 'inline'
            setTimeout(() => {
                maxMessage.style.display = 'none'
            }, 3000);
        }
    });

    // Handle the form submission
    habitForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const habitName = habitNameInput.value.trim().toLowerCase()
        const frequency = habitFrequencyInput.value.trim().toLowerCase()
        const tracking = habitTrackingInput.value.trim().toLowerCase()
        const details = habitDetailsInput.value

        // Check if habit exists
        const habitNames = habitList.map(function(habit){
            return habit.habitName
        })
        if (!habitNames.includes(habitName)){
            addHabit(habitName, frequency, tracking, details)
            habitNameInput.value = '' // Reset input field
            habitDetailsInput.value = '' // Reset text area
            habitForm.style.display = 'none' // Hide the form again
        } else {
            // Show exists message
            let existsMessage = document.getElementById('exists-message')
            existsMessage.style.display = 'inline'
            setTimeout(() => {
                existsMessage.style.display = 'none'
            }, 3000);
        }
    });
});

// Set copyright year
document.getElementById("current-year").innerText = currYear

// Delete habits
document.addEventListener('click', function(event){
    if (event.target.classList.contains('delete-btn')){
        // find habit name from id
        const habitName = event.target.id.slice(7)
        // Make list of habit names
        const habitNamesArr = habitList.map(habit => habit.habitName)
        // Find index of habit name
        const index = habitNamesArr.indexOf(habitName)
        // Delete habit from habit list
        habitList.splice(index, 1)
        // Update local storage and re-render screen
        setLocalStorage()
        renderCalendar()
        renderHabits()
    }
})

// Document event listeners
document.addEventListener('click', function(event){
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

    // Mark habit as done
    else if (event.target.classList.contains('done-btn')){
        // Set the date
        const newDate = new Date()
        const day = newDate.getDate()
        const month = months[newDate.getMonth()]
        const year = newDate.getFullYear()
        const date = `${day}${month}${year}`
 
        // Add date to the habit objects doneDates array
        const habitName = event.target.id.slice(5) // Get habit name

        // Get the numberInput element if it exists
        const numberInput = document.getElementById(`number-input-${habitName}`)

        for (habit of habitList){
            if (habit.habitName === habitName){

                // If date doesn't exist, push date to doneDates
                if (habit.doneDates.slice(-1) != date){
                    // If tracking is number
                    if (numberInput){
                        habit.numbers.push(numberInput.value)
                        numberInput.value = ''
                    }
                    // Push date and render
                    habit.doneDates.push(date)
                    setLocalStorage()
                    renderCalendar()
                }
            }
        }
    }

    // Expand habit details when clicking on the habit header or habit name
    else if (event.target.classList.contains('habit-header')){
        // get habit name
        const habitName = event.target.id.slice(7)
        // show details
        const habitDetails = document.getElementById(`details-${habitName}`)
        habitDetails.classList.toggle('grid')
    } else if (event.target.classList.contains('habit-name')){
        // get habit name
        const habitName = event.target.id.slice(11)
        // show details
        const habitDetails = document.getElementById(`details-${habitName}`)
        habitDetails.classList.toggle('grid')
    }

})


/* Console log the habit list */
console.log(habitList)


/* Function to get habit element HTML */
function getHabitHTML(habitName, frequency, tracking, details){
    // Adding tracking mode elements
    numberInput = ''

    if (tracking === 'number'){
        numberInput = `
            <input id="number-input-${habitName}" type="number" placeholder="Number">
        `
    }

    return `
        <div class="habit-header" id="header-${habitName}">
            <h3 class="habit-name" id="habit-name-${habitName}">${habitName}</h3>
            <div>
                ${numberInput}
                <button id="done-${habitName}" class="done-btn">Done</button>
            </div>
        </div>
        <div class="habit-details" id="details-${habitName}">
            <div>
                <h4>Frequency</h4>
                <p class="habit-frequency">${frequency}</p>
            </div>
            <div>
                <h4>Tracking</h4>
                <p class="habit-tracking">${tracking}</p>
            </div>
            <div class="span-2">
                <h4>Details</h4>
                <p>${details}</p>
            </div>
            <div class="margin-top span-2">
                <button id="edit-${habitName}" class="edit-btn">Edit</button>
                <button id="delete-${habitName}" class="delete-btn">Delete</button>
            </div>
        </div>
    `
}


/* === Main Code === */

onAuthStateChanged(auth, (user) => {
    if (user) {
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
            console.log('Signed in with Google')
        }).catch((error) => {
            console.error(error.message)
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

function clearInputField(field) {
	field.value = ""
}

function clearAuthFields() {
	clearInputField(emailInput)
	clearInputField(passwordInput)
}