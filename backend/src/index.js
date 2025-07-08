const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/users');
const docsRoutes = require('./routes/docs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

startServer(); 