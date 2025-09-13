import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Restaurant, MenuCategory, MenuItem, CartItem } from '@/types';

interface RestaurantMenuProps {
  restaurant: Restaurant;
  cart: CartItem[];
  onUpdateCart: (item: MenuItem, action: 'add' | 'remove' | 'increment' | 'decrement') => void;
  onViewCart: () => void;
}

export default function RestaurantMenu({ 
  restaurant, 
  cart, 
  onUpdateCart, 
  onViewCart 
}: RestaurantMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const { toast } = useToast();

  const { data: menuData, isLoading } = useQuery<MenuCategory[]>({
    queryKey: ['/api/menu/restaurant', restaurant.id],
  });

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartItemQuantity = (menuItemId: string) => {
    const cartItem = cart.find(item => item.menuItem.id === menuItemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    if (!menuItem.isAvailable) {
      toast({
        variant: 'destructive',
        title: 'Item Unavailable',
        description: `${menuItem.name} is currently not available.`,
      });
      return;
    }
    
    onUpdateCart(menuItem, 'add');
    toast({
      title: 'Added to Cart',
      description: `${menuItem.name} added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex space-x-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-6 w-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 flex space-x-4">
                <Skeleton className="w-24 h-24 flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const firstCategory = menuData?.[0]?.name || '';
  const currentCategory = activeCategory || firstCategory;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-restaurant-menu-title">
            {restaurant.name} Menu
          </h2>
          <p className="text-muted-foreground">{restaurant.description}</p>
        </div>
        <Button 
          className="bg-chart-3 hover:bg-chart-3/90" 
          onClick={onViewCart}
          data-testid="button-view-cart"
        >
          <i className="fas fa-shopping-cart mr-2"></i>
          View Cart ({totalItems})
        </Button>
      </div>

      {/* Menu Categories */}
      <div className="flex space-x-6 mb-6 border-b border-border">
        {menuData?.map((category) => (
          <button
            key={category.id}
            className={`pb-3 font-medium transition-colors ${
              (activeCategory || firstCategory) === category.name
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => setActiveCategory(category.name)}
            data-testid={`button-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuData
          ?.find(category => category.name === currentCategory)
          ?.items?.map((item) => {
            const quantity = getCartItemQuantity(item.id);
            
            return (
              <Card key={item.id} data-testid={`card-menu-item-${item.id}`}>
                <CardContent className="p-4 flex space-x-4">
                  <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground" data-testid={`text-item-name-${item.id}`}>
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-lg font-bold text-foreground" data-testid={`text-item-price-${item.id}`}>
                            ₹{item.price}
                          </span>
                          <Badge 
                            variant={item.isVeg ? "default" : "secondary"}
                            className={item.isVeg ? "bg-chart-2" : "bg-chart-5"}
                          >
                            <i className={`fas ${item.isVeg ? 'fa-seedling' : 'fa-drumstick-bite'} mr-1`}></i>
                            {item.isVeg ? 'Veg' : 'Non-Veg'}
                          </Badge>
                          {!item.isAvailable && (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {quantity > 0 ? (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 bg-destructive/10 text-destructive hover:bg-destructive/20"
                              onClick={() => onUpdateCart(item, 'decrement')}
                              data-testid={`button-decrement-${item.id}`}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-medium" data-testid={`text-quantity-${item.id}`}>
                              {quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 bg-chart-2/10 text-chart-2 hover:bg-chart-2/20"
                              onClick={() => onUpdateCart(item, 'increment')}
                              data-testid={`button-increment-${item.id}`}
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleAddToCart(item)}
                            disabled={!item.isAvailable}
                            data-testid={`button-add-${item.id}`}
                          >
                            Add +
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {menuData?.find(category => category.name === currentCategory)?.items?.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-utensils text-4xl text-muted-foreground mb-4"></i>
          <h3 className="text-lg font-semibold text-foreground mb-2">No items in this category</h3>
          <p className="text-muted-foreground">Check back later or try another category.</p>
        </div>
      )}
    </div>
  );
}
