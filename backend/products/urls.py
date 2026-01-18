from django.urls import path
from .views import ProductListView, ProductDetailView, ProductReviewCreateView

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('<slug:slug>/', ProductDetailView.as_view(), name='product-detail'),  # SEO-friendly slug
    path("reviews/create/", ProductReviewCreateView.as_view(), name="review-create"),
]