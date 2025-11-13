from wagtail.blocks import StructBlock, CharBlock, TextBlock, ListBlock


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