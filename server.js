import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import mongoose from 'mongoose';
// import { Schema } from 'mongoose';
// import {randomUUID} from "crypto";
import bodyParser from 'body-parser';
import cors from 'cors';
import cadastrarRouter from './router/cadastrarRouter.js';
import incendioRouter from './router/incendioRouter.js';

import path from 'path';
import { fileURLToPath } from 'url';



conectar();

async function conectar(){
    await mongoose.connect(''||process.env.MONGO_URL).
        then(()=> console.log("Conectado ao MongoDB")).
        catch(err => console.log(err));
}

// const cadastradoSchema = new Schema({
//     id:{
//         type: 'UUID',
//         default: () => randomUUID()    
//     },
//     nome:{type:String,
//         required:true},
//     cpf:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     email:{
//         type:String,
//         required:true
//     },
//     senha:{
//         type:String,
//         required:true
//     }
// });

// const Cadastrar=mongoose.model('Cadastrar',cadastradoSchema);

// const incendioSchema =new Schema({
//     id:{
//         type: 'UUID',
//         default: () => randomUUID()    
//     },
//     gravidade:String,
//     descricao:String,
//     cidade :String,
//     rua :String,
//     localizacao : {
//         type: {
//           type: String, // Don't do `{ location: { type: String } }`
//           enum: ['Point'], // 'location.type' must be 'Point'
//           required: true
//         },
//         coordinates: {
//           type: [Number],
//           required: true
//         }
//     },
//     data_registro :{
//         type: 'Date',
//         default: Date.now
//     },
//     nome: String,
//     cpf : String
// });

// const Incendio =mongoose.model('Incendio',incendioSchema);

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



// // Validador de CPF
// class ValidaCPF {
//     constructor(cpfEnviado) {
//         Object.defineProperty(this, 'cpfLimpo', {
//             enumerable: true,
//             get: function () {
//                 return cpfEnviado.replace(/\D+/g, '');
//             },
//         });
//     }

//     valida() {
//         if (typeof this.cpfLimpo === 'undefined') return false;
//         if (this.cpfLimpo.length !== 11) return false;
//         if (this.isSequencia()) return false;

//         const cpfParcial = this.cpfLimpo.slice(0, -2);
//         const digito1 = this.criaDigito(cpfParcial);
//         const digito2 = this.criaDigito(cpfParcial + digito1);

//         const novoCpf = cpfParcial + digito1 + digito2;
//         return novoCpf === this.cpfLimpo;
//     }

//     criaDigito(cpfParcial) {
//         const cpfArray = Array.from(cpfParcial);

//         let regressivo = cpfArray.length + 1;
//         const total = cpfArray.reduce((ac, val) => {
//             ac += regressivo * Number(val);
//             regressivo--;
//             return ac;
//         }, 0);

//         const digito = 11 - (total % 11);
//         return digito > 9 ? '0' : String(digito);
//     }

//     isSequencia() {
//         const sequencia = this.cpfLimpo[0].repeat(this.cpfLimpo.length);
//         return sequencia === this.cpfLimpo;
//     }
// }

// // Função para validar CPF
// function validarCPF(cpf) {
//     const validador = new ValidaCPF(cpf);
//     return validador.valida();
// }

// app.get('/validarCPF', (req, res) => {
//     let { cpf } = req.query;

//     if (!cpf) {
//         return res.status(400).send({ valido: false, message: 'CPF não fornecido.' });
//     }

//     // Remove pontuações
//     cpf = cpf.replace(/\D+/g, '');

//     const validador = new ValidaCPF(cpf);
//     const valido = validador.valida();

//     res.status(200).send({ valido });
// });

// // Salvar dados do cadastro
// app.post('/cadastro', async (req, res) => {
//     const { nome, email, senha } = req.body;
//     let { cpf } = req.body;

//     // Remove pontuações do CPF
//     cpf = cpf.replace(/\D+/g, '');

//     // Validação de CPF
//     if (!validarCPF(cpf)) {
//         return res.status(400).send({ message: 'CPF inválido.' });
//     }

//     try {
//         const cadastroUser= new Cadastrar({nome,cpf,email,senha});
//         await cadastroUser.save();
//         res.status(201).send({ message: 'Usuário cadastrado com sucesso!' });
//         return;
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Erro ao cadastrar usuário' });
//     }
// });


// // Comparar dados para login
// app.post('/login', async (req, res) => {
//     const { cpf, senha } = req.body;

//     try {
//         const usuario = await Cadastrar.findOne({ cpf,senha });

//         // Se o usuário não existir, retorna erro
//         if (!usuario) {
//             return res.status(401).json({ message: 'CPF incorreto.' });
//         }

//         res.status(200).json({ message: 'Login realizado com sucesso!', nome: usuario.nome, cpf: usuario.cpf });
//         return;
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Erro ao processar o login.' });
//     }
// });


// app.get('/api/minhaAjuda', async (req, res) => {
//     const { cpf } = req.query;

//     if (!cpf) {
//         return res.status(400).send({ message: 'CPF do usuário é obrigatório.' });
//     }

//     try {
//         const query = { cpf: cpf };
        
//         // Fazendo a consulta ao MongoDB
//         const incendios = await Incendio.find(query).select('id cidade rua descricao gravidade data_registro');

//         res.status(200).json(incendios);
//     } catch (error) {
//         console.error('Erro ao listar incêndios do usuário:', error);
//         res.status(500).send({ message: 'Erro ao listar incêndios do usuário.' });
//     }
// });


// app.post('/alertarIncendio', async (req, res) => {
//     const { descricao, gravidade, latitude, longitude, cidade, rua, cpf, nome } = req.body;

//     // Validação básica dos campos
//     if (!descricao || !gravidade || !latitude || !longitude || !cidade || !rua || !cpf || !nome) {
//         return res.status(400).send({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
//     }

//     console.log('Dados recebidos:', { descricao, gravidade, latitude, longitude, cidade, rua, cpf, nome });

//     try {
//         const localizacao = {
//             type: 'Point',
//             coordinates: [longitude, latitude] // Ordem: [longitude, latitude]
//         };
//         const cadastroIncendio= new Incendio({ descricao, gravidade, cidade, rua,localizacao, cpf, nome });
//         await cadastroIncendio.save();
//         res.status(201).send({ message: 'Alerta de incêndio registrado com sucesso!' });
//     } catch (error) {
//         console.error('Erro ao salvar no banco:', error);
//         res.status(500).send({ message: 'Erro ao registrar alerta de incêndio.' });
//     }
// });


//   // Salvar localização
// app.post('/incendios', async (req, res) => {
//     const { cidade, rua, latitude, longitude } = req.body;
  
//     try {
//         const localizacao = {
//             type: 'Point',
//             coordinates: [longitude, latitude] // Ordem: [longitude, latitude]
//         };
//         const cadastroIncendio= new Incendio({ cidade, rua, localizacao });
//         await cadastroIncendio.save();
//         res.status(201).send({ message: 'Localização registrada com sucesso!' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Erro ao registrar localização.' });
//     }
//   });


//   // Listar todos os incêndios
// app.get('/api/incendios', async (req, res) => {
//     try {
//         const incendios = await Incendio.find({},{
//             _id: 1, // Equivalente ao campo 'id' no SQL
//             cidade: 1,
//             rua: 1,
//             descricao: 1,
//             gravidade: 1,
//             data_registro: 1,
//             nome: 1,
//             cpf: 1,
//             longitude: { $arrayElemAt: ["$localizacao.coordinates", 0] }, // Extrai a longitude
//             latitude: { $arrayElemAt: ["$localizacao.coordinates", 1] }   // Extrai a latitude
//           })
//         .select(' cidade rua descricao gravidade data_registro');
//         res.status(200).json(incendios);
//     } catch (error) {
//         console.error('Erro ao listar incêndios:', error);
//         res.status(500).send({ message: 'Erro ao listar incêndios.' });
//     }
// });


// // Obter detalhes de um incêndio por ID
// app.get('/api/incendios/:id', async (req, res) => {
//     const id = req.params.id;

//     try {
//         const incendios = await Incendio.findOne({_id:id}).select('id cidade rua descricao gravidade data_registro nome cpf');
        
//         res.status(200).json(incendios);
//     } catch (error) {
//         console.error('Erro ao buscar detalhes do incêndio:', error);
//         res.status(500).send({ message: 'Erro ao buscar detalhes do incêndio.' });
//     }
// });

// // Adicionar um novo incêndio
// app.post('/api/incendios', async (req, res) => {
//     const { descricao, cidade, rua, cadastro_id } = req.body;
//     try {
       
//         const cadastroIncendio= new Incendio({ descricao,cidade, rua,cadastro_id });
//         await cadastroIncendio.save();
//         res.status(201).send({ message: 'Incêndio registrado com sucesso!' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ message: 'Erro ao registrar incêndio' });
//     }
//   });
  
  
//   // Excluir um incêndio
//   app.delete('/api/incendios/:id', async (req, res) => {
//       const id = req.params.id;
  
//       try {
//         const incendio = await Incendio.findByIdAndDelete({_id:id});

//         if (!incendio) {
//             return res.status(404).send({ message: 'Incêndio não encontrado.' });
//         }
  
//           res.send({ message: 'Incêndio excluído com sucesso!' });
//       } catch (error) {
//           console.error('Erro ao excluir incêndio:', error);
//           res.status(500).send({ message: 'Erro ao excluir incêndio.' });
//       }
//   });


app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
  });
