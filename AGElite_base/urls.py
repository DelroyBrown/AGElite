from django.contrib import admin
from django.urls import path, include

app_name = 'AGElite_base'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('AGElite_home.urls')),
]
