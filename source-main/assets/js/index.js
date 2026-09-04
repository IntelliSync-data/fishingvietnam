document.addEventListener('DOMContentLoaded', function() {
    const tabsContainer = document.querySelector('.gallery-tabs');
    const gallerySentinel = document.getElementById('gallery-sentinel');

    const PAGE_LIMIT = 10; // số item load mỗi lần (trang đầu + mỗi lần scroll)

    // Current state 
    let currentCategoryId = null; // null = All, number = categoryId
    let currentPage = 1;
    let totalItems = 0;   // get from API 
    let loadedCount = 0; 
    let isLoading = false; // wait for API response

    //GET /api/v1/media?page=&limit=&categoryId=
    async function fetchMedia(categoryId, page) {
        const params = new URLSearchParams({ page, limit: PAGE_LIMIT });
        if (categoryId) params.set('categoryId', categoryId);

        const response = await fetch(`https://app.fishingvietnam.com/api/v1/media?${params.toString()}`);
        return response.json();
    }

    // Change categories
    async function loadCategory(categoryId) {
        currentCategoryId = categoryId;
        currentPage = 1;
        loadedCount = 0;
        totalItems = 0;

        try {
            const result = await fetchMedia(currentCategoryId, currentPage);
            totalItems = result.meta.total;
            loadedCount = result.data.length;
            renderGallery(result.data, false); // append : false, delete old grid, render new grid
        } catch (error) {
            console.error('Error loading media:', error);
        }
    }

    // Scroll bottom
    async function loadMoreMedia() {
        if (isLoading || loadedCount >= totalItems) return; // loading or all items loaded, skip
        isLoading = true;

        try {
            currentPage += 1;
            const result = await fetchMedia(currentCategoryId, currentPage);
            loadedCount += result.data.length;
            renderGallery(result.data, true); // append : true , append new items to existing grid
        } catch (error) {
            console.error('Error loading more media:', error);
        } finally {
            isLoading = false;
        }
    }

    // gallerySentinel
    if (gallerySentinel) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMoreMedia();
            }
        }, { rootMargin: '200px' }); // trigger soon before reaching the sentinel

        observer.observe(gallerySentinel);
    }

    // Get categories and render tabs
    fetch('https://app.fishingvietnam.com/api/v1/categories')
        .then(response => response.json())
        .then(result => {
            const categories = result.data.sort((a, b) => a.sort_order - b.sort_order);

            const tabs = [
                { id: null, name: 'All' },
                ...categories.map(category => ({ id: category.id, name: category.name }))
            ];

            tabs.forEach((tab, index) => {
                const btn = document.createElement('button');
                btn.className = 'gallery-tab-btn';
                if (index === 0) btn.classList.add('selected');
                btn.textContent = tab.name;
                btn.dataset.categoryId = tab.id;

                btn.addEventListener('click', function() {
                    document.querySelectorAll('.gallery-tab-btn')
                        .forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');

                    loadCategory(tab.id); // load media for selected category
                });

                tabsContainer.appendChild(btn);
            });

            loadCategory(null); 
        })
        .catch(error => {
            console.error('Error fetching or processing:', error);
            tabsContainer.innerHTML = `<p style="color:red;">Cannot load categories: ${error.message}</p>`;
        });
});
