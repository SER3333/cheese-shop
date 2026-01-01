from django.contrib.sitemaps import Sitemap
from .models import Product

class ProductSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return Product.objects.all()

    def location(self, obj):
        return f"/product/{obj.slug}/"  # slug SEO-friendly

class StaticViewSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.6

    def items(self):
        return ["home", "siry", "dzhemy", "soky"]

    def location(self, item):
        return "/" if item == "home" else f"/{item}/"
