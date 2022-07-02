import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Lemon',
      email: 'lemon@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  items: [
    {
      //_id: '1',
      name: 'Nike Slim shirt',
      slug: 'nike-slim-shirt',
      category: 'Shirts',
      image: '/images/p1.jpg', // 679px × 829px
      price: 120,
      stock: 0,
      brand: 'Nike',
      rating: 4.5,
      reviewNum: 10,
      description: 'high quality shirt',
    },
    {
      //_id: '2',
      name: 'Adidas Fit Shirt',
      slug: 'adidas-fit-shirt',
      category: 'Shirts',
      image: '/images/p2.jpg',
      price: 250,
      stock: 5,
      brand: 'Adidas',
      rating: 4.0,
      reviewNum: 10,
      description: 'high quality product',
    },
    {
      //_id: '3',
      name: 'Nike Slim Pant',
      slug: 'nike-slim-pant',
      category: 'Pants',
      image: '/images/p3.jpg',
      price: 25,
      stock: 15,
      brand: 'Nike',
      rating: 4.5,
      reviewNum: 14,
      description: 'high quality product',
    },
    {
      //_id: '4',
      name: 'Adidas Fit Pant',
      slug: 'adidas-fit-pant',
      category: 'Pants',
      image: '/images/p4.jpg',
      price: 65,
      stock: 5,
      brand: 'Puma',
      rating: 3.5,
      reviewNum: 10,
      description: 'high quality product',
    },
  ],
};
export default data;
