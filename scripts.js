let currentToken = 1;
const MAX_TOKENS = 3000;
const MAX_PERSONS_PER_PHONE = 6;
let phoneTokenCount = {};
const adminUsername = "Muruga";
const adminPassword = "Velmaral";

function generateToken() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const numberOfPersons = parseInt(document.getElementById('numberOfPersons').value);
    
    if (!phoneNumber) {
        alert("Please enter a mobile number.");
        return;
    }
    
    if (!numberOfPersons || isNaN(numberOfPersons)) {
        alert("Please select the number of persons.");
        return;
    }
    
    if (numberOfPersons > MAX_PERSONS_PER_PHONE) {
        alert("Maximum 6 persons per mobile number.");
        return;
    }
    
    const tokensIssued = phoneTokenCount[phoneNumber] || 0;
    
    if (tokensIssued + numberOfPersons > MAX_PERSONS_PER_PHONE) {
        alert("You have reached the limit of 6 tokens for this mobile number.");
        return;
    }
    
    if (currentToken + numberOfPersons > MAX_TOKENS) {
        alert("All tokens have been issued.");
        return;
    }
    
    let tokenNumbers = [];
    for (let i = 0; i < numberOfPersons; i++) {
        tokenNumbers.push(currentToken);
        currentToken++;
    }
    
    phoneTokenCount[phoneNumber] = (phoneTokenCount[phoneNumber] || 0) + numberOfPersons;
    alert(`Your tokens have been generated: ${tokenNumbers.join(', ')}`);
}

function showAdminLogin() {
    document.getElementById("userForm").style.display = "none";
    document.getElementById("adminLogin").style.display = "block";
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    if (username === adminUsername && password === adminPassword) {
        document.getElementById("adminLogin").style.display = "none";
        document.getElementById("adminDashboard").style.display = "block";
        displayTokenReport();
    } else {
        alert("Invalid login credentials.");
    }
}

function displayTokenReport() {
    const totalTokens = Object.values(phoneTokenCount).reduce((acc, val) => acc + val, 0);
    let reportHTML = `<p>Total Tokens Generated: ${totalTokens}</p><table border="1"><tr><th>Sl.no.</th><th>Mobile Number</th><th>Tokens Issued</th></tr>`;
    let i = 1;
    
    for (let phone in phoneTokenCount) {
        reportHTML += `<tr><td>${i++}</td><td>${phone}</td><td>${phoneTokenCount[phone]}</td></tr>`;
    }
    
    reportHTML += `</table>`;
    document.getElementById("tokenReport").innerHTML = reportHTML;
}

function generatePDFReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = new Date();
    const formattedDate = date.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: '2-digit', minute: '2-digit' });
    const totalTokens = Object.values(phoneTokenCount).reduce((acc, val) => acc + val, 0);
    
    doc.text(`Token Generated Report as of Date: ${formattedDate}`, 10, 10);
    doc.text(`Total Tokens Generated: ${totalTokens}`, 10, 20);
    
    let y = 30;
    doc.text("Sl.no.", 10, y);
    doc.text("Mobile Number", 40, y);
    doc.text("Tokens Issued", 130, y);
    y += 10;
    
    let i = 1;
    for (let phone in phoneTokenCount) {
        doc.text(String(i), 10, y);
        doc.text(phone, 40, y);
        doc.text(String(phoneTokenCount[phone]), 130, y);
        y += 10;
        i++;
    }
    
    doc.save(`Token_Report_${formattedDate.replace(/ /g, "_").replace(/:/g, "-")}.pdf`);
}
