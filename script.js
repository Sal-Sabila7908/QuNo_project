// ================== DOCTORS DATA ==================
let doctors = [
    {
        id: 1,
        name: "Dr. Rafiqul Islam",
        specialty: "Cardiologist",
        hospital: "Square Hospital",
        img: "https://randomuser.me/api/portraits/men/32.jpg"},
    {
        id: 2,
        name: "Dr. Farzana Akter",
        specialty: "Dermatologist",
        hospital: "United Hospital",
        img: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        id: 3,
        name: "Dr. Abdullah Mamun",
        specialty: "Neurologist",
        hospital: "Evercare Hospital",
        img: "https://randomuser.me/api/portraits/men/45.jpg"
    }
];

let currentUser = null;
let selectedDoctor = null;
let currentRatingDoctor = null;

// ================== RATING SYSTEM ==================
function loadRatings() {
    return JSON.parse(localStorage.getItem('doctorRatings')) || {};
}

function saveRatings(ratings) {
    localStorage.setItem('doctorRatings', JSON.stringify(ratings));
}

function getDoctorRatings(doctorId) {
    let ratings = loadRatings();
    return ratings[doctorId] || { average: 0, count: 0, reviews: [] };
}

function addRating(doctorId, rating, comment, userName) {
    let ratings = loadRatings();
    
    if (!ratings[doctorId]) {
        ratings[doctorId] = { totalRating: 0, count: 0, average: 0, reviews: [] };
    }
    
    ratings[doctorId].totalRating += rating;
    ratings[doctorId].count++;
    ratings[doctorId].average = ratings[doctorId].totalRating / ratings[doctorId].count;
    
    ratings[doctorId].reviews.unshift({
        user: userName,
        rating: rating,
        comment: comment,
        date: new Date().toLocaleDateString()
    });

    if (ratings[doctorId].reviews.length > 5) ratings[doctorId].reviews.pop(); // keep only 5 recent
    
    saveRatings(ratings);
    return ratings[doctorId];
}

function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star" style="color: ${i <= Math.round(rating) ? '#f59e0b' : '#ddd'}"></i>`;
    }
    return stars;
}

// ================== BASIC FUNCTIONS ==================
function login() {
    let email = document.getElementById("email").value.trim();
    if (email) {
        currentUser = email.split('@')[0];
        showApp();
    } else {
        alert("Please enter email");
    }
}

function showApp() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    renderDoctors(doctors);
}

function logout() {
    location.reload();
}

// ================== RENDER DOCTORS ==================
function renderDoctors(data) {
    let grid = document.getElementById("doctorsGrid");
    grid.innerHTML = "";

    data.forEach(d => {
        let ratings = getDoctorRatings(d.id);
        let avg = ratings.average.toFixed(1);

        grid.innerHTML += `
        <div class="doctor-card">
            <div class="doctor-img" style="background-image:url('${d.img || 'https://via.placeholder.com/300x200'}')"></div>
            <div class="doctor-info">
                <h3>${d.name}</h3>
                <p>${d.specialty}</p>
                <p>${d.hospital}</p>
                
                <div class="rating-display">
                    ${renderStars(ratings.average)}
                    <span>(${avg} • ${ratings.count} reviews)</span>
                </div>

                <div class="reviews-section">
                    ${ratings.reviews.length ? 
                        ratings.reviews.slice(0,2).map(r => `
                            <small><strong>${r.user}</strong>: ${r.comment.substring(0,45)}...</small><br>
                        `).join('') : 
                        '<small style="color:#999">No reviews yet</small>'}
                </div>

                <button class="btn book-btn" onclick="openBookingModal(${d.id})">Book Appointment</button>
                <button class="rate-btn" onclick="openRatingModal(${d.id})">
                    <i class="fas fa-star"></i> Rate Doctor
                </button>
            </div>
        </div>`;
    });
}

// ================== BOOKING MODAL ==================
function openBookingModal(id) {
    selectedDoctor = doctors.find(d => d.id === id);
    document.getElementById("modalDoctorName").innerText = selectedDoctor.name;
    document.getElementById("modalSpecialty").innerText = selectedDoctor.specialty;
    document.getElementById("modalHospital").innerText = selectedDoctor.hospital;
    document.getElementById("appointmentModal").style.display = "flex";
    // let tomorrow = new Date();
    // tomorrow.setDate(tomorrow.getDate() + 1);
    // document.getElementById("apptDate").value = tomorrow.toISOString().split('T')[0];
}

function closeModal() {
    document.getElementById("appointmentModal").style.display = "none";
}

function confirmBooking() {
    let date = document.getElementById("apptDate").value;
    let time = document.getElementById("apptTime").value || "Not selected";
    
    if (!date) {
        alert("Please select a date");
        return;
    }

    alert(`✅ Appointment Confirmed!\n\nDoctor: ${selectedDoctor.name}\nDate: ${date}\nTime: ${time}\nPatient: ${currentUser}`);
    closeModal();
}

// ================== RATING MODAL ==================
function openRatingModal(id) {
    // if (!currentUser) {
    //     alert("Please login first to rate!");
    //     return;
    // }
    currentRatingDoctor = doctors.find(d => d.id === id);
    document.getElementById("ratingDoctorName").innerText = currentRatingDoctor.name;
    document.getElementById("selectedRating").value = 0;
    document.getElementById("commentText").value = "";

    // Reset stars
    document.querySelectorAll('.star-rating i').forEach(star => {
        star.classList.remove('active', 'fa-solid');
        star.classList.add('fa-regular');
    });

    document.getElementById("ratingModal").style.display = "flex";
}

function setRating(rating) {
    document.getElementById("selectedRating").value = rating;
    
    document.querySelectorAll('.star-rating i').forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active', 'fa-solid');
            star.classList.remove('fa-regular');
        } else {
            star.classList.remove('active', 'fa-solid');
            star.classList.add('fa-regular');
        }
    });
}

function closeRatingModal() {
    document.getElementById("ratingModal").style.display = "none";
}

function submitRating() {
    let rating = parseInt(document.getElementById("selectedRating").value);
    let comment = document.getElementById("commentText").value.trim();

    if (rating === 0) {
        alert("Please select stars (1-5)");
        return;
    }
    if (!comment) {
        alert("Please write a comment");
        return;
    }

    addRating(currentRatingDoctor.id, rating, comment, currentUser);
    
    alert(`Thank you! You rated ${currentRatingDoctor.name} with ${rating} stars.`);

    closeRatingModal();
    renderDoctors(doctors);   // Refresh to show new rating
}