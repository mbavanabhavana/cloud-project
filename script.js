// Load leaves from localStorage
let leaves = JSON.parse(localStorage.getItem("leaves")) || [];

/* ================= LOGIN SECTION ================= */

const roleSelect = document.getElementById("role");

if (roleSelect) {
  roleSelect.addEventListener("change", function () {
    if (this.value === "admin") {
      document.getElementById("studentLogin").style.display = "none";
      document.getElementById("adminLogin").style.display = "block";
    } else {
      document.getElementById("studentLogin").style.display = "block";
      document.getElementById("adminLogin").style.display = "none";
    }
  });
}

function login() {
  const role = document.getElementById("role").value;
  const errorMsg = document.getElementById("errorMsg");

  if (errorMsg) errorMsg.innerText = "";

  if (role === "admin") {
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    if (user === "admin" && pass === "admin123") {
      window.location.href = "admin.html";
    } else {
      if (errorMsg) errorMsg.innerText = "Invalid Admin Credentials";
    }
  } else {
    const reg = document.getElementById("studentReg").value.trim();

    if (reg === "") {
      if (errorMsg) errorMsg.innerText = "Please enter Register Number";
    } else {
      localStorage.setItem("currentStudent", reg);
      window.location.href = "apply.html";
    }
  }
}

/* ================= APPLY LEAVE SECTION ================= */

const leaveForm = document.getElementById("leaveForm");

if (leaveForm) {
  leaveForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const regno = document.getElementById("regno").value.trim();
    const reason = document.getElementById("reason").value.trim();
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const errorMsg = document.getElementById("errorMsg");

    if (errorMsg) errorMsg.innerText = "";

    if (!name || !regno || !reason || !fromDate || !toDate) {
      if (errorMsg) errorMsg.innerText = "All fields are required!";
      return;
    }

    if (toDate < fromDate) {
      if (errorMsg) errorMsg.innerText = "To Date must be after From Date!";
      return;
    }

    const newLeave = {
      name,
      regno,
      reason,
      fromDate,
      toDate,
      status: "Pending",
    };

    leaves.push(newLeave);
    localStorage.setItem("leaves", JSON.stringify(leaves));

    alert("Leave Applied Successfully!");
    leaveForm.reset();
  });
}

/* ================= STUDENT STATUS SECTION ================= */

const statusTable = document.getElementById("statusTable");

if (statusTable) {
  const currentStudent = localStorage.getItem("currentStudent");

  leaves.forEach((leave) => {
    if (leave.regno === currentStudent) {
      const row = statusTable.insertRow();

      row.insertCell(0).innerText = leave.reason;
      row.insertCell(1).innerText = leave.fromDate;
      row.insertCell(2).innerText = leave.toDate;

      const statusCell = row.insertCell(3);
      statusCell.innerText = leave.status;

      if (leave.status === "Approved") statusCell.style.color = "green";
      else if (leave.status === "Rejected") statusCell.style.color = "red";
      else statusCell.style.color = "orange";
    }
  });
}

/* ================= ADMIN SECTION ================= */

const adminTable = document.getElementById("adminTable");

if (adminTable) {
  leaves.forEach((leave, index) => {
    const row = adminTable.insertRow();

    row.insertCell(0).innerText = leave.name;
    row.insertCell(1).innerText = leave.regno;
    row.insertCell(2).innerText = leave.reason;
    row.insertCell(3).innerText = leave.fromDate;
    row.insertCell(4).innerText = leave.toDate;

    const statusCell = row.insertCell(5);
    statusCell.innerText = leave.status;

    if (leave.status === "Approved") statusCell.style.color = "green";
    else if (leave.status === "Rejected") statusCell.style.color = "red";
    else statusCell.style.color = "orange";

    const actionCell = row.insertCell(6);

    const approveBtn = document.createElement("button");
    approveBtn.innerText = "Approve";
    approveBtn.onclick = function () {
      leaves[index].status = "Approved";
      localStorage.setItem("leaves", JSON.stringify(leaves));
      location.reload();
    };

    const rejectBtn = document.createElement("button");
    rejectBtn.innerText = "Reject";
    rejectBtn.onclick = function () {
      leaves[index].status = "Rejected";
      localStorage.setItem("leaves", JSON.stringify(leaves));
      location.reload();
    };

    actionCell.appendChild(approveBtn);
    actionCell.appendChild(rejectBtn);
  });
}
