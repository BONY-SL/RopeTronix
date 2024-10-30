// Search function to filter the table
function search() {

    const selectedDate = document.getElementById("date").value;
    const pieceCountHistoryEl = document.getElementById("pieceCountHistoryEl");
    const rows = pieceCountHistoryEl.getElementsByTagName("tr");

    let totalPieces = 0; // Initialize total pieces count


    for (let row of rows) {
        const dateCell = row.cells[0];
        const countCell = row.cells[1];

        if (dateCell && countCell) {
            const date = dateCell.textContent;
            const count = parseInt(countCell.textContent);


            if (date === selectedDate) {
                row.style.display = "";
                totalPieces += count;
            } else {
                row.style.display = "none";
            }
        }
    }

    // Display the total pieces count
    const totalPiecesEl = document.getElementById("totalPieces");
    if (totalPieces > 0) {
        totalPiecesEl.textContent = `Total Pieces: ${totalPieces}`;
    } else {
        totalPiecesEl.textContent = `No pieces found for the selected date.`;
    }
}
