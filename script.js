const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ตัวแปรฟิสิกส์
let simulationRunning = false;
let t = 0; // เวลา
let startX = 50;
let startY = canvas.height - 50;
let x = startX;
let y = startY;

// ตัวแปรอินพุต
let u = 50; // ความเร็วต้น
let theta = 45; // มุม
let g = 9.8; // แรงโน้มถ่วง

// อัปเดตตัวเลขเมื่อเลื่อนเมาส์
document.getElementById('velocity').oninput = function() {
    u = parseFloat(this.value);
    document.getElementById('valV').innerText = u;
}
document.getElementById('angle').oninput = function() {
    theta = parseFloat(this.value);
    document.getElementById('valA').innerText = theta;
}
document.getElementById('gravity').oninput = function() {
    g = parseFloat(this.value);
    document.getElementById('valG').innerText = g;
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // วาดพื้น
    ctx.fillStyle = "#e94560";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    // รีเซ็ตตัวแปร
    simulationRunning = false;
    t = 0;
    x = startX;
    y = startY;
}

function fireProjectile() {
    simulationRunning = true;
    t = 0;
    gameLoop();
}

function gameLoop() {
    if (!simulationRunning) return;

    // --- สูตรฟิสิกส์ (Physics Engine) ---
    // แปลงมุมเป็นเรเดียน
    let rad = theta * (Math.PI / 180);
    
    // ux = u * cos(theta)
    // uy = u * sin(theta)
    let ux = u * Math.cos(rad);
    let uy = u * Math.sin(rad);

    // สูตรการเคลื่อนที่แนวราบ: sx = ux * t
    x = startX + (ux * t);

    // สูตรการเคลื่อนที่แนวดิ่ง: sy = uy * t - 0.5 * g * t^2
    // (หมายเหตุ: ใน Canvas แกน Y ยิ่งมากยิ่งลงข้างล่าง จึงต้องใช้เครื่องหมายลบสลับกัน)
    y = startY - ((uy * t) - (0.5 * g * Math.pow(t, 2)));

    // วาดวัตถุ
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();

    // เช็คการชนพื้น
    if (y > canvas.height - 20) {
        simulationRunning = false;
        console.log("ตกถึงพื้นแล้ว!");
    }

    t += 0.15; // เพิ่มเวลา (Time Step)
    requestAnimationFrame(gameLoop);
}

// --- ระบบโจทย์ปัญหา (Quiz System) ---
const questions = [
    {
        text: "ถ้ายิงวัตถุด้วยความเร็ว 40 m/s ทำมุม 30 องศา วัตถุจะลอยนานกี่วินาที? (ใช้ g=10)",
        answer: 4 // t = 2*u*sin/g = 2*40*0.5/10 = 4
    },
    {
        text: "มุมใดที่ทำให้วัตถุไปได้ไกลที่สุด?",
        answer: 45
    }
];
let currentQ = 0;

function setMode(mode) {
    if(mode === 'quiz') {
        document.getElementById('quizSection').style.display = 'block';
        loadQuestion();
    } else {
        document.getElementById('quizSection').style.display = 'none';
    }
}

function loadQuestion() {
    document.getElementById('questionText').innerText = "โจทย์: " + questions[currentQ].text;
    document.getElementById('feedback').innerText = "";
}

function checkAnswer() {
    let userAns = parseFloat(document.getElementById('userAnswer').value);
    if(userAns === questions[currentQ].answer) {
        document.getElementById('feedback').innerText = "ถูกต้อง! เก่งมาก";
        document.getElementById('feedback').style.color = "#4CAF50";
    } else {
        document.getElementById('feedback').innerText = "ผิดครับ ลองคำนวณใหม่นะ";
        document.getElementById('feedback').style.color = "red";
    }
}

// เริ่มต้นวาดพื้นหลังครั้งแรก
resetCanvas();
