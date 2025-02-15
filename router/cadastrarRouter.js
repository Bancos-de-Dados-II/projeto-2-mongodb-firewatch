import express from 'express';
import { validaCpf, salvarDadosCadastro, compararDadosLogin } from '../src/controller/cadastrarController.js';

const cadastrarRouter = express.Router();

cadastrarRouter.get('/validarCPF', validaCpf);
cadastrarRouter.post('/cadastro', salvarDadosCadastro);
cadastrarRouter.post('/login', compararDadosLogin);

export default cadastrarRouter;