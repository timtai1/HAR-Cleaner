// HAR Cleaner Web App - Client-side Logic

let sessionId = null;
let fqdnData = [];
let allURLs = [];
let filteredURLs = [];
let currentPage = 1;
let pageSize = 50;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeFileUpload();
});

// File Upload Handling
function initializeFileUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    // Click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', function(e) {
        if (this.files.length > 0) {
            uploadFile(this.files[0]);
        }
    });

    // Drag and drop
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    });
}

// Upload and analyze HAR file
function uploadFile(file) {
    if (!file.name.endsWith('.har')) {
        showAlert('danger', 'Please select a valid .har file');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    // Show progress
    document.getElementById('uploadProgress').classList.remove('d-none');
    document.getElementById('progressBar').style.width = '50%';
    document.getElementById('progressText').textContent = 'Analyzing HAR file...';

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showAlert('danger', data.error);
            document.getElementById('uploadProgress').classList.add('d-none');
        } else {
            // Success
            sessionId = data.session_id;
            fqdnData = data.fqdn_data;

            document.getElementById('progressBar').style.width = '100%';
            document.getElementById('progressText').textContent = 'Analysis complete!';

            setTimeout(() => {
                document.getElementById('uploadProgress').classList.add('d-none');
                showStep2(data);
            }, 500);
        }
    })
    .catch(error => {
        showAlert('danger', 'Error uploading file: ' + error.message);
        document.getElementById('uploadProgress').classList.add('d-none');
    });
}

// Show Step 2: FQDN Selection
function showStep2(data) {
    document.getElementById('step1').classList.add('d-none');
    document.getElementById('step2').classList.remove('d-none');

    document.getElementById('totalEntries').textContent = data.total_entries;

    const fqdnList = document.getElementById('fqdnList');
    fqdnList.innerHTML = '';

    fqdnData.forEach((item, index) => {
        const sizeKB = (item.total_size / 1024).toFixed(2);
        const sizeMB = (item.total_size / (1024 * 1024)).toFixed(2);
        const sizeDisplay = item.total_size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

        const div = document.createElement('div');
        div.className = 'fqdn-item';
        div.innerHTML = `
            <div class="d-flex align-items-center">
                <input type="checkbox" class="fqdn-checkbox me-3" id="fqdn_${index}"
                       value="${index}" checked onchange="updateFQDNSelection()">
                <label for="fqdn_${index}" class="flex-grow-1">
                    <div class="fqdn-domain">${item.fqdn}</div>
                    <div class="fqdn-stats">
                        <i class="bi bi-link-45deg"></i> ${item.count} requests
                        <span class="ms-3"><i class="bi bi-hdd"></i> ${sizeDisplay}</span>
                    </div>
                </label>
            </div>
        `;
        fqdnList.appendChild(div);
    });
}

// FQDN Selection Functions
function selectAllFQDNs() {
    document.querySelectorAll('.fqdn-checkbox').forEach(cb => cb.checked = true);
}

function deselectAllFQDNs() {
    document.querySelectorAll('.fqdn-checkbox').forEach(cb => cb.checked = false);
}

function updateFQDNSelection() {
    // Can be used to show live stats
}

// Proceed to URL selection
function proceedToURLs() {
    const selectedFQDNs = Array.from(document.querySelectorAll('.fqdn-checkbox:checked'))
        .map(cb => parseInt(cb.value));

    if (selectedFQDNs.length === 0) {
        showAlert('warning', 'Please select at least one domain');
        return;
    }

    // Collect all URLs from selected FQDNs
    allURLs = [];
    selectedFQDNs.forEach(index => {
        allURLs.push(...fqdnData[index].urls);
    });

    // Sort by size (descending)
    allURLs.sort((a, b) => b.size - a.size);

    // Show Step 3
    document.getElementById('step2').classList.add('d-none');
    document.getElementById('step3').classList.remove('d-none');

    filteredURLs = [...allURLs];
    renderURLList();
}

// URL List Functions
function renderURLList() {
    const urlList = document.getElementById('urlList');
    urlList.innerHTML = '';

    document.getElementById('totalURLs').textContent = filteredURLs.length;

    // Pagination
    const startIndex = pageSize === 'all' ? 0 : (currentPage - 1) * parseInt(pageSize);
    const endIndex = pageSize === 'all' ? filteredURLs.length : startIndex + parseInt(pageSize);
    const paginatedURLs = filteredURLs.slice(startIndex, endIndex);

    paginatedURLs.forEach(url => {
        const sizeKB = (url.size / 1024).toFixed(2);
        const sizeMB = (url.size / (1024 * 1024)).toFixed(2);
        const sizeDisplay = url.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

        const div = document.createElement('div');
        div.className = 'url-item';
        div.innerHTML = `
            <input type="checkbox" class="url-checkbox" value="${url.index}" checked
                   onchange="updateURLSelection()">
            <div class="url-info">
                <div class="url-text">
                    <span class="method-badge method-${url.method}">${url.method}</span>
                    <span class="ms-2">${url.url}</span>
                </div>
                <div class="url-meta">
                    Status: ${url.status} | Type: ${url.mimeType}
                </div>
            </div>
            <div class="url-size">${sizeDisplay}</div>
        `;
        urlList.appendChild(div);
    });

    updateURLSelection();
    renderPagination();
}

function renderPagination() {
    if (pageSize === 'all') {
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    const totalPages = Math.ceil(filteredURLs.length / parseInt(pageSize));
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    const ul = document.createElement('ul');
    ul.className = 'pagination';

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" onclick="changePage(${currentPage - 1})">Previous</a>`;
    ul.appendChild(prevLi);

    // Page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        const li = document.createElement('li');
        li.className = 'page-item';
        li.innerHTML = `<a class="page-link" onclick="changePage(1)">1</a>`;
        ul.appendChild(li);

        if (startPage > 2) {
            const dots = document.createElement('li');
            dots.className = 'page-item disabled';
            dots.innerHTML = `<span class="page-link">...</span>`;
            ul.appendChild(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" onclick="changePage(${i})">${i}</a>`;
        ul.appendChild(li);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('li');
            dots.className = 'page-item disabled';
            dots.innerHTML = `<span class="page-link">...</span>`;
            ul.appendChild(dots);
        }

        const li = document.createElement('li');
        li.className = 'page-item';
        li.innerHTML = `<a class="page-link" onclick="changePage(${totalPages})">${totalPages}</a>`;
        ul.appendChild(li);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" onclick="changePage(${currentPage + 1})">Next</a>`;
    ul.appendChild(nextLi);

    pagination.appendChild(ul);
}

function changePage(page) {
    const totalPages = Math.ceil(filteredURLs.length / parseInt(pageSize));
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderURLList();
    document.getElementById('urlList').scrollTop = 0;
}

function changePageSize() {
    pageSize = document.getElementById('pageSize').value;
    currentPage = 1;
    renderURLList();
}

function filterURLs() {
    const searchText = document.getElementById('urlSearch').value.toLowerCase();

    if (searchText === '') {
        filteredURLs = [...allURLs];
    } else {
        filteredURLs = allURLs.filter(url =>
            url.url.toLowerCase().includes(searchText)
        );
    }

    currentPage = 1;
    renderURLList();
}

function selectAllURLs() {
    document.querySelectorAll('.url-checkbox').forEach(cb => cb.checked = true);
    updateURLSelection();
}

function deselectAllURLs() {
    document.querySelectorAll('.url-checkbox').forEach(cb => cb.checked = false);
    updateURLSelection();
}

function updateURLSelection() {
    const selectedCount = document.querySelectorAll('.url-checkbox:checked').length;
    document.getElementById('selectedCount').textContent = selectedCount;
}

function backToFQDNs() {
    document.getElementById('step3').classList.add('d-none');
    document.getElementById('step2').classList.remove('d-none');
}

// Check file size before export
function checkFileSize() {
    const selectedIndices = Array.from(document.querySelectorAll('.url-checkbox:checked'))
        .map(cb => parseInt(cb.value));

    if (selectedIndices.length === 0) {
        showAlert('warning', 'No URLs selected');
        return;
    }

    fetch('/check_size', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session_id: sessionId,
            selected_indices: selectedIndices
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showAlert('danger', data.error);
        } else {
            const message = `
                <strong>File Size Check:</strong><br>
                Estimated size: <strong>${data.size_mb} MB</strong><br>
                Selected entries: <strong>${data.entry_count}</strong><br>
                Response bodies removed: <strong>${data.removed_bodies}</strong><br>
                ${data.exceeds_limit ?
                    '<span class="text-danger"><i class="bi bi-exclamation-triangle"></i> Exceeds 20MB limit for Invicti!</span>' :
                    '<span class="text-success"><i class="bi bi-check-circle"></i> Within 20MB limit</span>'}
            `;
            showAlert(data.exceeds_limit ? 'warning' : 'success', message);
        }
    })
    .catch(error => {
        showAlert('danger', 'Error checking file size: ' + error.message);
    });
}

// Export HAR file
function exportHAR() {
    const selectedIndices = Array.from(document.querySelectorAll('.url-checkbox:checked'))
        .map(cb => parseInt(cb.value));

    if (selectedIndices.length === 0) {
        showAlert('warning', 'Please select at least one URL to export');
        return;
    }

    fetch('/export', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session_id: sessionId,
            selected_indices: selectedIndices
        })
    })
    .then(response => {
        if (response.ok && response.headers.get('Content-Type') === 'application/json') {
            // Check if it's a warning response
            return response.json();
        } else if (response.ok) {
            // File download
            return response.blob().then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cleaned.har';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);

                showAlert('success', 'HAR file exported successfully!');
            });
        } else {
            return response.json().then(data => {
                throw new Error(data.error || 'Export failed');
            });
        }
    })
    .then(data => {
        if (data && data.warning) {
            showAlert('danger', data.message);
        }
    })
    .catch(error => {
        showAlert('danger', 'Error exporting file: ' + error.message);
    });
}

// Utility: Show alert
function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
