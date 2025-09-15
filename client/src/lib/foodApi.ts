// Food API service for fetching real food images
export interface FoodImage {
  image: string;
  category: string;
}

// Food categories for the manager dashboard
export const FOOD_CATEGORIES = [
  'biryani',
  'burger', 
  'butter-chicken',
  'dessert',
  'dosa',
  'idly',
  'pasta',
  'pizza',
  'rice',
  'samosa',
  'chicken',
  'vegetable',
  'noodles',
  'sandwich',
  'soup'
] as const;

export type FoodCategory = typeof FOOD_CATEGORIES[number];

// Cache for food images to avoid repeated API calls
const imageCache = new Map<string, string>();

/**
 * Fetch a random food image from a specific category
 */
export async function fetchFoodImage(category: FoodCategory): Promise<string> {
  // Check cache first
  if (imageCache.has(category)) {
    return imageCache.get(category)!;
  }

  try {
    const response = await fetch(`https://foodish-api.com/api/images/${category}/`);
    const data: FoodImage = await response.json();
    
    if (data.image) {
      imageCache.set(category, data.image);
      return data.image;
    }
  } catch (error) {
    console.warn(`Failed to fetch ${category} image:`, error);
  }

  // Fallback to a default food image
  const fallbackImage = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center`;
  imageCache.set(category, fallbackImage);
  return fallbackImage;
}

/**
 * Fetch multiple food images for different categories
 */
export async function fetchMultipleFoodImages(categories: FoodCategory[]): Promise<Record<string, string>> {
  const images: Record<string, string> = {};
  
  // Fetch images in parallel
  const promises = categories.map(async (category) => {
    const image = await fetchFoodImage(category);
    images[category] = image;
  });

  await Promise.all(promises);
  return images;
}

/**
 * Get a random food image from any category
 */
export async function fetchRandomFoodImage(): Promise<string> {
  try {
    const response = await fetch('https://foodish-api.com/api/');
    const data: FoodImage = await response.json();
    return data.image;
  } catch (error) {
    console.warn('Failed to fetch random food image:', error);
    return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center';
  }
}

/**
 * Get food image for a specific dish name
 */
export async function getFoodImageForDish(dishName: string): Promise<string> {
  // Map dish names to categories
  const dishToCategory: Record<string, FoodCategory> = {
    'chicken biryani': 'biryani',
    'mutton biryani': 'biryani',
    'veg biryani': 'biryani',
    'biryani': 'biryani',
    'burger': 'burger',
    'chicken burger': 'burger',
    'veg burger': 'burger',
    'butter chicken': 'butter-chicken',
    'paneer butter masala': 'butter-chicken',
    'dessert': 'dessert',
    'ice cream': 'dessert',
    'cake': 'dessert',
    'dosa': 'dosa',
    'masala dosa': 'dosa',
    'plain dosa': 'dosa',
    'idly': 'idly',
    'idli': 'idly',
    'pasta': 'pasta',
    'spaghetti': 'pasta',
    'pizza': 'pizza',
    'margherita': 'pizza',
    'rice': 'rice',
    'fried rice': 'rice',
    'samosa': 'samosa',
    'chicken': 'chicken',
    'chicken curry': 'chicken',
    'vegetable': 'vegetable',
    'noodles': 'noodles',
    'sandwich': 'sandwich',
    'soup': 'soup',
  };

  // Find the best matching category
  const lowerDishName = dishName.toLowerCase();
  let category: FoodCategory = 'rice'; // default

  for (const [dish, cat] of Object.entries(dishToCategory)) {
    if (lowerDishName.includes(dish)) {
      category = cat;
      break;
    }
  }

  return fetchFoodImage(category);
}
