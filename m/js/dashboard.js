// Tentukan URL API yang sesuai dengan IP dan path yang benar
const apiUrl = 'http://192.168.58.102/APILAS/gen.php';  // Gantilah dengan URL API Anda

// Ambil username dari localStorage
const username = localStorage.getItem("username");

// Tampilkan username di navbar kiri
if (username) {
    document.getElementById("username").textContent = `Welcome, ${username}`;
} else {
    // Jika username tidak ada, arahkan kembali ke halaman login
    window.location.href = "../loginmanager.html";
}

// Menangani aksi klik tombol logout
document.getElementById("logoutBtn").addEventListener("click", function() {
    // Hapus username dari localStorage
    localStorage.removeItem("username");

    // Arahkan pengguna ke halaman login
    window.location.href = "../loginmanager.html";
});

function showContent(menu) {
    const contentArea = document.getElementById('contentArea');
    
    if (menu === 'dashboard') {
        fetch('db.html')
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('File not found');
            })
            .then(data => {
                contentArea.innerHTML = data;
            })
            .catch(error => {
                contentArea.innerHTML = '<p>Error loading content: ' + error.message + '</p>';
            });
    } else if (menu === 'stock') {
        contentArea.innerHTML = `
            <h2>Stock List</h2>
            <table id="stockTable" class="table-common table-stock">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Kode Barang</th>
                        <th>Nama Barang</th>
                        <th>Merk</th>
                        <th>Type</th>
                        <th>Jumlah</th>
                        <th>Satuan</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;

        // Fetch data dari API
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const tableBody = document.querySelector('#stockTable tbody');
                    tableBody.innerHTML = '';

                    data.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.id}</td>
                            <td>${item.kode_barang}</td>
                            <td>${item.nama_barang}</td>
                            <td>${item.merk}</td>
                            <td>${item.type}</td>
                            <td>${item.jumlah}</td>
                            <td>${item.satuan}</td>
                            <td>${item.created_at}</td>
                            <td>${item.updated_at}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    console.error('Data yang diterima bukan array');
                }
            })
            .catch(error => {
                contentArea.innerHTML += '<p>Error fetching data: ' + error.message + '</p>';
            });
    } else if (menu === 'request') {
        contentArea.innerHTML = '<h2>Request List</h2><p>This is the request list content.</p>';
    } else if (menu === 'history') {
        contentArea.innerHTML = '<h2>History Approval</h2><p>This is the history approval content.</p>';
    }
}

// Memastikan konten dashboard ditampilkan pertama kali saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    showContent('dashboard');
});

// Menangani aksi klik untuk setiap menu
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');

    // Fungsi untuk mengatur kelas aktif
    function setActiveLink(link) {
        // Hapus kelas 'active' dari semua link
        navLinks.forEach(function(navLink) {
            navLink.classList.remove('active');
        });

        // Tambahkan kelas 'active' pada link yang diklik
        link.classList.add('active');
    }

    // Tambahkan event listener pada setiap link
    navLinks.forEach(function(navLink) {
        navLink.addEventListener('click', function() {
            // Set link yang diklik menjadi aktif
            setActiveLink(navLink);
            // Panggil fungsi showContent untuk mengganti konten
            showContent(navLink.getAttribute('onclick').replace("showContent('", "").replace("')", ""));
        });
    });

    // Set default active link (Dashboard)
    const defaultLink = document.querySelector('a[onclick="showContent(\'dashboard\')"]');
    setActiveLink(defaultLink);  // Set link Dashboard sebagai aktif pertama kali
    showContent('dashboard'); // Tampilkan konten Dashboard pertama kali
});
