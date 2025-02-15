import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import {randomUUID} from "crypto";

const incendioSchema =new Schema({
    id:{
        type: 'UUID',
        default: () => randomUUID()    
    },
    gravidade:String,
    descricao:String,
    cidade :String,
    rua :String,
    localizacao : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    data_registro :{
        type: 'Date',
        default: Date.now
    },
    nome: String,
    cpf : String
});

const Incendio = mongoose.model('Incendio',incendioSchema);

export default Incendio;