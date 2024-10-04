import { Router } from 'express';
import { updateVeiculo } from '../../models/vehicleModel.js'; 
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.put('/:id', upload.single('foto'), async (req, res) => {
    const { id } = req.params;
    const {
        modelo,
        anoFabricacao,
        cor,
        descricao,
        valor,
        km,
        marca,
        usuarioId,
        cidade,
        estado,
        cep,
        complemento,
        logradouro,
        numero,
        cambio,
        carroceria,
        combustivel
    } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID deve ser um número válido.' });
    }

    const fotoBuffer = req.file ? req.file.buffer : null;

    // Check for required fields
    const requiredFields = [modelo, anoFabricacao, cor, descricao, valor, km, marca, usuarioId];
    if (requiredFields.some(field => !field)) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    try {
        const veiculoExistente = await prisma.veiculo.findUnique({
            where: { id: parseInt(id) }
        });

        if (!veiculoExistente) {
            return res.status(404).json({ message: 'Veículo não encontrado.' });
        }

        const veiculoData = {
            modelo,
            anoFabricacao: parseInt(anoFabricacao),
            cor,
            descricao,
            valor: parseFloat(valor),
            km: parseFloat(km),
            marca,
            foto: fotoBuffer, // or keep as null if not provided
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

        const updatedVeiculo = await updateVeiculo(id, veiculoData);
        res.status(200).json(updatedVeiculo);
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ message: 'Erro ao atualizar veículo.' });
    }
});

export default router;
