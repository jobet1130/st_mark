/**
 * AjaxHandler.js
 * Global AJAX Handler Class with Animation Support
 * Author: Jobet Casquejo
 * Version: 1.1.0
 * 
 * Description:
 * A reusable, OOP-based JavaScript class for handling AJAX requests with jQuery.
 * Supports GET/POST requests, JSON parsing, retry logic, configurable callbacks, and animation states.
 * Can be included globally on any page without page-specific dependencies.
 * 
 * Features:
 * - Modular and reusable
 * - Configurable default headers and base URL
 * - Safe JSON parsing
 * - Retry logic with delay
 * - Success, error, and complete callbacks
 * - Loading, success, and error animation states
 * - Logging for debugging
 */

class AjaxHandler {
    /**
     * Class version
     * @type {string}
     */
    static version = '1.1.0';

    /**
     * Initialize the AJAX handler with optional default configuration.
     * @param {Object} config - Default configuration options.
     * @param {string} [config.baseUrl=''] - Base URL prepended to all requests.
     * @param {Object} [config.headers={'Content-Type':'application/json','X-Requested-With':'XMLHttpRequest'}] - Default request headers.
     * @param {number} [config.retries=0] - Number of retry attempts for failed requests.
     * @param {number} [config.retryDelay=1000] - Delay between retries in milliseconds.
     * @param {number} [config.timeout=10000] - AJAX request timeout in milliseconds.
     * @param {Object} [config.animation] - Animation configuration for loading states.
     * @param {string} [config.animation.loadingClass='loading'] - CSS class for loading state.
     * @param {string} [config.animation.successClass='success'] - CSS class for success state.
     * @param {string} [config.animation.errorClass='error'] - CSS class for error state.
     * @param {string} [config.animation.targetElement=null] - Element to apply animation classes to.
     */
    constructor(config = {}) {
        this.defaultConfig = {
            baseUrl: config.baseUrl || '',
            headers: config.headers || {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            retries: config.retries || 0,
            retryDelay: config.retryDelay || 1000,
            timeout: config.timeout || 10000,
            animation: config.animation || {
                loadingClass: 'loading',
                successClass: 'success',
                errorClass: 'error',
                targetElement: null
            }
        };

        // Bind context for internal methods
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this._request = this._request.bind(this);
        this._safeParseJSON = this._safeParseJSON.bind(this);
        this._logResponse = this._logResponse.bind(this);
        this.setDefaults = this.setDefaults.bind(this);
    }

    /**
     * Perform an AJAX GET request.
     * @param {string} url - Endpoint relative to baseUrl.
     * @param {Object} [options={}] - Optional settings overriding defaults.
     * @param {Function} [options.onSuccess] - Callback function for successful response.
     * @param {Function} [options.onError] - Callback function for failed response.
     * @param {Function} [options.onComplete] - Callback executed after request finishes.
     * @param {Object} [options.animation] - Animation configuration for this request.
     * @returns {Promise<any>} - Resolves with parsed response data or rejects with error object.
     */
    get(url, options = {}) {
        return this._request('GET', url, null, options);
    }

    /**
     * Perform an AJAX POST request.
     * @param {string} url - Endpoint relative to baseUrl.
     * @param {Object} data - Data payload to send in the request body.
     * @param {Object} [options={}] - Optional settings overriding defaults.
     * @param {Function} [options.onSuccess] - Callback function for successful response.
     * @param {Function} [options.onError] - Callback function for failed response.
     * @param {Function} [options.onComplete] - Callback executed after request finishes.
     * @param {Object} [options.animation] - Animation configuration for this request.
     * @returns {Promise<any>} - Resolves with parsed response data or rejects with error object.
     */
    post(url, data, options = {}) {
        return this._request('POST', url, data, options);
    }

    /**
     * Internal method to handle AJAX requests using jQuery.
     * @private
     * @param {string} method - HTTP method ('GET' or 'POST').
     * @param {string} url - Full endpoint URL.
     * @param {Object|null} data - Payload for POST requests.
     * @param {Object} options - Configuration overrides.
     * @returns {Promise<any>} - Resolves or rejects based on AJAX response.
     */
    _request(method, url, data, options) {
        const config = { ...this.defaultConfig, ...options };
        const fullUrl = config.baseUrl ? `${config.baseUrl}${url}` : url;

        const requestOptions = {
            url: fullUrl,
            type: method,
            headers: config.headers,
            timeout: config.timeout,
            dataType: 'json'
        };

        if (data && method === 'POST') {
            requestOptions.data = JSON.stringify(data);
        }

        const executeRequest = () => {
            // Apply loading animation
            this._applyAnimation('loading', config.animation);

            return new Promise((resolve, reject) => {
                $.ajax(requestOptions)
                    .done((response) => {
                        try {
                            const parsedData = this._safeParseJSON(response);
                            
                            // Check if response is a valid API response
                            if (this._isValidApiResponse(parsedData)) {
                                this._logResponse('success', parsedData);
                                this._applyAnimation('success', config.animation);
                                if (typeof config.onSuccess === 'function') config.onSuccess(parsedData);
                                resolve(parsedData);
                            } else {
                                // Handle invalid API response
                                const error = new Error('Invalid API response format');
                                error.response = parsedData;
                                throw error;
                            }
                        } catch (error) {
                            console.error('Failed to process successful response:', error);
                            this._applyAnimation('error', config.animation);
                            reject(error);
                        }
                    })
                    .fail((jqXHR, textStatus, errorThrown) => {
                        const errorObj = {
                            status: jqXHR.status,
                            statusText: jqXHR.statusText,
                            textStatus,
                            errorThrown,
                            responseText: jqXHR.responseText,
                            responseJSON: jqXHR.responseJSON
                        };
                        this._logResponse('error', errorObj);
                        this._applyAnimation('error', config.animation);
                        if (typeof config.onError === 'function') config.onError(errorObj);
                        reject(errorObj);
                    })
                    .always(() => {
                        if (typeof config.onComplete === 'function') config.onComplete();
                    });
            });
        };

        // Retry logic
        if (config.retries > 0) {
            let attempts = 0;
            const attemptRequest = () => {
                return executeRequest().catch((error) => {
                    attempts += 1;
                    if (attempts <= config.retries) {
                        console.warn(`Retrying request (${attempts}/${config.retries})...`);
                        return new Promise(resolve => setTimeout(resolve, config.retryDelay))
                            .then(() => attemptRequest());
                    } else {
                        throw error;
                    }
                });
            };
            return attemptRequest();
        }

        return executeRequest();
    }

    /**
     * Safely parse JSON strings without throwing exceptions.
     * @private
     * @param {any} input - Input to parse.
     * @returns {any} - Parsed object or original input if not a string.
     * @throws {SyntaxError} If JSON is invalid.
     */
    _safeParseJSON(input) {
        if (typeof input === 'string') {
            try {
                return JSON.parse(input);
            } catch (e) {
                console.error('Invalid JSON received:', input);
                throw e;
            }
        }
        return input;
    }

    /**
     * Check if the response is a valid API response.
     * @private
     * @param {any} response - Response to validate.
     * @returns {boolean} - True if response is valid.
     */
    _isValidApiResponse(response) {
        // Accept any valid JSON response
        // Could be extended to check for specific API response formats
        return response !== null && response !== undefined;
    }

    /**
     * Apply animation classes to target element.
     * @private
     * @param {'loading'|'success'|'error'} state - Animation state to apply.
     * @param {Object} animationConfig - Animation configuration.
     */
    _applyAnimation(state, animationConfig) {
        const config = animationConfig || this.defaultConfig.animation;
        const targetElement = config.targetElement;
        
        if (!targetElement) return;
        
        const $element = $(targetElement);
        if (!$element.length) return;
        
        // Remove all animation classes
        $element.removeClass(config.loadingClass)
               .removeClass(config.successClass)
               .removeClass(config.errorClass);
        
        // Add appropriate class based on state
        switch (state) {
            case 'loading':
                $element.addClass(config.loadingClass);
                break;
            case 'success':
                $element.addClass(config.successClass);
                break;
            case 'error':
                $element.addClass(config.errorClass);
                break;
        }
    }

    /**
     * Log responses to the console for debugging purposes.
     * @private
     * @param {'success'|'error'} level - Log type.
     * @param {any} data - Data to log.
     */
    _logResponse(level, data) {
        switch (level) {
            case 'success':
                console.info(`[AjaxHandler v${AjaxHandler.version}] Request succeeded:`, data);
                break;
            case 'error':
                console.error(`[AjaxHandler v${AjaxHandler.version}] Request failed:`, data);
                break;
            default:
                console.log(`[AjaxHandler v${AjaxHandler.version}]`, data);
        }
    }

    /**
     * Update default configuration values dynamically.
     * @param {Object} newDefaults - New configuration properties.
     */
    setDefaults(newDefaults) {
        this.defaultConfig = { ...this.defaultConfig, ...newDefaults };
    }
}

// Expose globally under a safe namespace
window.AjaxHandler = AjaxHandler;
