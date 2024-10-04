import { getveiculo } from "../../models/vehicleModel.js" 

const list = async (req, res, next) => {
    try {
        const veiculos = await getveiculo();
        const veiculosComImagem = veiculos.map(veiculo => ({
            ...veiculo,
            foto: veiculo.foto ? `data:image/jpeg;base64,${veiculo.foto.toString('base64')}` : null
        }));

        return res.json({
            message: "Veículos carregados com sucesso!",
            veiculos: veiculosComImagem
        });
    } catch (error) {
        next(error);
    }
};

export default list