import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import type { Restaurant, TechPark } from '@/types';

interface GoogleMapProps {
  restaurants: Restaurant[];
  selectedPark: TechPark;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default function GoogleMap({ restaurants, selectedPark }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const mapOptions = {
        center: { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      setIsLoaded(true);
    };

    loadGoogleMaps();

    return () => {
      if ((window as any).initMap) {
        delete (window as any).initMap;
      }
    };
  }, []);

  useEffect(() => {
    if (!map || !isLoaded || !window.google) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: any[] = [];

    // Add markers for each restaurant
    restaurants.forEach((restaurant, index) => {
      const position = {
        lat: 12.9716 + (Math.random() - 0.5) * 0.01, // Random position near center
        lng: 77.5946 + (Math.random() - 0.5) * 0.01
      };

      const marker = new window.google.maps.Marker({
        position,
        map,
        title: restaurant.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#fff" stroke-width="2"/>
              <text x="20" y="25" text-anchor="middle" fill="white" font-size="16" font-weight="bold">${index + 1}</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-lg">${restaurant.name}</h3>
            <p class="text-sm text-gray-600">${restaurant.cuisine}</p>
            <p class="text-sm text-gray-600">⭐ ${restaurant.rating} • ${restaurant.distance}</p>
            <p class="text-sm text-gray-600">⏱️ ${restaurant.estimatedTime || restaurant.preparationTime}</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
      map.fitBounds(bounds);
    }
  }, [map, restaurants, isLoaded]);

  if (!isLoaded) {
    return (
      <Card className="mb-6 shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-6">
          <div className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 h-80 rounded-2xl border border-border/50 shadow-inner overflow-hidden" data-testid="map-container">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-8 w-2 h-2 bg-secondary rounded-full animate-pulse delay-200"></div>
              <div className="absolute bottom-6 left-8 w-4 h-4 bg-accent rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse delay-700"></div>
              <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-secondary rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-accent rounded-full animate-pulse delay-300"></div>
            </div>
            
            {/* Central loading content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                {/* Loading icon with gradient */}
                <div className="relative">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary via-secondary to-accent p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                  </div>
                  {/* Pulse rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full border border-secondary/20 animate-ping delay-200"></div>
                </div>
                
                {/* Enhanced text */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-5 w-5 text-primary animate-bounce" />
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      Loading Google Maps
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Preparing restaurant locations...
                  </p>
                  
                  {/* Progress dots */}
                  <div className="flex justify-center space-x-1 mt-4">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gradient overlay borders */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent"></div>
            <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 shadow-lg border-0 bg-gradient-to-br from-background to-muted/10">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Restaurant Locations
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {restaurants.length} restaurants in {selectedPark.name}
          </p>
        </div>
        <div 
          ref={mapRef} 
          className="w-full h-80 rounded-2xl border border-border/50 shadow-lg overflow-hidden bg-gradient-to-br from-muted/20 to-muted/40" 
          data-testid="map-container"
        />
        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Click markers for details</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span>Real-time locations</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
