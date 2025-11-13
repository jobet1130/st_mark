/**
 * FooterManager.js
 * OOP-based JavaScript class for footer functionality with AJAX support
 * Author: Jobet P. Casquejo
 * Version: 1.0.0
 * 
 * Description:
 * A reusable, OOP-based JavaScript class for handling footer interactions.
 * Supports AJAX requests, JSON parsing, and dynamic content updates.
 * 
 * Features:
 * - Modular and reusable footer functionality
 * - AJAX-based data fetching
 * - JSON response handling
 * - Dynamic content updates
 * - Error handling and logging
 */

class FooterManager {
    /**
     * Class version
     * @type {string}
     */
    static version = '1.0.0';

    /**
     * Initialize the Footer Manager
     * @param {Object} config - Configuration options
     */
    constructor(config = {}) {
        this.config = {
            baseUrl: config.baseUrl || '/api',
            endpoints: config.endpoints || {
                contact: '/contact/submit',
                socialStats: '/social/stats'
            },
            selectors: config.selectors || {
                contactForm: '#contact-form',
                contactSubmit: '#contact-submit',
                socialLinks: '.social-media-link',
                copyrightYear: '.current-year'
            },
            ...config
        };

        // Initialize when DOM is ready
        $(document).ready(() => {
            this.init();
        });
    }

    /**
     * Initialize the footer functionality
     */
    init() {
        console.info(`[FooterManager v${FooterManager.version}] Initializing...`);
        
        // Set current year in copyright
        this.updateCopyrightYear();
        
        // Bind event handlers
        this.bindEvents();
        
        // Load dynamic content
        this.loadDynamicContent();
        
        console.info(`[FooterManager v${FooterManager.version}] Initialization complete`);
    }

    /**
     * Bind event handlers for footer interactions
     */
    bindEvents() {
        // Contact form submission
        $(this.config.selectors.contactForm).on('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmission();
        });

        // Social media link tracking
        $(this.config.selectors.socialLinks).on('click', (e) => {
            const $link = $(e.currentTarget);
            this.trackSocialClick($link);
        });
    }

    /**
     * Update copyright year
     */
    updateCopyrightYear() {
        const currentYear = new Date().getFullYear();
        $(this.config.selectors.copyrightYear).text(currentYear);
    }

    /**
     * Load dynamic content via AJAX
     */
    loadDynamicContent() {
        // Example: Load social media stats
        this.loadSocialStats();
    }

    /**
     * Handle contact form submission
     */
    handleContactSubmission() {
        // Get form data
        const formData = {
            name: $('#contact-name').val(),
            email: $('#contact-email').val(),
            subject: $('#contact-subject').val(),
            message: $('#contact-message').val()
        };

        // Validate form data
        if (!this.validateContactForm(formData)) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Create AJAX handler instance
        const ajaxHandler = new window.AjaxHandler({
            baseUrl: this.config.baseUrl,
            retries: 2,
            retryDelay: 1000
        });

        // Submit contact form
        ajaxHandler.post(this.config.endpoints.contact, formData, {
            onSuccess: (response) => {
                this.handleContactSuccess(response);
            },
            onError: (error) => {
                this.handleContactError(error);
            },
            animation: {
                targetElement: this.config.selectors.contactForm,
                loadingClass: 'loading',
                successClass: 'success',
                errorClass: 'error'
            }
        });
    }

    /**
     * Load social media statistics
     */
    loadSocialStats() {
        // Create AJAX handler instance
        const ajaxHandler = new window.AjaxHandler({
            baseUrl: this.config.baseUrl
        });

        // Fetch social stats
        ajaxHandler.get(this.config.endpoints.socialStats, {
            onSuccess: (response) => {
                this.updateSocialStats(response);
            },
            onError: (error) => {
                console.warn('[FooterManager] Failed to load social stats:', error);
            }
        });
    }

    /**
     * Track social media link clicks
     * @param {jQuery} $link - The clicked link element
     */
    trackSocialClick($link) {
        const platform = $link.attr('aria-label');
        const url = $link.attr('href');
        
        // Send tracking data via AJAX
        const ajaxHandler = new window.AjaxHandler({
            baseUrl: this.config.baseUrl
        });
        
        ajaxHandler.post('/analytics/social-click', {
            platform: platform,
            url: url,
            timestamp: new Date().toISOString()
        }, {
            onSuccess: (response) => {
                console.info(`[FooterManager] Tracked click on ${platform}`, response);
                // Check if response is JSON and handle accordingly
                if (response && typeof response === 'object') {
                    // Process JSON response
                    if (response.status === 'success') {
                        console.info('[FooterManager] Social click tracking confirmed by server');
                    } else {
                        console.warn('[FooterManager] Social click tracking may have issues:', response.message || 'Unknown error');
                    }
                } else {
                    console.warn('[FooterManager] Unexpected response format for social click tracking');
                }
            },
            onError: (error) => {
                console.warn(`[FooterManager] Failed to track click on ${platform}:`, error);
            }
        });
    }

    /**
     * Handle successful contact submission
     * @param {Object} response - JSON response from server
     */
    handleContactSuccess(response) {
        if (response.success) {
            this.showNotification(response.message || 'Message sent successfully!', 'success');
            $(this.config.selectors.contactForm)[0].reset();
        } else {
            this.showNotification(response.message || 'Failed to send message', 'error');
        }
    }

    /**
     * Handle contact submission error
     * @param {Object} error - Error object
     */
    handleContactError(error) {
        let message = 'Failed to send message. Please try again later.';
        
        if (error.responseJSON && error.responseJSON.message) {
            message = error.responseJSON.message;
        }
        
        this.showNotification(message, 'error');
    }

    /**
     * Update social media statistics
     * @param {Object} stats - JSON statistics data
     */
    updateSocialStats(stats) {
        // Example implementation - would need specific selectors in HTML
        if (stats.facebook) {
            $('.facebook-count').text(stats.facebook.followers);
        }
        if (stats.twitter) {
            $('.twitter-count').text(stats.twitter.followers);
        }
        if (stats.linkedin) {
            $('.linkedin-count').text(stats.linkedin.followers);
        }
        if (stats.youtube) {
            $('.youtube-count').text(stats.youtube.subscribers);
        }
    }

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validate contact form data
     * @param {Object} data - Form data
     * @returns {boolean} - True if valid
     */
    validateContactForm(data) {
        return data.name && data.email && data.subject && data.message && this.validateEmail(data.email);
    }

    /**
     * Show notification message
     * @param {string} message - Message to display
     * @param {string} type - Type of message (success, error, info)
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const $notification = $(`
            <div class="footer-notification ${type}">
                <p>${message}</p>
            </div>
        `);
        
        // Add to footer
        $('footer').append($notification);
        
        // Remove after delay
        setTimeout(() => {
            $notification.fadeOut(() => {
                $notification.remove();
            });
        }, 5000);
    }

    /**
     * Update default configuration
     * @param {Object} newConfig - New configuration options
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}

// Initialize FooterManager when DOM is ready
$(document).ready(() => {
    // Create global instance
    window.footerManager = new FooterManager();
});

// Expose globally under a safe namespace
window.FooterManager = FooterManager;