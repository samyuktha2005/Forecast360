from firebase_admin import firestore

db = firestore.client()

class WeatherData:
    collection_name = "weather_data"  # Firestore Collection Name

    @staticmethod
    def add_weather_record(timestamp, temperature, pressure, humidity, wind_speed):
        """Add a new weather data record to Firestore."""
        doc_ref = db.collection(WeatherData.collection_name).document()
        doc_ref.set({
            "timestamp": timestamp,
            "temperature": temperature,
            "pressure": pressure,
            "humidity": humidity,
            "wind_speed": wind_speed
        })
        return doc_ref.id

    @staticmethod
    def get_all_weather_data():
        """Retrieve all weather data from Firestore."""
        docs = db.collection(WeatherData.collection_name).stream()
        return [{doc.id: doc.to_dict()} for doc in docs]

class WeatherPrediction:
    collection_name = "weather_predictions"

    @staticmethod
    def add_prediction(timestamp, predicted_temp, predicted_pressure, predicted_humidity, predicted_wind_speed):
        """Save LSTM model predictions to Firestore."""
        doc_ref = db.collection(WeatherPrediction.collection_name).document()
        doc_ref.set({
            "timestamp": timestamp,
            "predicted_temperature": predicted_temp,
            "predicted_pressure": predicted_pressure,
            "predicted_humidity": predicted_humidity,
            "predicted_wind_speed": predicted_wind_speed
        })
        return doc_ref.id

    @staticmethod
    def get_all_predictions():
        """Retrieve all stored predictions from Firestore."""
        docs = db.collection(WeatherPrediction.collection_name).stream()
        return [{doc.id: doc.to_dict()} for doc in docs]
