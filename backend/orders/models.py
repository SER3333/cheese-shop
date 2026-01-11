from django.db import models
from products.models import Product

class Order(models.Model):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_lehght=100)
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    products = models.ManyToManyField(Product, through='OrderItem')

    def __str__(self):
        return f"Order #{self.id} ({self.name})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    quantity = models.PositiveIntegerField(default=1)

    weight = models.PositiveIntegerField(
        verbose_name="Вага (г)",
        help_text="Скільки грамів цього продукту замовили",
    )

    def __str__(self):
        return f"{self.product.name} — {self.weight} г × {self.quantity}"
