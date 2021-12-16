import './app.scss'
import 'virtual:windi.css'
import 'virtual:windi-devtools'
import { routes } from './routes'
import { type JSX } from 'solid-js'
import { Footer, Header } from '@components'
import { useRoutes } from 'solid-app-router'

const App = (): JSX.Element => {
  const Route = useRoutes(routes)

  return (
    <>
      <Header />
      <main class='flex-grow text-gray-600 body-font'>
        <section class='container px-5 py-10 mx-auto'>
          <Route />
        </section>
      </main>
      <Footer />
    </>
  )
}
export default App
