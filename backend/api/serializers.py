from django.contrib.auth.models import User
from rest_framework import serializers
from .models import FashionItem, UserPreference, Outfit, OutfitRecommendation, VirtualCloset, UserProfile
import json
import logging

logger = logging.getLogger(__name__)

class UserProfileSerializer(serializers.ModelSerializer):
    def validate_favorite_colors(self, value):
        if isinstance(value, str):
            try:
                return json.loads(value)
            except (TypeError, json.JSONDecodeError):
                raise serializers.ValidationError("Invalid JSON format for favorite colors")
        return value

    def validate_favorite_styles(self, value):
        if isinstance(value, str):
            try:
                return json.loads(value)
            except (TypeError, json.JSONDecodeError):
                raise serializers.ValidationError("Invalid JSON format for favorite styles")
        return value

    class Meta:
        model = UserProfile
        fields = ['profile_picture', 'bio', 'favorite_colors', 'favorite_styles', 'body_measurements']
        extra_kwargs = {'user': {'read_only': True}}

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "password2"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Username already exists."})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        try:
            user = User.objects.create_user(**validated_data)
            return user
        except Exception as e:
            logger.error(f"error creating user in serializers: {str(e)}", exc_info=True)
            raise e

class FashionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FashionItem
        fields = ["id", "name", "description", "image_url", "created_at", "updated_at", "image", "category"]

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ["id", "user", "preferred_styles", "preferred_colors"]
        extra_kwargs = {"user": {"read_only":True}}

class OutfitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outfit
        fields = ["id", "user", "image", "rating"]
        extra_kwargs = {"user": {"read_only": True}}

class OutfitRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutfitRecommendation
        fields = "__all__"

class VirtualClosetSerializer(serializers.ModelSerializer):
    class Meta:
        model = VirtualCloset
        fields = ["id", "user", "item_name", "item_image", "category"]
        extra_kwargs = {"user": {"read_only": True}}