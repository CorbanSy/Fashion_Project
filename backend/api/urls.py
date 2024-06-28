from django.urls import path
from .views import FashionItemListCreate, UserPreferenceDetail

urlpatterns = [
    path("fashion-items/", FashionItemListCreate.as_view(), name="fashion-item-list"),
    path("user/preferences/", UserPreferenceDetail.as_view(), name="user-preferences"),
]
