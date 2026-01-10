"""
WSGI config for cheeseshop project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cheeseshop.settings')

# Спершу ініціалізуємо Django додаток
application = get_wsgi_application()

# Тільки ПІСЛЯ цього додаємо WhiteNoise для медіа-файлів
# /app/media — це шлях, який ви вказали при створенні Volume в Railway
application = WhiteNoise(application, root='/app/media')
application.add_files('/app/media', prefix='/media/')