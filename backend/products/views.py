from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer

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

'''
from rest_framework import generics
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer

@method_decorator(cache_page(30), name="dispatch")
class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    queryset = (
        Product.objects
        .filter(available=True)
        .only("id", "name", "slug", "price", "weight", "image", "created_at")

    )

    def get_serializer_context(self):
        return {"request": self.request}


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    queryset = (
        Product.objects
        .filter(available=True)
        .prefetch_related("images")
    )

    def get_serializer_context(self):
        return {"request": self.request}
'''