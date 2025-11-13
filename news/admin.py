from django.contrib import admin
from .models import BlogIndexPage, BlogPage

# Register your models here.
admin.site.register(BlogIndexPage)
admin.site.register(BlogPage)