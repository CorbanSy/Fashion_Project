from django.urls import path
from .views import (
    UserProfileView,
    CreateUserView,
    FashionItemListCreate,
    UserPreferenceDetail,
    OutfitListCreateView,
    OutfitRecommendationView,
    VirtualClosetView,
    VirtualClosetDeleteView,  # Import the delete view
    ImageUploadView,
    ConfirmDetectedItemsView,
    PredictItemDetails,
)

urlpatterns = [
    path('users/', CreateUserView.as_view(), name='create-user'),
    path("fashion-items/", FashionItemListCreate.as_view(), name="fashion-item-list"),
    path("user/preferences/", UserPreferenceDetail.as_view(), name="user-preferences"),
    path("outfits/<int:outfit_id>/recommendations/", OutfitRecommendationView.as_view(), name="outfit-recommendations"),
    path("outfits/", OutfitListCreateView.as_view(), name="outfits-list-create"),
    path("confirm-detected-items/", ConfirmDetectedItemsView.as_view(), name="confirm_detected_items"),
    path('predict-item-details/', PredictItemDetails.as_view(), name='predict-item-details'),
    path("virtual-closet/", VirtualClosetView.as_view(), name="virtual-closet"),
    path('virtual-closet/<int:pk>/', VirtualClosetDeleteView.as_view(), name="virtual-closet-delete"),  # Add this line
    path('upload-image/', ImageUploadView.as_view(), name="upload-image"),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
