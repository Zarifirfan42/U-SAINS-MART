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
    username: "Zarif 42",
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
    name: "Apple MacBook Air (M1, 2020)",
    price: 3200,
    description: "Excellent condition MacBook Air with Apple M1 chip, 8GB RAM, 256GB SSD. Battery health ~92%. Comes with original charger and slim protective sleeve. Used lightly for development and coursework — no dents or screen marks.",
    category: "Electronics",
    image: "assets/macbook-air-m1.png",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    status: "active",
    reports: []
  },
  {
    id: "p-2",
    ownerId: "u-student-1",
    name: "University Textbook Bundle — Science & Math",
    price: 180,
    description: "Set of 4 used but well-kept textbooks: Calculus (3rd ed), Organic Chemistry (2nd ed), Physics for Scientists, and Introduction to Statistics. Annotations only in margins, no torn pages. Ideal for semester study packs.",
    category: "Books",
    image: "assets/textbooks-bundle.jpeg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    status: "active",
    reports: []
  },
  {
    id: "p-3",
    ownerId: "u-student-1",
    name: "Compact Dorm Fridge — 45L",
    price: 350,
    description: "Low-noise 45L mini fridge, perfect for single rooms. Energy-saving, internal shelf removable, works perfectly with small icebox. Cleaned and defrosted before listing.",
    category: "Appliances",
    image: "assets/dorm-fridge-45l.jpeg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    status: "active",
    reports: []
  },
  {
    id: "p-4",
    ownerId: "u-student-1",
    name: "Study Desk + Ergonomic Chair",
    price: 420,
    description: "Sturdy wooden study desk (120x60cm) with cable grommet and drawer, paired with an ergonomic mesh office chair. Ideal for long study sessions; chair has adjustable height and lumbar support.",
    category: "Furniture",
    image: "assets/study-desk-chair.jpg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    status: "active",
    reports: []
  },
  {
    id: "p-5",
    ownerId: "u-student-1",
    name: "Gaming Headset + Mouse Combo (RGB)",
    price: 260,
    description: "Comfortable over-ear gaming headset with clear microphone and RGB lighting, bundled with a high-precision wired gaming mouse (programmable DPI). Both fully functional and tested — perfect for multiplayer sessions and streaming.",
    category: "Electronics",
    image: "assets/svg/gaming-gear.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    status: "active",
    reports: []
  },
  {
    id: "p-6",
    ownerId: "u-student-1",
    name: "Scientific Calculator — Casio FX-991EX",
    price: 120,
    description: "Casio FX-991EX ClassWiz scientific calculator in near-new condition. Comes with protective cover and original manual. Suitable for engineering and maths exams (non-programmable).",
    category: "Stationery",
    image: "assets/calculator-casio-fx-991ex.jpeg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    status: "active",
    reports: []
  },
  {
    id: "p-7",
    ownerId: "u-student-1",
    name: "Hybrid Commuter Bike — 21-Speed",
    price: 900,
    description: "Reliable hybrid bike for city commutes and light trails. Shimano 21-speed derailleur, front suspension, alloy frame with quick-release front wheel. Recent tune-up and new brake pads installed.",
    category: "Sports",
    image: "assets/svg/commuter-bike.svg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60,
    status: "active",
    reports: []
  },
  {
    id: "p-8",
    ownerId: "u-student-1",
    name: "Electric Kettle — 1.7L Stainless",
    price: 95,
    description: "Fast-boil 1.7L electric kettle with auto shut-off and boil-dry protection. Stainless steel interior, removable limescale filter, just one semester old and in spotless condition.",
    category: "Kitchen",
    image: "assets/electric-kettle-1-7l.jpeg",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
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
