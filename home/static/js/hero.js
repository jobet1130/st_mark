class HeroSection {
  constructor() {
    this.init();
  }

  init() {
    $(document).ready(() => {
      this.bindEvents();
      this.loadDynamicContent();
    });
  }

  bindEvents() {
    // Handle button click events
    $('.btn-primary, .btn-warning').on('click', (e) => {
      this.handleButtonClick(e);
    });

    // Handle scroll indicator click
    $('.animate-bounce').on('click', () => {
      this.scrollToContent();
    });
  }

  handleButtonClick(event) {
    event.preventDefault();
    const button = $(event.currentTarget);
    const url = button.attr('href');
    
    // Send AJAX request with JSON response
    this.sendNavigationRequest(url)
      .done((response) => {
        if (response.status === 'success') {
          window.location.href = url;
        } else {
          this.handleError(response.message || 'Navigation failed');
        }
      })
      .fail((xhr, status, error) => {
        // Even if the request fails, we still navigate to maintain user experience
        console.warn('Navigation tracking failed, but proceeding with navigation:', error);
        window.location.href = url;
      });
  }

  sendNavigationRequest(url) {
    // Send AJAX request with JSON response
    return $.ajax({
      url: '/api/hero-navigation/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        destination: url,
        timestamp: new Date().toISOString()
      })
    });
  }

  loadDynamicContent() {
    // Load dynamic hero content via AJAX
    this.fetchHeroData()
      .done((response) => {
        if (response.status === 'success') {
          this.updateHeroContent(response.data);
        } else {
          console.warn('Failed to load dynamic hero content:', response.message);
        }
      })
      .fail((xhr, status, error) => {
        console.error('Hero content loading failed:', error);
      });
  }

  fetchHeroData() {
    // Fetch hero data with JSON response
    return $.ajax({
      url: '/api/hero-content/',
      method: 'GET',
      dataType: 'json'
    });
  }

  updateHeroContent(data) {
    // Update hero content with dynamic data
    if (data.title) {
      $('.display-3').html(data.title);
    }
    
    if (data.subtitle) {
      $('p.fs-3').text(data.subtitle);
    }
    
    // Use a more specific selector to only target hero section buttons
    if (data.buttonText) {
      $('.hero-section .btn-primary').html(`${data.buttonText} <i class="fas fa-arrow-right ms-2"></i>`);
    }
  }

  scrollToContent() {
    // Animate scroll to main content
    const target = $('main').offset().top - 70; // Account for fixed navbar
    
    $('html, body').animate({
      scrollTop: target
    }, 800, 'easeInOutCubic');
  }

  handleError(message) {
    // Handle errors with user feedback
    console.error('HeroSection Error:', message);
    
    // In a real implementation, you might show a notification to the user
    // For now, we'll just log the error
  }
}

// Initialize the hero section
$(document).ready(() => {
  window.heroSection = new HeroSection();
});