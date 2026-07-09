const fs = require('fs');
let code = fs.readFileSync('src/app/weather/page.tsx', 'utf8');

const districtsData = `
const gujaratDistricts = [
  { name: "Ahmedabad", lat: 23.0225, lon: 72.5714 },
  { name: "Amreli", lat: 21.6032, lon: 71.2221 },
  { name: "Anand", lat: 22.5645, lon: 72.9289 },
  { name: "Aravalli", lat: 23.4241, lon: 73.3100 },
  { name: "Banaskantha", lat: 24.1723, lon: 71.8493 },
  { name: "Bharuch", lat: 21.7051, lon: 72.9959 },
  { name: "Bhavnagar", lat: 21.7645, lon: 72.1519 },
  { name: "Botad", lat: 22.1706, lon: 71.6684 },
  { name: "Chhota Udaipur", lat: 22.3082, lon: 74.0044 },
  { name: "Dahod", lat: 22.8315, lon: 74.2566 },
  { name: "Dang", lat: 20.8062, lon: 73.6934 },
  { name: "Devbhoomi Dwarka", lat: 22.2442, lon: 68.9685 },
  { name: "Gandhinagar", lat: 23.2156, lon: 72.6369 },
  { name: "Gir Somnath", lat: 20.8872, lon: 70.4026 },
  { name: "Jamnagar", lat: 22.4707, lon: 70.0577 },
  { name: "Junagadh", lat: 21.5222, lon: 70.4579 },
  { name: "Kheda", lat: 22.7538, lon: 72.6841 },
  { name: "Kutch", lat: 23.7337, lon: 69.8597 },
  { name: "Mahisagar", lat: 23.2842, lon: 73.4913 },
  { name: "Mehsana", lat: 23.5880, lon: 72.3693 },
  { name: "Morbi", lat: 22.8120, lon: 70.8320 },
  { name: "Narmada", lat: 21.8703, lon: 73.5356 },
  { name: "Navsari", lat: 20.9467, lon: 72.9520 },
  { name: "Panchmahal", lat: 22.7663, lon: 73.6167 },
  { name: "Patan", lat: 23.8493, lon: 72.1266 },
  { name: "Porbandar", lat: 21.6417, lon: 69.6293 },
  { name: "Rajkot", lat: 22.3039, lon: 70.8022 },
  { name: "Sabarkantha", lat: 23.6393, lon: 73.1119 },
  { name: "Surat", lat: 21.1702, lon: 72.8311 },
  { name: "Surendranagar", lat: 22.7276, lon: 71.6371 },
  { name: "Tapi", lat: 21.1714, lon: 73.6186 },
  { name: "Vadodara", lat: 22.3072, lon: 73.1812 },
  { name: "Valsad", lat: 20.5992, lon: 72.9342 }
];
`;

const fetchWeatherOld = `  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(\`https://api.open-meteo.com/v1/forecast?latitude=\${lat}&longitude=\${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&hourly=temperature_2m,precipitation_probability,wind_speed_10m\`);
        const data = await res.json();
        if (data && data.current) {
          const code = data.current.weather_code;
          let condition = "Clear";
          let icon = Sun;
          if (code >= 1 && code <= 3) { condition = "Cloudy"; icon = CloudSun; }
          else if (code >= 51 && code <= 67) { condition = "Rain"; icon = CloudRain; }
          else if (code >= 80) { condition = "Showers"; icon = CloudRain; }

          setLiveWeather(prev => ({
            ...prev,
            location: { ...prev.location, city: locationName === "Fetching GPS..." ? "Current Location" : locationName, lastUpdated: new Date().toLocaleTimeString() },
            temperatureC: Math.round(data.current.temperature_2m),
            feelsLikeC: Math.round(data.current.temperature_2m) + 2,
            condition,
            icon
          }));
        }
      } catch (err) {
        console.warn("Weather API unavailable", err);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLocationName("Your Farm");
          await fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("GPS failed, falling back to Gujarat.", error);
          setLocationName("Gujarat, India");
          fetchWeather(23.0225, 72.5714);
        }
      );
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocationName("Gujarat, India");
      fetchWeather(23.0225, 72.5714);
    }
  }, [locationName]);`;

const fetchWeatherNew = `  const [selectedDistrict, setSelectedDistrict] = useState<string>("GPS");

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async (lat: number, lon: number, locName: string) => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "02785a68098150e0254c7a9e7321daac";
        const res = await fetch(\`https://api.openweathermap.org/data/2.5/weather?lat=\${lat}&lon=\${lon}&appid=\${apiKey}&units=metric\`);
        const data = await res.json();
        if (data && data.weather && data.weather.length > 0 && isMounted) {
          const code = data.weather[0].icon;
          let condition = data.weather[0].main;
          let icon = Sun;
          if (code.startsWith("01")) icon = Sun;
          else if (code.startsWith("02")) icon = CloudSun;
          else if (code.startsWith("03") || code.startsWith("04")) icon = Cloud;
          else if (code.startsWith("09") || code.startsWith("10")) icon = CloudRain;
          else if (code.startsWith("11")) icon = CloudRain;
          else if (code.startsWith("13")) icon = CloudSnow;
          else icon = Cloud;

          setLiveWeather(prev => ({
            ...prev,
            location: { ...prev.location, city: locName, lastUpdated: new Date().toLocaleTimeString() },
            temperatureC: Math.round(data.main.temp),
            feelsLikeC: Math.round(data.main.feels_like),
            highC: Math.round(data.main.temp_max),
            lowC: Math.round(data.main.temp_min),
            condition,
            icon
          }));
        }
      } catch (err) {
        console.warn("Weather API unavailable", err);
      }
    };

    if (selectedDistrict === "GPS") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            if (isMounted) await fetchWeather(position.coords.latitude, position.coords.longitude, "Your Farm (GPS)");
          },
          (error) => {
            console.warn("GPS failed, falling back to Ahmedabad.", error);
            if (isMounted) fetchWeather(23.0225, 72.5714, "Ahmedabad, Gujarat");
          }
        );
      } else {
        if (isMounted) fetchWeather(23.0225, 72.5714, "Ahmedabad, Gujarat");
      }
    } else {
      const district = gujaratDistricts.find(d => d.name === selectedDistrict);
      if (district && isMounted) {
        fetchWeather(district.lat, district.lon, \`\${district.name}, Gujarat\`);
      }
    }
    
    return () => { isMounted = false; };
  }, [selectedDistrict]);`;

code = code.replace(fetchWeatherOld, fetchWeatherNew);
code = code.replace('function WeatherContent() {', districtsData + '\nfunction WeatherContent() {');

// We don't need locationName anymore if we removed it
code = code.replace('  const [locationName, setLocationName] = useState("Fetching GPS...");\n', '');

const selectorUI = `
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant">
        <div>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Live Weather</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time updates for Gujarat districts via OpenWeatherMap.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="material-symbols-outlined text-primary">location_on</span>
          <select 
            className="flex-1 md:w-64 bg-surface text-on-surface border border-outline rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="GPS">Use My GPS Location</option>
            <optgroup label="Gujarat Districts">
              {gujaratDistricts.map(d => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <WeatherHero`;

code = code.replace('<WeatherHero', selectorUI);

fs.writeFileSync('src/app/weather/page.tsx', code);
