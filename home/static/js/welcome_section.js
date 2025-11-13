class WelcomeSection {
  constructor() {
    this.highlightsContainer = $('#highlights-container');
    this.studentsImage = $('#students-image');
    this.yearsExcellence = $('#years-excellence');
    this.welcomeBadge = $('#welcome-badge');
    this.mainHeading = $('#main-heading');
    this.description = $('#description');
    this.learnMoreBtn = $('#learn-more-btn');
    this.admissionBtn = $('#admission-btn');
    
    this.init();
  }

  init() {
    this.loadContent();
    this.bindEvents();
  }

  loadContent() {
    // AJAX call to get content
    this.fetchWelcomeData()
      .then(response => {
        if (response.status === 'success') {
          this.updateContent(response);
        } else {
          console.error('API returned error:', response.message);
        }
      })
      .catch(error => {
        console.error('Error loading welcome section data:', error);
      });
  }

  fetchWelcomeData() {
    // Actual AJAX call to our API
    return $.ajax({
      url: '/api/welcome-section/',
      method: 'GET',
      dataType: 'json'
    });
  }

  updateContent(response) {
    const data = response.data;
    
    // Update image
    if (data.imageSrc) {
      this.studentsImage.attr('src', data.imageSrc);
    }
    
    // Update years of excellence
    if (data.yearsOfExcellence) {
      this.yearsExcellence.text(data.yearsOfExcellence);
    }
    
    // Update welcome badge
    if (data.welcomeText) {
      this.welcomeBadge.text(data.welcomeText);
    }
    
    // Update heading with accessibility considerations
    if (data.heading) {
      this.mainHeading.text(data.heading);
    } else {
      // Ensure heading has meaningful content for screen readers
      this.mainHeading.text("Welcome to St. Mark University");
    }
    
    // Update description
    if (data.description) {
      this.description.text(data.description);
    }
    
    // Update highlights
    if (data.highlights && data.highlights.length > 0) {
      this.renderHighlights(data.highlights);
    }
  }

  renderHighlights(highlights) {
    // Clear existing content
    this.highlightsContainer.empty();
    
    // Check if highlights exist and is an array
    if (!Array.isArray(highlights) || highlights.length === 0) {
      // Add a visually hidden message for screen readers
      this.highlightsContainer.append('<div class="visually-hidden">No highlights available</div>');
      return;
    }
    
    let highlightsHtml = '';
    
    highlights.forEach((highlight, index) => {
      // Ensure highlight has content
      if (highlight && highlight.trim() !== '') {
        highlightsHtml += `
          <div class="d-flex align-items-start highlight-item mb-2" data-index="${index}">
            <i class="fas fa-check-circle text-primary mt-1 me-2" style="font-size: 1.25rem;" aria-hidden="true"></i>
            <span class="text-dark">${highlight}</span>
          </div>
        `;
      }
    });
    
    this.highlightsContainer.html(highlightsHtml);
  }

  bindEvents() {
    // Bind button events
    this.learnMoreBtn.on('click', (e) => {
      e.preventDefault();
      this.handleLearnMoreClick();
    });
    
    this.admissionBtn.on('click', (e) => {
      e.preventDefault();
      this.handleAdmissionClick();
    });
    
    // Bind highlight item events
    $(document).on('click', '.highlight-item', (e) => {
      const index = $(e.currentTarget).data('index');
      this.handleHighlightClick(index);
    });
  }

  handleLearnMoreClick() {
    // API call for navigation
    $.ajax({
      url: '/api/welcome-section/',
      method: 'POST',
      data: JSON.stringify({ 
        action: 'navigate',
        target: 'about',
        timestamp: new Date().toISOString()
      }),
      contentType: 'application/json',
      success: (response) => {
        window.location.href = response.data.url;
      },
      error: (xhr, status, error) => {
        console.error('Navigation error:', error);
        // Fallback navigation
        window.location.href = '/about';
      }
    });
  }

  handleAdmissionClick() {
    // API call for navigation
    $.ajax({
      url: '/api/welcome-section/',
      method: 'POST',
      data: JSON.stringify({ 
        action: 'navigate',
        target: 'admissions',
        timestamp: new Date().toISOString()
      }),
      contentType: 'application/json',
      success: (response) => {
        window.location.href = response.data.url;
      },
      error: (xhr, status, error) => {
        console.error('Navigation error:', error);
        // Fallback navigation
        window.location.href = '/admissions';
      }
    });
  }

  handleHighlightClick(index) {
    // API call for highlight interaction
    $.ajax({
      url: '/api/welcome-section/',
      method: 'POST',
      data: JSON.stringify({ 
        action: 'highlight_interaction',
        highlightIndex: index,
        timestamp: new Date().toISOString()
      }),
      contentType: 'application/json',
      success: (response) => {
        console.log('Highlight interaction recorded:', response);
        // Visual feedback
        $(`.highlight-item[data-index="${index}"]`).addClass('highlighted');
        setTimeout(() => {
          $(`.highlight-item[data-index="${index}"]`).removeClass('highlighted');
        }, 1000);
      },
      error: (xhr, status, error) => {
        console.error('Highlight interaction error:', error);

        // Visual feedback for error
        const $highlightItem = $(`.highlight-item[data-index="${index}"]`);
        $highlightItem.addClass('error');
        
        // Log the full error details including status
        console.error('Highlight interaction failed:', {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText
        });

        // Check if the request was successful based on status
        if (xhr.status === 200) {
          console.log('Highlight interaction recorded:', response);
          // Visual feedback
          $(`.highlight-item[data-index="${index}"]`).addClass('highlighted');
          setTimeout(() => {
            $(`.highlight-item[data-index="${index}"]`).removeClass('highlighted');
          }, 1000);
        } else {
          // Handle non-200 status codes
          $highlightItem.addClass('error');
          
          // Log the full error details including status
          console.error('Highlight interaction failed:', {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText
          });
        }

        // Remove error class after animation
        setTimeout(() => {
          $highlightItem.removeClass('error');
        }, 1000);
        $(`.highlight-item[data-index="${index}"]`).addClass('error');
        setTimeout(() => {
          $(`.highlight-item[data-index="${index}"]`).removeClass('error');
        }, 1000);
        console.error('Highlight interaction error:', error);
      }
    });
  }
}

// Initialize the welcome section when the document is ready
$(document).ready(function() {
  new WelcomeSection();
});