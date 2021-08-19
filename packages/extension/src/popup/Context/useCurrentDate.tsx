// import { Accessor, useContext, createContext, createSignal } from 'solid-js'
// import { createStore } from 'solid-js/store'

// type State = TSI.Flag[]
// type Dispatch = (action: Action) => void
// type CountProviderProps = { children: React.ReactNode }
// type Action = { type: 'init'; payload: TSI.Flag[] } | { type: 'set-flag-update-at'; payload: TSI.Flag }

// const StateContext = React.createContext<State | undefined>(undefined)
// const DispatchContext = React.createContext<Dispatch | undefined>(undefined)
//
// function currentDateReducer(state: State, action: Action): State | never {
//   switch (action.type) {
//     case 'init':
//       return action.payload
//     case 'set-flag-update-at':
//       return state.map(flag => {
//         if (flag.id === action.payload.id) {
//           return { ...flag, updatedAt: action.payload.updatedAt }
//         }
//
//         return flag
//       })
//     default: {
//       throw new Error(`Unhandled action type in currentDateReducer`)
//     }
//   }
// }
//
// function CurrentDateProvider({ children }: CountProviderProps): JSX.Element {
//   const [state, dispatch] = useReducer(currentDateReducer, [])
//
//   return (
//     <StateContext.Provider value={state}>
//       <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
//     </StateContext.Provider>
//   )
// }
//
// function useCurrentDateState(): State {
//   const context = useContext(StateContext)
//   if (context === undefined) {
//     throw new Error('CurrentDate: StateContext must be used within a CountProvider')
//   }
//   return context
// }
//
// function useCurrentDateDispatch(): Dispatch {
//   const context = useContext(DispatchContext)
//   if (context === undefined) {
//     throw new Error('CurrentDate DispatchContext must be used within a CountProvider')
//   }
//   return context
// }
//
// function useCurrentDate(): [State, Dispatch] {
//   return [useCurrentDateState(), useCurrentDateDispatch()]
// }
//
// export { CurrentDateProvider, useCurrentDateState, useCurrentDateDispatch, useCurrentDate }
////////////////////////////////////////////////////////////////////////////////

export {}
