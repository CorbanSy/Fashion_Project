from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import FashionItemSerializer, UserPreferencesSerializer, UserSerializer, OutfitSerializer, OutfitRecommendationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import FashionItem, UserPreference, Outfit, OutfitRecommendation

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class FashionItemListCreate(generics.ListCreateAPIView):
    queryset = FashionItem.objects.all()
    serializer_class = FashionItemSerializer
    permission_classes = [IsAuthenticated]

class UserPreferenceDetail(generics.RetrieveUpdateAPIView):
    queryset = UserPreference.objects.all()
    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.preferences
    
class OutfitCreateView(generics.CreateAPIView):
    serializer_class = OutfitSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OutfitRecommendationView(generics.ListAPIView):
    serializer_class = OutfitRecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        outfit_id = self.kwargs["outfit_id"]
        return OutfitRecommendation.objects.filter(outfit_id=outfit_id)
    
    def post(self, request, *args, **kwargs):
        outfit_id = self.kwargs["outfit_id"]
        outfit = Outfit.objects.get(id=outfit_id)
        recommended_item = FashionItem.objects.order_by("?").first()
        recommendation = OutfitRecommendation.objects.create(
            outfit=outfit,
            recommended_item=recommended_item,
            reason="Consider changing the color to something brighter."
        )
        serializer = self.get_serializer(recommendation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)