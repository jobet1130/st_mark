class TestimonialsSection {
  constructor() {
    this.testimonialsContainer = $('.testimonials-container');
    this.init();
  }

  init() {
    // Check if testimonials are already present in the container
    const existingTestimonials = this.testimonialsContainer.find('.card');
    
    // If there are no existing testimonials, load them dynamically
    if (existingTestimonials.length === 0) {
      this.loadTestimonials();
    }
  }

  loadTestimonials() {
    // Show loading state
    this.showLoadingState();

    // Load testimonials data from API
    $.ajax({
      url: '/api/testimonials/',
      method: 'GET',
      dataType: 'json',
      success: (response) => {
        if (response.status === 'success' && Array.isArray(response.data) && response.data.length > 0) {
          this.renderTestimonials(response.data);
        } else {
          // If no data from API, show a message
          this.showNoTestimonialsMessage();
        }
      },
      error: (xhr, status, error) => {
        console.error('Error loading testimonials:', error);
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
    this.testimonialsContainer.html(html);
  }

  renderTestimonials(testimonials) {
    let html = '';
    
    testimonials.forEach((testimonial) => {
      html += `
        <div class="col-lg-4 col-md-6 col-12">
          <div class="card h-100 border-top-gold shadow-sm hover-shadow-elegant-hover transition-all duration-300 hover-lift">
            <div class="card-body d-flex flex-column">
              <div class="quote-icon text-gold mb-3">
                <i class="fas fa-quote-left fa-2x"></i>
              </div>
              <p class="card-text text-dark mb-4 flex-grow-1 fst-italic">
                "${testimonial.quote}"
              </p>
              <div class="border-top border-light pt-3 mt-auto">
                <p class="fw-bold mb-1">${testimonial.name}</p>
                <p class="text-muted small mb-0">${testimonial.role}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    // Wrap in a row for proper Bootstrap grid layout
    this.testimonialsContainer.html(`<div class="row g-4">${html}</div>`);
  }

  showNoTestimonialsMessage() {
    const html = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <h4>No Testimonials Available</h4>
          <p>There are currently no testimonials to display. Please check back later.</p>
        </div>
      </div>
    `;
    this.testimonialsContainer.html(html);
  }

  showErrorMessage() {
    const html = `
      <div class="col-12">
        <div class="alert alert-danger text-center">
          <h4>Testimonials Loading Error</h4>
          <p>Sorry, we're having trouble loading testimonials right now. Please try again later.</p>
        </div>
      </div>
    `;
    this.testimonialsContainer.html(html);
  }
}

// Initialize the testimonials section when document is ready
$(document).ready(function() {
  new TestimonialsSection();
});