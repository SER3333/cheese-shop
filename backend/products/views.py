from rest_framework import generics
from .models import Product, ProductReview
from .serializers import ProductSerializer, ProductReviewSerializer

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(available=True).order_by('-created_at')
    serializer_class = ProductSerializer

    def get_serializer_context(self):
        return {"request": self.request}


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(available=True)
    serializer_class = ProductSerializer
    lookup_field = "slug"  # <- ось це ключове

    def get_serializer_context(self):
        return {"request": self.request}

class ProductReviewCreateView(generics.CreateAPIView):
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer