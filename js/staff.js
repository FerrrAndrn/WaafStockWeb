const apiUrl = 'http://10.40.255.102/APILAS/api.php'; // URL API server

// Fungsi untuk menangani login
async function handleLogin(e) {
    e.preventDefault(); // Mencegah submit form default

    const username = document.getElementById('usernameLogin').value.trim();
    const password = document.getElementById('passwordLogin').value.trim();
    const loginMessage = document.getElementById('loginMessage');

    // Periksa apakah username dan password kosong
    if (!username || !password) {
        loginMessage.textContent = 'Harap isi username dan password!';
        loginMessage.style.display = 'block';
        return;
    }

    try {
        // Kirim data login ke server
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'login_manager',
                username: username,
                password: password
            })
        });

        const result = await response.json();

        console.log(result); // Debug log untuk melihat respons API

        // Jika login gagal (username atau password salah)
        if (!response.ok || !result.success) {
            loginMessage.textContent = result.message || 'Username atau password salah!';
            loginMessage.style.display = 'block';
            return;
        }

        // Jika login berhasil, simpan username di localStorage
        localStorage.setItem("username", username); // Menyimpan username

        // Cek role pengguna setelah login berhasil
        if (result.role === 'staff') {
            // Jika role = staff, arahkan ke dashboard
            window.location.href = 'staff/dashboard.html'; // Redirect ke dashboard staff
        } else if (result.role === 'manager') {
            // Jika role = manager, tampilkan pop-up
            showPopup();
        }
    } catch (error) {
        loginMessage.textContent = error.message;
        loginMessage.style.display = 'block';
    }
}

// Fungsi untuk menampilkan pop-up
function showPopup() {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <div class="popup-content">
            <p>Anda bukan staff, tolong login dengan akun staff</p>
            <button class="btn btn-navy" id="popupOkBtn">OK</button>
        </div>
    `;

    document.body.appendChild(popup);

    // Tambahkan event listener untuk menutup pop-up
    document.getElementById('popupOkBtn').addEventListener('click', () => {
        popup.remove(); // Hapus pop-up setelah tombol OK diklik
    });
}

// Tambahkan event listener untuk form login
document.getElementById('loginForm').onsubmit = handleLogin;
