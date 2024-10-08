from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    bio = models.TextField(blank=True)
    favorite_colors = models.CharField(max_length=200, blank=True)
    favorite_styles = models.CharField(max_length=200, blank=True)
    body_measurements = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.user.username

class FashionItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image_url = models.URLField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='fashion_items/', default='fashion_items/default_image.jpg')
    category = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name
    
class UserPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="preferences")
    preferred_styles = models.TextField()
    preferred_colors = models.TextField()

    def __str__(self):
        return f"{self.user.username}'s Preferences"
    
class Outfit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="outfits")
    image = models.ImageField(upload_to="outfits/")
    rating = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Outfit {self.id} by {self.user.username}"

class OutfitRecommendation(models.Model):
    outfit = models.ForeignKey(Outfit, on_delete=models.CASCADE, related_name="recommendations")
    recommended_item = models.ForeignKey(FashionItem, on_delete=models.CASCADE)
    reason = models.TextField()

    def __str__(self):
        return f"Recommendation for {self.outfit.id}"
    
class VirtualCloset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="closet_item")
    item_name = models.CharField(max_length=100)
    item_image = models.ImageField(upload_to="closet_items/")
    category = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.item_name} in {self.user.username}'s closet"