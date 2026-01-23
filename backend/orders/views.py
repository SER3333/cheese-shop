from rest_framework import generics, status
from .models import Order
from .serializers import OrderSerializer
import os
import requests
from rest_framework.response import Response


class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("❌ Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        order = serializer.save()
        self.send_telegram_notification(order)

    def send_telegram_notification(self, order):
        token = os.getenv('TELEGRAM_TOKEN')
        chat_id = os.getenv('TELEGRAM_CHAT_ID')

        if not token or not chat_id:
            return

        text = (
            f"📦 Нове замовлення #{order.id}\n"
            f"👤 Ім'я: {order.name}\n"
            f"👤 Фамілія : {order.surname}\n"
            f"📞 Телефон: {order.phone}\n"
            f"📍 Адреса: {order.address or '-'}\n"
            f"📝 Коментар: {order.comment or '-'}\n"
            f"🧀 Товари:\n"
        )

        total_weight = 0

        for item in order.orderitem_set.all():
            item_weight = item.weight * item.quantity
            total_weight += item_weight

            text += (
                f"• {item.product.short_description} — "
                f"{item.weight} г × {item.quantity} "
                f"(разом {item_weight} г)\n"
            )

        text += f"\n⚖️ Загальна вага: {total_weight} г"
        text += f"\n💰 Сума: {order.total_price} грн"

        requests.get(
            f"https://api.telegram.org/bot{token}/sendMessage",
            params={
                "chat_id": chat_id,
                "text": text
            }
        )
