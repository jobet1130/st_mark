/**
 * NavbarHandler.js
 * Author: Jobet Casquejo
 * Version: 1.0.0
 * 
 * Dynamically loads navbar links via AJAX from JSON API
 * and handles Bootstrap collapse toggling.
 */

class NavbarHandler {
    constructor(options = {}) {
        this.apiUrl = options.apiUrl || '/api/navigation';
        this.desktopNavSelector = options.desktopNavSelector || '#desktop-nav';
        this.retryAttempts = options.retryAttempts || 3;
        this.currentAttempt = 0;

        this.init();
    }

    init() {
        this.fetchNavigationData()
            .then(data => this.populateNavigation(data))
            .catch(error => {
                console.warn('Failed to load navbar data from API, using fallback:', error);
                // Fallback to static navigation if API fails
                this.populateNavigation(this.getStaticNavigation());
            });
    }

    async fetchNavigationData() {
        try {
            const response = await $.ajax({ url: this.apiUrl, dataType: 'json' });
            console.log('Navigation data fetched:', response);
            return response;
        } catch (error) {
            this.currentAttempt++;
            console.warn(`Attempt ${this.currentAttempt} failed:`, error);
            if (this.currentAttempt < this.retryAttempts) {
                await new Promise(res => setTimeout(res, 1000 * this.currentAttempt));
                return this.fetchNavigationData();
            } else {
                throw new Error('Failed to fetch navigation data after ' + this.retryAttempts + ' attempts.');
            }
        }
    }

    populateNavigation(navItems) {
        const desktopNav = $(this.desktopNavSelector);
        if (!desktopNav.length) return;

        desktopNav.empty();
        navItems.forEach(item => {
            const link = $('<a>')
                .addClass('nav-link')
                .attr('href', item.path)
                .text(item.name);
            const li = $('<li>').addClass('nav-item').append(link);
            desktopNav.append(li);
        });
    }

    // Fallback static navigation data
    getStaticNavigation() {
        return [
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Academics', path: '/academics' },
            { name: 'Admissions', path: '/admissions' },
            { name: 'Faculty & Staff', path: '/faculty' },
            { name: 'News & Events', path: '/news' },
            { name: 'Gallery', path: '/gallery' },
            { name: 'Contact Us', path: '/contact' }
        ];
    }
}

// Initialize navbar when DOM is ready
$(document).ready(() => {
    new NavbarHandler(
        { 
            apiUrl: '/api/navigation',        // endpoint returning JSON array of links
            desktopNavSelector: '#desktop-nav',
            mobileNavSelector: '#mobile-nav',
            mobileToggleSelector: '#mobile-toggle',
            retryAttempts: 3
        }
    );
});