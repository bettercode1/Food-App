import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import GoogleMap from '@/components/GoogleMap';
import type { Restaurant, TechPark } from '@/types';

interface FoodPlacesProps {
  selectedPark: TechPark;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function FoodPlaces({ selectedPark, onSelectRestaurant }: FoodPlacesProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: restaurants, isLoading } = useQuery<Restaurant[]>({
    queryKey: ['/api/restaurants/tech-park', selectedPark.id],
  });

  const filteredRestaurants = restaurants?.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Food Places in {selectedPark.name}</h2>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Food Places in {selectedPark.name}</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64"
              data-testid="input-restaurant-search"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
          </div>
          <Button variant="outline" data-testid="button-filter">
            <i className="fas fa-filter mr-2"></i>
            Filter
          </Button>
        </div>
      </div>

      {/* Google Maps Integration */}
      <GoogleMap restaurants={filteredRestaurants} selectedPark={selectedPark} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <Card 
            key={restaurant.id}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => onSelectRestaurant(restaurant)}
            data-testid={`card-restaurant-${restaurant.id}`}
          >
            <div className="h-48 bg-muted relative overflow-hidden">
              {restaurant.imageUrl && (
                <img 
                  src={restaurant.imageUrl} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 right-2 bg-card px-2 py-1 rounded-full text-xs font-medium">
                <i className="fas fa-star text-yellow-400 mr-1"></i>
                {restaurant.rating}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2" data-testid={`text-restaurant-name-${restaurant.id}`}>
                {restaurant.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{restaurant.cuisine}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>
                  <i className="fas fa-walking mr-1"></i>
                  {restaurant.distance}m
                </span>
                <span>
                  <i className="fas fa-clock mr-1"></i>
                  {restaurant.preparationTime}
                </span>
                <span className="text-primary font-medium">{restaurant.priceRange}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge 
                  variant={restaurant.isOpen ? "default" : "destructive"}
                  data-testid={`badge-status-${restaurant.id}`}
                >
                  {restaurant.isOpen ? "Open" : "Closed"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {restaurant.deliveryAvailable && restaurant.takeawayAvailable && restaurant.dineinAvailable
                    ? "All options"
                    : restaurant.deliveryAvailable
                    ? "Delivery available"
                    : restaurant.takeawayAvailable
                    ? "Takeaway only"
                    : "Dine-in only"
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRestaurants.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <i className="fas fa-search text-4xl text-muted-foreground mb-4"></i>
          <h3 className="text-lg font-semibold text-foreground mb-2">No restaurants found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
