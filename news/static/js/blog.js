class BlogManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadBlogStats();
    }

    bindEvents() {
        // Bind any blog-specific events
        $('.blog-post-item a').on('click', (e) => {
            this.handlePostClick(e);
        });
    }

    handlePostClick(event) {
        // Example of AJAX call for tracking blog post clicks
        const postUrl = $(event.target).attr('href');
        const postTitle = $(event.target).text();
        
        $.ajax({
            url: '/api/blog/click/',
            method: 'POST',
            data: JSON.stringify({
                'post_url': postUrl,
                'post_title': postTitle
            }),
            contentType: 'application/json',
            success: (response) => {
                console.log('Click tracked successfully:', response);
            },
            error: (xhr, status, error) => {
                console.error('Error tracking click:', error);
            }
        });
    }

    loadBlogStats() {
        // Example of AJAX call to load blog statistics
        $.ajax({
            url: '/api/blog/stats/',
            method: 'GET',
            dataType: 'json',
            success: (response) => {
                this.displayBlogStats(response);
            },
            error: (xhr, status, error) => {
                console.error('Error loading blog stats:', error);
            }
        });
    }

    displayBlogStats(data) {
        // Example of handling JSON response
        if (data && data.total_posts) {
            console.log(`Total blog posts: ${data.total_posts}`);
        }
    }
}

// Initialize the blog manager when the document is ready
$(document).ready(function() {
    new BlogManager();
});