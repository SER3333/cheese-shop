from rest_framework import generics
from .models import Product, ProductReview
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductReviewSerializer
)


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(available=True).order_by("-created_at")
    serializer_class = ProductListSerializer


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(available=True)
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"


class ProductReviewCreateView(generics.CreateAPIView):
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer

