// Mảng chứa dữ liệu gallery với phân loại image và video
const galleryData = [
    {
        image: 'assets/images/image-gallery-1.png',
        type: 'image',
        size: 'large'
    },
    {
        image: 'assets/images/image-gallery-2.png',
        link: 'https://www.facebook.com/ly.chisang/videos/2427851414223564?locale=vi_VN', // YouTube: Video ID | Facebook: Full video URL
        platform: 'facebook', // 'youtube' hoặc 'facebook'
        type: 'video',
        size: 'normal'
    },
    {
        image: 'assets/images/galery001.png',
        type: 'image',
        size: 'normal'
    },
    {
        image: 'assets/images/galery002.png',
        type: 'image',
        size: 'normal'
    },
    {
        image: 'assets/images/video00.png',
        link: 'https://www.facebook.com/watch/?v=1043086287842341', // YouTube: Video ID | Facebook: Full video URL
        platform: 'facebook', // 'youtube' hoặc 'facebook'
        type: 'video',
        size: 'normal'
    },
    {
        image: 'assets/images/galery003.png',
        type: 'image',
        size: 'large'
    },
    {
        image: 'assets/images/galery004.png',
        type: 'image',
        size: 'normal'
    },
    {
        image: 'assets/images/galery005.png',
        type: 'image',
        size: 'normal'
    },
    {
        image: 'assets/images/video03.png',
        link: 'https://www.facebook.com/ly.chisang/videos/1501066667720560?locale=vi_VN', // YouTube: Video ID | Facebook: Full video URL
        platform: 'facebook', // 'youtube' hoặc 'facebook'
        type: 'video',
        size: 'normal'
    },
    {
        image: 'assets/images/galery006.png',
        type: 'image',
        size: 'normal'
    },
    {
        image: 'assets/images/galery007.png',
        type: 'image',
        size: 'normal'
    },
    {
        image: 'assets/images/galery009.png',
        type: 'image',
        size: 'large'
    },
    {
        image: 'assets/images/galery008.png',
        type: 'image',
        size: 'normal'
    },
    {
        image: 'assets/images/video04.png',
        link: 'https://www.facebook.com/ly.chisang/videos/1280748250082587?locale=vi_VN', // Facebook: Full URL
        platform: 'facebook',
        type: 'video',
        size: 'normal'
    },
    {
        image: 'assets/images/galery010.png',
        type: 'image',
        size: 'normal'
    },
    {
        image: 'assets/images/galery011.png',
        type: 'image',
        size: 'large'
    },
    {
        image: 'assets/images/galery012.png',
        type: 'image',
        size: 'large'
    },
    {
        image: 'assets/images/galery013.png',
        type: 'image',
        size: 'normal'
    },
    {
        image: 'assets/images/galery014.png',
        type: 'image',
        size: 'normal'
    },
    {
        image: 'assets/images/video05.png',
        link: 'https://www.facebook.com/ly.chisang/videos/652405697841442?locale=vi_VN', // Facebook: Full URL
        platform: 'facebook',
        type: 'video',
        size: 'normal'
    },
    {
        image: 'assets/images/video06.png',
        link: 'https://www.facebook.com/ly.chisang/videos/1042292290739150?locale=vi_VN', // YouTube: Video ID | Facebook: Full video URL
        platform: 'facebook', // 'youtube' hoặc 'facebook'
        type: 'video',
        size: 'normal'
    },
    {
        image: 'assets/images/video09.png',
        link: 'https://www.facebook.com/ly.chisang/videos/1403700677592498?locale=vi_VN', // Facebook: Full URL
        platform: 'facebook',
        type: 'video',
        size: 'normal'
    },
    {
        image: 'assets/images/video08.png',
        link: 'https://www.facebook.com/ly.chisang/videos/1235197258278920?locale=vi_VN', // Facebook: Full URL
        platform: 'facebook',
        type: 'video',
        size: 'normal'
    },
    {
        image: 'assets/images/video07.png',
        link: 'https://www.facebook.com/ly.chisang/videos/1048677790438919?locale=vi_VN', // Facebook: Full URL
        platform: 'facebook',
        type: 'video',
        size: 'normal'
    },
    {
        image: 'assets/images/video10.png',
        link: 'https://www.facebook.com/ly.chisang/videos/1295813631491888?locale=vi_VN', // Facebook: Full URL
        platform: 'facebook',
        type: 'video',
        size: 'normal'
    },
    {
        image: 'assets/images/video11.png',
        link: 'https://www.facebook.com/ly.chisang/videos/1161762925335280?locale=vi_VN', // Facebook: Full URL
        platform: 'facebook',
        type: 'video',
        size: 'normal'
    },
    {
        image: 'assets/images/video_cap01.jpg',
        link: 'https://www.facebook.com/ly.chisang/videos/2294435874310730?locale=vi_VN', // YouTube: Video ID | Facebook: Full video URL
        platform: 'facebook', // 'youtube' hoặc 'facebook'
        type: 'video',
        size: 'normal'
    }
];

// Function mở popup lightbox
function openLightbox(item) {
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxContent = document.getElementById('lightbox-content');

    lightboxContent.innerHTML = '';

    if (item.type === 'image') {
        // Hiện image full screen
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = 'Gallery image';
        img.className = 'lightbox-image';
        lightboxContent.appendChild(img);
    } else if (item.type === 'video') {
        // Embed video based on platform
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'lightbox-video-wrapper';

        const iframe = document.createElement('iframe');
        iframe.className = 'lightbox-video';
        iframe.allowFullscreen = true;
        iframe.frameBorder = '0';

        if (item.platform === 'youtube') {
            // YouTube embed
            iframe.src = `https://www.youtube.com/embed/${item.link}?autoplay=1`;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        } else if (item.platform === 'facebook') {
            // Facebook embed
            const encodedUrl = encodeURIComponent(item.link);
            iframe.src = `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&autoplay=true`;
            iframe.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
        }

        videoWrapper.appendChild(iframe);
        lightboxContent.appendChild(videoWrapper);
    }

    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Function đóng popup lightbox
function closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxContent = document.getElementById('lightbox-content');

    lightbox.style.display = 'none';
    lightboxContent.innerHTML = '';
    document.body.style.overflow = '';
}

// Function render gallery grid
function renderGallery(filter = 'all') {
    const galleryGrid = document.querySelector('.gallery-grid');

    if (!galleryGrid) {
        return;
    }

    // Lọc data theo filter
    let filteredData = galleryData;

    // Chỉ lấy 7 item đầu tiên nếu đang ở trang index.html
    const isIndexPage = window.location.pathname.includes('index.html') ||
                        window.location.pathname.endsWith('/') ||
                        window.location.pathname.endsWith('/fishingvietnam.com');
    if (isIndexPage) {
        filteredData = filteredData.slice(0, 7);
    }

    if (filter !== 'all') {
        filteredData = filteredData.filter(item => item.type === filter);
    }

    // Clear grid hiện tại
    galleryGrid.innerHTML = '';

    // Render từng item
    filteredData.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-img ${item.size === 'large' ? 'large' : ''}`;
        galleryItem.style.cursor = 'pointer';

        // Tạo img element
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.type;

        // Nếu là video, thêm icon play
        if (item.type === 'video') {
            galleryItem.classList.add('video');

            // Thêm play icon overlay
            const playIcon = document.createElement('div');
            playIcon.className = 'play-icon';
            playIcon.innerHTML = '▶';
            galleryItem.appendChild(playIcon);
        }

        // Click để mở lightbox
        galleryItem.addEventListener('click', () => openLightbox(item));

        galleryItem.appendChild(img);
        galleryGrid.appendChild(galleryItem);
    });
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');

    // Render gallery ban đầu với tất cả items
    renderGallery('all');

    // Xử lý click tab
    galleryTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Xóa selected class khỏi tất cả tabs
            galleryTabBtns.forEach(b => b.classList.remove('selected'));

            // Thêm selected class vào tab được click
            this.classList.add('selected');

            // Lấy text của button để xác định filter
            const filterText = this.textContent.trim().toLowerCase();

            // Render lại gallery với filter tương ứng
            renderGallery(filterText);
        });
    });
});
