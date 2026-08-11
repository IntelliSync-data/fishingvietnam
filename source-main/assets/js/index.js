document.addEventListener('DOMContentLoaded', function() {
    const tabsContainer = document.querySelector('.gallery-tabs');

    fetch('https://app.fishingvietnam.com/api/v1/categories')
        .then(response => response.json())
        .then(result => {
            const categories = result.data.sort((a,b) => a.sort_order - b.sort_order);

            const tabs = [
                {id: null, name: 'All'},
                ...categories.map(category => ({id: category.id, name: category.name}))
                
            ];

            tabs.forEach((tab, index) => {
                const btn = document.createElement('button');
                btn.className = 'gallery-tab-btn';
                if (index == 0) btn.classList.add('selected');
                btn.textContent= tab.name;
                btn.dataset.categoryId = tab.id;

                btn.addEventListener('click', function() {
                    document.querySelectorAll('.gallery-tab-btn')
                        .forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');

                const id =this.dataset.categoryId;
                console.log('Chọn: ', this.textContent, 'ID:', id); 
            });

            tabsContainer.appendChild(btn);
        });
    });
});