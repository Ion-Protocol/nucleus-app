import * as currencyFunctions from './currency'
import * as bigintFunctions from './bigint'

export const utils = {
  ...currencyFunctions,
  ...bigintFunctions,
}
