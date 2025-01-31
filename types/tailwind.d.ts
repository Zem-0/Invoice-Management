declare module 'tailwindcss/lib/util/flattenColorPalette' {
    const flattenColorPalette: (colors: object) => { [key: string]: string };
    export default flattenColorPalette;
} 