import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.users.upsert({
    where: { email: 'yashbeeharry363@gmail.com' },
    update: {},
    create: {
      email: 'yashbeeharry363@gmail.com',
      password_hash: adminPassword,
      name: 'Fresh Roots Admin',
      phone: '+230 5123 4567',
      role: 'admin',
    },
  });
  console.log('Admin user created:', admin.email);

  // Create categories
  const categories = [
    { name: 'Vegetables', slug: 'vegetables', description: 'Fresh vegetables from local farms' },
    { name: 'Fruits', slug: 'fruits', description: 'Seasonal tropical fruits' },
    { name: 'Herbs', slug: 'herbs', description: 'Fresh herbs and spices' },
    { name: 'Root Vegetables', slug: 'root-vegetables', description: 'Root vegetables and tubers' },
    { name: 'Leafy Greens', slug: 'leafy-greens', description: 'Fresh leafy greens and bredes' },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.categories.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories.push(created);
    console.log('Category created:', created.name);
  }

  // Mauritian produce listings
  const listings = [
    {
      title: 'FreshRoots Passion Fruit Plant',
      description:
        'Grow your own fresh passion fruit. Perfect for:\\n' +
        '- Home gardens\\n' +
        '- Fences, trellises & pergolas\\n' +
        '- Fresh juice, desserts & daily use\\n\\n' +
        'Why grow passion fruit?\\n' +
        '- Fast-growing climbing vine\\n' +
        '- Produces generously with proper care\\n' +
        '- Thrives in Mauritian climate\\n' +
        '- Long-term harvest once established\\n\\n' +
        'Pickup near Rushmore Business School / My Choice.\\n' +
        'Delivery available in Quatre Bornes, Vacoas, Curepipe & Rose Hill (small fee).\\n' +
        'Contact: WhatsApp +230 5903 3327',
      price: 100.0,
      unit: 'plant',
      stock: 80,
      location: 'Quatre Bornes',
      tags: ['plant', 'passion-fruit', 'garden', 'local'],
      category_slug: 'fruits',
      image_url:
        'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
    },
    { title: 'Bredes Leafy Greens', description: 'Fresh local bredes, perfect for traditional Mauritian dishes', price: 45.0, unit: 'bunch', stock: 50, location: 'Triolet', tags: ['local', 'fresh', 'traditional'], category_slug: 'leafy-greens' },
    { title: 'Lalo Okra', description: 'Fresh okra, harvested daily', price: 60.0, unit: 'kg', stock: 30, location: 'Pamplemousses', tags: ['local', 'fresh'], category_slug: 'vegetables' },
    { title: 'Pipangaille Eggplant', description: 'Long purple eggplants, ideal for rougaille', price: 55.0, unit: 'kg', stock: 40, location: 'Plaine Magnien', tags: ['local', 'fresh', 'organic'], category_slug: 'vegetables' },
    { title: 'Giraumon Pumpkin', description: 'Sweet pumpkin, perfect for soups and curries', price: 40.0, unit: 'kg', stock: 25, location: 'Riviere du Rempart', tags: ['local', 'fresh'], category_slug: 'vegetables' },
    { title: 'Songe Taro', description: 'Fresh taro roots, traditional Mauritian staple', price: 70.0, unit: 'kg', stock: 35, location: 'Flacq', tags: ['local', 'fresh', 'traditional'], category_slug: 'root-vegetables' },
    { title: 'Organic Tomatoes', description: 'Fresh organic tomatoes from Plaine Magnien', price: 85.0, unit: 'kg', stock: 50, location: 'Plaine Magnien', tags: ['organic', 'local', 'fresh'], category_slug: 'vegetables' },
    { title: 'Fresh Carrots', description: 'Crunchy and sweet carrots', price: 50.0, unit: 'kg', stock: 45, location: 'Curepipe', tags: ['local', 'fresh'], category_slug: 'root-vegetables' },
    { title: 'Lettuce', description: 'Fresh crisp lettuce, perfect for salads', price: 35.0, unit: 'head', stock: 60, location: 'Moka', tags: ['local', 'fresh', 'hydroponic'], category_slug: 'leafy-greens' },
    { title: 'Fresh Broccoli', description: 'Green broccoli, rich in nutrients', price: 95.0, unit: 'kg', stock: 20, location: 'Curepipe', tags: ['local', 'fresh'], category_slug: 'vegetables' },
    { title: 'Fresh Coriander', description: 'Fragrant fresh coriander leaves', price: 30.0, unit: 'bunch', stock: 40, location: 'Pamplemousses', tags: ['local', 'fresh', 'herbs'], category_slug: 'herbs' },
    { title: 'Chillies Piment', description: 'Hot Mauritian chillies', price: 120.0, unit: 'kg', stock: 15, location: 'Flacq', tags: ['local', 'fresh', 'spicy'], category_slug: 'vegetables' },
    { title: 'Papaya', description: 'Sweet ripe papayas', price: 50.0, unit: 'piece', stock: 30, location: 'Grand Baie', tags: ['local', 'fresh', 'tropical'], category_slug: 'fruits' },
    { title: 'Bananas', description: 'Fresh local bananas', price: 40.0, unit: 'kg', stock: 100, location: 'Riviere du Rempart', tags: ['local', 'fresh', 'tropical'], category_slug: 'fruits' },
    { title: 'Fresh Ginger', description: 'Local ginger root, perfect for cooking', price: 150.0, unit: 'kg', stock: 20, location: 'Flacq', tags: ['local', 'fresh', 'spice'], category_slug: 'herbs' },
    { title: 'Cucumber', description: 'Fresh crisp cucumbers', price: 45.0, unit: 'kg', stock: 55, location: 'Moka', tags: ['local', 'fresh', 'hydroponic'], category_slug: 'vegetables' },
  ];

  for (const listingData of listings) {
    const category = createdCategories.find((c) => c.slug === listingData.category_slug);
    const { category_slug, image_url, ...data } = listingData as any;

    const listing = await prisma.listings.create({
      data: {
        ...data,
        category_id: category?.id,
        admin_id: admin.id,
      },
    });

    // Add placeholder image
    await prisma.listing_images.create({
      data: {
        listing_id: listing.id,
        image_url: image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
        is_primary: true,
        order: 0,
      },
    });

    console.log('Listing created:', listing.title);
  }

  console.log('\nDatabase seeding completed successfully!');
  console.log('\nAdmin Credentials:');
  console.log('   Email: yashbeeharry363@gmail.com');
  console.log('   Password: Admin@123');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
