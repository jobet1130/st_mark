from django.conf import settings
from django.urls import include, path
from django.contrib import admin

from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls

from search import views as search_views
from . import views
from home import views as home_views
from news import views as news_views

urlpatterns = [
    path("django-admin/", admin.site.urls),
    path("admin/", include(wagtailadmin_urls)),
    path("documents/", include(wagtaildocs_urls)),
    path("search/", search_views.search, name="search"),
    path("api/navigation/", views.NavigationLinksView.as_view(), name="navigation-api"),
    path("api/social/stats/", views.SocialStatsView.as_view(), name="social-stats-api"),
    path("api/hero-content/", home_views.HeroAPIView.as_view(), name="hero-content-api"),
    path("api/hero-navigation/", home_views.HeroAPIView.as_view(), name="hero-navigation-api"),
    path("api/site-info/", home_views.SiteInfoAPIView.as_view(), name="site-info-api"),
    path("api/statistics/", home_views.StatisticsAPIView.as_view(), name="statistics-api"),
    path("api/quick-links-click/", home_views.QuickLinksClickAPIView.as_view(), name="quick-links-click-api"),
    path("api/welcome-section/", home_views.WelcomeSectionAPIView.as_view(), name="welcome-section-api"),
    path("api/news/", home_views.NewsAPIView.as_view(), name="news-api"),
    path("api/events/", home_views.EventsAPIView.as_view(), name="events-api"),
    path("api/gallery/", home_views.GalleryAPIView.as_view(), name="gallery-api"),
    path("api/testimonials/", home_views.TestimonialsAPIView.as_view(), name="testimonials-api"),
    path("api/blog/stats/", news_views.BlogStatsView.as_view(), name="blog-stats-api"),
    path("api/blog/click/", news_views.BlogClickView.as_view(), name="blog-click-api"),
    path("news/", news_views.redirect_to_news, name="news-redirect"),
    path("blogs/", news_views.news_redirect_view, name="blogs-redirect"),
    path("news-redirect/", news_views.news_landing_page, name="news-landing"),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    # Serve static and media files from development server
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = urlpatterns + [
    # For anything not caught by a more specific rule above, hand over to
    # Wagtail's page serving mechanism. This should be the last pattern in
    # the list:
    path("", include(wagtail_urls)),
    # Alternatively, if you want Wagtail pages to be served from a subpath
    # of your site, rather than the site root:
    #    path("pages/", include(wagtail_urls)),
]