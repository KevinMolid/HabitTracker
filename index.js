const habitsList = document.getElementById('habits')

// localStorage.clear() // Clear localStorage

// Get items from local storage
let habitList = JSON.parse(localStorage.getItem('habitList'))
if (!habitList) {
    localStorage.setItem('habitList', JSON.stringify([]))
    habitList = JSON.parse(localStorage.getItem('habitList'))
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


// Function to render the calendar
function renderCalendar() {
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(), // Get first day of month
    lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(), // Get last date of month
    lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay(), // Get last day of month
    lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate() // Get last date of previous month

    let liTag = ""

    for (let i = firstDayOfMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `
            <li class="inactive">
                <div class="date-wrapper">${lastDateOfLastMonth -i + 1}</div>
                <div class="ticks">
                    <div class="tick tick-1"></div>
                    <div class="tick tick-2"></div>
                    <div class="tick tick-3"></div>
                </div>
            </li>
        `
    }

    for (let i = 1; i <= lastDateOfMonth; i++) { // creating li of all days of current month
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                        && currYear === new Date().getFullYear() ? "active" : ""

        liTag += `
        <li class="${isToday}">
            <div class="date-wrapper">${i}</div>
            <div class="ticks">
                <div class="tick tick-1"></div>
                <div class="tick tick-2"></div>
                <div class="tick tick-3"></div>
            </div>
        </li>
        `
    }

    for (let i = lastDayOfMonth; i < 6; i++) { // creating li of next month first days
        liTag += `
            <li class="inactive">
                <div class="date-wrapper">${i - lastDayOfMonth + 1}</div>
                <div class="ticks">
                    <div class="tick tick-1"></div>
                    <div class="tick tick-2"></div>
                    <div class="tick tick-3"></div>
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


// ********** HABITS **********
// Render habits to screen
for (habit of habitList){
    console.log(habit)
    // Create element and render to screen
    const listItem = document.createElement('li')
    listItem.classList.add('habit') // Add the habit class for general styling
    listItem.classList.add(`${habit.color}`) // Add color class for specific styling
    listItem.innerHTML = `
        <p>${habit.habitName}</p>
        <div>
            <button id="delete-${habit.habitName}" class="delete-btn">Delete</button>
            <button>Done</button>
        </div>
    `
    habitsList.appendChild(listItem)
}

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
                <button>Done</button>
            </div>
        `
        habitsList.appendChild(listItem)


        // Save habit to Local Storage
        habitList.push({
            habitName: `${habitName}`,
            color: `${color}`,
            doneDates: []
        })
        localStorage.setItem('habitList', JSON.stringify(habitList))
    }

    // Show the form when the + New Habit button is clicked
    addHabitButton.addEventListener('click', () => {
        if (JSON.parse(localStorage.getItem('habitList')).length < 3){
            habitForm.style.display = 'block'
        } else {
            // Show max habits message
            let message = document.getElementById('max-message')
            message.style.display = 'inline'
            setTimeout(() => {
                message.style.display = 'none'
            }, 3000);
        }
    });

    // Handle the form submission
    habitForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const habitName = habitNameInput.value.trim();
        if (habitName) {
            addHabit(habitName)
            habitNameInput.value = '' // Reset input field
            habitForm.style.display = 'none' // Hide the form again
        } else {
            alert('Please enter a habit name.')
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