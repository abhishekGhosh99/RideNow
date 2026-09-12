const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Car = require("../models/Car");

dotenv.config();

const cars = [
  {
    name: "BMW 3 Series",
    brand: "BMW",
    model: "3 Series",
    year: 2024,
    category: "luxury",

    pricing: {
      perDay: 5500,
      perWeek: 35000,
      perMonth: 120000,
      discounts: {
        basic: 0,
        standard: 5,
        premium: 10,
      },
    },

    specifications: {
      seats: 5,
      transmission: "automatic",
      fuelType: "petrol",
      mileage: 15,
      engineCapacity: "1998cc",
      features: [
        "Apple CarPlay",
        "Android Auto",
        "Sunroof",
        "Leather Seats",
        "360° Camera",
      ],
    },

    images: [
      {
        url: "https://images.unsplash.com/photo-1555215695-3004980ad54e",
        alt: "BMW 3 Series",
        isPrimary: true,
      },
    ],

    isAvailable: true,

    location: {
      city: "Delhi",
      branch: "Connaught Place",
      address: "Connaught Place, New Delhi",
    },

    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: true,
  },

  {
    name: "Mercedes-Benz C-Class",
    brand: "Mercedes-Benz",
    model: "C-Class",
    year: 2024,
    category: "luxury",

    pricing: {
      perDay: 6500,
      perWeek: 42000,
      perMonth: 145000,
      discounts: {
        basic: 0,
        standard: 5,
        premium: 10,
      },
    },

    specifications: {
      seats: 5,
      transmission: "automatic",
      fuelType: "petrol",
      mileage: 14,
      engineCapacity: "1993cc",
      features: [
        "Ambient Lighting",
        "Apple CarPlay",
        "Sunroof",
        "Leather Seats",
        "360° Camera",
      ],
    },

    images: [
      {
        url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
        alt: "Mercedes-Benz C-Class",
        isPrimary: true,
      },
    ],

    isAvailable: true,

    location: {
      city: "Delhi",
      branch: "Aerocity",
      address: "Aerocity, New Delhi",
    },

    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: true,
  },

  {
    name: "Audi A4",
    brand: "Audi",
    model: "A4",
    year: 2023,
    category: "sedan",

    pricing: {
      perDay: 4800,
      perWeek: 30000,
      perMonth: 105000,
      discounts: {
        basic: 0,
        standard: 5,
        premium: 10,
      },
    },

    specifications: {
      seats: 5,
      transmission: "automatic",
      fuelType: "petrol",
      mileage: 16,
      engineCapacity: "1998cc",
      features: [
        "Virtual Cockpit",
        "Apple CarPlay",
        "Cruise Control",
        "Parking Sensors",
      ],
    },

    images: [
      {
        url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
        alt: "Audi A4",
        isPrimary: true,
      },
    ],

    isAvailable: true,

    location: {
      city: "Delhi",
      branch: "Saket",
      address: "Saket, New Delhi",
    },

    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: false,
  },

  {
    name: "Toyota Fortuner",
    brand: "Toyota",
    model: "Fortuner",
    year: 2024,
    category: "suv",

    pricing: {
      perDay: 4500,
      perWeek: 28000,
      perMonth: 95000,
      discounts: {
        basic: 0,
        standard: 5,
        premium: 10,
      },
    },

    specifications: {
      seats: 7,
      transmission: "automatic",
      fuelType: "diesel",
      mileage: 12,
      engineCapacity: "2755cc",
      features: [
        "7 Seats",
        "4x4",
        "Cruise Control",
        "Reverse Camera",
        "Touchscreen",
      ],
    },

    images: [
      {
        url: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b",
        alt: "Toyota Fortuner",
        isPrimary: true,
      },
    ],

    isAvailable: true,

    location: {
      city: "Delhi",
      branch: "Vasant Kunj",
      address: "Vasant Kunj, New Delhi",
    },

    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: true,
  },

  {
    name: "Honda City",
    brand: "Honda",
    model: "City",
    year: 2024,
    category: "standard",

    pricing: {
      perDay: 2200,
      perWeek: 14000,
      perMonth: 48000,
      discounts: {
        basic: 0,
        standard: 5,
        premium: 10,
      },
    },

    specifications: {
      seats: 5,
      transmission: "automatic",
      fuelType: "petrol",
      mileage: 17,
      engineCapacity: "1498cc",
      features: [
        "Apple CarPlay",
        "Android Auto",
        "Cruise Control",
        "Rear Camera",
      ],
    },

    images: [
      {
        url: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd",
        alt: "Honda City",
        isPrimary: true,
      },
    ],

    isAvailable: true,

    location: {
      city: "Delhi",
      branch: "Dwarka",
      address: "Dwarka, New Delhi",
    },

    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: false,
  },

  {
    name: "Maruti Suzuki Swift",
    brand: "Maruti Suzuki",
    model: "Swift",
    year: 2024,
    category: "economy",

    pricing: {
      perDay: 1500,
      perWeek: 9500,
      perMonth: 32000,
      discounts: {
        basic: 0,
        standard: 5,
        premium: 10,
      },
    },

    specifications: {
      seats: 5,
      transmission: "manual",
      fuelType: "petrol",
      mileage: 22,
      engineCapacity: "1197cc",
      features: [
        "Android Auto",
        "Bluetooth",
        "Rear Parking Sensors",
        "Touchscreen",
      ],
    },

    images: [
      {
        url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
        alt: "Maruti Suzuki Swift",
        isPrimary: true,
      },
    ],

    isAvailable: true,

    location: {
      city: "Delhi",
      branch: "Rohini",
      address: "Rohini, New Delhi",
    },

    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: false,
  },  {
    name: "Toyota Camry",
    brand: "Toyota",
    model: "Camry",
    year: 2024,
    category: "sedan",

    pricing: {
      perDay: 3800,
      perWeek: 24000,
      perMonth: 82000,
      discounts: {
        basic: 0,
        standard: 5,
        premium: 10,
      },
    },

    specifications: {
      seats: 5,
      transmission: "automatic",
      fuelType: "petrol",
      mileage: 18,
      engineCapacity: "2487cc",
      features: [
        "Leather Seats",
        "Apple CarPlay",
        "Android Auto",
        "Cruise Control",
        "Rear Camera",
      ],
    },

    images: [
      {
        url: "https://images.unsplash.com/photo-1550355291-bbee04a92027",
        alt: "Toyota Camry",
        isPrimary: true,
      },
    ],

    isAvailable: true,

    location: {
      city: "Delhi",
      branch: "Greater Kailash",
      address: "Greater Kailash, New Delhi",
    },

    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: false,
  },

  {
    name: "Hyundai Tucson",
    brand: "Hyundai",
    model: "Tucson",
    year: 2024,
    category: "suv",

    pricing: {
      perDay: 3200,
      perWeek: 20000,
      perMonth: 68000,
      discounts: {
        basic: 0,
        standard: 5,
        premium: 10,
      },
    },

    specifications: {
      seats: 5,
      transmission: "automatic",
      fuelType: "diesel",
      mileage: 16,
      engineCapacity: "1995cc",
      features: [
        "Panoramic Sunroof",
        "Apple CarPlay",
        "Android Auto",
        "360° Camera",
        "Cruise Control",
      ],
    },

    images: [
      {
        url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
        alt: "Hyundai Tucson",
        isPrimary: true,
      },
    ],

    isAvailable: true,

    location: {
      city: "Delhi",
      branch: "Hauz Khas",
      address: "Hauz Khas, New Delhi",
    },

    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: true,
  },

  {
    name: "Kia Seltos",
    brand: "Kia",
    model: "Seltos",
    year: 2024,
    category: "suv",

    pricing: {
      perDay: 2800,
      perWeek: 17500,
      perMonth: 60000,
      discounts: {
        basic: 0,
        standard: 5,
        premium: 10,
      },
    },

    specifications: {
      seats: 5,
      transmission: "automatic",
      fuelType: "petrol",
      mileage: 17,
      engineCapacity: "1497cc",
      features: [
        "Ventilated Seats",
        "Panoramic Sunroof",
        "Apple CarPlay",
        "Android Auto",
        "360° Camera",
      ],
    },

    images: [
      {
        url: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
        alt: "Kia Seltos",
        isPrimary: true,
      },
    ],

    isAvailable: true,

    location: {
      city: "Delhi",
      branch: "Lajpat Nagar",
      address: "Lajpat Nagar, New Delhi",
    },

    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: false,
  },

  {
    name: "Mahindra XUV700",
    brand: "Mahindra",
    model: "XUV700",
    year: 2024,
    category: "suv",

    pricing: {
      perDay: 3000,
      perWeek: 19000,
      perMonth: 65000,
      discounts: {
        basic: 0,
        standard: 5,
        premium: 10,
      },
    },

    specifications: {
      seats: 7,
      transmission: "automatic",
      fuelType: "diesel",
      mileage: 14,
      engineCapacity: "2198cc",
      features: [
        "7 Seats",
        "Panoramic Sunroof",
        "ADAS",
        "Apple CarPlay",
        "Android Auto",
        "360° Camera",
      ],
    },

    images: [
      {
        url: "https://images.unsplash.com/photo-1542362567-b07e54358753",
        alt: "Mahindra XUV700",
        isPrimary: true,
      },
    ],

    isAvailable: true,

    location: {
      city: "Delhi",
      branch: "Karol Bagh",
      address: "Karol Bagh, New Delhi",
    },

    minimumRentalDays: 1,
    maximumRentalDays: 30,
    isFeatured: false,
  },
];

const seedCars = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Car.deleteMany();

    await Car.insertMany(cars);

    console.log(`✅ ${cars.length} cars seeded successfully`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding cars:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedCars();