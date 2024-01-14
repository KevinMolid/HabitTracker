// Variables
const habitsList = document.getElementById('habits') // Habit list element -> Rename habitListEl
const deleteAllHabitsBtn = document.getElementById('delete-all-habits-btn')
let habitList = []

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
    for (habit of habitList){
        // Create element and render to screen
        const listItem = document.createElement('li')
        listItem.classList.add('habit') // Add the habit class for general styling
        listItem.classList.add(`${habit.color}`) // Add color class for specific styling
        listItem.innerHTML = `
            <p>${habit.habitName}</p>
            <div>
                <button id="delete-${habit.habitName}" class="delete-btn">Delete</button>
                <button id="done-${habit.habitName}" class="done-btn">Done</button>
            </div>
        `
        habitsList.appendChild(listItem)
    }
}


// Run app
// Get items from local storage
fetchLocalStorage()
// Render habits to screen
renderHabits()

// Event listeners
deleteAllHabitsBtn.addEventListener('click', function(){
    clearLocalStorage()
    clearHabitsList()
    // Set Local storage to empty list   
    fetchLocalStorage() 
    renderCalendar()
})




// ********** CALENDAR **********
const currentDate = document.querySelector('.current-date'),
daysTag = document.querySelector('.days'),
prevNextIcon = document.querySelectorAll('.prev-next-icon')

// Getting new date, current month and year
let date = new Date(), 
currYear = date.getFullYear(), 
currMonth = date.getMonth()

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


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

        liTag += `
            <li class="inactive">
                <div class="date-wrapper">${day}</div>
                <div class="ticks">
                    <div class="tick ${pinkTick}"></div>
                    <div class="tick ${blueTick}"></div>
                    <div class="tick ${orangeTick}"></div>
                </div>
            </li>
        `
    }

    for (let i = 1; i <= lastDateOfMonth; i++) { // creating li of all days of current month
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                        && currYear === new Date().getFullYear() ? "active" : ""

        // Get the date
        const day = i
        const month = months[new Date(currYear, currMonth, 1).getMonth()]
        const year = new Date(currYear, currMonth, 1).getFullYear()
        const checkdate = `${day}${month}${year}`

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

        liTag += `
        <li class="${isToday}">
            <div class="date-wrapper">${i}</div>
            <div class="ticks">
                <div class="tick ${pinkTick}"></div>
                <div class="tick ${blueTick}"></div>
                <div class="tick ${orangeTick}"></div>
            </div>
        </li>
        `
    }

    for (let i = lastDayOfMonth; i < 6; i++) { // creating li of next month first days
        liTag += `
            <li class="inactive">
                <div class="date-wrapper">${i - lastDayOfMonth + 1}</div>
                <div class="ticks">
                    <div class="tick"></div>
                    <div class="tick"></div>
                    <div class="tick"></div>
                </div>
            </li>
        `
    }

    currentDate.innerText = `${months[currMonth]}  ${currYear}`
    daysTag.innerHTML = liTag
}

renderCalendar()

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


// ********** NEW HABITS **********

// Add event listeners to document
document.addEventListener('DOMContentLoaded', () => {
    const addHabitButton = document.getElementById('add-habit')
    const habitForm = document.getElementById('habit-form')
    const habitNameInput = document.getElementById('habit-name')

    // Function to add a habit to the list
    function addHabit(habitName) {
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
        listItem.innerHTML = `
            <p>${habitName}</p>
            <div>
                <button id="delete-${habitName}" class="delete-btn">Delete</button>
                <button id="done-${habitName}" class="done-btn">Done</button>
            </div>
        `
        habitsList.appendChild(listItem)


        // Save habit to Local Storage
        habitList.push({
            habitName: `${habitName}`,
            color: `${color}`,
            doneDates: []
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
        const habitName = habitNameInput.value.trim().toLowerCase();

        // Check if habit exists
        const habitNames = habitList.map(function(habit){
            return habit.habitName
        })
        if (!habitNames.includes(habitName)){
            addHabit(habitName)
            habitNameInput.value = '' // Reset input field
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
        console.log(event.target)
    }
})

// Mark habit as done
document.addEventListener('click', function(event){
    if (event.target.classList.contains('done-btn')){
        // Set the date
        const newDate = new Date()
        const day = newDate.getDate()
        const month = months[newDate.getMonth()]
        const year = newDate.getFullYear()
        const date = `${day}${month}${year}`

        // Add date to the habit objects doneDates array
        const habitName = event.target.id.slice(5) // Get habit name

        for (habit of habitList){
            if (habit.habitName === habitName){
                // If date doesn't exis, push date to doneDates
                if (habit.doneDates.slice(-1) != date){
                    habit.doneDates.push(date)
                    setLocalStorage()
                    renderCalendar()
                }
            }
        }
    }
})