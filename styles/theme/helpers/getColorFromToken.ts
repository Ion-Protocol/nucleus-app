import theme from '..'

/**
 * Recursively resolves a token path in an object.
 *
 * @param {object} obj - The object containing the tokens.
 * @param {string} path - The token path to resolve, represented as a dot-separated string.
 * @returns {any} - The resolved value at the given token path.
 */
const resolveToken = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

/**
 * Retrieves the color value for a given semantic token and color mode.
 *
 * @param {string} token - The token representing the color, formatted as a dot-separated string.
 * @param {'light' | 'dark'} colorMode - The color mode, either 'light' or 'dark'.
 * @returns {string} - The resolved hex color value.
 *
 * @throws Will throw an error if the token is not found in the semantic tokens or if the color mode is not defined for the token.
 *
 * @example
 * // Assuming theme.semanticTokens.colors contains:
 * // {
 * //   timeRange: {
 * //     selectedBackground: {
 * //       default: 'blue.500',
 * //       _dark: 'blue.300'
 * //     }
 * //   }
 * // }
 *
 * const color = getColorFromToken('timeRange.selectedBackground', 'dark')
 * console.log(color) // Outputs the resolved hex color for 'blue.300'
 */
export const getColorFromToken = (token: string, colorMode: 'light' | 'dark'): string => {
  const tokenValue = resolveToken(theme.semanticTokens.colors, token)

  if (!tokenValue) {
    throw new Error(`Token ${token} not found in semantic tokens`)
  }

  const tokenColor = colorMode === 'dark' ? tokenValue._dark : tokenValue.default

  if (!tokenColor) {
    throw new Error(`Color mode ${colorMode} not defined for token ${token}`)
  }

  // If tokenColor is already a valid color code, return it directly
  if (theme.colors[tokenColor]) {
    return theme.colors[tokenColor]
  }

  // Split and resolve color family and shade
  const [colorFamily, colorShade] = tokenColor.split('.')
  const hexColor = theme.colors[colorFamily][colorShade]

  if (!hexColor) {
    throw new Error(`Hex color not found for ${colorFamily}.${colorShade}`)
  }

  return hexColor
}
