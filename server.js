import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import cadastrarRouter from './router/cadastrarRouter.js';
import incendioRouter from './router/incendioRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

conectar();

async function conectar() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("Conectado ao MongoDB");
    } catch (err) {
        console.error("Erro ao conectar ao MongoDB:", err);
    }
}

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Servir arquivos estáticos
app.use(cors());
app.use(cadastrarRouter);
app.use(incendioRouter);

// Ajuste necessário para usar `__dirname` no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar o Express para servir arquivos estáticos corretamente
app.use(express.static(path.join(__dirname, 'src/view')));

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
  });
