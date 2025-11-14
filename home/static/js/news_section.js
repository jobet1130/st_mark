class NewsSection {
  constructor() {
    this.newsContainer = $('.news-container');
    this.loadMoreBtn = $('#load-more-news');
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadNews();
  }

  bindEvents() {
    this.loadMoreBtn.on('click', (e) => {
      e.preventDefault();
      this.viewAllNews();
    });
  }

  loadNews() {
    // Fetch news data from API
    $.ajax({
      url: '/api/news/',
      method: 'GET',
      dataType: 'json',
      success: (response) => {
        if (response.status === 'success' && Array.isArray(response.data) && response.data.length > 0) {
          this.renderNews(response.data);
          // Show the "View All News" button since we have data
          this.loadMoreBtn.show();
        } else {
          // If no data from API, keep the static content and hide the "View All News" button if there are no news items
          if (this.newsContainer.find('.col-md-6').length === 0) {
            this.loadMoreBtn.hide();
          }
        }
      },
      error: (xhr, status, error) => {
        console.error('Error loading news:', error);
        // If API fails, keep the static content and hide the "View All News" button if there are no news items
        if (this.newsContainer.find('.col-md-6').length === 0) {
          this.loadMoreBtn.hide();
        }
      }
    });
  }

  renderNews(items) {
    let html = '';
    
    items.forEach(item => {
      html += `
        <div class="col-md-6 col-lg-4">
          <div class="card news-card h-100">
            <div class="overflow-hidden">
              <img 
                src="${item.image}" 
                alt="${item.title}" 
                class="card-img-top news-card-img"
              >
            </div>
            <div class="card-body d-flex flex-column">
              <div class="news-date mb-2">
                <i class="fas fa-calendar me-2"></i>
                <small>${item.date}</small>
              </div>
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text news-excerpt text-muted flex-grow-1">
                ${item.excerpt}
              </p>
            </div>
            <div class="card-footer bg-transparent border-0 mt-auto pb-4">
              <a href="/news/${item.id}" class="read-more-link">
                Read More <i class="fas fa-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    });
    
    this.newsContainer.html(html);
  }

  viewAllNews() {
    window.location.href = '/news';
  }
}

// Initialize the news section when document is ready
$(document).ready(function() {
  new NewsSection();
});