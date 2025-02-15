import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import {randomUUID} from "crypto";

const cadastradoSchema = new Schema({
    id:{
        type: 'UUID',
        default: () => randomUUID()    
    },
    nome:{type:String,
        required:true},
    cpf:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true
    },
    senha:{
        type:String,
        required:true
    }
});

const Cadastrar=mongoose.model('Cadastrar',cadastradoSchema);

export default Cadastrar; 