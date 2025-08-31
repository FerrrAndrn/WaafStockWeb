// Tentukan URL API yang sesuai dengan IP dan path yang benar
const apiUrl = 'http://192.168.43.102/APILAS/gen.php';  // Gantilah dengan URL API Anda

// Ambil username dari localStorage
const username = localStorage.getItem("username");

// Tampilkan username di navbar kiri
if (username) {
    document.getElementById("username").textContent = `Welcome, ${username}`;
} else {
    // Jika username tidak ada, arahkan kembali ke halaman login
    window.location.href = "../loginstaff.html";
}

// Menangani aksi klik tombol logout
document.getElementById("logoutBtn").addEventListener("click", function() {
    // Hapus username dari localStorage
    localStorage.removeItem("username");

    // Arahkan pengguna ke halaman login
    window.location.href = "../loginstaff.html";
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
            <h2>Form Request</h2>
            <div class="form-container">
                <form id="requestForm">
                    <input type="text" id="kode_request" name="kode_request" hidden>
                    <input type="text" id="kode_pegawai" name="kode_pegawai" required placeholder="Masukkan Kode Pegawai"><br><br>
                    <input type="text" id="kode_barang" name="kode_barang" required placeholder="Masukkan Kode Barang"><br><br>
                    <input type="number" id="jumlah" name="jumlah" required placeholder="Masukkan Jumlah"><br><br>
                    <button type="button" id="submitBtn">Submit</button>
                </form>
            </div>
    
            <div class="table-container">
                <h2>Request Table</h2>
                <table id="requestTable" class="table-common table-stock">
                    <thead>
                        <tr>
                            <th>Kode Request</th>
                            <th>Kode Pegawai</th>
                            <th>Kode Barang</th>
                            <th>Jumlah</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
    
            <!-- Modal Konfirmasi Penghapusan -->
            <div id="deleteModal" class="modal">
                <div class="modal-content">
                    <h3>Confirm Delete</h3>
                    <p>Are you sure to delete this request?</p>
                    <button id="confirmDeleteBtn" class="btn-ok">Yes, Delete</button>
                    <button id="cancelDeleteBtn" class="btn-cancel">Cancel</button>
                </div>
            </div>
    
            <!-- Modal Sukses -->
            <div class="modal modal-success">
                <div class="modal-content">
                    <p class="modal-message"></p>
                    <button class="btn-close-success">Ok</button>
                </div>
            </div>
        `;
    
        // Fungsi untuk memuat data dari server
        async function loadRequestData() {
            try {
                const response = await fetch(apiUrl + '?menu=request');
                const requests = await response.json();
    
                const tableBody = document.querySelector('#requestTable tbody');
                tableBody.innerHTML = ""; // Hapus isi tabel sebelum memuat data baru
    
                requests.forEach(request => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${request.kode_request}</td>
                        <td>${request.kode_pegawai}</td>
                        <td>${request.kode_barang}</td>
                        <td>${request.jumlah}</td>
                        <td>${request.status}</td>
                        <td>
                            <button class="action-btn edit-btn" data-id="${request.kode_request}">Edit</button>
                            <button class="action-btn delete-btn" data-id="${request.kode_request}">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
    
                // Tambahkan event listener untuk tombol Edit dan Delete
                document.querySelectorAll('.edit-btn').forEach(button => {
                    button.addEventListener('click', (e) => editRequest(e.target.dataset.id));
                });
    
                document.querySelectorAll('.delete-btn').forEach(button => {
                    button.addEventListener('click', (e) => showDeleteModal(e.target.dataset.id));
                });
            } catch (error) {
                console.error('Error loading request data:', error);
            }
        }
    
        // Fungsi untuk menampilkan modal konfirmasi
        function showDeleteModal(kodeRequest) {
            const modal = document.getElementById('deleteModal');
            modal.style.display = 'flex';
    
            // Set data-id pada tombol konfirmasi
            const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
            confirmDeleteBtn.setAttribute('data-id', kodeRequest);
        }
    
        // Fungsi untuk menyembunyikan modal
        function hideDeleteModal() {
            const modal = document.getElementById('deleteModal');
            modal.style.display = 'none';
        }
    
        // Fungsi untuk menghapus data dari server
        async function deleteRequest(kodeRequest) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ kode_request: kodeRequest })
                });
    
                const result = await response.json();
                if (result.success) {
                    loadRequestData(); // Refresh tabel setelah delete
                } else {
                    alert('Gagal menghapus request.');
                }
            } catch (error) {
                console.error('Error deleting request:', error);
            } finally {
                hideDeleteModal(); // Tutup modal setelah penghapusan
            }
        }
    
        // Event listener untuk tombol konfirmasi hapus
        document.getElementById('confirmDeleteBtn').addEventListener('click', (e) => {
            const kodeRequest = e.target.getAttribute('data-id');
            deleteRequest(kodeRequest);
        });
    
        // Event listener untuk tombol batal hapus
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            hideDeleteModal();
        });
    
        // Fungsi untuk menambahkan data dan menampilkan modal sukses
        document.getElementById('submitBtn').addEventListener('click', async () => {
            const kodePegawai = document.getElementById('kode_pegawai').value;
            const kodeBarang = document.getElementById('kode_barang').value;
            const jumlah = document.getElementById('jumlah').value;
            const kodeRequest = document.getElementById('kode_request').value;
    
            if (!kodePegawai || !kodeBarang || !jumlah) {
                alert('Semua field harus diisi.');
                return;
            }
    
            const data = {
                kode_pegawai: kodePegawai,
                kode_barang: kodeBarang,
                jumlah: parseInt(jumlah),
            };
    
            try {
                let result;
                if (kodeRequest) { // Update data
                    data.kode_request = kodeRequest;
                    const response = await fetch(apiUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                    result = await response.json();
                } else { // Tambah data baru
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                    result = await response.json();
                }
    
                if (result.success) {
                    // Tampilkan modal sukses
                    const modalSuccess = document.querySelector('.modal-success');
                    modalSuccess.style.display = 'flex';
                    document.querySelector('.modal-message').textContent = 'Request has been sent';
                    document.getElementById('requestForm').reset(); // Reset form
                    document.getElementById('submitBtn').textContent = 'Submit'; // Kembalikan tombol ke Submit
    
                    // Event listener untuk menutup modal sukses
                    document.querySelector('.btn-close-success').onclick = () => {
                        modalSuccess.style.display = 'none';
                        loadRequestData(); // Refresh tabel
                    };
                } else {
                    console.error('Gagal menambahkan data.');
                }
            } catch (error) {
                console.error('Error adding or updating data:', error);
            }
        });
    
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
