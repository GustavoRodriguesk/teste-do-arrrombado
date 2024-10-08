import exceptionHandler from '../../utils/ajuda.js';
import { generateAccessToken } from '../../utils/auth.js';
import { createNewUser } from '../../models/accountModel.js';
import { DateTime } from 'luxon'; 
import multer from 'multer';
import express from 'express'; 

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('foto_perfil'), async (req, res) => {
    const { nome, email, senha, cpf, telefone, nascimento, cidade, estado, isAdmin } = req.body;
    const fotoBuffer = req.file ? req.file.buffer : null;

    if (!nome || !email || !senha || !cpf || !telefone) {
        return res.status(400).json({ error: "Nome, email, senha, CPF e telefone são obrigatórios." });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'A foto do usuario é obrigatória.' });
    }
    if (senha.length < 8) {
        return res.status(400).json({ error: "A senha deve ter no mínimo 8 caracteres." });
    }

    if (isNaN(cpf) || isNaN(telefone)) {
        return res.status(400).json({ error: "CPF e telefone devem conter apenas números." });
    }

    try {
        const usuario = await createNewUser({
            nome,
            email,
            senha,
            cpf,
            telefone,
            nascimento,
            cidade,
            estado,
            foto_perfil: fotoBuffer,
            isAdmin
        });

        if (!usuario) {
            return res.status(409).json({ error: "Email já está em uso." });
        }

        usuario.data_registro = DateTime.fromJSDate(usuario.data_registro)
            .setZone('America/Sao_Paulo')
            .toISO(); // Consider keeping it as an ISO string

        const jwt = generateAccessToken(usuario);
        usuario.accessToken = jwt;

        res.status(201).json(usuario);
    } catch (exception) {
        exceptionHandler(exception, res);
    }
});


export default router;
