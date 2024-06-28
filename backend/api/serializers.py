from django.contrib.auth.models import User
from rest_framework import serializers
from .models import FashionItem, UserPreference, Outfit, OutfitRecommendation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only":True}}

    def create(self, validated_data):
        user = user.objects.create_user(**validated_data)
        return user

class FashionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FashionItem
        fields = ["id", "name", "description", "image_url", "created_at", "updated_at"]

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ["id", "user", "preferred_styles", "preferred_colors"]
        extra_kwargs = {"user": {"read_only":True}}

class OutfitSerializers(serializers.ModelSerializer):
    class Meta:
        model = Outfit
        fields = ["id", "user", "image", "rating"]
        extra_kwargs = {"user": {"read_only": True}}

class OutfitRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutfitRecommendation
        fields = "__all__"