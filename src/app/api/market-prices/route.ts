import { NextResponse } from 'next/server';
import axios from 'axios';

// In-memory cache for API response
let cache = {
  data: null as any[] | null,
  timestamp: 0,
};

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const marketParam = searchParams.get('market') || 'Gondal';
    const commodityParam = searchParams.get('commodity');
    const dateParam = searchParams.get('date');

    const API_KEY = process.env.DATA_GOV_API_KEY;
    if (!API_KEY) {
      console.error("DATA_GOV_API_KEY is not defined in environment variables.");
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    const now = Date.now();
    let rawRecords: any[] = [];
    let isFallback = false;

    // Check if cache is valid
    if (cache.data && (now - cache.timestamp < CACHE_DURATION_MS)) {
      rawRecords = cache.data;
    } else {
      try {
        // Fetch only Gondal market data from govt API and get up to 500 records
        const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=500&filters[market]=${encodeURIComponent(marketParam)}`;
        
        const response = await axios.get(url, {
          timeout: 10000
        });

        if (response.data && response.data.records) {
          rawRecords = response.data.records;
          cache = { data: rawRecords, timestamp: now };
        } else {
          throw new Error("Invalid response format from government API");
        }
      } catch (apiError) {
        console.error("Failed to fetch from Government API:", apiError);
        if (cache.data) {
          console.warn("Using expired cached data due to API failure.");
          rawRecords = cache.data;
          isFallback = true;
        } else {
          throw apiError;
        }
      }
    }

    // Process Data
    let filteredRecords = rawRecords.filter(item => 
      item.market && item.market.toLowerCase().includes(marketParam.toLowerCase())
    );

    if (commodityParam) {
      filteredRecords = filteredRecords.filter(item => 
        item.commodity && item.commodity.toLowerCase().includes(commodityParam.toLowerCase())
      );
    }

    if (dateParam && dateParam !== 'today') {
      filteredRecords = filteredRecords.filter(item => 
        item.arrival_date === dateParam
      );
    }

    const seenCommodities = new Set();
    const uniqueRecords = [];

    for (const record of filteredRecords) {
      const normalizedName = record.commodity?.toLowerCase().trim();
      if (!seenCommodities.has(normalizedName)) {
        seenCommodities.add(normalizedName);
        uniqueRecords.push({
          commodity: record.commodity,
          market: record.market,
          district: record.district,
          state: record.state,
          arrival_date: record.arrival_date,
          min_price: record.min_price,
          max_price: record.max_price,
          modal_price: record.modal_price
        });
      }
    }

    uniqueRecords.sort((a, b) => a.commodity.localeCompare(b.commodity));

    return NextResponse.json({
      success: true,
      cached: now - cache.timestamp > 0 && now - cache.timestamp < CACHE_DURATION_MS,
      isFallback,
      lastUpdated: new Date(cache.timestamp).toISOString(),
      data: uniqueRecords
    });

  } catch (error) {
    console.error("Market API Route Error:", error);
    // If there is no cached data at all
    return NextResponse.json({ 
      success: false, 
      error: 'Unable to load market prices. Please try again later.' 
    }, { status: 503 });
  }
}
