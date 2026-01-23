// ===============================
// RESERVATIONS APP
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    console.log("app.js loaded correctly");

    const form = document.getElementById("reservationForm");
    const listContainer = document.getElementById("reservationsList");

    // ===============================
    // STATE
    // ===============================
    let reservations = [];

    // ===============================
    // LOCAL STORAGE
    // ===============================
    function saveToLocalStorage() {
        localStorage.setItem("reservations", JSON.stringify(reservations));
    }

    function loadFromLocalStorage() {
        const storedReservations = localStorage.getItem("reservations");
        if (storedReservations) {
            reservations = JSON.parse(storedReservations);
            renderReservations();
        }
    }

    loadFromLocalStorage();

    // ===============================
    // FORM SUBMIT
    // ===============================
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const people = document.getElementById("people").value;
        const type = document.getElementById("type").value;

        // ===============================
        // VALIDATIONS
        // ===============================
        if (name.length < 3) {
            alert("Name must have at least 3 characters");
            return;
        }

        if (!/^\d{8,}$/.test(phone)) {
            alert("Phone must contain at least 8 numbers");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert("Invalid email format");
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        if (date < today) {
            alert("Date cannot be in the past");
            return;
        }

        if (time < "08:00" || time > "22:00") {
            alert("Time must be between 08:00 and 22:00");
            return;
        }

        if (people < 1 || people > 10) {
            alert("Number of people must be between 1 and 10");
            return;
        }

        if (type === "") {
            alert("Please select a reservation type");
            return;
        }

        // ===============================
        // CREATE RESERVATION
        // ===============================
        const reservation = {
            id: Date.now(), // unique ID
            name,
            date,
            time,
            people,
            type
        };

        reservations.push(reservation);
        saveToLocalStorage();
        renderReservations();

        form.reset();
    });

    // ===============================
    // DELETE RESERVATION
    // ===============================
    function deleteReservation(id) {
        reservations = reservations.filter(res => res.id !== id);
        saveToLocalStorage();
        renderReservations();
    }

    // ===============================
    // RENDER RESERVATIONS
    // ===============================
    function renderReservations() {
        if (reservations.length === 0) {
            listContainer.innerHTML = "No reservations yet.";
            return;
        }

        let html = `
            <table class="reservations-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>People</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        reservations.forEach((res) => {
            html += `
                <tr>
                    <td>${res.name}</td>
                    <td>${res.date}</td>
                    <td>${res.time}</td>
                    <td>${res.people}</td>
                    <td>${res.type}</td>
                    <td>
                        <button class="boton delete-btn" data-id="${res.id}">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        listContainer.innerHTML = html;

        // Attach delete events
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", () => {
                const id = Number(button.dataset.id);
                deleteReservation(id);
            });
        });
    }
});
