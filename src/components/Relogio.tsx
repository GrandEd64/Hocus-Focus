import { useEffect, useRef, useState } from "react"
import { View, Text, Pressable } from "react-native"
import { AnotacaoEntity } from "../types/entities";
import { formatTime, parseHHMMSS } from "../Relogio/timeParsers";

type RelogioProps = {
    fontSize?: number;
    selectedAnotacao?: AnotacaoEntity;
    onStop: (elapsedTime: number) => void;
    onReset: () => void;
    onPlannedTimerReached: () => void;
}

function Relogio (
    {
        fontSize,
        selectedAnotacao,
        onStop,
        onReset,
        onPlannedTimerReached
    } : RelogioProps
) {
    const [isRunning, setIsRunning] = useState(false);
    const [currentSessionTime, setCurrentSessionTime] = useState(0);
    const [previousStudyTime, setPreviousStudyTime] = useState(0);
    const intervalIdRef = useRef(null);
    const startTimeRef = useRef(0);

    let totalElapsedTime = previousStudyTime + currentSessionTime;
    const hasReachedLimit = selectedAnotacao?.tempo_planejado_estudo && parseHHMMSS(selectedAnotacao?.tempo_planejado_estudo) < totalElapsedTime;

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now() - currentSessionTime;
            if(hasReachedLimit) {timeUp(); return;};
            intervalIdRef.current = setInterval(() => {
                setCurrentSessionTime(Date.now() - startTimeRef.current);
            }, 10);
        } else {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        }

        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [isRunning, currentSessionTime]);

    useEffect(() => {
        setIsRunning(false);
        setCurrentSessionTime(0);
        if(selectedAnotacao?.tempo_estudado){
            setPreviousStudyTime(parseHHMMSS(selectedAnotacao.tempo_estudado));
        } else {
            setPreviousStudyTime(0);
        }
    }, [selectedAnotacao]);

    function timeUp() {
        totalElapsedTime = Math.floor(totalElapsedTime);
        stop();
        onPlannedTimerReached();
    }

    function start() {
        if(hasReachedLimit) {timeUp(); return;};
        setIsRunning(true);
    }

    function stop() {
        setIsRunning(false);
        onStop(currentSessionTime + previousStudyTime);
    }

    function reset() {
        setIsRunning(false);
        setCurrentSessionTime(0);
        setPreviousStudyTime(0);
        onReset();
    }

    const btnFontStyle = {fontSize: fontSize};

    return (
        <View className="flex-1 items-center justify-center gap-6">
            <Text className="text-5xl font-bold font-mono text-blue-600">
                {formatTime(totalElapsedTime, true)}
            </Text>
            <View className="flex-row gap-2">
                <Pressable
                    onPress={start}
                    disabled={isRunning}
                    className={`px-6 py-2 rounded-lg ${isRunning ? 'opacity-50' : 'bg-green-500'} active:opacity-75`}
                >
                    <Text className="text-white text-base font-semibold" style={btnFontStyle}>Começar Estudos</Text>
                </Pressable>
                <Pressable
                    onPress={stop}
                    disabled={!isRunning}
                    className={`px-6 py-2 rounded-lg ${!isRunning ? 'opacity-50' : 'bg-red-500'} active:opacity-75`}
                >
                    <Text className="text-white text-base font-semibold" style={btnFontStyle}>Pausar estudo</Text>
                </Pressable>
                <Pressable
                    onPress={reset}
                    className="px-6 py-2 rounded-lg bg-gray-500 active:opacity-75"
                >
                    <Text className="text-white text-base font-semibold" style={btnFontStyle}>Reset</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default Relogio