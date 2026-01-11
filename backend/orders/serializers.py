from decimal import Decimal
from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.IntegerField()

    class Meta:
        model = OrderItem
        fields = ['product','quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'name',
            'surname',
            'phone',
            'address',
            'comment',
            'total_price',
            'items'
        ]
        read_only_fields = ['total_price']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        total_price = Decimal('0.00')

        for item in items_data:
            product = Product.objects.get(id=item['product'])

            weight = item.get('weight') or product.weight
            quantity = item.get('quantity', 1)

            # 💰 ціна за позицію
            item_price = (
                Decimal(weight) / Decimal(100)
            ) * product.price * quantity

            total_price += item_price

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                weight = product.weight,  # ✅ БЕРЕМО З ТОВАРУ
            )

        order.total_price = total_price
        order.save(update_fields=['total_price'])

        return order
