let totalExpense = 0;
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let streak = parseInt(localStorage.getItem('streak')) || 0;
let lastUpdatedDate = localStorage.getItem('lastUpdatedDate') || null;

function showExpensePage() {
    document.getElementById('welcomePage').style.display = 'none';
    document.getElementById('expensePage').style.display = 'block';
    loadExpenses();
    updateChart();
    updateStreak();
}

function showWelcomePage() {
    document.getElementById('expensePage').style.display = 'none';
    document.getElementById('welcomePage').style.display = 'block';
}

function addExpense() {
    const name = document.getElementById('expenseName').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const date = document.getElementById('expenseDate').value;

    if (name === "" || isNaN(amount) || amount <= 0 || !date) {
        alert("Please enter a valid expense name, amount, and date.");
        return;
    }

    totalExpense += amount;
    document.getElementById('totalExpense').textContent = totalExpense.toFixed(2);

    expenses.push({ name, amount, date });
    localStorage.setItem('expenses', JSON.stringify(expenses));

    checkAndUpdateStreak(date);  
    loadExpenses();
    updateChart();

    document.getElementById('expenseName').value = "";
    document.getElementById('expenseAmount').value = "";
    document.getElementById('expenseDate').value = "";
}

function checkAndUpdateStreak(currentDate) {
    let today = new Date().toISOString().split('T')[0];

    if (!lastUpdatedDate) {
        streak = 1;  
    } else {
        let lastDate = new Date(lastUpdatedDate);
        let current = new Date(currentDate);

        let difference = (current - lastDate) / (1000 * 60 * 60 * 24);

        if (difference === 1) {
            streak++;  
        } else if (difference > 1) {
            streak = 1;  
        }
    }

    lastUpdatedDate = currentDate;
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastUpdatedDate', lastUpdatedDate);
    updateStreak();
}

function updateStreak() {
    document.getElementById('streakCount').textContent = streak;
}

function loadExpenses() {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = "";
    totalExpense = 0;

    expenses.forEach((expense, index) => {
        totalExpense += expense.amount;
        const listItem = document.createElement('li');
        listItem.innerHTML = `${expense.date} - ${expense.name}: $${expense.amount.toFixed(2)} 
            <button class="delete-btn" onclick="removeExpense(${index})">Delete</button>`;
        expenseList.appendChild(listItem);
    });

    document.getElementById('totalExpense').textContent = totalExpense.toFixed(2);
}

function removeExpense(index) {
    totalExpense -= expenses[index].amount;
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    loadExpenses();
    updateChart();
}

// Weekly Expense Chart
function updateChart() {
    let ctx = document.getElementById('weeklyChart').getContext('2d');
    
    let last7Days = [];
    let amounts = [];
    
    for (let i = 6; i >= 0; i--) {
        let date = new Date();
        date.setDate(date.getDate() - i);
        let formattedDate = date.toISOString().split('T')[0];

        last7Days.push(formattedDate);
        let dailyTotal = expenses
            .filter(exp => exp.date === formattedDate)
            .reduce((sum, exp) => sum + exp.amount, 0);
        amounts.push(dailyTotal);
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{ label: 'Daily Expenses', data: amounts, borderColor: 'blue', fill: false }]
        }
    });
}

function changeBackgroundColor() {
    let color = document.getElementById('bgColor').value;
    document.body.style.backgroundColor = color;
}


