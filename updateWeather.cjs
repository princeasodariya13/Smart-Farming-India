const fs = require('fs');
let content = fs.readFileSync('src/app/weather/page.tsx', 'utf8');

content = content.replace(
  '  const [liveWeather, setLiveWeather] = useState(currentWeather);',
  `  const [liveWeather, setLiveWeather] = useState(currentWeather);
  const [liveMetrics, setLiveMetrics] = useState(metrics);
  const [liveHourly, setLiveHourly] = useState(hourly);
  const [liveSevenDay, setLiveSevenDay] = useState(sevenDay);

  const getIconComponent = (name) => {
    switch(name) {
      case 'Sun': return Sun;
      case 'CloudSun': return CloudSun;
      case 'Cloud': return Cloud;
      case 'CloudRain': return CloudRain;
      case 'CloudSnow': return CloudSnow;
      case 'CloudLightning': return Radar;
      case 'CloudFog': return Cloud;
      case 'Droplets': return Droplets;
      case 'Wind': return Wind;
      case 'Gauge': return Gauge;
      case 'Eye': return Eye;
      case 'Thermometer': return Thermometer;
      case 'Sprout': return Sprout;
      default: return Sun;
    }
  };`
);

content = content.replace(
  /const fetchWeatherByCoords = async \(lat: number, lon: number, locName: string\) => \{[\s\S]*?\} catch \(err\) \{[\s\S]*?\}\n  \};/g,
  `const fetchWeatherByCoords = async (lat: number, lon: number, locName: string) => {
    try {
      const res = await fetch(\`/api/weather?lat=\${lat}&lon=\${lon}\`);
      const result = await res.json();
      if (result.success) {
        const d = result.data;
        if (locName) d.currentWeather.location.city = locName;
        d.currentWeather.icon = getIconComponent(d.currentWeather.icon);
        
        const mappedMetrics = d.metrics.map((m) => ({ ...m, icon: getIconComponent(m.icon) }));
        const mappedHourly = d.hourly.map((h) => ({ ...h, icon: getIconComponent(h.icon) }));
        const mappedSevenDay = d.sevenDay.map((s) => ({ ...s, icon: getIconComponent(s.icon) }));
        
        setLiveWeather(d.currentWeather);
        setLiveMetrics(mappedMetrics);
        setLiveHourly(mappedHourly);
        setLiveSevenDay(mappedSevenDay);
      }
    } catch (err) {
      console.warn("Weather API unavailable", err);
    }
  };`
);

content = content.replace(
  '{metrics.map((metric) => (',
  '{liveMetrics.map((metric) => ('
);

content = content.replace(
  '<HourlyForecast items={hourly} />',
  '<HourlyForecast items={liveHourly} />'
);

content = content.replace(
  '<SevenDayForecast days={sevenDay} />',
  '<SevenDayForecast days={liveSevenDay} />'
);

fs.writeFileSync('src/app/weather/page.tsx', content);
