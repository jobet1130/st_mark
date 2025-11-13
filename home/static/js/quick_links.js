/**
 * QuickLinks.js
 * Handles interactions for the quick links section with AJAX and JSON API responses
 */

class QuickLinks {
  constructor(options = {}) {
    this.apiUrl = options.apiUrl || '/api/quick-links-click/';
    this.init();
  }

  init() {
    $(document).ready(() => {
      this.bindEvents();
    });
  }

  bindEvents() {
    // Add click tracking with AJAX
    $('.quick-link-card').on('click', (e) => {
      e.preventDefault();
      const $card = $(e.currentTarget);
      const title = $card.find('.card-title').text();
      const url = $card.closest('a').attr('href');
      
      this.trackClick(title, url)
        .done((response) => {
          if (response.status === 'success') {
            // Navigate to the URL after successful tracking
            window.location.href = url;
          } else {
            console.warn('Tracking failed:', response.message);
            // Still navigate even if tracking fails
            window.location.href = url;
          }
        })
        .fail((xhr, status, error) => {
          console.error('Tracking request failed:', error);
          // Still navigate even if tracking fails
          window.location.href = url;
        });
    });
  }

  /**
   * Track quick link click via AJAX
   * @param {string} title - The title of the clicked link
   * @param {string} url - The URL of the clicked link
   * @returns {jqXHR} jQuery AJAX promise
   */
  trackClick(title, url) {
    return $.ajax({
      url: this.apiUrl,
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        title: title,
        url: url,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    });
  }
}

// Initialize when DOM is ready
$(document).ready(() => {
  window.quickLinks = new QuickLinks({
    apiUrl: '/api/quick-links-click/'  // endpoint returning JSON response
  });
});