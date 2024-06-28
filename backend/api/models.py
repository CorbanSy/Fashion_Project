from django.db import models
from django.contrib.auth.models import User
    
class FashionItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image_url = models.URLField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class UserPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="preferences")
    preferred_styles = models.TextField()
    preferred_colors = models.TextField()

    def __str__(self):
        return f"{self.user.username}'s Preferences"