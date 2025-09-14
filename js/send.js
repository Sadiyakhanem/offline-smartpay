const senderId = localStorage.getItem("currentUserId");

if (!senderId) {
  alert("Please login first.");
  window.location.href = "auth.html";
}

document.getElementById("sendForm").onsubmit = async (e) => {
  e.preventDefault();

  const receiverEmail = document.getElementById("receiver").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);

  if (!receiverEmail || isNaN(amount) || amount <= 0) {
    alert("⚠️ Enter valid receiver and amount.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderId,
        receiverEmail,
        amount,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Transaction failed");
    }

    alert("✅ ₹" + amount + " sent to " + receiverEmail);
    window.location.href = "dashboard.html";

  } catch (err) {
    alert("❌ " + err.message);
  }
};

function startScan() {
  const qrRegion = document.getElementById("reader");
  qrRegion.style.display = "block";
  qrRegion.innerHTML = "";

  const html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(cameras => {
    if (cameras && cameras.length) {
      html5QrCode.start(
        cameras[0].id,
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          document.getElementById("receiver").value = decodedText;
          html5QrCode.stop().then(() => {
            qrRegion.innerHTML = "";
            qrRegion.style.display = "none";
          });
        },
        (errorMessage) => {
          // optional: console.log(errorMessage);
        }
      );
    }
  }).catch(err => {
    alert("Camera access failed: " + err);
  });
}
