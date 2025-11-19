export const mockUsers = [
  {
    id: "u-admin",
    email: "admin@usm.edu",
    username: "Admin Alpha",
    password: "admin123",
    role: "admin",
    campus: "Main Campus",
    bio: "Marketplace guardian",
    avatar: "assets/placeholder.svg"
  },
  {
    id: "u-student-1",
    email: "zarifirfan@student.usm.my",
    username: "Hana Rahman",
    password: "student123",
    role: "student",
    campus: "Main Campus",
    bio: "Tech lover and bargain hunter",
    avatar: "assets/placeholder.svg"
  },
  {
    id: "u-student-2",
    email: "amir.tech@student.usm.my",
    username: "Amir Tech",
    password: "student123",
    role: "student",
    campus: "North Campus",
    bio: "Electronics enthusiast",
    avatar: "assets/placeholder.svg"
  }
];

export const mockProducts = [
  {
    id: "p-1",
    ownerId: "u-student-1",
    name: "MacBook Pro 13\" M2",
    price: 3200,
    description: "Apple MacBook Pro 13-inch with M2 chip, 8GB RAM, 256GB SSD. Excellent condition, minimal use. Perfect for students and professionals. Includes original charger and box.",
    category: "Electronics",
    image: "assets/placeholder.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    status: "active",
    reports: []
  },
  {
    id: "p-2",
    ownerId: "u-student-1",
    name: "Organic Chemistry Textbook",
    price: 45,
    description: "Advanced Organic Chemistry by Wade, 9th Edition. Used for one semester only. All pages intact, minimal highlighting. Essential for chemistry students.",
    category: "Books",
    image: "assets/placeholder.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    status: "active",
    reports: []
  },
  {
    id: "p-3",
    ownerId: "u-student-2",
    name: "Mini Dorm Fridge",
    price: 320,
    description: "Perfect 3.2L portable mini fridge for hostel rooms. Energy efficient, quiet operation. Temperature control feature. Ideal for keeping snacks and drinks cold.",
    category: "Appliances",
    image: "assets/placeholder.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    status: "active",
    reports: []
  },
  {
    id: "p-4",
    ownerId: "u-student-2",
    name: "Wooden Study Desk",
    price: 150,
    description: "Sturdy wooden desk with spacious surface area. Dimensions: 120cm x 60cm. Includes small shelf. Lightly used, excellent condition. Great for dorm room setup.",
    category: "Furniture",
    image: "assets/placeholder.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    status: "active",
    reports: []
  },
  {
    id: "p-5",
    ownerId: "u-student-1",
    name: "Gaming Laptop ASUS ROG",
    price: 1500,
    description: "ASUS ROG Strix G15 with RTX 3050, Intel i7, 16GB RAM, 512GB SSD. High performance for gaming and content creation. Includes cooling pad and gaming mouse.",
    category: "Electronics",
    image: "assets/placeholder.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    status: "active",
    reports: []
  },
  {
    id: "p-6",
    ownerId: "u-student-2",
    name: "Scientific Calculator Casio",
    price: 65,
    description: "Casio FX-991EX Scientific Calculator. Essential for engineering and science students. Dual display, solar powered with battery backup. Like new condition.",
    category: "Tools",
    image: "assets/placeholder.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
    status: "active",
    reports: []
  },
  {
    id: "p-7",
    ownerId: "u-student-1",
    name: "Mountain Bike Trek",
    price: 550,
    description: "Trek mountain bike 21-speed, 26-inch wheels. Well maintained, barely used this semester. Perfect condition for campus commuting and weekend rides.",
    category: "Sports",
    image: "assets/placeholder.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    status: "active",
    reports: []
  },
  {
    id: "p-8",
    ownerId: "u-student-2",
    name: "Electric Kettle 1.7L",
    price: 35,
    description: "Stainless steel electric kettle with auto shut-off feature. Fast heating, energy efficient. Perfect for quick tea/coffee in hostel. Rarely used, like new.",
    category: "Appliances",
    image: "assets/placeholder.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 36,
    status: "active",
    reports: []
  }
];

export const mockMessages = [
  {
    id: "m-1",
    from: "u-student-1",
    to: "u-admin",
    body: "Hi Admin, thanks for keeping the marketplace safe!",
    createdAt: Date.now() - 1000 * 60 * 30
  },
  {
    id: "m-2",
    from: "u-student-2",
    to: "u-student-1",
    body: "Is the MacBook still available?",
    createdAt: Date.now() - 1000 * 60 * 15
  }
];
