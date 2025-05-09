// Inisialisasi variabel waktu, sesi, dan status
let detik = 0; // Waktu dalam detik
let sesi = 1; // Nomor sesi saat ini
let longBreakTime; // Durasi istirahat panjang dalam detik
let isBreak = false; // Status apakah sedang istirahat

// Referensi elemen HTML
const timerView = document.getElementById("timerView");
const startBut = document.getElementById("startBTN");
const pauseBut = document.getElementById("pauseBTN");
const nextBut = document.getElementById("next");
const inputLbreak = document.getElementById("lbreak");
const sessionView = document.getElementById("session");

let timerInterval; // Menyimpan interval timer

// Fungsi untuk memperbarui tampilan timer
const updateTimer = () => {
    let visualTime = `${Math.floor(detik / 60).toString().padStart(2, '0')}:${(detik % 60).toString().padStart(2, '0')}`;
    timerView.innerHTML = visualTime;
}
updateTimer(); // Inisialisasi tampilan timer

// Fungsi untuk memulai countdown timer
function startTimer() {
    updateTimer();
    if (timerInterval) return; // Jika sudah berjalan, jangan buat ulang

    timerInterval = setInterval(() => {
        if (detik == 0) {
            // Jika waktu habis, hentikan dan lanjut ke sesi berikutnya
            clearInterval(timerInterval);
            timerInterval = null;
            detik = 0;
            updateTimer();
            nextSession();
        } else {
            detik--; // Kurangi waktu
        }
        updateTimer();
    }, 1000);
}

// Fungsi untuk memulai siklus Pomodoro pertama
function startPomodoro() {
    if (inputLbreak.value == 0) {
        inputLbreak.value = 15; // Default 15 menit jika kosong
    }
    longBreakTime = inputLbreak.value * 60; // Konversi ke detik
    detik = 1500; // Set 25 menit sesi kerja
    timerView.style.backgroundColor = "#F00"; // Warna untuk sesi kerja
    startTimer();
}

// Fungsi untuk melanjutkan ke sesi berikutnya (kerja atau istirahat)
function nextSession() {
    stopTimer();
    if (isBreak) {
        // Jika sebelumnya istirahat, lanjut ke sesi kerja
        isBreak = false;
        detik = 1500;
        startTimer();
        sesi++;
        sessionView.innerHTML = `SESSION #${sesi}`;
        timerView.style.backgroundColor = "#F00";
    } else {
        // Jika sebelumnya kerja, masuk ke sesi istirahat
        breakTime();
    }
}

// Fungsi untuk mengatur waktu istirahat
function breakTime() {
    if (sesi % 4 == 0) {
        // Istirahat panjang setiap 4 sesi
        detik = longBreakTime;
        timerView.style.backgroundColor = "#00FF00";
        sessionView.innerHTML = "LONG BREAK";
    } else {
        // Istirahat pendek
        detik = 300; // 5 menit
        timerView.style.backgroundColor = "#FFDD00";
        sessionView.innerHTML = "SHORT BREAK";
    }
    startTimer();
    isBreak = true;
}

// Fungsi untuk menghentikan timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    detik = 0;
    sessionView.innerHTML = `SESSION #${sesi}`;
    timerView.style.backgroundColor = "#FFF";
    updateTimer();
}

// Fungsi untuk menjeda timer
function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    updateTimer();
}

// Event listener untuk tombol START/STOP
startBut.addEventListener('click', () => {
    if (timerInterval) {
        // Jika sedang berjalan, hentikan
        startBut.innerHTML = "START";
        pauseBut.style.visibility = "hidden";
        nextBut.style.visibility = "hidden";
        sesi = 1;
        stopTimer();
    } else {
        // Jika tidak berjalan, mulai
        startBut.innerHTML = "STOP";
        pauseBut.style.visibility = "visible";
        nextBut.style.visibility = "visible";
        startPomodoro();
    }
});

// Variabel status jeda
let isPause = false;

// Event listener untuk tombol PAUSE/CONTINUE
pauseBut.addEventListener('click', function () {
    if (isPause) {
        // Lanjutkan timer
        isPause = false;
        this.innerHTML = "PAUSE";
        startTimer();
    } else {
        // Jeda timer
        isPause = true;
        this.innerHTML = "CONTINUE";
        pauseTimer();
    }
});

// Event listener untuk tombol NEXT (lanjut sesi berikutnya)
nextBut.addEventListener('click', nextSession);
