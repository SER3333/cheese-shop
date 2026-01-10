"""
WSGI config for cheeseshop project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
from whitenoise import WhiteNoise
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')

application = get_wsgi_application()

# Додаємо підтримку медіа-файлів для WhiteNoise
if not settings.DEBUG:
    application = WhiteNoise(application, root=settings.MEDIA_ROOT)
    application.add_files(settings.MEDIA_ROOT, prefix=settings.MEDIA_URL)