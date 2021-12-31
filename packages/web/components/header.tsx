import { IMGS } from '@util'
import { JSX } from 'solid-js'
import { NavLink } from 'solid-app-router'

export const Header = (): JSX.Element => {
  return (
    <header class='sticky top-0 z-10 text-gray-600 bg-gray-700 body-font'>
      <div class='container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row'>
        <a href='/' class='flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0'>
          <img src={IMGS.logo} height={32} width={32} alt='logo' />
        </a>
        <nav class='flex flex-wrap items-center justify-center text-base md:mr-auto md:ml-4 md:py-1 md:pl-4 gap-5'>
          <NavLink class='text-white hover:text-green-500' activeClass='text-green-300' href='/list'>
            Shariah list
          </NavLink>
          <NavLink class='text-white hover:text-green-500' activeClass='text-green-300' href='/guideline'>
            Guideline
          </NavLink>
          <NavLink class='ml-auto text-white hover:text-green-500' activeClass='text-green-300' href='/dev'>
            Dev
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
