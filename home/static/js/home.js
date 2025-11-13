class HomeAPI {
  constructor() {
    this.init();
  }

  init() {
    $(document).ready(() => {
      this.loadSiteInfo();
      this.loadStatistics();
    });
  }

  loadSiteInfo() {
    $.ajax({
      url: '/api/site-info/',
      method: 'GET',
      dataType: 'json'
    })
    .done((response) => {
      if (response.status === 'success') {
        this.displaySiteInfo(response.data);
      } else {
        console.warn('Failed to load site information:', response.message);
      }
    })
    .fail((xhr, status, error) => {
      console.error('Site info loading failed:', error);
    });
  }

  displaySiteInfo(data) {
    // This function would update the DOM with site information
    console.log('Site Info:', data);
  }

  loadStatistics() {
    $.ajax({
      url: '/api/statistics/',
      method: 'GET',
      dataType: 'json'
    })
    .done((response) => {
      if (response.status === 'success') {
        this.displayStatistics(response.data);
      } else {
        console.warn('Failed to load statistics:', response.message);
      }
    })
    .fail((xhr, status, error) => {
      console.error('Statistics loading failed:', error);
    });
  }

  displayStatistics(data) {
    // This function would update the DOM with statistics
    console.log('Statistics:', data);
  }
}

// Initialize the home API
$(document).ready(() => {
  window.homeAPI = new HomeAPI();
});