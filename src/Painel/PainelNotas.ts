import { useDatabase } from "../hooks/useDatabase";
import { AnotacaoEntity, PainelEntity } from "../types/entities";

export class PainelNotas{
    Painel: PainelEntity
    Anotacoes?: AnotacaoEntity[]

    constructor(id, services)
    {
        this.Painel = services.painel.FindById(id);
        services.Anotacoes.findByPanel(id).then((anotacoes: AnotacaoEntity[]) => {
            this.Anotacoes = anotacoes.filter(a => a.nota);
        }).catch(() => {
            this.Anotacoes = [];
        });
    };
}