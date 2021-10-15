import './PageLayout.scss'
import { Component } from 'solid-js'
import logo from '../../../assets/shariah-icon.svg'

export const PageLayout: Component = props => {
  return <Layout>{props.children}</Layout>
}

const Layout: Component = props => {
  return (
    <>
      <header class='text-gray-600 body-font sticky top-0 bg-gray-700 z-10'>
        <div class='container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center'>
          <a href='/' class='flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0'>
            <img src={logo} height={32} width={32} alt='logo' />
          </a>
          <nav class='md:mr-auto md:ml-4 md:py-1 md:pl-4 gap-5 flex flex-wrap items-center text-base justify-center'>
            <a href='/list' class='text-white hover:text-gray-300'>
              Shariah list
            </a>
            <a href='/dev' class='text-white hover:text-gray-300'>
              Dev
            </a>
            <a href='/guideline' class='text-white hover:text-gray-300'>
              Guideline
            </a>
          </nav>
        </div>
      </header>
      <main class='text-gray-600 body-font'>
        <section class='container px-5 py-24 mx-auto'>{props.children}</section>
      </main>
    </>
  )
}
