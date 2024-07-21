from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, FashionItem, UserPreference, Outfit, OutfitRecommendation, VirtualCloset

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'

class UserPreferenceInline(admin.StackedInline):
    model = UserPreference
    can_delete = False
    verbose_name_plural = 'Preferences'

class FashionItemInline(admin.TabularInline):
    model = VirtualCloset
    extra = 0
    verbose_name_plural = 'Closet Items'

class OutfitInline(admin.TabularInline):
    model = Outfit
    extra = 0
    verbose_name_plural = 'Outfits'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline, UserPreferenceInline, FashionItemInline, OutfitInline)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(FashionItem)
admin.site.register(OutfitRecommendation)
