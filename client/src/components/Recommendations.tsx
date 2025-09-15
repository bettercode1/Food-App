import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import type { Restaurant, MenuItem, Order } from '@/types';

interface RecommendationsProps {
  onSelectRestaurant?: (restaurant: Restaurant) => void;
  onSelectMenuItem?: (item: MenuItem) => void;
}

interface RecommendationData {
  trendingRestaurants: Restaurant[];
  popularItems: MenuItem[];
  recommendedForYou: Restaurant[];
  recentlyOrdered: MenuItem[];
  seasonalOffers: MenuItem[];
}

export default function Recommendations({ onSelectRestaurant, onSelectMenuItem }: RecommendationsProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('trending');

  // Fetch user's order history for Useralization
  const { data: userOrders } = useQuery<Order[]>({
    queryKey: ['/api/orders/user', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/orders/user/${user?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user orders');
      }
      return response.json();
    },
  });

  // Fetch recommendation data
  const { data: recommendations, isLoading } = useQuery<RecommendationData>({
    queryKey: ['/api/recommendations', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/recommendations/${user?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      return response.json();
    },
  });

  // Generate Useralized recommendations based on order history
  const UseralizedRecommendations = useState(() => {
    if (!userOrders || userOrders.length === 0) return {
      favoriteRestaurants: [] as string[],
      favoriteCuisines: [] as string[],
    };

    const restaurantFrequency = new Map<string, number>();
    const cuisineFrequency = new Map<string, number>();

    userOrders.forEach(order => {
      if (order.restaurantId) {
        restaurantFrequency.set(order.restaurantId, (restaurantFrequency.get(order.restaurantId) || 0) + 1);
      }
      
      // Extract cuisine from order items or restaurant data
      order.items?.forEach(item => {
        // This would need to be enhanced with actual menu item data
        const cuisine = 'North Indian'; // Placeholder
        cuisineFrequency.set(cuisine, (cuisineFrequency.get(cuisine) || 0) + 1);
      });
    });

    return {
      favoriteRestaurants: Array.from(restaurantFrequency.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([restaurantId]) => restaurantId),
      favoriteCuisines: Array.from(cuisineFrequency.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([cuisine]) => cuisine),
    };
  })[0];

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'trending':
        return 'fa-fire';
      case 'popular':
        return 'fa-star';
      case 'Useral':
        return 'fa-heart';
      case 'recent':
        return 'fa-clock';
      case 'offers':
        return 'fa-gift';
      default:
        return 'fa-thumbs-up';
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'trending':
        return 'text-red-500';
      case 'popular':
        return 'text-yellow-500';
      case 'Useral':
        return 'text-pink-500';
      case 'recent':
        return 'text-blue-500';
      case 'offers':
        return 'text-green-500';
      default:
        return 'text-primary';
    }
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Recommendations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const recommendationSections = [
    {
      id: 'trending',
      title: 'Trending Now',
      icon: 'fa-fire',
      color: 'text-red-500',
      description: 'Most popular restaurants this week',
      data: recommendations?.trendingRestaurants || [],
    },
    {
      id: 'popular',
      title: 'Popular Items',
      icon: 'fa-star',
      color: 'text-yellow-500',
      description: 'Best-selling dishes across all restaurants',
      data: recommendations?.popularItems || [],
    },
    {
      id: 'Useral',
      title: 'Recommended for You',
      icon: 'fa-heart',
      color: 'text-pink-500',
      description: 'Based on your order history',
      data: recommendations?.recommendedForYou || [],
    },
    {
      id: 'recent',
      title: 'Recently Ordered',
      icon: 'fa-clock',
      color: 'text-blue-500',
      description: 'Your recent favorites',
      data: recommendations?.recentlyOrdered || [],
    },
    {
      id: 'offers',
      title: 'Special Offers',
      icon: 'fa-gift',
      color: 'text-green-500',
      description: 'Limited time deals and discounts',
      data: recommendations?.seasonalOffers || [],
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Recommendations</h2>
          <p className="text-muted-foreground mt-1">
            <i className="fas fa-magic mr-1"></i>
            Useralized suggestions just for you
          </p>
        </div>
        <Button variant="outline" size="sm">
          <i className="fas fa-refresh mr-2"></i>
          Refresh
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-utensils text-chart-1"></i>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-lg font-semibold">{userOrders?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-store text-chart-2"></i>
              <div>
                <p className="text-sm text-muted-foreground">Favorite Restaurants</p>
                <p className="text-lg font-semibold">{UseralizedRecommendations.favoriteRestaurants.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-heart text-chart-3"></i>
              <div>
                <p className="text-sm text-muted-foreground">Preferred Cuisines</p>
                <p className="text-lg font-semibold">{UseralizedRecommendations.favoriteCuisines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-trophy text-chart-4"></i>
              <div>
                <p className="text-sm text-muted-foreground">Loyalty Points</p>
                <p className="text-lg font-semibold">{(userOrders?.length || 0) * 10}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendation Sections */}
      <div className="space-y-8">
        {recommendationSections.map((section) => (
          <div key={section.id}>
            <div className="flex items-center space-x-3 mb-4">
              <i className={`fas ${section.icon} ${section.color} text-xl`}></i>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.data.slice(0, 6).map((item, index) => (
                <Card 
                  key={`${section.id}-${index}`}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => {
                    if ('restaurantId' in item && onSelectRestaurant) {
                      onSelectRestaurant(item as unknown as Restaurant);
                    } else if ('menuItemId' in item && onSelectMenuItem) {
                      onSelectMenuItem(item as MenuItem);
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {'name' in item ? item.name : 'Menu Item'}
                        </h4>
                        {'cuisine' in item && (
                          <p className="text-sm text-muted-foreground">{item.cuisine}</p>
                        )}
                        {'description' in item && (
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        <i className={`fas ${getRecommendationIcon(section.id)} mr-1 ${getRecommendationColor(section.id)}`}></i>
                        #{index + 1}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      {'rating' in item && (
                        <div className="flex items-center text-sm">
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          <span>{item.rating}</span>
                        </div>
                      )}
                      {'price' in item && (
                        <span className="text-sm font-medium text-foreground">₹{item.price}</span>
                      )}
                      {'distance' in item && (
                        <span className="text-xs text-muted-foreground">
                          <i className="fas fa-walking mr-1"></i>
                          {item.distance}m
                        </span>
                      )}
                    </div>

                    {section.id === 'Useral' && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <i className="fas fa-heart mr-1"></i>
                        Based on your preferences
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {section.data.length === 0 && (
              <div className="text-center py-8">
                <i className="fas fa-inbox text-2xl text-muted-foreground mb-2"></i>
                <p className="text-muted-foreground">No recommendations available</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Useralization Insights */}
      {userOrders && userOrders.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <i className="fas fa-chart-pie mr-2 text-chart-1"></i>
              Your Ordering Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-1">{userOrders.length}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-2">
                  ₹{userOrders.reduce((sum, order) => sum + order.total, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-chart-3">
                  {Math.round(userOrders.reduce((sum, order) => sum + order.total, 0) / userOrders.length)}
                </p>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
