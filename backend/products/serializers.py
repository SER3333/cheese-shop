from rest_framework import serializers
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image"]

class ProductListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "price",
            "weight",
            "image",
        )

    def get_image(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url)

class ProductDetailSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "short_description",
            "long_description",
            "price",
            "image",
            "images",
            "weight",
        )

    def get_image(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url)