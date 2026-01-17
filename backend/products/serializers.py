from rest_framework import serializers
from .models import Product, ProductImage, ProductReview


class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ["id", "name", "rating", "comment", "created_at"]


class ProductListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
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

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_average_rating(self, obj):
        return obj.average_rating()


class ProductDetailSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    reviews = ProductReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_images(self, obj):
        request = self.context.get("request")
        return [
            {"image": request.build_absolute_uri(img.image.url)}
            for img in obj.images.all()
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()
