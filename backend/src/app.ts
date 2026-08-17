import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import articlesRoutes from './routes/articles.routes';
import userRoutes from './routes/user.routes';
import { errorHandler, notFound } from './middlewares/error.middleware';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem origin (como ferramentas mobile/Postman) ou dentro dos permitidos
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pela política de CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da Aplicação
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/users', userRoutes);

// Tratamento de rotas inexistentes e erros globais
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`🚀 Servidor rodando com sucesso em http://localhost:${port}`);
  });
}

export default app;