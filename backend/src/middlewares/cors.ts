export const corsOptions = {
  origin: ['http://localhost:3000', 'https://instabooks-livid.vercel.app'],
  optionsSuccessStatus: 204,
  methods: 'GET, POST, PUT, DELETE',
  credentials: true // Allows cookies to be sent
};

