document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.querySelector(".sbtn");
    const startScreen = document.querySelector(".start-screen");
    const mainScreen = document.querySelector(".main-screen");
    const main = document.querySelector(".main");

    startButton.addEventListener("touchstart", function() {
        startButton.style.transform = "scale(0.8)";
    });

    startButton.addEventListener("touchend", function() {
        startButton.style.transform = "scale(1)";
        startScreen.style.display = "none";
        mainScreen.style.display = "flex";

        // Hide mainScreen after 3 seconds
        setTimeout(function() {
            mainScreen.style.display = "none";
            main.style.display = "flex";
        }, 3000);
    });
});
