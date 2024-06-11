const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/clima', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado...'))
.catch(err => console.log('Error al conectar a MongoDB:', err));

// Definir esquema y modelo
const searchSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, required: true },
  temperature: { type: Number, required: true },
  condition: { type: String, required: true },
  conditionText: { type: String, required: true },
  icon: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Search = mongoose.model('Search', searchSchema);

// Ruta para guardar una búsqueda
app.post('/api/search', async (req, res) => {
  const { city, country, temperature, condition, conditionText, icon } = req.body;

  if (!city || !country || !temperature || !condition || !conditionText || !icon) {
    return res.status(400).send({ error: 'Todos los campos son requeridos' });
  }

  try {
    const search = new Search({ city, country, temperature, condition, conditionText, icon });
    await search.save();
    res.status(201).send(search);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Ruta para obtener todas las búsquedas
app.get('/api/search', async (req, res) => {
  try {
    const searches = await Search.find();
    res.status(200).send(searches);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
