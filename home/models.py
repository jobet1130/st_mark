from django.db import models  # For standard Django fields

from wagtail.models import Page
from wagtail.fields import StreamField
from wagtail import blocks  # We'll use this to define an inline block
from wagtail.admin.panels import FieldPanel

# Import your custom block
from home.blocks import WelcomeSectionBlock


# Optional inline block example to use 'blocks' import
class HighlightBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True, max_length=100)
    description = blocks.TextBlock(required=False)

    class Meta:
        icon = "star"
        label = "Highlight"


class HomePage(Page):
    # Standard Django model field
    subtitle = models.CharField(max_length=255, blank=True)

    # StreamField using both a custom block and an inline block
    body = StreamField(
        [
            ('welcome_section', WelcomeSectionBlock()),
        ],
        use_json_field=True,
        blank=True
    )

    # Wagtail admin panels
    content_panels = Page.content_panels + [
        FieldPanel('subtitle'),
        FieldPanel('body'),
    ]
