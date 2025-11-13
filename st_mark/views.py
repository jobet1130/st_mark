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
        return JsonResponse(navigation_links, safe=False)
