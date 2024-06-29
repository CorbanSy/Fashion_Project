from django.urls import path
from .views import FashionItemListCreate, UserPreferenceDetail, OutfitCreateView, OutfitRecommendationView, VirtualClostestView

urlpatterns = [
    path("fashion-items/", FashionItemListCreate.as_view(), name="fashion-item-list"),
    path("user/preferences/", UserPreferenceDetail.as_view(), name="user-preferences"),
    path("outfits/", OutfitCreateView.as_view(), name="create-outfit"),
    path("outfits/<int:outfit_id>/recommendations/", OutfitRecommendationView.as_view(), name="outfit-recommendations"),
    path("virtual-closet/", VirtualClostestView.as_view(), name="virtual-closet"),
]
