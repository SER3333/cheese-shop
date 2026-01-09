from django.db import models
from django.utils.text import slugify
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

class Product(models.Model):
    CATEGORY_CHOICES = [
        ("cheese", "Сири"),
        ("jam", "Джеми"),
        ("juice", "Соки"),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, blank=True, null=True)
    short_description = models.TextField(blank=True)
    long_description = models.TextField(blank=True)

    weight = models.PositiveIntegerField(
        verbose_name="Вага (г)",
        help_text="Вводити тільки цифри, наприклад: 250",
        null=True,
        blank=True
    )

    price = models.DecimalField(max_digits=8, decimal_places=2)
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="cheese")

    def save(self, *args, **kwargs):
        is_new_image = False

        if self.pk:
            old = Product.objects.filter(pk=self.pk).first()
            if old and old.image != self.image:
                is_new_image = True
        else:
            is_new_image = bool(self.image)

        # ===== SLUG =====
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        super().save(*args, **kwargs)

        # ===== IMAGE COMPRESSION =====
        if self.image and is_new_image:
            img = Image.open(self.image)

            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            img.thumbnail((1600, 1600), Image.LANCZOS)

            buffer = BytesIO()
            img.save(buffer, format="JPEG", quality=75, optimize=True)
            buffer.seek(0)

            filename = self.image.name.split("/")[-1]  # 🔥 ВАЖЛИВО

            self.image.save(
                filename,
                ContentFile(buffer.read()),
                save=False
            )

            buffer.close()
            super().save(update_fields=["image"])

    def __str__(self):
        return f"{self.name} — {self.weight} г"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/gallery/')
    alt_text = models.CharField(max_length=255, blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.image:
            img = Image.open(self.image)

            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            img.thumbnail((1600, 1600), Image.LANCZOS)

            buffer = BytesIO()
            img.save(buffer, format="JPEG", quality=75, optimize=True)
            buffer.seek(0)

            self.image.save(
                self.image.name,
                ContentFile(buffer.read()),
                save=False
            )

            buffer.close()
            super().save(update_fields=["image"])


    def __str__(self):
        return f"Image for {self.product.name}"
