// Load và inject footer component vào tất cả các trang
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer');

    if (!footerPlaceholder) {
        console.error('Footer placeholder not found');
        return;
    }

    // Fetch footer HTML
    fetch('components/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load footer');
            }
            return response.text();
        })
        .then(html => {
            footerPlaceholder.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
}

// Load footer khi DOM ready
document.addEventListener('DOMContentLoaded', loadFooter);
