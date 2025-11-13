import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View

class HeroAPIView(View):
    """
    API endpoint for hero section interactions
    """
    
    def get(self, request):
        """
        Return dynamic hero content
        """
        data = {
            'title': 'Empowering Minds,<br>Building the Future',
            'subtitle': 'Join a community of scholars and innovators at St. Mark University, where excellence meets opportunity.',
            'buttonText': 'Explore Programs'
        }
        
        return JsonResponse({
            'status': 'success',
            'data': data,
            'message': 'Hero content retrieved successfully'
        })
    
    @method_decorator(csrf_exempt)
    def post(self, request):
        """
        Handle navigation requests from hero buttons
        """
        try:
            # Parse JSON data from request
            data = json.loads(request.body.decode('utf-8'))
            destination = data.get('destination', '')
            timestamp = data.get('timestamp', '')
            
            # Log the navigation (in a real app, you might save this to a database)
            print(f"Hero navigation to {destination} at {timestamp}")
            
            # Return success response
            return JsonResponse({
                'status': 'success',
                'message': 'Navigation request processed',
                'data': {
                    'destination': destination,
                    'timestamp': timestamp
                }
            })
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'An error occurred: {str(e)}'
            }, status=500)


class SiteInfoAPIView(View):
    """
    API endpoint for general site information
    """
    
    def get(self, request):
        """
        Return general site information
        """
        data = {
            'name': 'St. Mark University',
            'description': 'Empowering minds and building the future through excellence in education, research, and community service.',
            'founded': 1985,
            'motto': 'Excellence in Education',
            'contact': {
                'address': '123 University Avenue, Education City, EC 12345',
                'phone': '+1 (234) 567-890',
                'email': 'info@stmark.edu'
            }
        }
        
        return JsonResponse({
            'status': 'success',
            'data': data,
            'message': 'Site information retrieved successfully'
        })


class StatisticsAPIView(View):
    """
    API endpoint for site statistics
    """
    
    def get(self, request):
        """
        Return site statistics
        """
        data = {
            'students': 5420,
            'faculty': 320,
            'programs': 45,
            'research_projects': 128,
            'alumni': 15600,
            'last_updated': '2025-11-13'
        }
        
        return JsonResponse({
            'status': 'success',
            'data': data,
            'message': 'Statistics retrieved successfully'
        })