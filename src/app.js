require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const app = express();

app.use(express.json());

// SWAGGER
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/attendance', require('./modules/attendance/attendance.routes'));

app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);