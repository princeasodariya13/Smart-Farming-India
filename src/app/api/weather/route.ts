import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat') || '23.0225'; // Default to Ahmedabad
    const lon = searchParams.get('lon') || '72.5714';

    if (!API_KEY) {
      return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 500 });
    }

    // Fetch current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const currentData = await currentRes.json();

    // Fetch 5-day / 3-hour forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastRes.json();

    if (currentData.cod !== 200 || forecastData.cod !== "200") {
      return NextResponse.json({ success: false, error: "Failed to fetch weather data" }, { status: 500 });
    }

    // MAP CURRENT WEATHER
    const currentWeather = {
      location: { city: currentData.name, state: "", lastUpdated: new Date().toLocaleTimeString() },
      temperatureC: Math.round(currentData.main.temp),
      feelsLikeC: Math.round(currentData.main.feels_like),
      highC: Math.round(currentData.main.temp_max),
      lowC: Math.round(currentData.main.temp_min),
      condition: currentData.weather[0].main,
      icon: getIconForCondition(currentData.weather[0].id),
    };

    // MAP METRICS
    const metrics = [
      { id: "humidity", label: "Humidity", value: currentData.main.humidity, unit: "%", icon: "Droplets", trend: "flat", trendValue: "Stable" },
      { id: "wind", label: "Wind Speed", value: Math.round(currentData.wind.speed * 3.6), unit: "km/h", icon: "Wind", trend: "flat", trendValue: "Stable" },
      { id: "pressure", label: "Air Pressure", value: currentData.main.pressure, unit: "hPa", icon: "Gauge", trend: "flat", trendValue: "Stable" },
      { id: "visibility", label: "Visibility", value: Math.round(currentData.visibility / 1000), unit: "km", icon: "Eye", status: { label: "Clear", tone: "primary" } },
    ];

    // MAP HOURLY FORECAST (Next 8 entries = 24 hours)
    const hourly = forecastData.list.slice(0, 8).map((item: { dt: number; main: { temp: number }; weather: { id: number }[]; pop?: number; wind: { speed: number } }) => {
      const date = new Date(item.dt * 1000);
      return {
        time: date.getHours() === new Date().getHours() ? "Now" : date.toLocaleTimeString([], { hour: 'numeric' }),
        icon: getIconForCondition(item.weather[0].id),
        temperatureC: Math.round(item.main.temp),
        rainChance: Math.round((item.pop || 0) * 100),
        windKmh: Math.round(item.wind.speed * 3.6),
      };
    });

    // MAP DAILY FORECAST (Extract one reading per day, usually at 12:00)
    const dailyMap = new Map();
    for (const item of forecastData.list) {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      if (!dailyMap.has(day)) {
        dailyMap.set(day, {
          day: day,
          icon: getIconForCondition(item.weather[0].id),
          highC: Math.round(item.main.temp_max),
          lowC: Math.round(item.main.temp_min),
          rainChance: Math.round((item.pop || 0) * 100),
        });
      } else {
        const existing = dailyMap.get(day);
        existing.highC = Math.max(existing.highC, Math.round(item.main.temp_max));
        existing.lowC = Math.min(existing.lowC, Math.round(item.main.temp_min));
        existing.rainChance = Math.max(existing.rainChance, Math.round((item.pop || 0) * 100));
      }
    }
    const sevenDay = Array.from(dailyMap.values()).slice(0, 7);
    if (sevenDay.length > 0) sevenDay[0].day = "Today";

    return NextResponse.json({
      success: true,
      data: {
        currentWeather,
        metrics,
        hourly,
        sevenDay,
      }
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// Helper to map OpenWeatherMap condition codes to our lucide icons
function getIconForCondition(code: number) {
  if (code >= 200 && code < 300) return 'CloudLightning';
  if (code >= 300 && code < 600) return 'CloudRain';
  if (code >= 600 && code < 700) return 'CloudSnow';
  if (code >= 700 && code < 800) return 'CloudFog';
  if (code === 800) return 'Sun';
  if (code === 801) return 'CloudSun';
  if (code > 801) return 'Cloud';
  return 'Sun';
}
