from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse, Http404
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
import json
import os
from django.conf import settings

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
            data = request.data.copy()

            if 'favorite_colors' in data and isinstance(data['favorite_colors'], str):
                try:
                    data['favorite_colors'] = json.loads(data['favorite_colors'])
                except json.JSONDecodeError:
                    return Response({"error": "Invalid JSON format for favorite colors"}, status=status.HTTP_400_BAD_REQUEST)
            if 'favorite_styles' in data and isinstance(data['favorite_styles'], str):
                try:
                    data['favorite_styles'] = json.loads(data['favorite_styles'])
                except json.JSONDecodeError:
                    return Response({"error": "Invalid JSON format for favorite styles"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(instance, data=data, partial=partial)
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
        detected_items = self.process_outfit_image(outfit)
        return JsonResponse({"detected_items": detected_items}, status=201)

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
        logger.info(f"Detected items: {detected_items}")  # Log the detected items
        return detected_items

    def detect_clothing_items(self, predictions, image):
        detected_items = []
        image_width, image_height = image.size
        min_size = 20  # Increase the minimum size of the cropped image

        for element in predictions[0]['boxes']:
            x1, y1, x2, y2 = map(int, element.tolist())
            logger.info(f"Bounding box coordinates: ({x1}, {y1}), ({x2}, {y2})")

            if x1 < 0: x1 = 0
            if y1 < 0: y1 = 0
            if x2 > image_width: x2 = image_width
            if y2 > image_height: y2 = image_height

            width = x2 - x1
            height = y2 - y1

            if width > min_size and height > min_size:
                item_image = image.crop((x1, y1, x2, y2))
                item_name = f"clothing_item_{x1}_{y1}"  # Use a better naming strategy
                item_image_path = f"media/closet_items/{item_name}.jpg"
                item_image.save(item_image_path)
                detected_items.append({
                    "item_name": item_name,
                    "item_image": item_image_path
                })
                logger.info(f"Detected item saved: {item_name}")
            else:
                logger.info(f"Skipped small bounding box: ({x1}, {y1}), ({x2}, {y2}) with size ({width}, {height})")

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
        item_name = self.request.data.get('item_name')
        if not image:
            logger.error('No image provided in the request')
            raise serializers.ValidationError('No image provided')
        if not item_name:
            logger.error('No name provided in the request')
            raise serializers.ValidationError('No name provided')
        logger.info(f"Image provided: {image}")
        try:
            category = predict_image(image)  # Predict the category using the CNN model
        except Exception as e:
            logger.error(f"Error in prediction: {str(e)}")
            raise serializers.ValidationError('Error in prediction')
        logger.info(f'Detected category: {category}')
        try:
            serializer.save(user=self.request.user, category=category, item_name=item_name)
        except Exception as e:
            logger.error(f"Error saving serializer: {str(e)}")
            raise serializers.ValidationError('Error saving serializer')
        logger.info(f"Saved item: {serializer.data}")
        return Response({'category': category, **serializer.data}, status=status.HTTP_201_CREATED)

class VirtualClosetDeleteView(generics.DestroyAPIView):
    queryset = VirtualCloset.objects.all()
    serializer_class = VirtualClosetSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Http404:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error deleting item: {str(e)}", exc_info=True)
            return Response(status=status.HTTP_400_BAD_REQUEST)

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

class ConfirmDetectedItemsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        detected_items = request.data.get('detected_items', [])
        user = request.user

        for item in detected_items:
            item_name = item.get('item_name')
            item_image = item.get('item_image')
            if item_name and item_image:
                VirtualCloset.objects.create(
                    user=user,
                    item_name=item_name,
                    item_image=item_image
                )
        return Response({"detail": "Items confirmed and saved successfully."}, status=status.HTTP_201_CREATED)
    
class PredictItemDetails(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            image = request.data.get('image')
            if not image:
                return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

            # Save the image temporarily to the media folder
            temp_image_path = os.path.join(settings.MEDIA_ROOT, 'temp_image.jpg')
            with open(temp_image_path, 'wb+') as temp_file:
                for chunk in image.chunks():
                    temp_file.write(chunk)

            # Predict the item category here
            category = predict_image(temp_image_path)
            
            return Response({"category": category}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error predicting item category: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
