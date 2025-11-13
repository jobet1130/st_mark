from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from .models import BlogIndexPage, BlogPage


def redirect_to_news(request):
    """
    Redirect to the news/blog index page
    """
    # Try to find the blog index page
    blog_index = BlogIndexPage.objects.first()
    
    if blog_index:
        # If found, redirect to it
        return HttpResponseRedirect(blog_index.url)
    else:
        # If not found, redirect to home page
        return HttpResponseRedirect('/')


def news_redirect_view(request):
    """
    Alternative redirect view for news
    """
    # Find the first blog index page
    try:
        blog_index = BlogIndexPage.objects.live().first()
        if blog_index:
            return HttpResponseRedirect(blog_index.url)
        else:
            return HttpResponseRedirect('/')
    except BlogIndexPage.DoesNotExist:
        return HttpResponseRedirect('/')


def news_landing_page(request):
    """
    Render a landing page that redirects to news blogs
    """
    return render(request, 'news/news_redirect.html')


class BlogStatsView(View):
    """
    API endpoint for blog statistics
    """
    def get(self, request):
        # Get total number of blog posts
        total_posts = BlogPage.objects.live().count()
        
        # Get total number of blog index pages
        total_indexes = BlogIndexPage.objects.live().count()
        
        data = {
            'status': 'success',
            'data': {
                'total_posts': total_posts,
                'total_indexes': total_indexes
            },
            'count': 2
        }
        
        return JsonResponse(data)


@method_decorator(csrf_exempt, name='dispatch')
class BlogClickView(View):
    """
    API endpoint for tracking blog post clicks
    """
    def post(self, request):
        try:
            # Parse JSON data from request body
            body_unicode = request.body.decode('utf-8')
            body_data = json.loads(body_unicode)
            
            # Extract data (in a real implementation, you might save this to a database)
            post_url = body_data.get('post_url', '')
            post_title = body_data.get('post_title', '')
            
            # Return success response
            data = {
                'status': 'success',
                'message': 'Click tracked successfully',
                'data': {
                    'post_url': post_url,
                    'post_title': post_title
                }
            }
            
            return JsonResponse(data)
        except json.JSONDecodeError:
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)