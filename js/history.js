// js/history.js  – SmartPay History Logic
//--------------------------------------------------

const userId = localStorage.getItem("currentUserId");

// ⛔ Not logged in → redirect
if (!userId) {
  alert("Please login first.");
  window.location.href = "auth.html";
}

// 🔄 Fetch all transactions for the current user
fetch(`http://localhost:5000/api/auth/history/${userId}`)
  .then(res => res.json())
  .then(({ transactions }) => {
    const list = document.getElementById("historyList");

    // No transactions
    if (!transactions || transactions.length === 0) {
      list.innerHTML = "<p>No transactions yet.</p>";
      return;
    }

    // Render each transaction (latest first)
    transactions.reverse().forEach(tx => {
      const card = document.createElement("div");
      card.className = "history-card";

      // Determine direction
      const isSent = tx.sender?._id?.toString() === userId.toString();
      const counterparty = isSent
        ? (tx.receiver?.email || tx.to || "Unknown")
        : (tx.sender?.email  || tx.from || "Unknown");

      // Fallback timestamp
      const timestamp = tx.time || tx.date || new Date(tx.createdAt || Date.now()).toLocaleString();

      card.innerHTML = `
        <p><strong>${isSent ? "To" : "From"}:</strong> ${counterparty}</p>
        <p><strong>Amount:</strong> ₹${tx.amount}</p>
        <p><strong>Date:</strong> ${timestamp}</p>
      `;

      list.appendChild(card);
    });
  })
  .catch(err => {
    console.error("History Fetch Error:", err);
    alert("❌ Could not load history.");
    window.location.href = "dashboard.html";
  });

// 🔒 Logout handler
document.getElementById("logout").onclick = () => {
  localStorage.removeItem("currentUserId");
  localStorage.removeItem("currentUser");
  window.location.href = "auth.html";
};
