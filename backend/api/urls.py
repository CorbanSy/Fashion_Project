from django.urls import path
from .views import CreateUserView, FashionItemListCreate, UserPreferenceDetail, OutfitListCreateView, OutfitRecommendationView, VirtualClosetView, ImageUploadView

urlpatterns = [
    path('users/', CreateUserView.as_view(), name='create-user'),
    path("fashion-items/", FashionItemListCreate.as_view(), name="fashion-item-list"),
    path("user/preferences/", UserPreferenceDetail.as_view(), name="user-preferences"),
    path("outfits/<int:outfit_id>/recommendations/", OutfitRecommendationView.as_view(), name="outfit-recommendations"),
    path("outfits/", OutfitListCreateView.as_view(), name="outfits-list-create"),
    path("virtual-closet/", VirtualClosetView.as_view(), name="virtual-closet"),
    path('upload-image/', ImageUploadView.as_view(), name="upload-image"),
]
