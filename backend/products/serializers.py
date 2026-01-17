from rest_framework import serializers
from .models import Product, ProductReview


class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ["id", "name", "rating", "comment", "created_at"]


# 🔹 СПИСОК ТОВАРІВ
class ProductListSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "price",
            "weight",
            "category",
            "image",
            "average_rating",
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()


# 🔹 ДЕТАЛЬНА СТОРІНКА
class ProductDetailSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)
    images = serializers.SerializerMethodField()
    reviews = ProductReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_images(self, obj):
        return [img.image.url for img in obj.images.all()]

    def get_average_rating(self, obj):
        return obj.average_rating()
