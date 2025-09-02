import React, { useRef, useEffect } from 'react'


type NovaAnotacaoProps = {
    textoAnotacao: string;
    onRegistrarPress: (novaAnotacao: string) => void; 
};