from wagtail.blocks import StructBlock, CharBlock, TextBlock, ListBlock
from wagtail.images.blocks import ImageChooserBlock


class WelcomeSectionBlock(StructBlock):
    """A block for the welcome section with configurable text fields."""
    
    welcome_text = CharBlock(
        required=True,
        max_length=100,
        help_text="Text for the welcome badge",
        default="Welcome to St. Mark University"
    )
    
    heading = CharBlock(
        required=True,
        max_length=200,
        help_text="Main heading text",
        default="Shaping Leaders, Advancing Knowledge"
    )
    
    description = TextBlock(
        required=True,
        max_length=1000,
        help_text="Description paragraph text",
        default="At St. Mark University, we are committed to providing world-class education that prepares students for success in an ever-changing global landscape. Our diverse community of scholars, researchers, and innovators work together to push the boundaries of knowledge and create positive impact in society."
    )
    
    highlights = ListBlock(
        CharBlock(
            max_length=200,
            help_text="Highlight points"
        ),
        help_text="List of highlight points",
        default=[
            "Over 40 years of academic excellence",
            "Distinguished faculty with industry expertise",
            "State-of-the-art research facilities",
            "Global partnerships and exchange programs",
            "95% graduate employment rate"
        ]
    )
    
    class Meta:
        icon = "placeholder"
        label = "Welcome Section"
        template = "components/welcome_section.html"


class NewsItemBlock(StructBlock):
    """A block for individual news items."""
    
    title = CharBlock(
        required=True,
        max_length=200,
        help_text="News title"
    )
    
    date = CharBlock(
        required=True,
        max_length=100,
        help_text="Publication date"
    )
    
    excerpt = TextBlock(
        required=True,
        max_length=500,
        help_text="Brief excerpt of the news article"
    )
    
    image = ImageChooserBlock(
        required=True,
        help_text="News image"
    )
    
    class Meta:
        icon = "doc-full"
        label = "News Item"


class NewsSectionBlock(StructBlock):
    """A block for the news section with configurable news items."""
    
    heading = CharBlock(
        required=True,
        max_length=200,
        help_text="Section heading",
        default="Latest News & Announcements"
    )
    
    subheading = TextBlock(
        required=False,
        max_length=500,
        help_text="Section subheading or description",
        default="Stay updated with the latest happenings, achievements, and events at St. Mark University."
    )
    
    news_items = ListBlock(NewsItemBlock(), help_text="List of news items")
    
    class Meta:
        icon = "folder-open-inverse"
        label = "News Section"
        template = "components/news_section.html"

class EventItemBlock(StructBlock):
    title = CharBlock(required=True, max_length=200, help_text="Event title")
    date = CharBlock(required=True, max_length=100, help_text="Event date")
    time = CharBlock(required=True, max_length=100, help_text="Event time")
    location = CharBlock(required=True, max_length=200, help_text="Event location")
    description = TextBlock(required=True, max_length=500, help_text="Event description")
    
    class Meta:
        icon = "date"
        label = "Event Item"

class EventsSectionBlock(StructBlock):
    heading = CharBlock(required=True, max_length=200, default="Upcoming Events", help_text="Section heading")
    description = TextBlock(required=False, max_length=500, default="Join us for exciting events, workshops, and activities throughout the academic year.", help_text="Section description")
    events = ListBlock(EventItemBlock(), help_text="List of events")
    
    class Meta:
        icon = "calendar"
        label = "Events Section"
        template = "components/events_section.html"