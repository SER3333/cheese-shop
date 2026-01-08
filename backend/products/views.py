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
        .only("id", "name", "slug", "price", "weight", "image")
        .order_by("-created_at")
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
