# pdf_upload/urls.py
from django.urls import path
from .views import CSVFetchView, CSVCategoryView


urlpatterns = [
    path('fetch-csv/', CSVFetchView.as_view(), name='fetch-csv'),
    path('update-csv-category/', CSVCategoryView.as_view(), name='update-csv-category'),  # Define the route

]
