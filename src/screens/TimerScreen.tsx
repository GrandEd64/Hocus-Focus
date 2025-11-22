import { useEffect, useRef, useState, useCallback } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useAnotacoes, useDatabase } from "../hooks/useDatabase";
import { AnotacaoEntity, PainelEntity } from "../types/entities";
import { Anotacao } from "../database/models";
import { MaterialIcons } from "@expo/vector-icons";
import Relogio from "../components/Relogio";
import { formatTime, parseHHMMSS } from "../Relogio/timeParsers";

type TimerScreenProps = {
    fontSize?: number;
};

export default function TimerScreen ({
    fontSize
} : TimerScreenProps) {
    const {isReady, services} = useDatabase();

    const [anotacoes, setAnotacoes] = useState([] as AnotacaoEntity[]);
    const [currentAnotacao, setCurrentAnotacao] = useState(null as AnotacaoEntity);

    const carregarAnotacoes = useCallback(async () => {
        if (!services?.painel || !services?.anotacao) {
            console.log("Serviços não disponíveis ainda");
            return;
        }

        try {
            const paineisEncontrados : PainelEntity[] = await services.painel.findAll();
            const anotacoesEncontradas : AnotacaoEntity[] = await Promise.all(
                                            paineisEncontrados.map(p => services.anotacao.findByPainel(p.id))
                                            ).then(results => results.flat());
            console.log("carregando...");

            setAnotacoes(anotacoesEncontradas);
        } catch (error) {
            console.error("Erro ao carregar anotações:", error);
        }
    }, [services]);

    useEffect(() => {
        if (!services) {
            console.log("Banco de dados não está pronto.");
            return;
        }

        (async () => {
            await carregarAnotacoes();
            console.log("Anotações carregadas.");
        })();
    }, [services, carregarAnotacoes]);

    const atualizarAnotacao = async (a : AnotacaoEntity) => {
        const anotacaoInstance = new Anotacao(a);
        await services.anotacao.update(a.id, anotacaoInstance);
        await carregarAnotacoes();
    };

    async function pause(elapsedTime : number) {
        if(!currentAnotacao) {return};
        console.log("Registrando tempo...", elapsedTime)

        currentAnotacao.tempo_estudado = formatTime(elapsedTime, false);
        console.log("Novo tempo:", currentAnotacao.tempo_estudado);
        await atualizarAnotacao(currentAnotacao);
    };

    async function resetTempoEstudado() {
        currentAnotacao.tempo_estudado = null;
        await atualizarAnotacao(currentAnotacao);
    }

    const renderAnotacao = ({item}: { item : AnotacaoEntity}) => {
        return (
            <TouchableOpacity
                className={`flex-row items-center p-3 rounded-lg border bg-slate-100 border-slate-200`}
                activeOpacity={0.7}
                onPress={() => {currentAnotacao === item as Anotacao ? setCurrentAnotacao(null as Anotacao) : setCurrentAnotacao(item as Anotacao)}}
                >
                {/* Texto da anotação */}
                <View className="flex-1">
                    <Text className={`font-semibold text-black`} style={{ fontSize }}>
                    {item.descricao}
                    </Text>
                    {item.tempo_planejado_estudo && (
                        <View className="flex-row items-center mt-1">
                            <MaterialIcons 
                                name="schedule" 
                                size={12} 
                                color={"#94a3b8"} 
                            />
                            <Text
                                className={"text-slate-600"} 
                                style={{ fontSize: fontSize - 4, marginLeft: 4 }}
                            >
                                {item.tempo_planejado_estudo} - Planejado
                            </Text>
                        </View>
                    )}
                </View>
        
                {/* Tempo Estudado */}
                <View className="items-end">
                    <View 
                        className="px-2 py-1 rounded-full bg-slate-300"
                    >
                        <Text 
                            style={{ fontSize: fontSize - 4 }}
                            className="font-medium"
                        >
                            {item.tempo_estudado || "--:--:--"}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1">
            <View className="flex-1">
                <Relogio
                fontSize={fontSize}
                selectedAnotacao={currentAnotacao}
                onStop={(time) => pause(time)}
                onReset={() => resetTempoEstudado()}
                />
                {currentAnotacao && (
                    <View className="justify-center items-center p-3">
                        <Text style={{fontSize: fontSize + 3}}>
                            {currentAnotacao.descricao}
                        </Text>
                    </View>
                )}
            </View>
            <View className="flex-1">
                {anotacoes ? 
                    <FlatList
                    data={anotacoes}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderAnotacao}
                    showsVerticalScrollIndicator={false}
                    className='rounded-lg'
                    />
                    :
                    (<Text>
                        Sem anotações!
                    </Text>)
                }
            </View>
        </View>
    )
}