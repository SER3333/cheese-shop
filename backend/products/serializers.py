from rest_framework import serializers
from .models import Product, ProductImage, ProductReview

class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ["id", "name", "rating", "comment", "created_at"]

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image"]

class ProductListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    average_rating = serializers.FloatField()



    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'short_description',
            'long_description',
            'price',
            'image',
            'available',
            'category',
            'images',
            'weight',
            "average_rating",
            "reviews",
        ]

    def get_image(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url)

    def get_images(self, obj):
        request = self.context.get("request")
        return [
            {"image": request.build_absolute_uri(img.image.url)}
            for img in obj.images.all()
        ]

    def get_average_rating(self, obj):
        return obj.average_rating()

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
