
import { defineConfig, presetAttributify, presetIcons, presetTypography, presetUno, presetWebFonts, transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
    presets: [
        presetAttributify(),
        presetIcons(),
        presetTypography(),
        presetUno(),
        presetWebFonts({
            fonts: {
            },
        }),
    ],
    shortcuts: {
        "flex-center": "flex items-center justify-center",
        "flex-x-center": "flex justify-center",
        "flex-y-center": "flex items-center",
        "wh-full": "w-full h-full",
        "flex-x-between": "flex justify-between items-center",
        "flex-x-end": "flex justify-end items-center",
        "absolute-lt": "absolute left-0 top-0",
        "absolute-rt": "absolute right-0 top-0",
        "fixed-lt": "fixed left-0 top-0",
    },

    theme: {
        colors: {
            primary: "var(--el-color-primary)",
            primary_dark: "var(--el-color-primary-light-5)",
        },
    },

    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
});
