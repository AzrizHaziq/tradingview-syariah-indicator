import { IMGS } from '~/util'
import { JSX } from 'solid-js'
import { NavLink } from '@solidjs/router'

export const Header = (): JSX.Element => {
  return (
    <header class='sticky top-0 z-10 text-gray-600 bg-gray-700 body-font'>
      <div class='container flex flex-col items-center p-5 mx-auto md:flex-row'>
        <a href='/' class='flex items-center mb-4 font-medium text-gray-900 md:mb-0 title-font'>
          <img src={IMGS.logo} height={32} width={32} alt='logo' />
        </a>
        <nav class='flex flex-wrap gap-5 justify-center items-center w-full text-base md:py-1 md:mr-auto md:ml-4'>
          <NavLink class='text-white hover:text-green-500' activeClass='text-green-300' href='/list'>
            Shariah list
          </NavLink>
          <NavLink class='text-white hover:text-green-500' activeClass='text-green-300' href='/guideline'>
            Guideline
          </NavLink>
          <NavLink class='text-white hover:text-green-500' activeClass='text-green-300' href='/dev'>
            Dev
          </NavLink>

          <NavLink class='ml-0 text-white hover:text-green-500 md:ml-auto' activeClass='text-green-300' href='/wahed'>
            Wahed
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
