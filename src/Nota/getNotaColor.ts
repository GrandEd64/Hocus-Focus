export const getNotaColor = (nota: number) => {
    if (nota >= 9) return "#10b981"; // verde - excelente
    if (nota >= 7) return "#3b82f6"; // azul - bom
    if (nota >= 5) return "#f59e0b"; // amarelo - médio
    return "#ef4444"; // vermelho - ruim
  };