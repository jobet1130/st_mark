class EventsSection {
  constructor() {
    this.eventsContainer = $('.events-container');
    this.init();
  }

  init() {
    // Initialize the events section functionality
    this.loadEvents();
  }

  loadEvents() {
    // Check if events are already present in the container
    const existingEvents = this.eventsContainer.find('.card');
    
    // If there are no existing events, load them dynamically
    if (existingEvents.length === 0) {
      // Show loading state
      this.showLoadingState();
      
      // Load events data from API
      $.ajax({
        url: '/api/events/',
        method: 'GET',
        dataType: 'json',
        success: (response) => {
          if (response.status === 'success' && Array.isArray(response.data) && response.data.length > 0) {
            this.renderEvents(response.data);
          } else {
            // If no data from API, show a message
            this.showNoEventsMessage();
          }
        },
        error: (xhr, status, error) => {
          console.error('Error loading events:', error);
          // If API fails, show a message
          this.showErrorMessage();
        }
      });
    }
  }

  showLoadingState() {
    const html = `
      <div class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
    this.eventsContainer.html(html);
  }

  renderEvents(events) {
    let html = '';
    events.forEach(event => {
      html += `
        <div class="col-md-6 col-lg-4">
          <div class="card event-card h-100">
            <div class="card-body d-flex flex-column">
              <div class="event-date mb-2">
                <i class="fas fa-calendar me-2"></i>
                <small>${event.date}</small>
              </div>
              <h3 class="card-title">${event.title}</h3>
              <div class="event-time mb-2">
                <i class="fas fa-clock me-2"></i>
                <small>${event.time}</small>
              </div>
              <div class="event-location mb-3">
                <i class="fas fa-map-marker-alt me-2"></i>
                <small>${event.location}</small>
              </div>
              <p class="card-text text-muted flex-grow-1">
                ${event.description}
              </p>
              <a href="/news/${event.id}" class="btn btn-link p-0 h-auto fw-semibold">
                Learn More <i class="fas fa-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    });
    
    this.eventsContainer.html(html);
  }

  showNoEventsMessage() {
    const html = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <h4>No Events Available</h4>
          <p>There are currently no upcoming events. Please check back later.</p>
        </div>
      </div>
    `;
    this.eventsContainer.html(html);
  }

  showErrorMessage() {
    const html = `
      <div class="col-12">
        <div class="alert alert-danger text-center">
          <h4>Events Loading Error</h4>
          <p>Sorry, we're having trouble loading events right now. Please try again later.</p>
        </div>
      </div>
    `;
    this.eventsContainer.html(html);
  }
}

// Initialize the events section when document is ready
$(document).ready(function() {
  new EventsSection();
});