import { createStore } from 'solid-js/store'
import { useContext, JSX, createContext } from 'solid-js'
import { PageContextBuiltIn } from 'vite-plugin-ssr/types'

const PageContext = createContext<[{ pageContext: PageContextBuiltIn }, unknown]>([{ pageContext: null }, {}])

export function PageContextProvider(props: { pageContext: PageContextBuiltIn; children: JSX.Element }) {
  const store = createStore({ pageContext: props.pageContext })
  return <PageContext.Provider value={store}>{props.children}</PageContext.Provider>
}

export function usePageContext() {
  return useContext(PageContext)
}
