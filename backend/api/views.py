# views.py
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FashionItemSerializer, UserPreferencesSerializer, UserSerializer, OutfitSerializer, OutfitRecommendationSerializer, VirtualClosetSerializer, UserProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import FashionItem, UserPreference, Outfit, OutfitRecommendation, VirtualCloset, UserProfile
import logging
import torch
from torchvision import models, transforms
from PIL import Image
import traceback
from .predict_model import predict_image


logger = logging.getLogger(__name__)

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        if created:
            logger.info(f"UserProfile created for user: {self.request.user}")
        return user_profile
    
    def update(self, request, *args, **kwargs):
        logger.info(f"Incoming update request data: {request.data}")
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            logger.info(f"UserProfile updated successfully: {serializer.data}")
            return Response(serializer.data)
        except serializers.ValidationError as e:
            logger.error(f"Validation error: {e.detail}")
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error updating profile: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        logger.info(f"Attempting to create user with data: {request.data}")
        try:
            response = super().create(request, *args, **kwargs)
            logger.info(f"User created successfully: {response.data}")
            return response
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}", exc_info=True)
            logger.error(traceback.format_exc())
            return Response({"detail": "An error occurred while creating the user."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

class OutfitListCreateView(generics.ListCreateAPIView):
    queryset = Outfit.objects.all()
    serializer_class = OutfitSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        outfit = serializer.save(user=self.request.user)
        self.process_outfit_image(outfit)
    
    def process_outfit_image(self, outfit):
        image_path = outfit.image.path
        image = Image.open(image_path)
        transform = transforms.Compose([transforms.ToTensor()])
        image_tensor = transform(image).unsqueeze(0)
        model = models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
        model.eval()
        with torch.no_grad():
            predictions = model(image_tensor)
        detected_items = self.detect_clothing_items(predictions, image)
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
            item_name = "clothing_item"  # you might want to use a better naming strategy
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

class VirtualClosetView(generics.ListCreateAPIView):
    serializer_class = VirtualClosetSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return VirtualCloset.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        logger.info(f"Request data: {self.request.data}")
        image = self.request.data.get('item_image')
        if not image:
            logger.error('No image provided in the request')
            raise serializers.ValidationError('No image provided')
        logger.info(f"Image provided: {image}")
        try:
            category = predict_image(image)  # Predict the category using the CNN model
        except Exception as e:
            logger.error(f"Error in prediction: {str(e)}")
            raise serializers.ValidationError('Error in prediction')
        logger.info(f'Detected category: {category}')
        try:
            serializer.save(user=self.request.user, category=category)
        except Exception as e:
            logger.error(f"Error saving serializer: {str(e)}")
            raise serializers.ValidationError('Error saving serializer')
        logger.info(f"Saved item: {serializer.data}")
        return Response({'category': category, **serializer.data}, status=status.HTTP_201_CREATED)

class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        logger.info(f"Request data: {request.data}")
        file_serializer = FashionItemSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            image_path = file_serializer.data['image']
            category = predict_image(image_path)
            return Response({'category': category}, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Validation errors: {file_serializer.errors}")
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
