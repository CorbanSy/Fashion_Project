from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import FashionItemSerializer, UserPreferencesSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import FashionItem, UserPreference

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
    
    