
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
    }
  ],

  restaurants: [
    {
      id: '1',
      name: 'Canteen Delight',
      description: 'Traditional thali and home-style meals',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      rating: 4.5,
      distance: '50m',
      estimatedTime: '10-15 min',
      techParkId: '1',
      cuisine: 'North Indian, Thali'
    },
    {
      id: '2',
      name: 'North Spice Dhaba',
      description: 'Authentic North Indian sabji, roti, dal',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      rating: 4.3,
      distance: '80m', 
      estimatedTime: '12-18 min',
      techParkId: '1',
      cuisine: 'North Indian, Punjabi'
    },
    {
      id: '3',
      name: 'South Express',
      description: 'Fresh idli, dosa, sambar varieties',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop',
      rating: 4.6,
      distance: '120m',
      estimatedTime: '8-12 min',
      techParkId: '1',
      cuisine: 'South Indian'
    },
    {
      id: '4',
      name: 'Quick Bites Cafe',
      description: 'Sandwiches, burgers, shakes & snacks',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      rating: 4.2,
      distance: '90m',
      estimatedTime: '5-10 min',
      techParkId: '1',
      cuisine: 'Continental, Fast Food'
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
    { id: '9', name: 'Beverages', restaurantId: '4' }
  ],

  menuItems: [
    // Canteen Delight Items
    {
      id: '1',
      name: 'Paneer Butter Masala',
      description: 'Rich creamy paneer curry with butter and tomatoes',
      price: 120,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop',
      categoryId: '1',
      restaurantId: '1'
    },
    {
      id: '2', 
      name: 'Dal Tadka',
      description: 'Traditional yellow lentils with spiced tempering',
      price: 100,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
      categoryId: '3',
      restaurantId: '1'
    },
    {
      id: '3',
      name: 'Roti',
      description: 'Fresh wheat flatbread',
      price: 15,
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=300&h=200&fit=crop',
      categoryId: '2',
      restaurantId: '1'
    },
    {
      id: '4',
      name: 'Jeera Rice',
      description: 'Aromatic basmati rice with cumin',
      price: 80,
      image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=300&h=200&fit=crop',
      categoryId: '3',
      restaurantId: '1'
    },

    // North Spice Dhaba Items
    {
      id: '5',
      name: 'Rajma Chawal',
      description: 'Kidney beans curry with steamed rice',
      price: 140,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop',
      categoryId: '4',
      restaurantId: '2'
    },
    {
      id: '6',
      name: 'Butter Naan',
      description: 'Soft leavened bread with butter',
      price: 25,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
      categoryId: '5',
      restaurantId: '2'
    },
    {
      id: '7',
      name: 'Chole Bhature',
      description: 'Spicy chickpeas with fried bread',
      price: 110,
      image: 'https://images.unsplash.com/photo-1626132647523-66ef2175b85c?w=300&h=200&fit=crop',
      categoryId: '4',
      restaurantId: '2'
    },

    // South Express Items
    {
      id: '8',
      name: 'Masala Dosa',
      description: 'Crispy rice crepe with spiced potato filling',
      price: 60,
      image: 'https://images.unsplash.com/photo-1694689547570-1c462b9146bb?w=300&h=200&fit=crop',
      categoryId: '6',
      restaurantId: '3'
    },
    {
      id: '9',
      name: 'Idli Sambar',
      description: 'Steamed rice cakes with lentil curry',
      price: 50,
      image: 'https://images.unsplash.com/photo-1609501676725-7186f32fb26c?w=300&h=200&fit=crop',
      categoryId: '6',
      restaurantId: '3'
    },
    {
      id: '10',
      name: 'Filter Coffee',
      description: 'Traditional South Indian coffee',
      price: 40,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
      categoryId: '7',
      restaurantId: '3'
    },

    // Quick Bites Cafe Items
    {
      id: '11',
      name: 'Veg Burger',
      description: 'Grilled veggie patty with fresh lettuce and tomato',
      price: 90,
      image: 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=300&h=200&fit=crop',
      categoryId: '8',
      restaurantId: '4'
    },
    {
      id: '12',
      name: 'Club Sandwich',
      description: 'Triple-decker sandwich with veggies and mayo',
      price: 85,
      image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=300&h=200&fit=crop',
      categoryId: '8',
      restaurantId: '4'
    },
    {
      id: '13',
      name: 'Cold Coffee',
      description: 'Iced coffee with whipped cream',
      price: 70,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=200&fit=crop',
      categoryId: '9',
      restaurantId: '4'
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
      role: 'employee'
    }
  ],

  managers: [
    {
      id: '1',
      email: 'manager@canteendelight.com',
      password: 'password123',
      restaurantId: '1',
      name: 'Suresh Kumar'
    },
    {
      id: '2', 
      email: 'admin@northspice.com',
      password: 'password123',
      restaurantId: '2',
      name: 'Harpreet Singh'
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
  ]
};

let storage = {
  ...mockData,
  sessions: [] as any[]
};

export { storage };
