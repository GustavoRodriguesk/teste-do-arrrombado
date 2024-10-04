import { Router } from 'express';
import { updateVeiculo } from '../../models/vehicleModel.js'; 
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.put('/:id', upload.single('foto'), async (req, res) => {
    const { id } = req.params;
    const { modelo, anoFabricacao, cor, descricao, valor, km, marca, usuarioId, cidade, estado, cep, complemento, logradouro, numero, cambio, carroceria, combustivel } = req.body;
    const fotoBuffer = req.file ? req.file.buffer : null;

    if (!modelo || !anoFabricacao || !cor || !descricao || !valor || !km || !marca || !usuarioId) {
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
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar veículo.' });
    }
});


export default router;
