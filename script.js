document.addEventListener("DOMContentLoaded", function () {
    const bingoTable = document.getElementById("bingo-table").querySelector("tbody");
    const selectedList = document.getElementById("selected-list");
    const resetButton = document.getElementById("reset-button");
    let selectedNumbers = [];

    // Cria a tabela de Bingo
    for (let i = 0; i < 5; i++) {
        let row = document.createElement("tr");
        for (let j = 1; j <= 15; j++) {
            let cell = document.createElement("td");
            let number = i * 15 + j;
            cell.textContent = number;
            cell.addEventListener("click", function () {
                if (!cell.classList.contains("selected")) {
                    cell.classList.add("selected");
                    selectedNumbers.push(number);
                } else {
                    cell.classList.remove("selected");
                    selectedNumbers = selectedNumbers.filter(n => n !== number);
                }
                updateSelectedList();
            });
            row.appendChild(cell);
        }
        bingoTable.appendChild(row);
    }

    function updateSelectedList() {
        selectedList.innerHTML = "";
        selectedNumbers.forEach(number => {
            let listItem = document.createElement("li");
            listItem.textContent = number;
            selectedList.appendChild(listItem);
        });
    }

    resetButton.addEventListener("click", function () {
        selectedNumbers = [];
        updateSelectedList();
        const cells = document.querySelectorAll("#bingo-table td");
        cells.forEach(cell => {
            cell.classList.remove("selected");
        });
    });
});
