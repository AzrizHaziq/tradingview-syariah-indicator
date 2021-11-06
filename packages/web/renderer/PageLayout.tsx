import './PageLayout.scss'
import { IMGS, copy, trackEvent } from '@util'
import { usePageContext } from './usePageContext'
import { Component, createSignal, JSX } from 'solid-js'
import { PageContextBuiltIn } from 'vite-plugin-ssr/types'

export const PageLayout: Component = (props: { pageContext: PageContextBuiltIn; children: JSX.Element }) => {
  const [state] = usePageContext()
  const [isCopy, setIsCopy] = createSignal(false)
  const urlPathname = state.pageContext.urlPathname

  return (
    <>
      <header class='sticky top-0 z-10 text-gray-600 bg-gray-700 body-font'>
        <div class='container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row'>
          <a href='/' class='flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0'>
            <img src={IMGS.logo} height={32} width={32} alt='logo' />
          </a>
          <nav class='flex flex-wrap items-center justify-center text-base md:mr-auto md:ml-4 md:py-1 md:pl-4 gap-5'>
            <a
              href='/list'
              class='text-white hover:text-green-500'
              classList={{ 'text-green-300': urlPathname === '/list' }}>
              Shariah list
            </a>
            <a
              href='/guideline'
              class='text-white hover:text-green-500'
              classList={{ 'text-green-300': urlPathname === '/guideline' }}>
              Guideline
            </a>
            <a
              href='/dev'
              class='text-white hover:text-green-500'
              classList={{ 'text-green-300': urlPathname === '/dev' }}>
              Dev
            </a>
          </nav>
        </div>
      </header>
      <main class='text-gray-600 body-font'>
        <section class='container px-5 py-10 mx-auto'>{props.children}</section>
      </main>
      <footer class='sticky bottom'>
        <div className='flex flex-col px-5 py-10 bg-white md:flex-row md:items-center md:justify-between gap-2'>
          <div class='flex flex-col'>
            <img
              alt='wahed azrizhaziq referer code'
              src={IMGS.wahed}
              width={120}
              height={80}
              class='aspect-w-16 aspect-h-9'
            />
            <span class='items-center block'>
              Support this project by using
              <span class='inline mx-1 md:hidden'>this</span>
              <span class='hidden mx-1 md:inline'>that</span>
              referer code. I'm truly appreciate it Thank you!
              <svg
                viewBox='0 0 24 24'
                height='1.5em'
                width='1.5em'
                class='inline text-green-700 fill-current rotate-90 md:rotate-0 transform'
                xmlns='http://www.w3.org/2000/svg'>
                <path d='m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z' />
              </svg>
            </span>
          </div>
          <div
            class='relative flex items-center gap-2'
            onClick={() =>
              copy('azrjas3', () => {
                setIsCopy(true)
                setTimeout(() => setIsCopy(false), 1000)
                trackEvent('referrer_code', { category: 'web::referrer_code', label: 'footer' })
              })
            }>
            <code class='text-4xl border-2 border-green-500 rounded'>azrjas3</code>
            <span class='px-2 py-1 text-green-800 bg-green-100 rounded cursor-pointer'>
              {isCopy() ? 'Thank you !!' : 'Copy'}
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
