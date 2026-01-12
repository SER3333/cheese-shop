from django.contrib.sitemaps import Sitemap
from .models import Product

class ProductSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8
    protocol = "https"   # 🔥 ОБОВʼЯЗКОВО

    def items(self):
        return Product.objects.filter(available=True)

    def location(self, obj):
        return f"/product/{obj.slug}/"


class StaticViewSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.6
    protocol = "https"   # 🔥 ОБОВʼЯЗКОВО

    def items(self):
        return ["home", "siry", "dzhemy", "soky"]

    def location(self, item):
        return "/" if item == "home" else f"/{item}/"
