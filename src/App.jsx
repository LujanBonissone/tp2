import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

const API_WEATHER = `http://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&lang=es&q=`;
const API_BACKEND = `http://localhost:5000/api/clima`;

export default function App() {
  const [city, setCity] = useState("");
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temperature: "",
    condition: "",
    icon: "",
    conditionText: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, message: "" });
    setLoading(true);
  
    try {
      if (!city.trim()) {
        throw new Error("El campo ciudad es obligatorio");
      }
  
      const response = await fetch(`${API_WEATHER}${city}`);
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error.message);
      }
  
      const weatherData = {
        city: data.location.name,
        country: data.location.country,
        temperature: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      };
  
      setWeather(weatherData);
  
      // Enviar los datos al backend
      const backendResponse = await fetch(API_BACKEND, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(weatherData),
      });
  
      if (!backendResponse.ok) {
        const backendErrorData = await backendResponse.json();
        throw new Error(backendErrorData.error || "Error al guardar los datos en el servidor");
      }
    } catch (error) {
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <Container maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Weather App
      </Typography>

      <Box
        sx={{ display: "grid", gap: 2 }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={error.error}
          helperText={error.message}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Cargando..."
        >
          Buscar
        </LoadingButton>
      </Box>

      {weather.city && (
        <Box sx={{ mt: 2, display: "grid", gap: 2, textAlign: "center" }}>
          <Typography variant="h4" component="h2">
            {weather.city}, {weather.country}
          </Typography>

          <Box
            component="img"
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ margin: "0 auto" }}
          />

          <Typography variant="h5" component="h3">
            {weather.temperature} °C
          </Typography>

          <Typography variant="h6" component="h4">
            {weather.conditionText}
          </Typography>
        </Box>
      )}

      <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }}>
        Powered by:{" "}
        <a href="http://www.weatherapi.com" title="Weather API">
          WeatherAPI.com
        </a>
      </Typography>
    </Container>
  );
}