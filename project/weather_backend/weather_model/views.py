from django.http import JsonResponse
from .firebase_models import WeatherData, WeatherPrediction

def add_weather_record(request):
    """API endpoint to add weather data to Firestore."""
    if request.method == "POST":
        data = request.POST
        record_id = WeatherData.add_weather_record(
            timestamp=data.get("timestamp"),
            temperature=float(data.get("temperature")),
            pressure=float(data.get("pressure")),
            humidity=float(data.get("humidity")),
            wind_speed=float(data.get("wind_speed"))
        )
        return JsonResponse({"message": "Weather record added", "record_id": record_id})

def get_weather_data(request):
    """API endpoint to get all weather data from Firestore."""
    data = WeatherData.get_all_weather_data()
    return JsonResponse({"weather_data": data})

def add_prediction(request):
    """API endpoint to add LSTM model predictions to Firestore."""
    if request.method == "POST":
        data = request.POST
        prediction_id = WeatherPrediction.add_prediction(
            timestamp=data.get("timestamp"),
            predicted_temp=float(data.get("predicted_temperature")),
            predicted_pressure=float(data.get("predicted_pressure")),
            predicted_humidity=float(data.get("predicted_humidity")),
            predicted_wind_speed=float(data.get("predicted_wind_speed"))
        )
        return JsonResponse({"message": "Prediction added", "prediction_id": prediction_id})

def get_predictions(request):
    """API endpoint to fetch all predictions."""
    data = WeatherPrediction.get_all_predictions()
    return JsonResponse({"predictions": data})
