import { Card, CardContent } from '@/components/ui/card';
import type { Restaurant, TechPark } from '@/types';

interface GoogleMapProps {
  restaurants: Restaurant[];
  selectedPark: TechPark;
}

export default function GoogleMap({ restaurants, selectedPark }: GoogleMapProps) {
  // In a real implementation, you would integrate with Google Maps JavaScript API
  // For now, showing a placeholder that demonstrates the concept
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="bg-muted h-64 rounded-lg flex items-center justify-center" data-testid="map-container">
          <div className="text-center">
            <i className="fas fa-map-marked-alt text-4xl text-muted-foreground mb-2"></i>
            <p className="text-muted-foreground font-medium">Google Maps Integration</p>
            <p className="text-sm text-muted-foreground">
              Showing {restaurants.length} restaurants in {selectedPark.name}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              <p>Real-time locations and ratings</p>
              <p>Distance calculations and directions</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
