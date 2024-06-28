from django.contrib.auth.models import User
from rest_framework import serializers
from .models import FashionItem, UserPreference


class FashionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FashionItem
        fields = ["id", "name", "description", "image_url", "created_at", "updated_at"]

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ["id", "user", "preferred_styles", "preferred_colors"]
        extra_kwargs = {"user": {"read_only":True}}