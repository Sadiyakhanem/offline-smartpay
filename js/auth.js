
  const formTitle  = document.getElementById('formTitle');
  const toggleMode = document.getElementById('toggleMode');
  const form       = document.getElementById('authForm');
  const button     = form.querySelector('button');
  const phoneInput = document.getElementById('phone');

  let isLogin = true;

  toggleMode.onclick = () => {
    isLogin = !isLogin;
    formTitle.textContent = isLogin ? 'Login to SmartPay' : 'Signup for SmartPay';
    button.textContent    = isLogin ? 'Login' : 'Signup';
    toggleMode.innerHTML  = isLogin
      ? `Don't have an account? <span style="cursor:pointer; text-decoration: underline;">Signup</span>`
      : `Already have an account? <span style="cursor:pointer; text-decoration: underline;">Login</span>`;
    phoneInput.style.display = isLogin ? 'none' : 'block';
  };

  form.onsubmit = async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const phoneNumber = phoneInput.value.trim();

    if (!email || !password || (!isLogin && !phoneNumber)) {
      alert("Please fill all fields.");
      return;
    }

    const endpoint = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/signup';

    const payload = isLogin
      ? { email, password }
      : { username: email.split('@')[0], email, password, phoneNumber };

    try {
      const res  = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Something went wrong');

      alert(data.message);

      if (isLogin) {
        // ✅ save both for later pages
        localStorage.setItem("currentUser", data.user.email);
        localStorage.setItem("currentUserId", data.user._id);
        window.location.href = "dashboard.html";
      } else {
        toggleMode.click();           // switch back to login mode
        phoneInput.value = "";
      }
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

// GET /api/auth/history/:id  – return all populated transactions
router.get('/history/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'transactions',
        populate: [
          { path: 'sender',   select: 'username email' },
          { path: 'receiver', select: 'username email' }
        ]
      })
      .select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ transactions: user.transactions });
  } catch (err) {
    console.error('History Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
