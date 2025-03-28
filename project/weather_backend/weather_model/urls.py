from django.urls import path
from .views import add_weather_record, get_weather_data, add_prediction, get_predictions

urlpatterns = [
    path("add_weather/", add_weather_record, name="add_weather"),
    path("get_weather/", get_weather_data, name="get_weather"),
    path("add_prediction/", add_prediction, name="add_prediction"),
    path("get_predictions/", get_predictions, name="get_predictions"),
]
