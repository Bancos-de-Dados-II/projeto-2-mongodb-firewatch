import Incendio from "../model/Incendio.js";

export async function minhaAjuda(req, res) {
    const { cpf } = req.query;

    if (!cpf) {
        return res.status(400).send({ message: 'CPF do usuário é obrigatório.' });
    }

    try {
        const query = { cpf: cpf };
        
        // Fazendo a consulta ao MongoDB
        const incendios = await Incendio.find(query).select('id cidade rua descricao gravidade data_registro');

        res.status(200).json(incendios);
    } catch (error) {
        console.error('Erro ao listar incêndios do usuário:', error);
        res.status(500).send({ message: 'Erro ao listar incêndios do usuário.' });
    }
}

export async function alertarIncendio(req, res) {
    const { descricao, gravidade, latitude, longitude, cidade, rua, cpf, nome } = req.body;

    // Validação básica dos campos
    if (!descricao || !gravidade || !latitude || !longitude || !cidade || !rua || !cpf || !nome) {
        return res.status(400).send({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    console.log('Dados recebidos:', { descricao, gravidade, latitude, longitude, cidade, rua, cpf, nome });

    try {
        const localizacao = {
            type: 'Point',
            coordinates: [longitude, latitude] // Ordem: [longitude, latitude]
        };
        const cadastroIncendio= new Incendio({ descricao, gravidade, cidade, rua,localizacao, cpf, nome });
        await cadastroIncendio.save();
        res.status(201).send({ message: 'Alerta de incêndio registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar no banco:', error);
        res.status(500).send({ message: 'Erro ao registrar alerta de incêndio.' });
    }
};

  // Salvar localização
  export async function salvarLocalizacao(req, res){
    const { cidade, rua, latitude, longitude } = req.body;
  
    try {
        const localizacao = {
            type: 'Point',
            coordinates: [longitude, latitude] // Ordem: [longitude, latitude]
        };
        const cadastroIncendio= new Incendio({ cidade, rua, localizacao });
        await cadastroIncendio.save();
        res.status(201).send({ message: 'Localização registrada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Erro ao registrar localização.' });
    }
  };


  // Listar todos os incêndios
export async function listarTodosIncendio(req, res){
    try {
        const incendios = await Incendio.find({},{
            _id: 1, // Equivalente ao campo 'id' no SQL
            cidade: 1,
            rua: 1,
            descricao: 1,
            gravidade: 1,
            data_registro: 1,
            nome: 1,
            cpf: 1,
            longitude: { $arrayElemAt: ["$localizacao.coordinates", 0] }, // Extrai a longitude
            latitude: { $arrayElemAt: ["$localizacao.coordinates", 1] }   // Extrai a latitude
          })
        .select(' cidade rua descricao gravidade data_registro');
        res.status(200).json(incendios);
    } catch (error) {
        console.error('Erro ao listar incêndios:', error);
        res.status(500).send({ message: 'Erro ao listar incêndios.' });
    }
};

// Obter detalhes de um incêndio por ID
export async function detalhesIncendios(req, res){
    const id = req.params.id;

    try {
        const incendios = await Incendio.findOne({_id:id}).select('id cidade rua descricao gravidade data_registro nome cpf');
        
        res.status(200).json(incendios);
    } catch (error) {
        console.error('Erro ao buscar detalhes do incêndio:', error);
        res.status(500).send({ message: 'Erro ao buscar detalhes do incêndio.' });
    }
};

// Adicionar um novo incêndio
export async function adicionarIncendio(req, res){
    const { descricao, cidade, rua, cadastro_id } = req.body;
    try {
       
        const cadastroIncendio= new Incendio({ descricao,cidade, rua,cadastro_id });
        await cadastroIncendio.save();
        res.status(201).send({ message: 'Incêndio registrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Erro ao registrar incêndio' });
    }
  };
  
  
  // Excluir um incêndio
export async function deletarIncendio(req, res){
      const id = req.params.id;
  
      try {
        const incendio = await Incendio.findByIdAndDelete({_id:id});

        if (!incendio) {
            return res.status(404).send({ message: 'Incêndio não encontrado.' });
        }
  
          res.send({ message: 'Incêndio excluído com sucesso!' });
      } catch (error) {
          console.error('Erro ao excluir incêndio:', error);
          res.status(500).send({ message: 'Erro ao excluir incêndio.' });
      }
};

