
function logOut() {

    Swal.fire({
        title: 'Are you sure you want to logout?',
        text: "You will need to login again to access your account!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5dd042',
        cancelButtonColor: '#ff4646',
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "index.html";
        }
    });
}

window.onload = function () {
    console.log("temperaturechart.js loaded successfully");

    const sampleTemperatureData = {
        "2024-10-30": [80, 21, 20, 19, 19, 18, 20, 23, 26, 28, 29, 30, 31, 30, 29, 27, 26, 25, 24, 23, 22, 21, 20, 19],
        "2024-10-31": [20, 19, 18, 17, 18, 19, 22, 24, 27, 28, 29, 30, 32, 31, 30, 29, 27, 26, 25, 24, 22, 21, 20, 19]
    };

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

    function updateChart(selectedDate) {
        console.log("Updating chart for date:", selectedDate);
        const temperatureData = sampleTemperatureData[selectedDate] || Array(24).fill(0);

        chart.options.data[0].dataPoints = temperatureData.map((temp, hour) => ({ x: hour, y: temp }));
        chart.render();
        console.log("Chart updated with data:", chart.options.data[0].dataPoints);
    }

    document.getElementById("datePicker").addEventListener("change", (event) => {
        const selectedDate = event.target.value;
        updateChart(selectedDate);
    });

    // Initial chart render with a known date
    updateChart("2024-10-30");
};
