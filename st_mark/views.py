from django.http import JsonResponse
from django.views import View

class NavigationLinksView(View):
    def get(self, request):
        navigation_links = [
            { "name": "Home", "path": "/" },
            { "name": "About", "path": "/about" },
            { "name": "Academics", "path": "/academics" },
            { "name": "Admissions", "path": "/admissions" },
            { "name": "Faculty & Staff", "path": "/faculty" },
            { "name": "News & Events", "path": "/news" },
            { "name": "Gallery", "path": "/gallery" },
            { "name": "Contact Us", "path": "/contact" }
        ]
        
        # Enhanced API response with metadata
        response_data = {
            "status": "success",
            "data": navigation_links,
            "count": len(navigation_links)
        }
        return JsonResponse(response_data)


class SocialStatsView(View):
    def get(self, request):
        # Using the request parameter to check for query parameters
        # In a real application, this could be used for filtering, authentication, etc.
        format_type = request.GET.get('format', 'full')
        
        social_stats = {
            "facebook": {
                "followers": "10K"
            },
            "twitter": {
                "followers": "5K"
            },
            "linkedin": {
                "followers": "8K"
            },
            "youtube": {
                "subscribers": "15K"
            }
        }
        
        # Return different data based on format parameter
        if format_type == 'simple':
            # Simplified response
            simple_stats = {
                "total_followers": "38K"
            }
            response_data = {
                "status": "success",
                "data": simple_stats
            }
            return JsonResponse(response_data)
        else:
            # Full response
            response_data = {
                "status": "success",
                "data": social_stats,
                "count": len(social_stats)
            }
            return JsonResponse(response_data)