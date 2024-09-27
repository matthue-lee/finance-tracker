from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('upload/', views.upload_pdf, name='upload_pdf'),
    path('upload_success/', views.upload_success, name='upload_success'),
]