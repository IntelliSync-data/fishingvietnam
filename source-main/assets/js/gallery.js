const MEDIA_API_BASE_URL = 'https://app.fishingvietnam.com';

// Resolve media URL: if path is absolute (starts with http/https),
//  return as is; if relative, prepend MEDIA_API_BASE_URL
function resolveMediaUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return MEDIA_API_BASE_URL + path;
}

// Open popup lightbox to show full media 
function openLightbox(item) {
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxContent = document.getElementById('lightbox-content');

    lightboxContent.innerHTML = '';

    if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = resolveMediaUrl(item.url);
        img.alt = item.name || 'Gallery image';
        img.className = 'lightbox-image';
        lightboxContent.appendChild(img);
    }
     else if (item.type === 'video') {
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'lightbox-video-wrapper';

        const video = document.createElement('video');
        video.className = 'lightbox-video';
        video.src = resolveMediaUrl(item.url);
        video.controls = true;
        video.autoplay = true;

        videoWrapper.appendChild(video);
        lightboxContent.appendChild(videoWrapper);
    }
     else if (item.type === 'youtube' || item.type === 'facebook') {
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'lightbox-video-wrapper';

        const iframe = document.createElement('iframe');
        iframe.className = 'lightbox-video';
        iframe.allowFullscreen = true;
        iframe.frameBorder = '0';

        if (item.type === 'youtube') {
            iframe.src = `https://www.youtube.com/embed/${item.external_url}?autoplay=1`;
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        } else {
            const encodedUrl = encodeURIComponent(item.external_url);
            iframe.src = `https://www.facebook.com/plugins/video.php?href=${encodedUrl}&show_text=false&autoplay=true`;
            iframe.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
        }

        videoWrapper.appendChild(iframe);
        lightboxContent.appendChild(videoWrapper);
    }

    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxContent = document.getElementById('lightbox-content');

    lightbox.style.display = 'none';
    lightboxContent.innerHTML = '';
    document.body.style.overflow = '';
}

// Render gallery items into the grid
// append = true: append new items to existing grid; false: clear old grid and render new items 
// -> same as in index.js 

function renderGallery(items, append = false) {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    if (!append) {
        galleryGrid.innerHTML = '';
    }

    items.forEach(item => {
    
        const isWide = item.display_size === 'medium' || item.display_size === 'large';

        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-img ${isWide ? 'large' : ''}`;
        galleryItem.style.cursor = 'pointer';

        
        const thumbSrc = item.type === 'image' ? item.url : item.thumbnail_url;
        if (thumbSrc) {
            const img = document.createElement('img');
            img.src = resolveMediaUrl(thumbSrc);
            img.alt = item.name || item.type;
            galleryItem.appendChild(img);
        }

        
        if (item.type !== 'image') {
            galleryItem.classList.add('video');

            const playIcon = document.createElement('div');
            playIcon.className = 'play-icon';
            playIcon.innerHTML = '▶';
            galleryItem.appendChild(playIcon);
        }

        galleryItem.addEventListener('click', () => openLightbox(item));

        galleryGrid.appendChild(galleryItem);
    });
}
