import {initializeApp} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {getDatabase, onValue, ref} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyAeYUDXecF-kqVMZ_90iHFEfh4gP-fclWM",
    authDomain: "testiot-2d177.firebaseapp.com",
    databaseURL: "https://testiot-2d177-default-rtdb.firebaseio.com",
    projectId: "testiot-2d177",
    storageBucket: "testiot-2d177.appspot.com",
    messagingSenderId: "900432144588",
    appId: "1:900432144588:web:b1d0fe0d523e012264ba69",
    measurementId: "G-GSQ32P8TWY"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Element references
const humidityEl = document.getElementById("humidity");
const temperatureEl = document.getElementById("temperature");
const pieceCountEl = document.getElementById("pieceCount");
const operationTimeEl = document.getElementById("operationTime");
const productionTableBody = document.querySelector("#productionTable tbody");  // Reference to tbody
const temperatureHistoryEl = document.getElementById("temperatureHistory");
const tempWarningEl = document.getElementById("tempWarning");

// Helper function to format seconds into hours, minutes, and seconds
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h : ${minutes}m : ${remainingSeconds}s`;
}
function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notificationMessage");

    // Set the notification message
    notificationMessage.textContent = message;

    // Display the notification
    notification.classList.remove("hidden");
    notification.classList.add("visible");

    // Automatically hide the notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove("visible");
    }, 5000);
}

// Initialize counter for operation time
let operationTimeCounter = 0;
let operationTimeInterval;

const sensorRef = ref(database, "sensors");
const updateThreshold = 39603800; //
const currentTime = Date.now();
let lastUpdatedTime;

onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();

    // Get current timestamp


    // Update elements with two decimal places
    humidityEl.textContent = data.humidity !== null ? data.humidity.toFixed(2) : null;
    temperatureEl.textContent = data.temperature !== null ? data.temperature.toFixed(2) : null;
    pieceCountEl.textContent = data.piececount || null;

    const statusDiv1 = document.getElementById('sensor-status');
    const statusDiv2 = document.getElementById('sensor-status2');
    const statusDiv4 = document.getElementById('sensor-status4');

    lastUpdatedTime = new Date(data.datetime).getTime(); // Convert to milliseconds


    // Check if the sensors are responding and if they're within the threshold time
    const isPieceCountActive = data.piececount !== null && (currentTime - lastUpdatedTime < updateThreshold);
    const isHumidityActive = data.humidity !== null && (currentTime - lastUpdatedTime< updateThreshold);
    const isTemperatureActive = data.temperature !== null && (currentTime - lastUpdatedTime < updateThreshold);


    // Update piece count status
    if (isPieceCountActive) {
        statusDiv2.className = 'status-working';
        statusDiv2.textContent = 'Working Properly';
    } else {
        statusDiv2.className = 'status-stopped';
        statusDiv2.textContent = 'Stopped';
    }

    // Update humidity status
    if (isHumidityActive) {
        statusDiv4.className = 'status-working';
        statusDiv4.textContent = 'Working Properly';
    } else {
        statusDiv4.className = 'status-stopped';
        statusDiv4.textContent = 'Stopped';
    }

    // Update temperature status
    if (isTemperatureActive) {
        statusDiv1.className = 'status-working';
        statusDiv1.textContent = 'Working Properly';
    } else {
        statusDiv1.className = 'status-stopped';
        statusDiv1.textContent = 'Stopped';
    }


// Only update when operation time stops (as detected in your sensor onValue callback)
    if (currentTime - lastUpdatedTime >= updateThreshold) {

        clearInterval(operationTimeInterval);
        operationTimeEl.textContent = null;

    } else {

        if (data.operationtime !== null) {

           console.log("Sending operationTimeCounter:", operationTimeCounter);

            // Check for the specific condition
            if (operationTimeCounter > 7200 && operationTimeCounter < 7203) {
                // Call the function to show the notification
                showNotification("Repair the machine in another hour.");
            }

            clearInterval(operationTimeInterval);
            operationTimeCounter = data.operationtime;

            operationTimeInterval = setInterval(() => {
                operationTimeCounter++;
                operationTimeEl.textContent = formatTime(operationTimeCounter);
            }, 1000);
        }
    }

    // Display warning if the temperature is greater than 45°C
    if (data.temperature > 45) {
        tempWarningEl.style.display = "inline";
    } else {
        tempWarningEl.style.display = "none";
    }
});

const pieceCountHistoryEl = document.querySelector("#pieceCountHistoryEl");


// Historical piece count data listener
const pieceRef = ref(database, "pieces");
let data = []; // Array to hold the fetched data
let currentPage = 1;
const rowsPerPage = 7;

onValue(pieceRef, (snapshot) => {
    data = []; // Clear old data

    snapshot.forEach(dateSnapshot => {
        const date = dateSnapshot.key;
        const count = dateSnapshot.child("count").val();
        const datetime = dateSnapshot.child("datetime").val();

        // Store the data in the array
        data.push({ date, count, datetime });
    });

    renderTable(); // Render the table with the initial data
});

// Function to render the table with pagination
function renderTable() {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = data.slice(start, end);

    pieceCountHistoryEl.innerHTML = ""; // Clear existing rows

    paginatedItems.forEach(item => {
        // Create a new row
        const row = document.createElement("tr");

        // Create cells for date and count
        const dateCell = document.createElement("td");
        dateCell.textContent = item.date; // Set the date

        const countCell = document.createElement("td");
        countCell.textContent = item.count;

        // Append cells to the row
        row.appendChild(dateCell);
        row.appendChild(countCell);

        // Append the row to the table body
        pieceCountHistoryEl.appendChild(row);
    });

    updatePaginationControls();
}

// Function to update pagination controls
function updatePaginationControls() {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${totalPages}`;
    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

// Function to change the page
function changePage(direction) {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    if (direction === -1 && currentPage > 1) {
        currentPage--;
    } else if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    }
    renderTable();
}

// Initialize the pagination controls in your HTML
document.getElementById("paginationControls").innerHTML = `
    <button id="prevBtn" onclick="changePage(-1)">Previous</button>
    <span id="pageInfo"></span>
    <button id="nextBtn" onclick="changePage(1)">Next</button>
`;


window.onload = function () {

    console.log("temperaturechart.js loaded successfully");

    const chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Temperature (°C) Over 24 Hours"
        },
        axisX: {
            title: "Time (Hour)",
            interval: 1,
            labelFormatter: function (e) {
                return e.value + ":00";
            }
        },
        axisY: {
            title: "Temperature (°C)",
            minimum: 0,
            maximum: 100
        },
        data: [{
            type: "line",
            xValueFormatString: "Hour #",
            yValueFormatString: "#,##0°C",
            dataPoints: []
        }]
    });

    function updateChart(temperatureData) {
        console.log("Updating chart with data:", temperatureData);
        chart.options.data[0].dataPoints = temperatureData.map((temp, hour) => ({ x: hour, y: temp }));
        chart.render();
    }

    document.getElementById("datePicker").addEventListener("change", (event) => {
        const selectedDate = event.target.value;
        // Fetch and update the chart for the selected date
        fetchTemperatureData(selectedDate);
    });


    function fetchTemperatureData(selectedDate) {
        const tempRef = ref(database, `tempreture/${selectedDate}`);
        onValue(tempRef, (snapshot) => {
            const temperatureData = Array(24).fill(0);
            const temperatureCount = Array(24).fill(0);

            snapshot.forEach(timeSnapshot => {
                const timeKey = timeSnapshot.key;
                const hour = parseInt(timeKey.split(':')[0]);
                const temperature = timeSnapshot.child("tempreture").val();

                // Sum temperatures for the hour
                if (hour >= 0 && hour < 24) {
                    temperatureData[hour] += temperature;
                    temperatureCount[hour] += 1;
                }
            });

            // Calculate average temperatures for each hour
            for (let i = 0; i < 24; i++) {
                if (temperatureCount[i] > 0) {
                    temperatureData[i] /= temperatureCount[i];
                } else {
                    temperatureData[i] = 0;
                }
            }

            updateChart(temperatureData);
        });
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    document.getElementById("datePicker").value = formattedDate;
    fetchTemperatureData(formattedDate);

};
