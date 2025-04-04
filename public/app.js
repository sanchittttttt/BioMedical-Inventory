// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const loginForm = document.getElementById('login');
const registerForm = document.getElementById('register');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const loginFormContainer = document.getElementById('loginForm');
const registerFormContainer = document.getElementById('registerForm');
const dashboard = document.getElementById('dashboard');
const userEmailSpan = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const addItemForm = document.getElementById('addItemForm');
const inventoryTableBody = document.getElementById('inventoryTableBody');
const searchItemInput = document.getElementById('searchItem');
const alertsList = document.getElementById('alertsList');

// Authentication Functions
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userEmail', email);
            showDashboard();
        } else {
            showError(loginForm, data.message);
        }
    } catch (error) {
        showError(loginForm, 'An error occurred during login');
    }
}

async function register(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            showLoginForm();
            showSuccess('Registration successful! Please login.');
        } else {
            showError(registerForm, data.message);
        }
    } catch (error) {
        showError(registerForm, 'An error occurred during registration');
    }
}

// Inventory Management Functions
async function addItem(itemData) {
    try {
        const response = await fetch(`${API_BASE_URL}/inventory/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(itemData)
        });

        const data = await response.json();
        
        if (response.ok) {
            loadInventory();
            addItemForm.reset();
        } else {
            showError(addItemForm, data.message);
        }
    } catch (error) {
        showError(addItemForm, 'An error occurred while adding the item');
    }
}

async function loadInventory() {
    try {
        const response = await fetch(`${API_BASE_URL}/inventory/items`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const items = await response.json();
        displayInventory(items);
        checkLowStock(items);
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
}

async function updateItem(id, quantity) {
    try {
        const response = await fetch(`${API_BASE_URL}/inventory/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ quantity })
        });

        const data = await response.json();
        
        if (response.ok) {
            loadInventory();
        } else {
            showError(null, data.message);
        }
    } catch (error) {
        showError(null, 'An error occurred while updating the item');
    }
}

async function deleteItem(itemName) {
    try {
        const response = await fetch(`${API_BASE_URL}/inventory/items/${itemName}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            loadInventory();
        } else {
            const data = await response.json();
            showError(null, data.message);
        }
    } catch (error) {
        showError(null, 'An error occurred while deleting the item');
    }
}

// UI Functions
function displayInventory(items) {
    inventoryTableBody.innerHTML = '';
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.item_name}</td>
            <td>${item.quantity}</td>
            <td>${new Date(item.expiry_date).toLocaleDateString()}</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="showEditModal(${item.id}, ${item.quantity})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteItem('${item.item_name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        inventoryTableBody.appendChild(row);
    });
}

function checkLowStock(items) {
    alertsList.innerHTML = '';
    const lowStockItems = items.filter(item => item.quantity <= 10);
    
    if (lowStockItems.length > 0) {
        lowStockItems.forEach(item => {
            const alert = document.createElement('div');
            alert.className = 'alert-item';
            alert.innerHTML = `
                <span>${item.item_name} is running low (${item.quantity} remaining)</span>
                <button onclick="showEditModal(${item.id}, ${item.quantity})">Update Stock</button>
            `;
            alertsList.appendChild(alert);
        });
    } else {
        alertsList.innerHTML = '<p>No low stock alerts at this time.</p>';
    }
}

function showEditModal(id, currentQuantity) {
    const newQuantity = prompt('Enter new quantity:', currentQuantity);
    if (newQuantity !== null && !isNaN(newQuantity)) {
        updateItem(id, parseInt(newQuantity));
    }
}

function showError(form, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (form) {
        form.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    } else {
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}

function showLoginForm() {
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';
    dashboard.style.display = 'none';
}

function showRegisterForm() {
    loginFormContainer.style.display = 'none';
    registerFormContainer.style.display = 'block';
    dashboard.style.display = 'none';
}

function showDashboard() {
    loginFormContainer.style.display = 'none';
    registerFormContainer.style.display = 'none';
    dashboard.style.display = 'block';
    userEmailSpan.textContent = localStorage.getItem('userEmail');
    loadInventory();
}

// Event Listeners
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    register(email, password);
});

showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    showLoginForm();
});

addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const itemData = {
        item_name: document.getElementById('itemName').value,
        quantity: parseInt(document.getElementById('quantity').value),
        expiry_date: document.getElementById('expiryDate').value
    };
    addItem(itemData);
});

searchItemInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = inventoryTableBody.getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const itemName = row.cells[0].textContent.toLowerCase();
        row.style.display = itemName.includes(searchTerm) ? '' : 'none';
    });
});

// Check if user is already logged in
if (localStorage.getItem('token')) {
    showDashboard();
} else {
    showLoginForm();
} 