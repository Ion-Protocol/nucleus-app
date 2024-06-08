/**
 * This script reads SVG files from a specified input directory, converts them into Chakra UI icon components,
 * and saves the generated components to a specified output directory. The script ensures that all SVG attributes
 * are converted from kebab-case to camelCase and handles nested elements properly. If an icon file with the same
 * name already exists in the output directory, it will be skipped to avoid overwriting.
 *
 * Usage:
 * 1. Place your SVG files in the input directory (e.g., assets/svgs).
 * 2. Run the script using npm (e.g., npm run convert-icons).
 * 3. The script will generate Chakra UI icon components in the output directory (e.g., components/icons).
 * 4. You can then import and use these Chakra icons in the application.
 *
 * Why use Chakra icons?
 * Consistency: Ensures a unified design language across your application.
 * Customizability: Easily adjust size, color, and other properties to match your design.
 * Theming Support: Integrates with Chakra's theming system for consistent styling.
 *
 * Overall it's just much easier to deal with Chakra icons than raw SVGs.
 */

const fs = require('fs')
const path = require('path')
const { JSDOM } = require('jsdom')

// Function to convert kebab-case to PascalCase
const toPascalCase = (str) => {
  return str.replace(/(^\w|-\w)/g, (g) => g.replace('-', '').toUpperCase())
}

// Function to convert kebab-case to camelCase
const toCamelCase = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

// Function to recursively convert attributes of all elements in an SVG to camelCase and handle special cases
const convertAttributesToCamelCase = (element) => {
  if (element.nodeType === 1) {
    // Element node
    const attributes = Array.from(element.attributes)
    attributes.forEach((attr) => {
      if (attr.name.startsWith('xmlns') || attr.name === 'style') {
        element.removeAttribute(attr.name) // Remove xmlns and style attributes
      } else if (attr.name.includes(':')) {
        // Handle specific namespaced attributes
        if (attr.name.endsWith(':href')) {
          const camelCaseName = toCamelCase(attr.name.split(':')[1])
          element.setAttribute('href', attr.value)
          element.removeAttribute(attr.name)
        } else {
          element.removeAttribute(attr.name) // Remove other namespaced attributes
        }
      } else {
        const camelCaseName = toCamelCase(attr.name)
        if (camelCaseName !== attr.name) {
          element.setAttribute(camelCaseName, attr.value)
          element.removeAttribute(attr.name)
        }
      }
    })
    Array.from(element.childNodes).forEach(convertAttributesToCamelCase)
  }
}

// Function to convert SVG text to Chakra UI icon code
const convertSvgToChakraIcon = (svgText, iconName) => {
  const dom = new JSDOM(svgText, { contentType: 'image/svg+xml' })
  const svgElement = dom.window.document.querySelector('svg')
  convertAttributesToCamelCase(svgElement)

  const viewBox = svgElement.getAttribute('viewBox') || '0 0 24 24'
  const innerHtml = svgElement.innerHTML

  const componentName = `${iconName}Icon`
  const iconCode = `
import { createIcon } from '@chakra-ui/react';

export const ${componentName} = createIcon({
  displayName: '${componentName}',
  viewBox: '${viewBox}',
  path: (
    <>
      ${innerHtml}
    </>
  ),
});
`

  return iconCode
}

// Function to read SVG files and generate Chakra UI icon code
const convertSvgFilesToChakraIcons = (inputDir, outputDir) => {
  fs.readdir(inputDir, (err, files) => {
    if (err) {
      console.error('Error reading input directory:', err)
      return
    }

    files.forEach((file) => {
      const filePath = path.join(inputDir, file)
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err)
          return
        }

        const iconNameKebab = path.basename(file, path.extname(file))
        const iconNamePascal = toPascalCase(iconNameKebab)
        const outputFilePath = path.join(outputDir, `${iconNamePascal}.tsx`)

        if (fs.existsSync(outputFilePath)) {
          console.log(`Icon ${iconNamePascal}.tsx already exists, skipping conversion.`)
          return
        }

        const iconCode = convertSvgToChakraIcon(data, iconNamePascal)

        fs.writeFile(outputFilePath, iconCode, 'utf8', (err) => {
          if (err) {
            console.error('Error writing file:', err)
          } else {
            console.log(`Converted ${file} to ${iconNamePascal}.tsx`)
          }
        })
      })
    })
  })
}

// Example usage
const inputDirectory = path.resolve(__dirname, '../assets/svgs')
const outputDirectory = path.resolve(__dirname, '../components/icons')

// Ensure output directory exists
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true })
}

convertSvgFilesToChakraIcons(inputDirectory, outputDirectory)
