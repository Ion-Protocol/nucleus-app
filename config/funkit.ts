const FUNKIT_API_KEY = process.env.NEXT_PUBLIC_FUNKIT_API_KEY
if (!FUNKIT_API_KEY) throw new Error('FUNKIT_API_KEY is required')

export const funkitConfig = {
  appName: 'Ion Protocol',
  appLogoSrc: '/assets/images/IonLogo.png',
  loginModalConfig: {
    web2: false,
    web3: true,
  },
  apiKey: FUNKIT_API_KEY,
}
