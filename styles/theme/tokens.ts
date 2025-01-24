export const semanticTokens = {
  colors: {
    primary: {
      default: 'darkMode.500',
      _dark: 'neutral.500',
    },
    border: {
      default: 'neutral.600',
      _dark: 'darkMode.300',
    },
    borderLight: {
      default: 'neutral.600',
      _dark: 'darkMode.200',
    },
    background: {
      default: 'neutral.500',
      _dark: 'darkMode.500',
    },
    backgroundSecondary: {
      default: 'neutral.400',
      _dark: 'darkMode.400',
    },
    backgroundAlternate: {
      default: 'neutral.200',
      _dark: 'darkMode.400',
    },
    active: {
      default: 'neutral.200',
      _dark: 'darkMode.300',
    },
    drawerBackground: {
      default: 'neutral.400',
      _dark: 'darkMode.500',
    },
    formBackground: {
      default: 'neutral.500',
      _dark: 'darkMode.300',
    },
    successDialogSummary: {
      default: 'neutral.50',
      _dark: 'darkMode.300',
    },
    iconBackground: {
      default: 'neutral.200',
      _dark: 'darkMode.300',
    },
    text: {
      default: 'darkMode.500',
      _dark: 'white',
    },
    textInverse: {
      default: 'white',
      _dark: 'darkMode.500',
    },
    textSecondary: {
      default: 'darkMode.300',
      _dark: 'darkMode.200',
    },
    hover: {
      default: 'neutral.200',
      _dark: 'darkMode.700',
    },
    hoverSecondary: {
      default: 'neutral.300',
      _dark: 'darkMode.300',
    },
    navDrawerSelected: {
      default: 'neutral.300',
      _dark: 'darkMode.900',
    },
    modalParagraph: {
      default: '#6B7280',
      _dark: 'white',
    },
    infoIcon: {
      default: 'darkMode.200',
      _dark: 'darkMode.200',
    },
    disabledText: {
      default: 'neutral.700',
      _dark: 'darkMode.200',
    },
    shadow: {
      default: 'shadow.light',
      _dark: 'shadow.dark',
    },
    tooltip: {
      default: 'neutral.800',
      _dark: 'darkMode.50',
    },
    tooltipLabel: {
      default: 'neutral.900',
      _dark: 'darkMode.200',
    },
    link: {
      default: 'primary.500',
      _dark: 'primary.300',
    },
    smallTag: {
      default: 'neutral.600',
      _dark: 'darkMode.200',
    },
    smallTagText: {
      default: 'neutral.900',
      _dark: 'darkMode.400',
    },
    claimButtonText: {
      default: 'deepTeal.main',
      _dark: 'deepTeal.main',
    },
    claimButtonBorder: {
      default: 'goldenSand.main',
      _dark: 'goldenSand.main',
    },
    claimableButtonBg: {
      default: 'iceberg.50',
      _dark: 'iceberg.50',
    },
    claimableButtonBorder: {
      default: 'bermuda.main',
      _dark: 'bermuda.main',
    },
    success: {
      main: {
        default: 'green.main',
        _dark: 'green.main',
      },
      iconBg: {
        default: 'green.light',
        _dark: 'green.light',
      },
      background: {
        default: 'green.lighter',
        _dark: 'green.lighter',
      },
    },
    warning: {
      main: {
        default: 'yellow.dark',
        _dark: 'yellow.dark',
      },
      iconBg: {
        default: 'yellow.medium',
        _dark: 'yellow.veryDark',
      },
      background: {
        default: 'yellow.light',
        _dark: 'midnight.850',
      },
    },
    error: {
      main: {
        default: 'red.main',
        _dark: 'red.main',
      },
      iconBg: {
        default: 'red.light',
        _dark: 'red.light',
      },
      background: {
        default: 'red.lighter',
        _dark: 'red.lighter',
      },
    },
    warningCard: {
      bg: {
        default: 'neutral.100',
        _dark: 'darkMode.300',
      },
      border: {
        default: 'neutral.600',
        _dark: 'darkMode.100',
      },
    },
    skeleton: {
      startColor: {
        default: 'neutral.600',
        _dark: 'darkMode.300',
      },
      endColor: {
        default: 'neutral.700',
        _dark: 'darkMode.400',
      },
    },
    dialogSteps: {
      idle: {
        default: 'neutral.600',
        _dark: 'darkMode.300',
      },
      active: {
        default: 'neutral.900',
        _dark: 'darkMode.200',
      },
      icon: {
        idle: {
          default: 'darkMode.500',
          _dark: 'darkMode.200',
        },
        active: {
          default: 'white',
          _dark: 'white',
        },
      },
    },
    code: {
      background: {
        default: 'neutral.50',
        _dark: 'darkMode.800',
      },
    },
    // start v2 colors
    button: {
      primary: {
        bg: {
          default: 'bg.invert-primary',
          _dark: 'dark.violet.200',
        },
        'bg-hover': {
          default: 'bg.invert-secondary',
          _dark: 'dark.violet.100',
        },
        'bg-active': {
          default: 'bg.invert-tertiary',
          _dark: 'dark.violet.50',
        },
        'bg-disabled': {
          default: 'bg.quarternary',
          _dark: 'bg.tertiary',
        },
        stroke: {
          default: 'stroke.main',
          _dark: 'dark.violet.500',
        },
        element: {
          default: 'element.invert-primary',
          _dark: 'dark.element.darker',
        },
        'element-disabled': {
          default: 'element.invert-primary',
          _dark: 'dark.element.subdued',
        },
      },
      'mint-primary': {
        'stroke-hover': {
          default: 'transparent',
          _dark: 'transparent',
        },
        bg: {
          default: 'bg.invert-secondary',
          _dark: 'dark.violet.200',
        },
        'bg-hover': {
          default: 'bg.invert-primary',
          _dark: 'dark.violet.100',
        },
        'bg-active': {
          default: 'bg.invert-tertiary',
          _dark: 'dark.violet.300',
        },
        stroke: {
          default: 'stroke.main',
          _dark: 'stroke.main',
        },
        element: {
          default: 'element.invert-secondary',
          _dark: 'dark.violet.0',
        },
        'element-hover': {
          default: 'element.invert-primary',
          _dark: 'dark.violet.0',
        },
      },
      'mint-secondary': {
        'stroke-hover': {
          default: 'transparent',
          _dark: 'transparent',
        },
        bg: {
          default: 'bg.main',
          _dark: 'bg.main',
        },
        'bg-hover': {
          default: 'bg.invert-secondary',
          _dark: 'dark.violet.200',
        },
        'bg-active': {
          default: 'bg.invert-tertiary',
          _dark: 'dark.violet.100',
        },
        stroke: {
          default: 'stroke.main',
          _dark: 'stroke.main',
        },
        element: {
          default: 'element.lighter',
          _dark: 'element.lighter',
        },
        'element-hover': {
          default: 'element.invert-primary',
          _dark: 'dark.violet.0',
        },
      },
      error: {
        bg: {
          default: 'light.red.600',
          _dark: 'dark.red.200',
        },
        'bg-hover': {
          default: 'light.red.500',
          _dark: 'dark.red.400',
        },
        'bg-disabled': {
          default: 'light.red.0',
          _dark: 'dark.red.800',
        },
        'stroke-active': {
          default: 'light.red.600',
          _dark: 'dark.red.200',
        },
        element: {
          default: 'base.white',
          _dark: 'base.white',
        },
        'element-active': {
          default: 'light.red.600',
          _dark: 'dark.red.200',
        },
        'element-disabled': {
          default: 'light.red.300',
          _dark: 'dark.red.500',
        },
      },
    },
    checkbox: {
      'stroke-active': {
        default: 'transparent',
        _dark: 'element.subdued',
      },
      bg: {
        default: 'bg.main',
        _dark: 'bg.main',
      },
      'bg-active': {
        default: 'bg.invert-primary',
        _dark: 'bg.main',
      },
      stroke: {
        default: 'stroke.darker',
        _dark: 'stroke.darker',
      },
      element: {
        default: 'bg.main',
        _dark: 'bg.main',
      },
      'element-hover': {
        default: 'element.disabled',
        _dark: 'stroke.darker',
      },
      'element-active': {
        default: 'element.invert-primary',
        _dark: 'element.main',
      },
    },
    tag: {
      rewards: {
        stroke: {
          default: '#ffffff',
          _dark: 'dark.blue.600',
        },
        bg: {
          default: 'light.blue.50',
          _dark: 'dark.blue.800',
        },
        element: {
          default: 'light.blue.600',
          _dark: 'dark.blue.100',
        },
      },
      apy: {
        stroke: {
          default: '#ffffff',
          _dark: 'dark.violet.600',
        },
        bg: {
          default: 'light.violet.100',
          _dark: 'dark.violet.800',
        },
        element: {
          default: 'light.violet.600',
          _dark: 'dark.violet.100',
        },
      },
      info: {
        live: {
          stroke: {
            default: 'light.green.600',
            _dark: 'dark.green.500',
          },
          element: {
            default: 'light.green.600',
            _dark: 'dark.green.600',
          },
        },
        boosted: {
          stroke: {
            default: 'light.orange.600',
            _dark: 'dark.orange.500',
          },
          element: {
            default: 'light.orange.600',
            _dark: 'dark.orange.100',
          },
        },
        soon: {
          stroke: {
            default: 'light.choc.500',
            _dark: 'dark.choc.200',
          },
          element: {
            default: 'light.choc.200',
            _dark: 'dark.choc.300',
          },
        },
      },
    },
    'hero-illustration': {
      red: {
        default: 'web.thermic.400',
        _dark: 'web.thermic.400',
      },
      violet: {
        default: 'web.amethyst.400',
        _dark: 'web.amethyst.400',
      },
      yellow: {
        default: 'web.electron.400',
        _dark: 'web.electron.400',
      },
      green: {
        default: 'web.olivenite.400',
        _dark: 'web.olivenite.400',
      },
      neutral: {
        default: 'light.neutral.200',
        _dark: 'dark.neutral.300',
      },
      'stroke-primary': {
        default: 'element.main',
        _dark: 'element.disabled',
      },
      'stroke-secondary': {
        default: 'element.subdued',
        _dark: 'element.disabled',
      },
    },
    bg: {
      white: {
        default: 'light.neutral.0',
        _dark: 'dark.choc.900',
      },
      main: {
        default: 'light.neutral.50',
        _dark: 'dark.choc.800',
      },
      secondary: {
        default: 'light.neutral.100',
        _dark: 'dark.choc.700',
      },
      tertiary: {
        default: 'light.neutral.200',
        _dark: 'dark.choc.600',
      },
      quaternary: {
        default: 'light.neutral.300',
        _dark: 'dark.choc.500',
      },
      'invert-tertiary': {
        default: 'light.neutral.700',
        _dark: 'dark.choc.200',
      },
      'invert-secondary': {
        default: 'light.neutral.800',
        _dark: 'dark.choc.100',
      },
      'invert-primary': {
        default: 'light.neutral.900',
        _dark: 'dark.choc.50',
      },
    },
    element: {
      darker: {
        default: 'light.neutral.900',
        _dark: 'dark.choc.0',
      },
      main: {
        default: 'light.neutral.800',
        _dark: 'dark.choc.50',
      },
      lighter: {
        default: 'light.neutral.700',
        _dark: 'dark.choc.100',
      },
      subdued: {
        default: 'light.neutral.600',
        _dark: 'dark.choc.200',
      },
      disabled: {
        default: 'light.neutral.400',
        _dark: 'dark.choc.500',
      },
      'invert-secondary': {
        default: 'light.neutral.100',
        _dark: 'dark.choc.800',
      },
      'invert-primary': {
        default: 'light.neutral.50',
        _dark: 'dark.choc.900',
      },
      violet: {
        default: 'light.violet.600',
        _dark: 'dark.violet.100',
      },
    },
    stroke: {
      darker: {
        default: 'light.neutral.400',
        _dark: 'dark.choc.500',
      },
      main: {
        default: 'light.neutral.300',
        _dark: 'dark.choc.600',
      },
      light: {
        default: 'light.neutral.200',
        _dark: 'dark.choc.700',
      },
      lighter: {
        default: 'light.neutral.100',
        _dark: 'dark.choc.800',
      },
      focus: {
        default: 'light.neutral.700',
        _dark: 'dark.choc.200',
      },
      badge: {
        default: 'bg.white',
        _dark: 'dark.choc.500',
      },
    },
  },
}
