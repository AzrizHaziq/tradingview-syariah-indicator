import React, { useContext, useReducer } from 'react'

export const initState: TSI.Flag[] = [
  {
    id: 'MYX',
    src: '/assets/flag/MYX.svg',
    alt: 'Malaysia',
    width: '20px',
    height: '10px',
    updatedAt: '',
    displayUrl: 'https://github.com/AzrizHaziq/tradingview-syariah-indicator/blob/master/contents/MYX.txt',
  },
]

type State = TSI.Flag[]
type Dispatch = (action: Action) => void
type CountProviderProps = { children: React.ReactNode }
type Action = { type: 'init' } | { type: 'set-flag-update-at'; payload: { flag: string; updatedAt: Date | string } }

const StateContext = React.createContext<State | undefined>(undefined)
const DispatchContext = React.createContext<Dispatch | undefined>(undefined)

function currentDateReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'init':
      return initState
    case 'set-flag-update-at':
      return state.map(flag => {
        if (flag.id === action.payload.flag) {
          return { ...flag, updatedAt: action.payload.updatedAt }
        }

        return flag
      })
    default: {
      throw new Error(`Unhandled action type: ${action!.type}`)
    }
  }
}

function CurrentDateProvider({ children }: CountProviderProps) {
  const [state, dispatch] = useReducer(currentDateReducer, initState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}

function useCurrentDateState() {
  const context = useContext(StateContext)
  if (context === undefined) {
    throw new Error('CurrentDate: StateContext must be used within a CountProvider')
  }
  return context
}

function useCurrentDateDispatch() {
  const context = useContext(DispatchContext)
  if (context === undefined) {
    throw new Error('CurrentDate DispatchContext must be used within a CountProvider')
  }
  return context
}

function useCurrentDate() {
  return [useCurrentDateState(), useCurrentDateDispatch()] as const
}

export { CurrentDateProvider, useCurrentDateState, useCurrentDateDispatch, useCurrentDate }
