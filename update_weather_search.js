const fs = require('fs');
let code = fs.readFileSync('src/app/weather/page.tsx', 'utf8');

const targetEffect = `  const [selectedDistrict, setSelectedDistrict] = useState<string>("GPS");

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async (lat: number, lon: number, locName: string) => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "02785a68098150e0254c7a9e7321daac";
        const res = await fetch(\`https://api.openweathermap.org/data/2.5/weather?lat=\${lat}&lon=\${lon}&appid=\${apiKey}&units=metric\`);
        const data = await res.json();
        if (data && data.weather && data.weather.length > 0 && isMounted) {
          const code = data.weather[0].icon;
          const condition = data.weather[0].main;
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

const newEffect = `  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchWeatherByCoords = async (lat: number, lon: number, locName: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "02785a68098150e0254c7a9e7321daac";
      const res = await fetch(\`https://api.openweathermap.org/data/2.5/weather?lat=\${lat}&lon=\${lon}&appid=\${apiKey}&units=metric\`);
      const data = await res.json();
      if (data && data.weather && data.weather.length > 0) {
        const code = data.weather[0].icon;
        const condition = data.weather[0].main;
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "02785a68098150e0254c7a9e7321daac";
      const geoRes = await fetch(\`https://api.openweathermap.org/geo/1.0/direct?q=\${encodeURIComponent(searchQuery)},IN&limit=1&appid=\${apiKey}\`);
      const geoData = await geoRes.json();
      if (geoData && geoData.length > 0) {
        const { lat, lon, name, state } = geoData[0];
        await fetchWeatherByCoords(lat, lon, \`\${name}\${state ? \`, \${state}\` : ''}\`);
      } else {
        alert("Location not found in India. Please try another city.");
      }
    } catch (err) {
      console.error("Geocoding failed", err);
      alert("Error searching location.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (isMounted) await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude, "Your Farm (GPS)");
        },
        (error) => {
          console.warn("GPS failed, falling back to Ahmedabad.", error);
          if (isMounted) fetchWeatherByCoords(23.0225, 72.5714, "Ahmedabad, Gujarat");
        }
      );
    } else {
      if (isMounted) fetchWeatherByCoords(23.0225, 72.5714, "Ahmedabad, Gujarat");
    }
    return () => { isMounted = false; };
  }, []);`;

code = code.replace(targetEffect, newEffect);

const targetUI = `      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant">
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
      </div>`;

const newUI = `      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-4 rounded-2xl border border-outline-variant">
        <div>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Live Weather</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time updates for any location in India.</p>
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto relative">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">search</span>
          <input 
            type="text"
            placeholder="Search city in India..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 md:w-64 bg-surface text-on-surface border border-outline rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button 
            type="submit" 
            disabled={isSearching}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSearching ? '...' : 'Search'}
          </button>
        </form>
      </div>`;

code = code.replace(targetUI, newUI);

fs.writeFileSync('src/app/weather/page.tsx', code);
console.log("Updated weather API code!");
