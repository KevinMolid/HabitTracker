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
        liTag += `<li class="inactive">${lastDateOfLastMonth -i + 1}</li>`
    }

    for (let i = 1; i <= lastDateOfMonth; i++) { // creating li of all days of current month
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                        && currYear === new Date().getFullYear() ? "active" : ""

        liTag += `<li class="${isToday}">${i}</li>`
    }

    for (let i = lastDayOfMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`
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

// Add event listeners to document
document.addEventListener('DOMContentLoaded', () => {
    const habitsList = document.getElementById('habits');
    const addHabitButton = document.getElementById('add-habit');
    const habitForm = document.getElementById('habit-form');
    const habitNameInput = document.getElementById('habit-name');

    // Function to add a habit to the list
    function addHabit(habitName) {
        const listItem = document.createElement('li');
        listItem.textContent = habitName;
        habitsList.appendChild(listItem);
    }

    // Show the form when the Add New Habit button is clicked
    addHabitButton.addEventListener('click', () => {
        habitForm.style.display = 'block';
    });

    // Handle the form submission
    habitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const habitName = habitNameInput.value.trim();
        if (habitName) {
            addHabit(habitName);
            habitNameInput.value = ''; // Reset input field
            habitForm.style.display = 'none'; // Hide the form again
        } else {
            alert('Please enter a habit name.');
        }
    });
});

// Set copyright year
document.getElementById("current-year").innerText = currYear