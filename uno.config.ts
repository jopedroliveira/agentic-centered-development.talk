import { defineConfig } from 'unocss'

export default defineConfig({
  shortcuts: {
    'text-gradient': 'bg-gradient-to-r from-[#045CFC] to-[#A3A9FF] bg-clip-text text-transparent',
    'glass-card': 'bg-white/5 backdrop-blur-sm border border-white/8 rounded-xl p-4',
    'glow-border': 'border border-[#045CFC]/20 shadow-[0_0_24px_rgba(4,92,252,0.06)]',
  },
  theme: {
    colors: {
      brand: {
        blue: '#045CFC',
        yellow: '#F9FF47',
        pink: '#F29EFE',
        periwinkle: '#A3A9FF',
        wine: '#4A2930',
        light: '#F4F4F4',
        dark: '#1C1C1C',
      },
    },
  },
})
