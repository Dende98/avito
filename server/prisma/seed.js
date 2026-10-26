require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: 'Недвижимость', slug: 'real-estate' },
  { name: 'Транспорт', slug: 'transport' },
  { name: 'Электроника', slug: 'electronics' },
  { name: 'Для дома', slug: 'home' },
  { name: 'Работа', slug: 'jobs' },
  { name: 'Хобби и отдых', slug: 'hobby' },
  { name: 'Одежда', slug: 'fashion' },
];

const users = [
  { name: 'Антон Смирнов', email: 'anton@example.com', phone: '+7 (900) 111-22-33', city: 'Москва' },
  { name: 'Мария Волкова', email: 'maria@example.com', phone: '+7 (921) 555-13-45', city: 'Санкт-Петербург' },
  { name: 'Илья Ким', email: 'ilya@example.com', phone: '+7 (999) 812-44-10', city: 'Казань' },
  { name: 'Елена Соколова', email: 'elena@example.com', phone: '+7 (903) 712-04-18', city: 'Екатеринбург' },
];

const listings = [
  {
    title: 'iPhone 15 Pro 256 ГБ',
    description: 'Аккуратное состояние, полный комплект, без ремонтов. Батарея 96%.',
    price: 82000,
    city: 'Москва',
    categorySlug: 'electronics',
    sellerEmail: 'anton@example.com',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  {
    title: 'MacBook Air M2 13"',
    description: 'Легкий ноутбук для учебы и работы, 16 ГБ RAM, 512 ГБ SSD.',
    price: 94000,
    city: 'Москва',
    categorySlug: 'electronics',
    sellerEmail: 'maria@example.com',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  {
    title: 'Volkswagen Polo 2020',
    description: 'Один владелец, обслуживался вовремя, зимняя резина в комплекте.',
    price: 1190000,
    city: 'Санкт-Петербург',
    categorySlug: 'transport',
    sellerEmail: 'anton@example.com',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  {
    title: 'Toyota Camry 2019',
    description: 'ПТС оригинал, бережная эксплуатация, история обслуживания.',
    price: 2470000,
    city: 'Казань',
    categorySlug: 'transport',
    sellerEmail: 'ilya@example.com',
    images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80'],
  },
  {
    title: 'Диван Scandinavia',
    description: 'Ткань без пятен, раскладывается, самовывоз сегодня дешевле.',
    price: 28000,
    city: 'Казань',
    categorySlug: 'home',
    sellerEmail: 'ilya@example.com',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  {
    title: 'Квартира-студия у метро',
    description: 'Светлая студия 28 м², свежий ремонт, до метро 8 минут пешком.',
    price: 6150000,
    city: 'Екатеринбург',
    categorySlug: 'real-estate',
    sellerEmail: 'elena@example.com',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
    ],
  },
  {
    title: 'Велосипед Trek Marlin',
    description: 'Рама M, гидравлические тормоза, обслужен перед сезоном.',
    price: 47000,
    city: 'Москва',
    categorySlug: 'hobby',
    sellerEmail: 'maria@example.com',
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80'],
  },
  {
    title: 'Кофемашина DeLonghi',
    description: 'Автоматическая кофемашина, капучинатор, использовалась дома.',
    price: 31500,
    city: 'Санкт-Петербург',
    categorySlug: 'home',
    sellerEmail: 'elena@example.com',
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=1000&q=80'],
  },
  {
    title: 'Куртка The North Face',
    description: 'Размер M, теплая, без дефектов, носилась один сезон.',
    price: 14500,
    city: 'Москва',
    categorySlug: 'fashion',
    sellerEmail: 'anton@example.com',
    images: ['https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1000&q=80'],
  },
  {
    title: 'Frontend-разработчик React',
    description: 'Удаленная работа, TypeScript, React, опыт от 1 года.',
    price: 180000,
    city: 'Москва',
    categorySlug: 'jobs',
    sellerEmail: 'maria@example.com',
    images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80'],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { ...user, passwordHash },
      create: { ...user, passwordHash },
    });
  }

  for (const listing of listings) {
    const seller = await prisma.user.findUnique({ where: { email: listing.sellerEmail } });
    const category = await prisma.category.findUnique({ where: { slug: listing.categorySlug } });

    const existingListing = await prisma.listing.findFirst({
      where: {
        title: listing.title,
        sellerId: seller.id,
      },
    });

    if (existingListing) {
      await prisma.listing.update({
        where: { id: existingListing.id },
        data: {
          description: listing.description,
          price: listing.price,
          city: listing.city,
          images: listing.images,
          categoryId: category.id,
          status: 'ACTIVE',
        },
      });
    } else {
      await prisma.listing.create({
        data: {
          title: listing.title,
          description: listing.description,
          price: listing.price,
          city: listing.city,
          images: listing.images,
          sellerId: seller.id,
          categoryId: category.id,
        },
      });
    }
  }

  const demoUser = await prisma.user.findUnique({ where: { email: 'anton@example.com' } });
  const demoListings = await prisma.listing.findMany({
    where: { sellerId: { not: demoUser.id } },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  for (const listing of demoListings.slice(0, 2)) {
    await prisma.favorite.upsert({
      where: { userId_listingId: { userId: demoUser.id, listingId: listing.id } },
      update: {},
      create: { userId: demoUser.id, listingId: listing.id },
    });
  }

  for (const listing of demoListings.slice(2, 4)) {
    await prisma.cartItem.upsert({
      where: { userId_listingId: { userId: demoUser.id, listingId: listing.id } },
      update: {},
      create: { userId: demoUser.id, listingId: listing.id },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
