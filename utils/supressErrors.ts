/**
 * Suppresses specific React errors related to defaultProps deprecation in function components.
 *
 * This suppression is necessary because Recharts library components such as `ReferenceLine` still use
 * `defaultProps`, which will be deprecated in future React releases. The Recharts team is aware of this issue and
 * has discussed it extensively. Changing the usage of `defaultProps` to JavaScript default parameters requires
 * significant refactoring and is a complex task due to internal dependencies.
 *
 * Currently the occurence of this error does not break anything in the app. Since the error is well understood and documented,
 * we can suppress it to keep the console clean.
 *
 * Relevant GitHub Issues:
 * - [Change defaultProps in ReferenceArea and ReferenceLine to use Javascript default parameters](https://github.com/recharts/recharts/issues/3278)
 * - [Support for defaultProps will be removed from function components in a future major release](https://github.com/recharts/recharts/issues/3615)
 * - [Option ifOverflow='extendDomain' not working anymore for ReferenceLine and ReferenceArea](https://github.com/recharts/recharts/issues/3438)
 *
 * Note: This is a temporary workaround. Keep an eye on Recharts repository for updates.
 */
export const suppressErrors = () => {
  const originalError = console.error
  console.error = (message, ...args) => {
    if (
      typeof message === 'string' &&
      message.includes('Support for defaultProps will be removed from function components')
    ) {
      return
    }
    originalError(message, ...args)
  }
}
