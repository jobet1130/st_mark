class GallerySection {
  constructor() {
    this.galleryContainer = $('.gallery-container');
    this.init();
  }

  init() {
    // Check if gallery images are already present in the container
    const existingImages = this.galleryContainer.find('.gallery-item');
    
    // If there are no existing images, load them dynamically
    if (existingImages.length === 0) {
      this.loadGallery();
    }
  }

  loadGallery() {
    // Show loading state
    this.showLoadingState();

    // Load gallery data from API
    $.ajax({
      url: '/api/gallery/',
      method: 'GET',
      dataType: 'json',
      success: (response) => {
        if (response.status === 'success' && Array.isArray(response.data) && response.data.length > 0) {
          this.renderGallery(response.data);
        } else {
          // If no data from API, show a message
          this.showNoGalleryMessage();
        }
      },
      error: (xhr, status, error) => {
        console.error('Error loading gallery:', error);
        // If API fails, show a message
        this.showErrorMessage();
      }
    });
  }

  showLoadingState() {
    const html = `
      <div class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
    this.galleryContainer.html(html);
  }

  renderGallery(images) {
    let html = '';
    
    // Start the row for the grid layout
    html += '<div class="row g-4">';
    
    images.forEach((image, index) => {
      // Calculate Bootstrap column classes for responsive grid
      let colClass = 'col-md-6';
      if (images.length === 4) {
        colClass = 'col-lg-3 col-md-6';
      } else if (images.length === 3) {
        colClass = 'col-lg-4 col-md-6';
      }

      html += `
        <div class="${colClass} col-12">
          <div class="gallery-item rounded overflow-hidden position-relative cursor-pointer shadow-sm">
            <img src="${image.src}" alt="${image.alt}" class="w-100 h-100 object-fit-cover">
            <div class="gallery-overlay rounded">
              <p class="gallery-caption mb-0">${image.alt}</p>
            </div>
          </div>
        </div>
      `;
    });
    
    // Close the row
    html += '</div>';

    this.galleryContainer.html(html);
  }

  showNoGalleryMessage() {
    const html = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <h4>No Gallery Images Available</h4>
          <p>There are currently no gallery images to display. Please check back later.</p>
        </div>
      </div>
    `;
    this.galleryContainer.html(html);
  }

  showErrorMessage() {
    const html = `
      <div class="col-12">
        <div class="alert alert-danger text-center">
          <h4>Gallery Loading Error</h4>
          <p>Sorry, we're having trouble loading gallery images right now. Please try again later.</p>
        </div>
      </div>
    `;
    this.galleryContainer.html(html);
  }
}

// Initialize the gallery section when document is ready
$(document).ready(function() {
  new GallerySection();
});