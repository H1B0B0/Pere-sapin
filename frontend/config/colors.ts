export const CHALET_COLORS = [
    { name: 'slate', value: '#64748b', label: 'Gris ardoise' },
    { name: 'emerald', value: '#10b981', label: 'Émeraude' },
    { name: 'sky', value: '#0ea5e9', label: 'Bleu ciel' },
    { name: 'amber', value: '#f59e0b', label: 'Ambre' },
    { name: 'rose', value: '#f43f5e', label: 'Rose' },
    { name: 'violet', value: '#8b5cf6', label: 'Violet' },
    { name: 'teal', value: '#14b8a6', label: 'Bleu-vert' },
    { name: 'orange', value: '#f97316', label: 'Orange' },
] as const;

export type ChaletColor = typeof CHALET_COLORS[number]['name'];