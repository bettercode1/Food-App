// Food image API utilities
export interface FoodImageResponse {
  image: string;
}

// Mapping of food item keywords to specific food categories
const FOOD_CATEGORY_MAP: { [key: string]: string[] } = {
  'burger': ['burger', 'hamburger', 'cheeseburger'],
  'pizza': ['pizza', 'margherita', 'pepperoni'],
  'biryani': ['biryani', 'rice', 'fried rice'],
  'dosa': ['dosa', 'idli', 'uttapam'],
  'noodles': ['noodles', 'pasta', 'spaghetti', 'ramen'],
  'chicken': ['chicken', 'grilled chicken', 'fried chicken', 'tandoori'],
  'dessert': ['ice cream', 'cake', 'dessert', 'sweet', 'pastry'],
  'sandwich': ['sandwich', 'panini', 'sub'],
  'salad': ['salad', 'healthy', 'greens'],
  'curry': ['curry', 'dal', 'gravy'],
  'bread': ['bread', 'naan', 'roti', 'paratha'],
  'soup': ['soup', 'broth'],
  'seafood': ['fish', 'seafood', 'prawn', 'crab'],
  'samosa': ['samosa', 'snacks', 'pakora'],
  'coffee': ['coffee', 'latte', 'cappuccino'],
  'tea': ['tea', 'chai'],
  'juice': ['juice', 'smoothie', 'shake']
};

// Fallback to high-quality food images if API fails
const FALLBACK_IMAGES: { [key: string]: string } = {
  'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
  'biryani': 'https://images.unsplash.com/photo-1563379091339-03246963d61a?w=400&h=300&fit=crop',
  'dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&h=300&fit=crop',
  'noodles': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',
  'chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
  'dessert': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
  'sandwich': 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop',
  'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  'curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop',
  'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
  'seafood': 'https://images.unsplash.com/photo-1535140728325-781d1370266d?w=400&h=300&fit=crop',
  'samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
  'coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
  'tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
  'juice': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop',
  'default': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop'
};

/**
 * Determines the food category based on the food item name
 */
function getFoodCategory(foodName: string): string {
  const name = foodName.toLowerCase();
  
  for (const [category, keywords] of Object.entries(FOOD_CATEGORY_MAP)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }
  
  return 'default';
}

/**
 * Fetches a food image from Foodish API or returns fallback
 */
export async function fetchFoodImage(foodName: string): Promise<string> {
  const category = getFoodCategory(foodName);
  
  try {
    // Try to fetch from Foodish API (supports limited categories)
    const foodishCategories = ['biryani', 'burger', 'pizza', 'dessert', 'dosa', 'samosa'];
    
    if (foodishCategories.includes(category)) {
      const response = await fetch(`https://foodish-api.herokuapp.com/api/images/${category}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data: FoodImageResponse = await response.json();
        if (data.image) {
          return data.image;
        }
      }
    }
  } catch (error) {
    console.warn('Foodish API failed, using fallback image:', error);
  }
  
  // Return high-quality Unsplash fallback image
  return FALLBACK_IMAGES[category] || FALLBACK_IMAGES.default;
}

/**
 * Gets an appropriate food image - tries cache first, then API
 */
export async function getFoodImageUrl(foodName: string, existingUrl?: string): Promise<string> {
  // If there's already a valid image URL, use it
  if (existingUrl && existingUrl.startsWith('http')) {
    return existingUrl;
  }
  
  // Otherwise fetch a new one based on food name
  return await fetchFoodImage(foodName);
}

/**
 * Cache for storing fetched food images to avoid repeated API calls
 */
const imageCache = new Map<string, string>();

/**
 * Cached version of food image fetching
 */
export async function getCachedFoodImage(foodName: string): Promise<string> {
  const cacheKey = foodName.toLowerCase().trim();
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }
  
  const imageUrl = await fetchFoodImage(foodName);
  imageCache.set(cacheKey, imageUrl);
  
  return imageUrl;
}