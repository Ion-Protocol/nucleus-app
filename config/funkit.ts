import { darkTheme, lightTheme } from '@funkit/connect'

export const isDebug = false

const FUNKIT_API_KEY = process.env.NEXT_PUBLIC_FUNKIT_API_KEY
if (!FUNKIT_API_KEY) throw new Error('FUNKIT_API_KEY is required')

export const funkitConfig = {
  appName: 'Nucleus',
  appLogoSrc: '/assets/images/ion-logo-neutral.png',
  loginModalConfig: {
    web2: false,
    web3: true,
  },
  apiKey: FUNKIT_API_KEY,
}

export const funkitThemeConfig = {
  lightMode: lightTheme({
    accentColor: 'var(--chakra-colors-darkMode-500)',
    customFontFamily: 'var(--font-recklessNeue)',
    customFontWeights: {
      regular: 'var(--font-recklessNeue)',
      medium: 'var(--font-recklessNeue)',
      semibold: 'var(--font-recklessNeue)',
      bold: 'var(--font-recklessNeue)',
      heavy: 'var(--font-recklessNeue)',
    },
    fontSizing: 'regular',
    borderRadius: 'small',
    customColors: {
      notificationPrimary: 'var(--chakra-colors-neutral-500)',

      // button
      buttonPrimary: 'var(--chakra-colors-darkMode-500)',
      buttonDisabled: '#00171F77',

      // modal
      modalBackdrop: 'rgba(0,0,0,0.7)',
      modalBackground: 'var(--chakra-colors-neutral-400)',
      modalBorder: 'var(--chakra-colors-neutral-600)',
      modalTextDim: 'var(--chakra-colors-neutral-800)',
      modalTextSecondary: 'var(--chakra-colors-neutral-800)',
    },
  }),
  darkMode: darkTheme({
    accentColor: 'var(--chakra-colors-neutral-500)',
    borderRadius: 'small',
    customFontFamily: 'var(--font-recklessNeue)',
    customFontWeights: {
      regular: 'var(--font-recklessNeue)',
      medium: 'var(--font-ppformula)',
      semibold: 'var(--font-ppformula)',
      bold: 'var(--font-ppformula)',
      heavy: 'var(--font-ppformula)',
    },
    fontSizing: 'regular',
    customColors: {
      notificationPrimary: 'var(--chakra-colors-darkMode-300)',

      // button
      buttonPrimary: 'var(--chakra-colors-neutral-500)',
      buttonDisabled: '#f8f3e077',

      // modal
      modalBackdrop: 'rgba(0,0,0,0.7)',
      modalBackground: 'var(--chakra-colors-darkMode-400)',
      modalBorder: 'var(--chakra-colors-darkMode-300)',
      modalTextDim: 'var(--chakra-colors-darkMode-200)',
      modalTextSecondary: 'var(--chakra-colors-darkMode-200)',
    },
  }),
}
