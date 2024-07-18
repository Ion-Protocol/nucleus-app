import { DebounceConfig } from '@/store/middleware/debounceMiddleware'
import { setBridgeFromDebounceComplete } from '@/store/slices/bridges'
import { setBridgeFrom } from '@/store/slices/bridges/thunks'

/**
 * Configuration for debouncing actions in the application.
 *
 * This configuration array defines how specific actions should be debounced,
 * meaning it will delay the dispatch of these actions to prevent them from
 * being fired too frequently in a short period of time. This is particularly
 * useful in scenarios such as user input, where actions are triggered by
 * keystrokes or other frequent events.
 *
 * @param debounceActionType - The type of the action that should be debounced.
 * When this action is dispatched, the middleware will delay its processing
 * according to the specified debounceTime.
 * @param triggerActionType - The type of the action that should be dispatched
 * after the debounce delay. This action is triggered once the debounce delay
 * has elapsed. This action will need to be manually defined in a slice.
 * The established pattern is to listen to this action in a middlware sideEffect
 * to trigger another action.
 * @param debounceTime - The time, in milliseconds, to wait before dispatching
 * the debounceActionType. During this time, any subsequent dispatches of the
 * same debounceActionType will reset the delay.
 */
export const debounceConfigs: DebounceConfig[] = [
  {
    debounceActionType: setBridgeFrom.pending.type,
    triggerActionType: setBridgeFromDebounceComplete.type,
    debounceTime: 1000,
  },
]
