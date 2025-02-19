import express from 'express';
import { minhaAjuda, alertarIncendio, salvarLocalizacao, listarTodosIncendio, detalhesIncendios, adicionarIncendio, deletarIncendio } from "../src/controller/incendioController.js";

const incendioRouter = express.Router();

incendioRouter.get('/api/minhaAjuda', minhaAjuda);
incendioRouter.post('/alertarIncendio', alertarIncendio);
incendioRouter.post('/incendios', salvarLocalizacao);
incendioRouter.get('/api/incendios', listarTodosIncendio);
incendioRouter.get('/api/incendios/:id', detalhesIncendios);
incendioRouter.post('/api/incendios', adicionarIncendio);
incendioRouter.delete('/api/incendios/:id', deletarIncendio);

export default incendioRouter;
