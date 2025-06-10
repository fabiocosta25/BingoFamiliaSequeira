document.addEventListener("DOMContentLoaded", function () {
    const bingoTable = document.getElementById("bingo-table").querySelector("tbody");
    const selectedList = document.getElementById("selected-list");
    const resetButton = document.getElementById("reset-button");
    const fullscreenButton = document.getElementById("fullscreen-button");
    const bingoAnimationButton = document.getElementById("bingo-animation-button");
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
        selectedNumbers.forEach((number, index) => {
            let listItem = document.createElement("li");
            listItem.textContent = number;
            
            if (index % 2 === 0) {
                listItem.style.color = '#c82f1b'; 
            } else {
                listItem.style.color = '#f9d976'; 
            }
            selectedList.appendChild(listItem);
        });
        // Scroll to the last item added
        if (selectedList.lastChild) {
            selectedList.lastChild.scrollIntoView({ behavior: "smooth", inline: "end" });
        }
    }

    resetButton.addEventListener("click", function () {
        selectedNumbers = [];
        updateSelectedList();
        const cells = document.querySelectorAll("#bingo-table td");
        cells.forEach(cell => {
            cell.classList.remove("selected");
        });
    });

    fullscreenButton.addEventListener("click", function () {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                alert(`Erro ao tentar entrar em fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    });

    bingoAnimationButton.addEventListener("click", function () {
        let animationDiv = document.getElementById("bingo-animation");
        if (!animationDiv) {
            animationDiv = document.createElement("div");
            animationDiv.id = "bingo-animation";
            animationDiv.textContent = "BINGO!";
            animationDiv.style.position = "fixed";
            animationDiv.style.top = "50%";
            animationDiv.style.left = "50%";
            animationDiv.style.transform = "translate(-50%, -50%)";
            animationDiv.style.fontSize = "800px";
            animationDiv.style.background = "linear-gradient(to top, #ff0000, #ff7f00, #ffff00, #ffffff)";
            animationDiv.style.webkitBackgroundClip = "text";
            animationDiv.style.webkitTextFillColor = "transparent";
            animationDiv.style.backgroundClip = "text";
            animationDiv.style.color = "transparent";
            animationDiv.style.fontWeight = "bold";
            animationDiv.style.zIndex = "1000";
            animationDiv.style.opacity = "0";
            animationDiv.style.pointerEvents = "none";
            document.body.appendChild(animationDiv);
        }
        animationDiv.style.animation = "bingoFlash 1s ease-in-out 0s 4";
        animationDiv.style.opacity = "1";

        // Confetti effect container positioned relative to bingo animation
        const confettiContainer = document.createElement("div");
        confettiContainer.id = "confetti-container";
        confettiContainer.style.position = "fixed";
        confettiContainer.style.top = "0";
        confettiContainer.style.left = "0";
        confettiContainer.style.width = "100%";
        confettiContainer.style.height = "100%";
        confettiContainer.style.pointerEvents = "none";
        confettiContainer.style.zIndex = "1500";
        document.body.appendChild(confettiContainer);

        const colors = ['#ff0a54', '#ff477e', '#ff85a1', '#fbb1b1', '#f9bec7', '#f7cad0'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti");
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.animationDelay = (Math.random() * 3) + "s";
            confetti.style.animationDuration = (Math.random() * 3 + 2) + "s";
            confettiContainer.appendChild(confetti);
        }

        animationDiv.addEventListener("animationend", () => {
            animationDiv.style.opacity = "0";
            animationDiv.style.animation = "none";
            confettiContainer.remove();
        }, { once: true });
    });

    function createConfetti() {
        const confettiContainer = document.createElement("div");
        confettiContainer.id = "confetti-container";
        confettiContainer.style.position = "fixed";
        confettiContainer.style.top = "0";
        confettiContainer.style.left = "0";
        confettiContainer.style.width = "100%";
        confettiContainer.style.height = "100%";
        confettiContainer.style.pointerEvents = "none";
        confettiContainer.style.zIndex = "2000";
        document.body.appendChild(confettiContainer);

        const colors = ['#ff0a54', '#ff477e', '#ff85a1', '#fbb1b1', '#f9bec7', '#f7cad0'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti");
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.animationDelay = (Math.random() * 3) + "s";
            confetti.style.animationDuration = (Math.random() * 3 + 2) + "s";
            confettiContainer.appendChild(confetti);
        }

        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }
});
