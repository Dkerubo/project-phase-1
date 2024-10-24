// Base URL 
const baseUrl = 'http://localhost:3000';

// Function to collect data from the form
function collectData() {
    const form = document.querySelector('#driver-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            nationalId: e.target['national-id'].value,
            location: e.target.location.value,
            truckPlate: e.target['truck-plate'].value,
            datePicked: e.target['date-picked'].value,
            returnDate: e.target['date-return'].value
        };

        form.reset();  // Reset form after submission

        const driverId = form.dataset.id;
        if (driverId) {
            updateDriver(driverId, formData);  // Call update function if updating
            form.removeAttribute('data-id');     // Clear the update state after submission
        } else {
            postData(formData);  // Otherwise, add a new driver
        }
    });
}

// Function to POST data (Add a new driver)
function postData(formData) {
    fetch(`${baseUrl}/drivers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log('Driver added:', data);
            fetchDrivers();  // Refresh the table after adding a driver
        })
        .catch((err) => console.error('Error:', err));
}

// Function to GET and display all drivers
function fetchDrivers() {
    fetch(`${baseUrl}/drivers`)
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.querySelector('#body');
            tableBody.innerHTML = '';  // Clear the table before appending new rows

            data.forEach((driver) => {
                displayDriver(driver);
            });
        })
        .catch((err) => console.error('Error fetching drivers:', err));
}

// Function to display a single driver in the table
function displayDriver(driver) {
    const tableBody = document.querySelector('#body');
    const row = document.createElement('tr');

    row.innerHTML = `
        <th scope="row">${driver.id}</th>
        <td>${driver.name}</td>
        <td>${driver.email}</td>
        <td>${driver.nationalId}</td>
        <td>${driver.location}</td>
        <td>${driver.truckPlate}</td>
        <td>${driver.datePicked}</td>
        <td>${driver.returnDate}</td>
        <td>
            <button type="button" class="btn btn-warning" id="update-${driver.id}">Update</button>
            <button type="button" class="btn btn-danger" id="delete-${driver.id}">Delete</button>
        </td>
    `;

    const updateButton = row.querySelector(`#update-${driver.id}`);
    updateButton.addEventListener('click', () => {
        populateFormForUpdate(driver);
    });

    const deleteButton = row.querySelector(`#delete-${driver.id}`);
    deleteButton.addEventListener('click', () => {
        deleteDriver(driver.id);
    });

    tableBody.appendChild(row);
}

// Function to DELETE a driver
function deleteDriver(driverId) {
    fetch(`${baseUrl}/drivers/${driverId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log('Driver deleted:', data);
            fetchDrivers();  // Refresh the table after deletion
        })
        .catch((err) => console.error('Error deleting driver:', err));
}

// Function to UPDATE a driver
function updateDriver(driverId, updatedData) {
    fetch(`${baseUrl}/drivers/${driverId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    })
        .then((res) => res.json())
        .then((data) => {
            console.log('Driver updated:', data);
            fetchDrivers();  // Refresh the table after updating a driver
        })
        .catch((err) => console.error('Error updating driver:', err));
}

// Function to populate the form with driver details for updating
function populateFormForUpdate(driver) {
    const form = document.querySelector('#driver-form');
    form.name.value = driver.name;
    form.email.value = driver.email;
    form['national-id'].value = driver.nationalId;
    form.location.value = driver.location;
    form['truck-plate'].value = driver.truckPlate;
    form['date-picked'].value = driver.datePicked;
    form['date-return'].value = driver.returnDate;

    form.dataset.id = driver.id;  // Store the driver ID for updating
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    fetchDrivers();  // Fetch and display all drivers on page load
    collectData();   // Collect form data and handle form submission
});
