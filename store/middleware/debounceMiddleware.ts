import { debounceConfigs } from '@/config/debounce'
import { Action, Dispatch, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'

export interface DebounceConfig {
  debounceActionType: string
  triggerActionType: string
  debounceTime: number
}

interface DebounceMiddlewareOptions {
  debounceConfigs: DebounceConfig[]
}

/**
 * Creates a debounce middleware that delays the dispatch of actions based on the provided debounce configuration.
 *
 * @param options - The options for the debounce middleware, including the debounce configuration.
 * @returns A middleware function that can be used with Redux.
 *
 * @remarks
 * This middleware helps in scenarios where certain actions are dispatched frequently, such as when typing in an input field.
 * It ensures that the action is only dispatched once after a specified delay, improving performance and reducing unnecessary API calls or state updates.
 */
const createDebounceMiddleware = (options: DebounceMiddlewareOptions): Middleware => {
  const { debounceConfigs } = options
  const timers: { [actionType: string]: NodeJS.Timeout | null } = {}

  const middleware = (store: MiddlewareAPI) => (next: Dispatch) => (action: Action) => {
    const config = debounceConfigs.find((config) => config.debounceActionType === action.type)

    if (config) {
      const { debounceActionType, triggerActionType, debounceTime } = config

      if (timers[debounceActionType]) {
        clearTimeout(timers[debounceActionType]!)
      }

      timers[debounceActionType] = setTimeout(() => {
        next(action)
        store.dispatch({ type: triggerActionType })
      }, debounceTime)
    } else {
      return next(action)
    }

    return action
  }

  return middleware as Middleware
}

/**
 * Debounce middleware instance created with the specified configuration.
 * This middleware can be directly added to the Redux store.
 */
export const debounceMiddleware = createDebounceMiddleware({ debounceConfigs })
