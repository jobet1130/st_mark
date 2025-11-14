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


class QuickLinksClickAPIView(View):
    """
    API endpoint for tracking quick link clicks
    """
    
    @method_decorator(csrf_exempt)
    def post(self, request):
        """
        Handle quick link click tracking
        """
        try:
            # Parse JSON data from request
            data = json.loads(request.body.decode('utf-8'))
            title = data.get('title', '')
            url = data.get('url', '')
            timestamp = data.get('timestamp', '')
            user_agent = data.get('userAgent', '')
            referrer = data.get('referrer', '')
            
            # Log the click (in a real app, you might save this to a database)
            print(f"Quick link '{title}' clicked, navigating to {url} at {timestamp}")
            print(f"User agent: {user_agent}")
            print(f"Referrer: {referrer}")
            
            # Return success response
            return JsonResponse({
                'status': 'success',
                'message': 'Click tracked successfully',
                'data': {
                    'title': title,
                    'url': url,
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


class NewsAPIView(View):
    """
    API endpoint for news section content
    """
    
    def get(self, request):
        """
        Return news items
        """
        data = [
            {
                'id': 1,
                'title': "St. Mark University Ranks Among Top 100 Universities Globally",
                'date': "November 8, 2025",
                'excerpt': "Our commitment to academic excellence and innovative research has earned us recognition in the latest QS World University Rankings.",
                'image': "/static/images/campus-building.jpg"
            },
            {
                'id': 2,
                'title': "New Research Center for Artificial Intelligence Inaugurated",
                'date': "November 5, 2025",
                'excerpt': "State-of-the-art facilities will advance AI research and provide students with cutting-edge learning opportunities.",
                'image': "/static/images/students-studying.jpg"
            },
            {
                'id': 3,
                'title': "2024 Graduation Ceremony Celebrates 2,500 Graduates",
                'date': "October 28, 2025",
                'excerpt': "Our latest graduating class is ready to make their mark on the world with the knowledge and skills gained at St. Mark University.",
                'image': "/static/images/graduation.jpg"
            }
        ]
        
        return JsonResponse({
            'status': 'success',
            'data': data,
            'message': 'News items retrieved successfully'
        })


class WelcomeSectionAPIView(View):
    """
    API endpoint for welcome section content and interactions
    """
    
    def get(self, request):
        """
        Return dynamic welcome section content
        """
        data = {
            'imageSrc': '/static/images/students-studying.jpg',
            'yearsOfExcellence': '40+',
            'welcomeText': 'Welcome to St. Mark University',
            'heading': 'Shaping Leaders, Advancing Knowledge',
            'description': 'At St. Mark University, we are committed to providing world-class education that prepares students for success in an ever-changing global landscape. Our diverse community of scholars, researchers, and innovators work together to push the boundaries of knowledge and create positive impact in society.',
            'highlights': [
                'Over 40 years of academic excellence',
                'Distinguished faculty with industry expertise',
                'State-of-the-art research facilities',
                'Global partnerships and exchange programs',
                '95% graduate employment rate'
            ],
            'links': {
                'learnMore': '/about',
                'admission': '/admissions'
            }
        }
        
        return JsonResponse({
            'status': 'success',
            'data': data,
            'message': 'Welcome section content retrieved successfully'
        })
    
    @method_decorator(csrf_exempt)
    def post(self, request):
        """
        Handle navigation requests and highlight interactions
        """
        try:
            # Parse JSON data from request
            data = json.loads(request.body.decode('utf-8'))
            action = data.get('action', '')
            timestamp = data.get('timestamp', '')
            
            # Handle different actions
            if action == 'navigate':
                target = data.get('target', '')
                # Log the navigation (in a real app, you might save this to a database)
                print(f"Welcome section navigation to {target} at {timestamp}")
                
                # Determine URL based on target
                urls = {
                    'about': '/about',
                    'admissions': '/admissions'
                }
                url = urls.get(target, '/')
                
                return JsonResponse({
                    'status': 'success',
                    'message': 'Navigation request processed',
                    'data': {
                        'target': target,
                        'url': url,
                        'timestamp': timestamp
                    }
                })
                
            elif action == 'highlight_interaction':
                highlightIndex = data.get('highlightIndex', -1)
                # Log the interaction (in a real app, you might save this to a database)
                print(f"Highlight {highlightIndex} interacted with at {timestamp}")
                
                return JsonResponse({
                    'status': 'success',
                    'message': 'Highlight interaction recorded',
                    'data': {
                        'highlightIndex': highlightIndex,
                        'timestamp': timestamp
                    }
                })
                
            else:
                return JsonResponse({
                    'status': 'error',
                    'message': 'Invalid action specified'
                }, status=400)
                
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


class EventsAPIView(View):
    """
    API endpoint for events section content
    """
    
    def get(self, request):
        """
        Return upcoming events
        """
        data = [
            {
                'id': 1,
                'title': "Open House for Prospective Students",
                'date': "November 20, 2025",
                'time': "9:00 AM - 4:00 PM",
                'location': "Main Campus",
                'description': "Explore our campus, meet faculty, and learn about our programs."
            },
            {
                'id': 2,
                'title': "Annual Research Symposium",
                'date': "December 5, 2025",
                'time': "10:00 AM - 5:00 PM",
                'location': "Science Building Auditorium",
                'description': "Showcase of groundbreaking research from students and faculty."
            },
            {
                'id': 3,
                'title': "Career Fair 2025",
                'date': "December 12, 2025",
                'time': "11:00 AM - 6:00 PM",
                'location': "University Center",
                'description': "Connect with top employers and explore career opportunities."
            }
        ]
        
        return JsonResponse({
            'status': 'success',
            'data': data,
            'message': 'Events retrieved successfully'
        })


class GalleryAPIView(View):
    """
    API endpoint for gallery section content
    """
    
    def get(self, request):
        """
        Return gallery images
        """
        data = [
            {
                'src': '/static/images/campus-hero.jpg',
                'alt': 'Beautiful campus grounds'
            },
            {
                'src': '/static/images/students-studying.jpg',
                'alt': 'Students collaborating'
            },
            {
                'src': '/static/images/campus-building.jpg',
                'alt': 'Modern facilities'
            },
            {
                'src': '/static/images/graduation.jpg',
                'alt': 'Graduation ceremony'
            }
        ]
        
        return JsonResponse({
            'status': 'success',
            'data': data,
            'message': 'Gallery images retrieved successfully'
        })
