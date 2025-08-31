// Tentukan URL API yang sesuai dengan IP dan path yang benar
const apiUrl = 'http://192.168.43.102/APILAS/gem.php';  // Gantilah dengan URL API Anda

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

        // Fetch data stok dari API
        fetch(`${apiUrl}?menu=stock`)
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
        contentArea.innerHTML = `
            <div class="table-container">
                <h2>Request Table</h2>
                <table id="requestTable" class="table-common table-stock">
                    <thead>
                        <tr>
                            <th>Kode Request</th>
                            <th>Nama Barang</th>
                            <th>Merk</th>
                            <th>Type</th>
                            <th>Pemohon</th>
                            <th>Jumlah</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
    
        async function loadRequestData() {
            try {
                const response = await fetch(apiUrl + '?menu=request');
                const requests = await response.json();
        
                // Filter hanya data yang statusnya 'pending'
                const pendingRequests = requests.filter(request => request.status === 'pending');
        
                const tableBody = document.querySelector('#requestTable tbody');
                tableBody.innerHTML = ""; // Hapus isi tabel sebelum memuat data baru
        
                // Tampilkan hanya request yang statusnya 'pending'
                pendingRequests.forEach(request => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${request.kode_request}</td>
                        <td>${request.nama_barang}</td>
                        <td>${request.merk}</td>
                        <td>${request.type}</td>
                        <td>${request.nama_pegawai}</td>
                        <td>${request.jumlah}</td>
                        <td>${request.status}</td>
                        <td>
                            <button class="action-btn approve-btn" data-id="${request.kode_request}">Approve</button>
                            <button class="action-btn reject-btn" data-id="${request.kode_request}">Reject</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
        
                // Menambahkan event listener untuk tombol Approve dan Reject
                document.querySelectorAll('.approve-btn').forEach(button => {
                    button.addEventListener('click', (e) => updateStatus(e.target.dataset.id, 'approved'));
                });
        
                document.querySelectorAll('.reject-btn').forEach(button => {
                    button.addEventListener('click', (e) => updateStatus(e.target.dataset.id, 'rejected'));
                });
            } catch (error) {
                console.error('Error loading request data:', error);
            }
        }
        
    
        async function updateStatus(kodeRequest, status) {
            try {
                const response = await fetch(apiUrl + '?status-update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ kode_request: kodeRequest, status: status }),
                });
        
                const result = await response.json();
                if (result.success) {
                    loadRequestData(); // Refresh tabel setelah update status
                } else {
                    alert('Gagal memperbarui status request: ' + result.message);
                }
            } catch (error) {
                console.error('Error updating status:', error);
            }
        }        
    
        // Load data request saat halaman dimuat
        loadRequestData();
    }

    else if (menu === 'history') {
        contentArea.innerHTML = `
            <h2>History Request</h2>
            <table id="completeRequestTable" class="table-common table-stock">
                <thead>
                    <tr>
                        <th>Kode Request</th>
                        <th>Kode Barang</th>
                        <th>Nama Barang</th>
                        <th>Merk</th>
                        <th>Type</th>
                        <th>Pemohon</th>
                        <th>Jumlah</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>`;
    
        // Fetch data request lengkap dari API
        fetch(`${apiUrl}?menu=history`)
            .then(response => response.json())
            .then(data => {
                const tableBody = document.querySelector('#completeRequestTable tbody');
                tableBody.innerHTML = '';
    
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.kode_request}</td>
                        <td>${item.kode_barang}</td>
                        <td>${item.nama_barang}</td>
                        <td>${item.merk}</td>
                        <td>${item.type}</td>
                        <td>${item.nama_pegawai}</td>
                        <td>${item.jumlah}</td>
                        <td>${item.status}</td>
                        <td>${item.created_at}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                contentArea.innerHTML += `<p>Error fetching data: ${error.message}</p>`;
            });
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
