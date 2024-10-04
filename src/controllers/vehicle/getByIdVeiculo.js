import { getByIdVeiculo } from "../../models/vehicleModel.js";

const getById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Verifica se o parâmetro id existe e é um número válido
        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "ID inválido fornecido na requisição. Certifique-se de que é um número."
            });
        }

        const veiculo = await getByIdVeiculo(+id); // "+" converte o ID para número

        if (!veiculo) {
            return res.status(404).json({
                error: `Veículo com o ID ${id} não encontrado!`
            });
        }

        // Retorna o veículo e a foto (se estiver em formato de buffer, converta para base64)
        return res.json({
            success: "Veículo encontrado com sucesso!",
            veiculo: {
                ...veiculo,
                foto: veiculo.foto ? `data:image/jpeg;base64,${veiculo.foto.toString('base64')}` : null // Supondo que a foto seja um Buffer
            }
        });
    } catch (error) {
        next(error); // Passa o erro para o middleware de erro
    }
};

export default getById;
