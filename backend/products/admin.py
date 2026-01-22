from django.contrib import admin
from .models import Product, ProductImage, ProductReview

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    prepopulated_fields = {"slug": ("short_description",)}

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "name", "rating", "is_approved", "created_at")
    list_filter = ("rating", "is_approved")
    search_fields = ("name", "comment")



admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage)