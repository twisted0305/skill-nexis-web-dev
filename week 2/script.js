/* =========================
   DIGITAL CLOCK
========================= */

function updateClock() {

    // Get the current date and time
    const now = new Date();

    // Get hours, minutes and seconds
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();


    // Add a leading zero when the number is below 10
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");


    // Display the time
    document.getElementById("clock").textContent =
        `${hours}:${minutes}:${seconds}`;


    // Format and display the current date
    const formattedDate = now.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });


    document.getElementById("date").textContent =
        formattedDate;
}


/* =========================
   NEW YEAR COUNTDOWN
========================= */

function updateCountdown() {

    // Get the current date and time
    const now = new Date();


    // Set the target date
    const newYear = new Date("January 1, 2027 00:00:00");


    // Calculate the difference
    const difference = newYear - now;


    // If the countdown has finished
    if (difference <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }


    // Convert milliseconds into days
    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );


    // Calculate remaining hours
    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );


    // Calculate remaining minutes
    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );


    // Calculate remaining seconds
    const seconds = Math.floor(
        (difference / 1000) % 60
    );


    // Display countdown values
    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}


/* =========================
   UPDATE EVERYTHING
========================= */

function updateEverything() {

    updateClock();

    updateCountdown();
}


/* =========================
   INITIAL UPDATE
========================= */

updateEverything();


/* =========================
   UPDATE EVERY SECOND
========================= */

setInterval(updateEverything, 1000);