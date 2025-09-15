import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleMap from '@/components/GoogleMap';
import { Store, Search, Store as RestaurantIcon, Star, MapPin as DirectionsWalk, Clock as AccessTime, Grid3X3 as GridView, Map, Filter as FilterList } from 'lucide-react';
import type { Restaurant, TechPark } from '@/types';

interface FoodPlacesProps {
  selectedPark: TechPark;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function FoodPlaces({ selectedPark, onSelectRestaurant }: FoodPlacesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const { data: restaurants, isLoading } = useQuery<Restaurant[]>({
    queryKey: ['/api/restaurants/tech-park', selectedPark.id],
    queryFn: async () => {
      const response = await fetch(`/api/restaurants/tech-park/${selectedPark.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      return response.json();
    },
  });

  const filteredAndSortedRestaurants = useMemo(() => {
    if (!restaurants) return [];
    
    let filtered = restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCuisine = selectedCuisine === 'all' || 
        restaurant.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
      
      return matchesSearch && matchesCuisine;
    });

    // Sort restaurants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'distance':
          return parseInt(a.distance.toString()) - parseInt(b.distance.toString());
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [restaurants, searchTerm, selectedCuisine, sortBy]);

  const uniqueCuisines = useMemo(() => {
    if (!restaurants) return [];
    const cuisines = restaurants.flatMap(r => r.cuisine.split(',').map(c => c.trim()));
    return Array.from(new Set(cuisines));
  }, [restaurants]);

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
        <div>
          <h2 className="text-2xl font-bold text-foreground">Food Places in {selectedPark.name}</h2>
          <p className="text-muted-foreground mt-1 flex items-center">
            <Store className="mr-1" />
            {filteredAndSortedRestaurants.length} restaurants available
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <GridView className="mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <Map className="mr-1" />
            Map
          </Button>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search restaurants, cuisine, dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-restaurant-search"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
            <SelectTrigger>
              <SelectValue placeholder="Cuisine Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center">
                  <RestaurantIcon className="mr-2" />
                  All Cuisines
                </div>
              </SelectItem>
              {uniqueCuisines.map(cuisine => (
                <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">
                <div className="flex items-center">
                  <Star className="mr-2" />
                  Rating
                </div>
              </SelectItem>
              <SelectItem value="distance">
                <div className="flex items-center">
                  <DirectionsWalk className="mr-2" />
                  Distance
                </div>
              </SelectItem>
              <SelectItem value="name">
                <div className="flex items-center">
                  <RestaurantIcon className="mr-2" />
                  Name
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="flex items-center">
            <FilterList className="mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'map')}>
        <TabsContent value="grid" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedRestaurants.map((restaurant) => (
          <Card 
            key={restaurant.id}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => onSelectRestaurant(restaurant)}
            data-testid={`card-restaurant-${restaurant.id}`}
          >
            <div className="h-48 bg-muted relative overflow-hidden">
              {restaurant.imageUrl ? (
                <img 
                  src={restaurant.imageUrl} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <RestaurantIcon className="text-6xl text-muted-foreground" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-card px-2 py-1 rounded-full text-xs font-medium flex items-center">
                <Star className="text-yellow-400 mr-1 text-sm" />
                {restaurant.rating}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2" data-testid={`text-restaurant-name-${restaurant.id}`}>
                {restaurant.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{restaurant.cuisine}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span className="flex items-center">
                  <DirectionsWalk className="mr-1 text-sm" />
                  {restaurant.distance}m
                </span>
                <span className="flex items-center">
                  <AccessTime className="mr-1 text-sm" />
                  {restaurant.preparationTime}
                </span>
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
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          <GoogleMap restaurants={filteredAndSortedRestaurants} selectedPark={selectedPark} />
        </TabsContent>
      </Tabs>

      {filteredAndSortedRestaurants.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Search className="text-4xl text-muted-foreground mb-4 mx-auto" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No restaurants found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
