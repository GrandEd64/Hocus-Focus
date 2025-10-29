import { PainelEntity } from "../types/entities";
import { PainelNotas } from "./PainelNotas";

export const PaineisComNotas = async (services) => {
    const allPaineis : PainelEntity[] = await services.painel.findAll();
    const PaineisAnotacoes : PainelNotas[] = allPaineis.map(p => new PainelNotas(p.id, services));
    return PaineisAnotacoes.filter(p => p.Anotacoes);
};