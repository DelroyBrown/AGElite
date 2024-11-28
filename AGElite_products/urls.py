from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from . import views

app_name = 'AGElite_products'

urlpatterns = [
    path('store/', views.store_page, name='store'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)