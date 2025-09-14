const userId = localStorage.getItem("currentUserId");

if (!userId) {
  alert("Please login first.");
  window.location.href = "auth.html";
} else {
  fetch(`http://localhost:5000/api/auth/user/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) throw new Error(data.error);

      document.getElementById("userName").textContent = data.username;
      document.getElementById("balance").textContent = data.balance;
    })
    .catch(err => {
      console.error("Error fetching user:", err);
      alert("❌ " + err.message);
      localStorage.removeItem("currentUserId");
      window.location.href = "auth.html";
    });
}

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("currentUserId");
  window.location.href = "auth.html";
});
