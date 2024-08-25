import { darkTheme, lightTheme } from '@funkit/connect'

export const isDebug = false

const FUNKIT_API_KEY = process.env.NEXT_PUBLIC_FUNKIT_API_KEY
if (!FUNKIT_API_KEY) throw new Error('FUNKIT_API_KEY is required')

export const funkitConfig = {
  appName: 'Nucleus',
  appLogoSrc: '/assets/images/IonLogo.png',
  loginModalConfig: {
    web2: false,
    web3: true,
  },
  apiKey: FUNKIT_API_KEY,
}

export const funkitThemeConfig = {
  lightMode: lightTheme({
    accentColor: 'linear-gradient(101.87deg, #01B0D1 2.85%, #00869d 100.03%)',
    customFontFamily: 'inherit',
    borderRadius: 'small',
    customColors: {
      notificationPrimary: 'var(--chakra-colors-neutral-500)',
      buttonDisabled: '#01B0D150',
    },
  }),
  darkMode: darkTheme({
    accentColor: 'linear-gradient(101.87deg, #01B0D1 2.85%, #00869d 100.03%)',
    borderRadius: 'small',
    customColors: {
      notificationPrimary: 'var(--chakra-colors-darkMode-400)',
      modalBackground: 'var(--chakra-colors-darkMode-500)',
      modalBackdrop: 'rgba(0,0,0,0.7)',
      buttonDisabled: '#01B0D150',
      buttonTextPrimary: '#FFFFFF',
    },
  }),
}
