from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock


class BlogContentBlock(blocks.StructBlock):
    """A block for general blog content."""
    
    title = blocks.CharBlock(
        required=True,
        max_length=200,
        help_text="Section title"
    )
    
    content = blocks.RichTextBlock(
        required=True,
        help_text="Main content"
    )
    
    class Meta:
        icon = "doc-full"
        label = "Blog Content"


class BlogImageBlock(blocks.StructBlock):
    """A block for blog images with captions."""
    
    image = ImageChooserBlock(required=True)
    caption = blocks.CharBlock(
        required=False,
        max_length=250,
        help_text="Image caption"
    )
    
    class Meta:
        template = "blocks/blog_image_block.html"
        icon = "image"
        label = "Blog Image"


class BlogQuoteBlock(blocks.StructBlock):
    """A block for blog quotes."""
    
    quote = blocks.TextBlock(required=True)
    author = blocks.CharBlock(
        required=False,
        max_length=100,
        help_text="Quote author"
    )
    
    class Meta:
        template = "blocks/blog_quote_block.html"
        icon = "openquote"
        label = "Blog Quote"