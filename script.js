// Initialize Carousels
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const carousel = card.querySelector('.carousel-container');
        const indicatorsContainer = card.querySelector('.carousel-indicators');
        const images = carousel.querySelectorAll('.project-img');

        if (images.length > 1) {
            // Create indicators
            images.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');

                dot.addEventListener('click', () => {
                    carousel.scrollTo({
                        left: carousel.clientWidth * index,
                        behavior: 'smooth'
                    });
                });

                indicatorsContainer.appendChild(dot);
            });

            // Update active indicator on scroll
            carousel.addEventListener('scroll', () => {
                const scrollLeft = carousel.scrollLeft;
                const width = carousel.clientWidth;
                // Calculate current index based on scroll position + half width for snapping feel
                const index = Math.round(scrollLeft / width);

                const dots = indicatorsContainer.querySelectorAll('.dot');
                dots.forEach((d, i) => {
                    if (i === index) {
                        d.classList.add('active');
                    } else {
                        d.classList.remove('active');
                    }
                });
            });
        }
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-lightbox');
    const zoomBtns = document.querySelectorAll('.zoom-btn');

    function openLightbox(imgSrc, captionText) {
        lightbox.style.display = 'flex'; // Use flex to center
        // Small timeout to allow display:flex to apply before adding visible class for animation
        setTimeout(() => {
            lightbox.classList.add('visible');
        }, 10);
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = captionText;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeLightboxFunc() {
        lightbox.classList.remove('visible');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
        }, 300); // Wait for animation
        document.body.style.overflow = '';
    }

    // Open Lightbox on Zoom Button Click
    zoomBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            // Find the currently visible image in the carousel
            // Or simplified: find the first one or calculate based on scroll.
            // Better: find the image that is currently "active" or visible.

            const carousel = card.querySelector('.carousel-container');
            const images = carousel.querySelectorAll('.project-img');
            const width = carousel.clientWidth;
            const scrollLeft = carousel.scrollLeft;
            const index = Math.round(scrollLeft / width);

            // Safety check if index is out of bounds (though it shouldn't be)
            const activeImage = images[index] || images[0];
            const caption = card.querySelector('.project-caption').textContent;

            openLightbox(activeImage.src, caption);
        });
    });

    // Support opening by double clicking the image itself
    const allImages = document.querySelectorAll('.carousel-container .project-img');
    allImages.forEach(img => {
        img.addEventListener('dblclick', () => {
            const card = img.closest('.project-card');
            const caption = card.querySelector('.project-caption').textContent;
            openLightbox(img.src, caption);
        });
    });

    closeBtn.addEventListener('click', closeLightboxFunc);

    // Close on click outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightboxFunc();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
            closeLightboxFunc();
        }
    });
});
