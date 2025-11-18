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
  }
];

export const mockProducts = [
  {
    id: "p-1",
    ownerId: "u-student-1",
    name: "Lenovo Ideapad 5",
    price: 1900,
    description: "Ryzen 5, 16GB RAM, 512GB SSD. Lightly used for assignments.",
    category: "Electronics",
    image: "assets/placeholder.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    status: "active",
    reports: []
  },
  {
    id: "p-2",
    ownerId: "u-student-1",
    name: "Dorm Mini Fridge",
    price: 320,
    description: "Perfect for hostel rooms, energy efficient.",
    category: "Appliances",
    image: "assets/placeholder.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
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
  }
];
