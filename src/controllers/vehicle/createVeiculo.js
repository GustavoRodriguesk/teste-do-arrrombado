// Dentro do seu vehicleRouter.js ou controlador

import { Router } from 'express';
import { createVeiculo } from '../../models/vehicleModel.js'; 
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const router = Router();

router.post('/', upload.single('foto'), async (req, res) => {
    const { modelo, anoFabricacao, cor, descricao, valor, km, marca, usuarioId, cidade, estado, cep, complemento, logradouro, numero, cambio, carroceria, combustivel } = req.body;
    const fotoBuffer = req.file ? req.file.buffer : null;

    if (!req.file) {
        return res.status(400).json({ message: 'A foto do veículo é obrigatória.' });
    }

    try {
        const veiculoData = {
            modelo,
            anoFabricacao: parseInt(anoFabricacao),
            cor,
            descricao,
            valor: parseFloat(valor),
            km: parseFloat(km),
            marca,
            foto: fotoBuffer,  // Armazena a imagem como Bytea
            usuarioId: parseInt(usuarioId),
            cidade,
            estado,
            cep,
            complemento,
            logradouro,
            numero,
            cambio,
            carroceria,
            combustivel
        };

        const novoVeiculo = await createVeiculo(veiculoData);
        res.status(201).json(novoVeiculo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar veículo.' });
    }
});

export default router;

