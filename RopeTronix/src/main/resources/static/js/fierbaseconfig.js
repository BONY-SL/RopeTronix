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

// Initialize counter for operation time
let operationTimeCounter = 0;
let operationTimeInterval;

// Real-time data listener
const sensorRef = ref(database, "sensors");
onValue(sensorRef, (snapshot) => {
    const data = snapshot.val();

    // Update elements with two decimal places
    humidityEl.textContent = data.humidity ? data.humidity.toFixed(2) : "N/A";
    temperatureEl.textContent = data.temperature ? data.temperature.toFixed(2) : "N/A";
    pieceCountEl.textContent = data.piececount || "N/A";

    // Initialize or reset operation time and start the counter
    if (data.operationtime) {
        clearInterval(operationTimeInterval);
        operationTimeCounter = data.operationtime;

        // Update and increment the operation time every second
        operationTimeInterval = setInterval(() => {
            operationTimeCounter++;
            operationTimeEl.textContent = formatTime(operationTimeCounter);
        }, 1000);
    } else {
        operationTimeEl.textContent = "N/A";
    }

    // Display warning if the temperature is greater than 45°C
    if (data.temperature > 29) {
        tempWarningEl.style.display = "inline";
    } else {
        tempWarningEl.style.display = "none";
    }
});

const pieceCountHistoryEl = document.querySelector("#pieceCountHistoryEl");


// Historical piece count data listener
const pieceRef = ref(database, "pieces");
onValue(pieceRef, (snapshot) => {
    pieceCountHistoryEl.innerHTML = "";  // Clear old data

    snapshot.forEach(dateSnapshot => {
        const date = dateSnapshot.key;
            const count = dateSnapshot.child("count").val();
            const datetime = dateSnapshot.child("datetime").val();

            console.log(date);
            console.log(count)

            // Create a new row
            const row = document.createElement("tr");

            // Create cells for date, time, and count
            const dateCell = document.createElement("td");
            dateCell.textContent = date;  // Set the date

            const countCell = document.createElement("td");
            countCell.textContent = count;

            // Append cells to the row
            row.appendChild(dateCell);
            row.appendChild(countCell);

            // Append the row to the table body
            pieceCountHistoryEl.appendChild(row);
    });
});

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

    // Fetch temperature data for a specific date
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