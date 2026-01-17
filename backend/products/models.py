from django.db import models
from django.utils.text import slugify
from django.db.models import Avg

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

    def average_rating(self):
        return (
            self.reviews
            .filter(is_approved=True)
            .aggregate(avg=Avg("rating"))["avg"]
            or 0
        )

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} — {self.weight} г"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/gallery/')
    alt_text = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Image for {self.product.name}"

class ProductReview(models.Model):
    RATING_CHOICES = [
        (1, "1"),
        (2, "2"),
        (3, "3"),
        (4, "4"),
        (5, "5"),
    ]

    product = models.ForeignKey(
        Product,
        related_name="reviews",
        on_delete=models.CASCADE
    )

    name = models.CharField(
        max_length=100,
        verbose_name="Ім'я"
    )

    rating = models.PositiveSmallIntegerField(
        choices=RATING_CHOICES,
        verbose_name="Оцінка"
    )

    comment = models.TextField(
        verbose_name="Відгук"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    is_approved = models.BooleanField(
        default=True,
        verbose_name="Опубліковано"
    )

    def __str__(self):
        return f"{self.product.name} — {self.rating}★"

