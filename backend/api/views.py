from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import FashionItemSerializer, UserPreferencesSerializer, UserSerializer, OutfitSerializer, OutfitRecommendationSerializer, VirttualClosetSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import FashionItem, UserPreference, Outfit, OutfitRecommendation, VirtualCloset
import logging
import torch
from torchvision import models, transforms
from PIL import Image
import numpy as np

logger = logging.getLogger(__name__)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, * args, **kwargs)
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}", exc_info=True)
            return Response({"detail": "An error occured while creating the user."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        outfit = serializer.save(user=self.request.user)
        #Process the image to extract clothing items
        self.process_outfit_image(outfit)

    def process_outfit_image(self, outfit):
        #load the image
        image_path = outfit.image.path
        image = Image.open(image_path)
        #Preprocess the image
        transform = transforms.Compose([
            transforms.ToTensor(),
        ])
        image_tensor = transform(image).unsqueeze(0)
        #load the pre-trained model
        model = models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
        model.eval()
        #Detect clothing items
        with torch.no_grad():
            predictions = model(image_tensor)
        # Prcoess predictions
        detected_items = self.detect_clothing_items(predictions, image)
        #Save detected items to the VirtualCloset
        for item_name, item_image in detected_items:
            VirtualCloset.objects.create(
                user=outfit.user,
                item_name=item_name,
                item_image=item_image
            )

    def detect_clothing_items(self, predictions, image):
        detected_items = []
        for element in predictions[0]['boxes']:
            x1, y1, x2, y2 = map(int, element.tolist())
            item_image = image.crop((x1, y1, x2, y2))
            item_name = "clothing_item" #you might want to use a better naming strategy
            item_image_path = f"media/closet_items/{item_name}_{x1}_{y1}.jpg"
            item_image.save(item_image_path)
            detected_items.append((item_name, item_image_path))
        return detected_items

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