import { PainelEntity } from "../types/entities";
import { PainelNotas } from "./PainelNotas";

export const PaineisComNotas = async (services) => {
    const allPaineis : PainelEntity[] = await services.painel.findAll();
    const PaineisAnotacoes : PainelNotas[] = await Promise.all(allPaineis.map(async p => {
        const np = new PainelNotas(); 
        await np.Populate(p, services);
        return np;
    }));
    return PaineisAnotacoes.filter(p => p.Anotacoes.length !== 0) || [] as PainelEntity[];
};