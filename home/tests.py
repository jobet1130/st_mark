from django.test import TestCase
import os


class WelcomeSectionTestCase(TestCase):
    def test_welcome_section_template_content(self):
        """
        Test that the welcome section template has proper structure and accessibility attributes.
        """
        # Check that the template file contains the expected elements
        template_path = os.path.join('home', 'templates', 'components', 'welcome_section.html')
        with open(template_path, 'r') as f:
            content = f.read()
            
        # Check that the heading element has accessibility attributes
        self.assertIn('role="heading"', content)
        self.assertIn('aria-level="2"', content)
        
        # Check that the heading uses default values to prevent empty content
        self.assertIn('|default:"Shaping Leaders, Advancing Knowledge"', content)
        
        # Check that Font Awesome icons have proper accessibility attributes
        self.assertIn('aria-hidden="true"', content)
        
        # Check that highlights section has fallback content
        self.assertIn('{% else %}', content)