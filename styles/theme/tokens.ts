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
          _dark: 'bg.invert-primary',
        },
        'bg-hover': {
          default: 'bg.invert-secondary',
          _dark: 'bg.invert-secondary',
        },
        'bg-active': {
          default: 'bg.invert-tertiary',
          _dark: 'bg.invert-tertiary',
        },
        'bg-disabled': {
          default: 'bg.quarternary',
          _dark: 'bg.quarternary',
        },
        stroke: {
          default: 'stroke.main',
          _dark: 'stroke.main',
        },
        element: {
          default: 'element.invert-primary',
          _dark: 'element.invert-primary',
        },
        'element-disabled': {
          default: 'element.invert-primary',
          _dark: 'element.invert-primary',
        },
      },
      'mint-primary': {
        'stroke-hover': {
          default: '#ffffff',
          _dark: '#ffffff',
        },
        bg: {
          default: 'bg.invert-secondary',
          _dark: 'bg.invert-secondary',
        },
        'bg-hover': {
          default: 'bg.invert-primary',
          _dark: 'bg.invert-primary',
        },
        'bg-active': {
          default: 'bg.invert-tertiary',
          _dark: 'bg.invert-tertiary',
        },
        stroke: {
          default: 'stroke.main',
          _dark: 'stroke.main',
        },
        element: {
          default: 'element.invert-secondary',
          _dark: 'element.invert-secondary',
        },
        'element-hover': {
          default: 'element.invert-primary',
          _dark: 'element.invert-primary',
        },
      },
      'mint-secondary': {
        'stroke-hover': {
          default: '#ffffff',
          _dark: '#ffffff',
        },
        bg: {
          default: 'bg.main',
          _dark: 'bg.main',
        },
        'bg-hover': {
          default: 'bg.invert-secondary',
          _dark: 'bg.invert-secondary',
        },
        'bg-active': {
          default: 'bg.invert-tertiary',
          _dark: 'bg.invert-tertiary',
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
          _dark: 'element.invert-primary',
        },
      },
      error: {
        bg: {
          default: 'colors.red.600',
          _dark: 'colors.red.600',
        },
        'bg-hover': {
          default: 'colors.red.500',
          _dark: 'colors.red.500',
        },
        'bg-disabled': {
          default: 'colors.red.0',
          _dark: 'colors.red.0',
        },
        'stroke-active': {
          default: 'colors.red.600',
          _dark: 'colors.red.600',
        },
        element: {
          default: 'colors.base.white',
          _dark: 'colors.base.white',
        },
        'element-active': {
          default: 'colors.red.600',
          _dark: 'colors.red.600',
        },
        'element-disabled': {
          default: 'colors.red.300',
          _dark: 'colors.red.300',
        },
      },
    },
    checkbox: {
      'stroke-active': {
        default: '#ffffff',
        _dark: '#ffffff',
      },
      bg: {
        default: 'bg.main',
        _dark: 'bg.main',
      },
      'bg-active': {
        default: 'bg.invert-primary',
        _dark: 'bg.invert-primary',
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
        _dark: 'element.disabled',
      },
      'element-active': {
        default: 'element.invert-primary',
        _dark: 'element.invert-primary',
      },
    },
    tag: {
      rewards: {
        stroke: {
          default: '#ffffff',
          _dark: '#ffffff',
        },
        bg: {
          default: 'colors.blue.50',
          _dark: 'colors.blue.50',
        },
        element: {
          default: 'colors.blue.600',
          _dark: 'colors.blue.600',
        },
      },
      apy: {
        stroke: {
          default: '#ffffff',
          _dark: '#ffffff',
        },
        bg: {
          default: 'colors.violet.100',
          _dark: 'colors.violet.100',
        },
        element: {
          default: 'colors.violet.600',
          _dark: 'colors.violet.600',
        },
      },
      info: {
        live: {
          stroke: {
            default: 'colors.green.600',
            _dark: 'colors.green.600',
          },
          element: {
            default: 'colors.green.600',
            _dark: 'colors.green.600',
          },
        },
        boosted: {
          stroke: {
            default: 'colors.orange.600',
            _dark: 'colors.orange.600',
          },
          element: {
            default: 'colors.orange.600',
            _dark: 'colors.orange.600',
          },
        },
        soon: {
          stroke: {
            default: 'colors.choc.200',
            _dark: 'colors.choc.200',
          },
          element: {
            default: 'colors.choc.200',
            _dark: 'colors.choc.200',
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
        default: 'colors.neutral.200',
        _dark: 'colors.neutral.200',
      },
      'stroke-primary': {
        default: 'element.main',
        _dark: 'element.main',
      },
      'stroke-secondary': {
        default: 'element.subdued',
        _dark: 'element.subdued',
      },
    },
    bg: {
      white: {
        default: 'light.neutral.0',
        _dark: 'dark.neutral.900',
      },
      main: {
        default: 'light.neutral.50',
        _dark: 'dark.neutral.800',
      },
      secondary: {
        default: 'light.neutral.100',
        _dark: 'dark.neutral.700',
      },
      tertiary: {
        default: 'light.neutral.200',
        _dark: 'dark.neutral.200',
      },
      quaternary: {
        default: 'light.neutral.300',
        _dark: 'dark.neutral.300',
      },
      'invert-tertiary': {
        default: 'light.neutral.700',
        _dark: 'dark.neutral.700',
      },
      'invert-secondary': {
        default: 'light.neutral.800',
        _dark: 'dark.neutral.800',
      },
      'invert-primary': {
        default: 'light.neutral.900',
        _dark: 'dark.neutral.900',
      },
    },
    element: {
      darker: {
        default: 'light.neutral.900',
        _dark: 'dark.neutral.50',
      },
      main: {
        default: 'light.neutral.800',
        _dark: 'dark.neutral.100',
      },
      lighter: {
        default: 'light.neutral.700',
        _dark: 'dark.neutral.100',
      },
      subdued: {
        default: 'light.neutral.600',
        _dark: 'dark.neutral.500',
      },
      disabled: {
        default: 'light.neutral.400',
        _dark: 'dark.neutral.400',
      },
      'invert-secondary': {
        default: 'light.neutral.100',
        _dark: 'dark.neutral.100',
      },
      'invert-primary': {
        default: 'light.neutral.50',
        _dark: 'dark.neutral.50',
      },
      violet: {
        default: 'light.violet.600',
        _dark: 'dark.violet.600',
      },
    },
    stroke: {
      darker: {
        default: 'light.neutral.400',
        _dark: 'dark.neutral.400',
      },
      main: {
        default: 'light.neutral.300',
        _dark: 'dark.neutral.300',
      },
      light: {
        default: 'light.neutral.200',
        _dark: 'dark.neutral.200',
      },
      lighter: {
        default: 'light.neutral.100',
        _dark: 'dark.neutral.100',
      },
      focus: {
        default: 'light.neutral.700',
        _dark: 'dark.neutral.700',
      },
      badge: {
        default: 'bg.white',
        _dark: 'dark.choc.500',
      },
    },
  },
}
