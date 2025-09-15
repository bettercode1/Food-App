
export const mockData = {
  techParks: [
    {
      id: '1',
      name: 'Manyata Tech Park',
      description: 'Bangalore\'s largest tech park with 300+ companies',
      location: 'Hebbal, Bangalore',
      totalOutlets: 15
    },
    {
      id: '2', 
      name: 'Electronic City',
      description: 'IT hub with major tech companies',
      location: 'Electronic City, Bangalore',
      totalOutlets: 12
    },
    {
      id: '3',
      name: 'Whitefield Tech Park',
      description: 'Premium tech park in East Bangalore',
      location: 'Whitefield, Bangalore', 
      totalOutlets: 10
    },
    {
      id: '4',
      name: 'ITPL (International Tech Park)',
      description: 'World-class IT infrastructure with global companies',
      location: 'Whitefield, Bangalore',
      totalOutlets: 18
    },
    {
      id: '5',
      name: 'Cessna Business Park',
      description: 'Modern business park with tech giants and startups',
      location: 'Kadubeesanahalli, Bangalore',
      totalOutlets: 14
    },
    {
      id: '6',
      name: 'Bagmane Tech Park',
      description: 'Leading IT destination with Fortune 500 companies',
      location: 'CV Raman Nagar, Bangalore',
      totalOutlets: 16
    },
    {
      id: '7',
      name: 'RMZ Ecoworld',
      description: 'Sustainable tech park with green infrastructure',
      location: 'Outer Ring Road, Bangalore',
      totalOutlets: 11
    },
    {
      id: '8',
      name: 'Prestige Tech Park',
      description: 'Premium workspace with top-tier amenities',
      location: 'Sarjapur Road, Bangalore',
      totalOutlets: 13
    },
    {
      id: '9',
      name: 'Embassy Tech Village',
      description: 'Integrated township with residential and commercial spaces',
      location: 'Outer Ring Road, Bangalore',
      totalOutlets: 20
    },
    {
      id: '10',
      name: 'Salarpuria Sattva Knowledge City',
      description: 'Knowledge hub with educational and corporate facilities',
      location: 'Hennur, Bangalore',
      totalOutlets: 9
    },
    {
      id: '11',
      name: 'Phoenix MarketCity Tech Park',
      description: 'Mixed-use development with retail and office spaces',
      location: 'Whitefield, Bangalore',
      totalOutlets: 12
    },
    {
      id: '12',
      name: 'DivyaSree Techno Park',
      description: 'State-of-the-art facility with modern infrastructure',
      location: 'Whitefield, Bangalore',
      totalOutlets: 8
    }
  ],

  restaurants: [
    {
      id: '1',
      name: 'Canteen Delight',
      description: 'Traditional thali and home-style meals',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      rating: 4.5,
      distance: 50,
      preparationTime: '10-15 min',
      priceRange: '₹₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '1',
      cuisine: 'North Indian, Thali',
      location: { lat: 13.0827, lng: 77.6105 }
    },
    {
      id: '2',
      name: 'North Spice Dhaba',
      description: 'Authentic North Indian sabji, roti, dal',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      rating: 4.3,
      distance: 80,
      preparationTime: '12-18 min',
      priceRange: '₹₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '1',
      cuisine: 'North Indian, Punjabi',
      location: { lat: 13.0830, lng: 77.6108 }
    },
    {
      id: '3',
      name: 'South Express',
      description: 'Fresh idli, dosa, sambar varieties',
      imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
      rating: 4.6,
      distance: 120,
      preparationTime: '8-12 min',
      priceRange: '₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '1',
      cuisine: 'South Indian',
      location: { lat: 13.0833, lng: 77.6111 }
    },
    {
      id: '4',
      name: 'Quick Bites Cafe',
      description: 'Sandwiches, burgers, shakes & snacks',
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      rating: 4.2,
      distance: 90,
      preparationTime: '5-10 min',
      priceRange: '₹₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '1',
      cuisine: 'Continental, Fast Food',
      location: { lat: 13.0825, lng: 77.6102 }
    },
    // ITPL Restaurants
    {
      id: '5',
      name: 'Spice Garden',
      description: 'Authentic Indian cuisine with regional specialties',
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
      rating: 4.4,
      distance: 45,
      preparationTime: '15-20 min',
      priceRange: '₹₹₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '4',
      cuisine: 'Indian, Regional',
      location: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: '6',
      name: 'Cafe Coffee Day',
      description: 'Premium coffee and light snacks',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
      rating: 4.1,
      distance: 30,
      preparationTime: '5-8 min',
      priceRange: '₹₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '4',
      cuisine: 'Coffee, Beverages',
      location: { lat: 12.9720, lng: 77.5950 }
    },
    // Cessna Business Park Restaurants
    {
      id: '7',
      name: 'Pizza Corner',
      description: 'Fresh wood-fired pizzas and Italian cuisine',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      rating: 4.3,
      distance: 60,
      preparationTime: '12-18 min',
      priceRange: '₹₹₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '5',
      cuisine: 'Italian, Pizza',
      location: { lat: 12.9352, lng: 77.6245 }
    },
    {
      id: '8',
      name: 'Healthy Bites',
      description: 'Organic salads, smoothies, and healthy meals',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      rating: 4.5,
      distance: 25,
      preparationTime: '8-12 min',
      priceRange: '₹₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '5',
      cuisine: 'Healthy, Organic',
      location: { lat: 12.9355, lng: 77.6248 }
    },
    // Bagmane Tech Park Restaurants
    {
      id: '9',
      name: 'Chinese Express',
      description: 'Authentic Chinese cuisine with fresh ingredients',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d4f0?w=400&h=300&fit=crop',
      rating: 4.2,
      distance: 40,
      preparationTime: '10-15 min',
      priceRange: '₹₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '6',
      cuisine: 'Chinese, Asian',
      location: { lat: 12.9711, lng: 77.6412 }
    },
    {
      id: '10',
      name: 'Biryani House',
      description: 'Fragrant biryanis and Mughlai delicacies',
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
      rating: 4.6,
      distance: 35,
      preparationTime: '20-25 min',
      priceRange: '₹₹₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '6',
      cuisine: 'Mughlai, Biryani',
      location: { lat: 12.9715, lng: 77.6415 }
    },
    // Embassy Tech Village Restaurants
    {
      id: '11',
      name: 'Sushi Bar',
      description: 'Fresh sushi and Japanese cuisine',
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd1871?w=400&h=300&fit=crop',
      rating: 4.4,
      distance: 50,
      preparationTime: '15-20 min',
      priceRange: '₹₹₹₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '9',
      cuisine: 'Japanese, Sushi',
      location: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: '12',
      name: 'Street Food Corner',
      description: 'Popular street food and local delicacies',
      imageUrl: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop',
      rating: 4.3,
      distance: 20,
      preparationTime: '5-10 min',
      priceRange: '₹',
      isOpen: true,
      deliveryAvailable: true,
      takeawayAvailable: true,
      dineinAvailable: true,
      techParkId: '9',
      cuisine: 'Street Food, Local',
      location: { lat: 12.9720, lng: 77.5950 }
    }
  ],

  menuCategories: [
    { id: '1', name: 'Main Course', restaurantId: '1' },
    { id: '2', name: 'Breads', restaurantId: '1' },
    { id: '3', name: 'Dal & Rice', restaurantId: '1' },
    { id: '4', name: 'North Indian', restaurantId: '2' },
    { id: '5', name: 'Breads & Rice', restaurantId: '2' },
    { id: '6', name: 'South Indian', restaurantId: '3' },
    { id: '7', name: 'Beverages', restaurantId: '3' },
    { id: '8', name: 'Burgers & Sandwiches', restaurantId: '4' },
    { id: '9', name: 'Beverages', restaurantId: '4' },
    // ITPL Restaurants
    { id: '10', name: 'Regional Specialties', restaurantId: '5' },
    { id: '11', name: 'Coffee & Beverages', restaurantId: '6' },
    { id: '12', name: 'Light Snacks', restaurantId: '6' },
    // Cessna Business Park
    { id: '13', name: 'Pizzas', restaurantId: '7' },
    { id: '14', name: 'Pasta & Italian', restaurantId: '7' },
    { id: '15', name: 'Salads', restaurantId: '8' },
    { id: '16', name: 'Smoothies', restaurantId: '8' },
    // Bagmane Tech Park
    { id: '17', name: 'Chinese Main Course', restaurantId: '9' },
    { id: '18', name: 'Noodles & Rice', restaurantId: '9' },
    { id: '19', name: 'Biryani Specials', restaurantId: '10' },
    { id: '20', name: 'Mughlai Delicacies', restaurantId: '10' },
    // Embassy Tech Village
    { id: '21', name: 'Sushi Rolls', restaurantId: '11' },
    { id: '22', name: 'Japanese Main Course', restaurantId: '11' },
    { id: '23', name: 'Street Snacks', restaurantId: '12' },
    { id: '24', name: 'Local Specialties', restaurantId: '12' }
  ],

  menuItems: [
    // Canteen Delight Items
    {
      id: '1',
      name: 'Paneer Butter Masala',
      description: 'Rich creamy paneer curry with butter and tomatoes',
      price: 120,
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop',
      categoryId: '1',
      restaurantId: '1',
      isVeg: true,
      isAvailable: true,
      preparationTime: 15
    },
    {
      id: '2', 
      name: 'Dal Tadka',
      description: 'Traditional yellow lentils with spiced tempering',
      price: 100,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
      categoryId: '3',
      restaurantId: '1',
      isVeg: true,
      isAvailable: true,
      preparationTime: 10
    },
    {
      id: '3',
      name: 'Roti',
      description: 'Fresh wheat flatbread',
      price: 15,
      imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300&h=200&fit=crop',
      categoryId: '2',
      restaurantId: '1',
      isVeg: true,
      isAvailable: true,
      preparationTime: 5
    },
    {
      id: '4',
      name: 'Jeera Rice',
      description: 'Aromatic basmati rice with cumin',
      price: 80,
      imageUrl: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=300&h=200&fit=crop',
      categoryId: '3',
      restaurantId: '1',
      isVeg: true,
      isAvailable: true,
      preparationTime: 12
    },

    // North Spice Dhaba Items
    {
      id: '5',
      name: 'Rajma Chawal',
      description: 'Kidney beans curry with steamed rice',
      price: 140,
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop',
      categoryId: '4',
      restaurantId: '2',
      isVeg: true,
      isAvailable: true,
      preparationTime: 18
    },
    {
      id: '6',
      name: 'Butter Naan',
      description: 'Soft leavened bread with butter',
      price: 25,
      imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
      categoryId: '5',
      restaurantId: '2',
      isVeg: true,
      isAvailable: true,
      preparationTime: 8
    },
    {
      id: '7',
      name: 'Chole Bhature',
      description: 'Spicy chickpeas with fried bread',
      price: 110,
      imageUrl: 'https://images.unsplash.com/photo-1626132647523-66ef2175b85c?w=300&h=200&fit=crop',
      categoryId: '4',
      restaurantId: '2',
      isVeg: true,
      isAvailable: true,
      preparationTime: 15
    },

    // South Express Items
    {
      id: '8',
      name: 'Masala Dosa',
      description: 'Crispy rice crepe with spiced potato filling',
      price: 60,
      imageUrl: 'https://images.unsplash.com/photo-1694689547570-1c462b9146bb?w=300&h=200&fit=crop',
      categoryId: '6',
      restaurantId: '3',
      isVeg: true,
      isAvailable: true,
      preparationTime: 12
    },
    {
      id: '9',
      name: 'Idli Sambar',
      description: 'Steamed rice cakes with lentil curry',
      price: 50,
      imageUrl: 'https://images.unsplash.com/photo-1609501676725-7186f32fb26c?w=300&h=200&fit=crop',
      categoryId: '6',
      restaurantId: '3',
      isVeg: true,
      isAvailable: true,
      preparationTime: 8
    },
    {
      id: '10',
      name: 'Filter Coffee',
      description: 'Traditional South Indian coffee',
      price: 40,
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
      categoryId: '7',
      restaurantId: '3',
      isVeg: true,
      isAvailable: true,
      preparationTime: 5
    },

    // Quick Bites Cafe Items
    {
      id: '11',
      name: 'Veg Burger',
      description: 'Grilled veggie patty with fresh lettuce and tomato',
      price: 90,
      imageUrl: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=300&h=200&fit=crop',
      categoryId: '8',
      restaurantId: '4',
      isVeg: true,
      isAvailable: true,
      preparationTime: 10
    },
    {
      id: '12',
      name: 'Club Sandwich',
      description: 'Triple-decker sandwich with veggies and mayo',
      price: 85,
      imageUrl: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=300&h=200&fit=crop',
      categoryId: '8',
      restaurantId: '4',
      isVeg: true,
      isAvailable: true,
      preparationTime: 8
    },
    {
      id: '13',
      name: 'Cold Coffee',
      description: 'Iced coffee with whipped cream',
      price: 70,
      imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop',
      categoryId: '9',
      restaurantId: '4',
      isVeg: true,
      isAvailable: true,
      preparationTime: 5
    },

    // ITPL Restaurant Items
    {
      id: '14',
      name: 'Hyderabadi Biryani',
      description: 'Fragrant basmati rice with spiced meat',
      price: 180,
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop',
      categoryId: '10',
      restaurantId: '5',
      isVeg: false,
      isAvailable: true,
      preparationTime: 25
    },
    {
      id: '15',
      name: 'Cappuccino',
      description: 'Rich espresso with steamed milk foam',
      price: 120,
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
      categoryId: '11',
      restaurantId: '6',
      isVeg: true,
      isAvailable: true,
      preparationTime: 5
    },
    {
      id: '16',
      name: 'Chocolate Croissant',
      description: 'Buttery pastry with chocolate filling',
      price: 85,
      imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=200&fit=crop',
      categoryId: '12',
      restaurantId: '6',
      isVeg: true,
      isAvailable: true,
      preparationTime: 3
    },

    // Cessna Business Park Items
    {
      id: '17',
      name: 'Margherita Pizza',
      description: 'Classic tomato, mozzarella, and basil',
      price: 220,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
      categoryId: '13',
      restaurantId: '7',
      isVeg: true,
      isAvailable: true,
      preparationTime: 15
    },
    {
      id: '18',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with parmesan and croutons',
      price: 150,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      categoryId: '15',
      restaurantId: '8',
      isVeg: true,
      isAvailable: true,
      preparationTime: 8
    },
    {
      id: '19',
      name: 'Green Smoothie',
      description: 'Spinach, banana, and mango smoothie',
      price: 120,
      imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&h=200&fit=crop',
      categoryId: '16',
      restaurantId: '8',
      isVeg: true,
      isAvailable: true,
      preparationTime: 5
    },

    // Bagmane Tech Park Items
    {
      id: '20',
      name: 'Chicken Fried Rice',
      description: 'Wok-fried rice with chicken and vegetables',
      price: 160,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d4f0?w=300&h=200&fit=crop',
      categoryId: '18',
      restaurantId: '9',
      isVeg: false,
      isAvailable: true,
      preparationTime: 12
    },
    {
      id: '21',
      name: 'Mutton Biryani',
      description: 'Aromatic basmati rice with tender mutton',
      price: 250,
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop',
      categoryId: '19',
      restaurantId: '10',
      isVeg: false,
      isAvailable: true,
      preparationTime: 30
    },

    // Embassy Tech Village Items
    {
      id: '22',
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber sushi roll',
      price: 180,
      imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd1871?w=300&h=200&fit=crop',
      categoryId: '21',
      restaurantId: '11',
      isVeg: false,
      isAvailable: true,
      preparationTime: 10
    },
    {
      id: '23',
      name: 'Vada Pav',
      description: 'Spicy potato fritter in soft bread',
      price: 25,
      imageUrl: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=300&h=200&fit=crop',
      categoryId: '23',
      restaurantId: '12',
      isVeg: true,
      isAvailable: true,
      preparationTime: 5
    }
  ],

  users: [
    {
      id: '1',
      techPark: 'Manyata Tech Park',
      company: 'TechCorp Solutions',
      designation: 'Software Engineer',
      employeeName: 'Raj Kumar',
      mobile: '9876543210',
      role: 'employee',
      username: '9876543210'
    }
  ],

  managers: [
    {
      id: '1',
      email: 'manager@canteendelight.com',
      password: 'password123',
      restaurantId: '1',
      name: 'Suresh Kumar',
      username: 'manager1',
      restaurantName: 'Canteen Delight',
      techPark: '1',
      isActive: true,
      createdAt: null
    },
    {
      id: '2', 
      email: 'admin@northspice.com',
      password: 'password123',
      restaurantId: '2',
      name: 'Harpreet Singh',
      username: 'manager2',
      restaurantName: 'North Spice Dhaba',
      techPark: '1',
      isActive: true,
      createdAt: null
    }
  ],

  orders: [
    {
      id: '1',
      orderNumber: 'ORD-001',
      userId: '1',
      restaurantId: '1',
      items: [
        { menuItemId: '1', quantity: 1, price: 120 },
        { menuItemId: '3', quantity: 2, price: 15 },
        { menuItemId: '2', quantity: 1, price: 100 }
      ],
      status: 'preparing',
      total: 250,
      orderType: 'delivery',
      deliveryAddress: 'Block A, Office 204, Manyata Tech Park',
      estimatedTime: '15-20 min',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      orderNumber: 'ORD-002', 
      userId: '1',
      restaurantId: '3',
      items: [
        { menuItemId: '8', quantity: 1, price: 60 },
        { menuItemId: '10', quantity: 1, price: 40 }
      ],
      status: 'ready',
      total: 100,
      orderType: 'takeaway',
      estimatedTime: '8-12 min',
      createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    }
  ],

  orderItems: [] as any[]
};

let storage = {
  ...mockData,
  sessions: [] as any[],
  
  // User methods
  async getUserByUsername(username: string) {
    const user = this.users?.find(u => u.username === username);
    return user || null;
  },
  
  async createUser(userData: any) {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      username: userData.mobile, // Use mobile as username for now
      createdAt: new Date().toISOString()
    };
    if (!this.users) this.users = [];
    this.users.push(newUser);
    return newUser;
  },
  
  // Manager methods
  async getManager(id: string) {
    const manager = this.managers?.find(m => m.id === id);
    return manager || null;
  },
  
  async getManagerByUsername(username: string) {
    const manager = this.managers?.find(m => m.username === username || m.email === username);
    return manager || null;
  },

  async createManager(managerData: any) {
    const newManager = {
      id: Date.now().toString(),
      ...managerData,
      username: managerData.email, // Use email as username
      createdAt: null,
      isActive: true
    };
    if (!this.managers) this.managers = [];
    this.managers.push(newManager);
    return newManager;
  },
  
  // TechPark methods
  async getAllTechParks() {
    return this.techParks || [];
  },
  
  async getTechPark(id: string) {
    const techPark = this.techParks?.find(tp => tp.id === id);
    return techPark || null;
  },
  
  // Restaurant methods
  async getRestaurant(id: string) {
    const restaurant = this.restaurants?.find(r => r.id === id);
    return restaurant || null;
  },
  
  async getRestaurantsByTechPark(techParkId: string) {
    return this.restaurants?.filter(r => r.techParkId === techParkId) || [];
  },
  
  async getRestaurantByManager(managerId: string) {
    const manager = this.managers?.find(m => m.id === managerId);
    if (!manager) return null;
    return this.restaurants?.find(r => r.id === manager.restaurantId) || null;
  },
  
  // Menu methods
  async getMenuCategories(restaurantId: string) {
    return this.menuCategories?.filter(c => c.restaurantId === restaurantId) || [];
  },
  
  async getMenuItems(restaurantId: string) {
    return this.menuItems?.filter(i => i.restaurantId === restaurantId) || [];
  },
  
  async createMenuItem(itemData: any) {
    const newItem = {
      id: Date.now().toString(),
      ...itemData,
      createdAt: new Date().toISOString()
    };
    if (!this.menuItems) this.menuItems = [];
    this.menuItems.push(newItem);
    return newItem;
  },
  
  async getMenuItem(id: string) {
    const item = this.menuItems?.find(i => i.id === id);
    return item || null;
  },
  
  async updateMenuItem(id: string, updates: any) {
    const itemIndex = this.menuItems?.findIndex(i => i.id === id);
    if (itemIndex === -1 || itemIndex === undefined) return null;
    this.menuItems[itemIndex] = { ...this.menuItems[itemIndex], ...updates };
    return this.menuItems[itemIndex];
  },
  
  async deleteMenuItem(id: string) {
    const itemIndex = this.menuItems?.findIndex(i => i.id === id);
    if (itemIndex === -1 || itemIndex === undefined) return false;
    this.menuItems.splice(itemIndex, 1);
    return true;
  },
  
  // Order methods
  async createOrder(orderData: any) {
    const newOrder = {
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString()
    };
    if (!this.orders) this.orders = [];
    this.orders.push(newOrder);
    return newOrder;
  },
  
  async createOrderItem(itemData: any) {
    const newItem = {
      id: Date.now().toString(),
      ...itemData,
      createdAt: new Date().toISOString()
    };
    if (!this.orderItems) this.orderItems = [];
    this.orderItems.push(newItem);
    return newItem;
  },
  
  async getUserOrders(userId: string) {
    return this.orders?.filter(o => o.userId === userId) || [];
  },
  
  async getRestaurantOrders(restaurantId: string) {
    return this.orders?.filter(o => o.restaurantId === restaurantId) || [];
  },
  
  async getOrder(id: string) {
    const order = this.orders?.find(o => o.id === id);
    return order || null;
  },
  
  async getOrderItems(orderId: string) {
    return this.orderItems?.filter(oi => oi.orderId === orderId) || [];
  },
  
  async updateOrderStatus(id: string, status: string) {
    const orderIndex = this.orders?.findIndex(o => o.id === id);
    if (orderIndex === -1 || orderIndex === undefined) return null;
    this.orders[orderIndex] = { ...this.orders[orderIndex], status };
    return this.orders[orderIndex];
  }
};

export { storage };
