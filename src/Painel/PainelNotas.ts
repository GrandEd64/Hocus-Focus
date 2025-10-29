import { useDatabase } from "../hooks/useDatabase";
import { AnotacaoEntity, PainelEntity } from "../types/entities";

export class PainelNotas{
    Painel: PainelEntity
    Anotacoes: AnotacaoEntity[];

    public async Populate(painel : PainelEntity, services) {
        if (!services) throw new Error('Banco de dados não reconhecido');

        this.Painel = painel;
        try {
            const anotacoes = await services.anotacao.findByPainel(painel.id);
            console.log("Procurando anotações com notas....");
            const anotacoesComNotas = anotacoes.filter(a => a.nota !== null);
            this.Anotacoes = anotacoesComNotas || [];
        } catch (error) {
            console.log("Algo deu errado na procura de anotações, definindo as anotações do PainelNotas como vazio");
            this.Anotacoes = [];
        }
    }
}