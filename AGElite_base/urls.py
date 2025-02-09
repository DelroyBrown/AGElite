from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

app_name = 'AGElite_base'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('AGElite_home.urls')),
    path('', include('AGElite_products.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)