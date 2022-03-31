import { NavLink } from 'solid-app-router'
import { createSignal, JSX } from 'solid-js'
import { copy, IMGS, trackEvent } from '@util'

import pkg from '../package.json'
import rootPkg from '../../../package.json'

export const Footer = (): JSX.Element => {
  const [isCopy, setIsCopy] = createSignal(false)

  return (
    <footer>
      <div class='flex flex-col px-5 py-10 bg-white xl:flex-row xl:items-center md:justify-between gap-2'>
        <div class='flex flex-col items-center xl:items-stretch'>
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
              class='inline text-green-700 fill-current rotate-90 xl:rotate-0 transform'
              xmlns='http://www.w3.org/2000/svg'>
              <path d='m11.293 17.293 1.414 1.414L19.414 12l-6.707-6.707-1.414 1.414L15.586 11H6v2h9.586z' />
            </svg>
          </span>
        </div>
        <div
          class='inline-flex mx-auto xl:ml-auto xl:mr-0 rounded-md shadow-sm'
          role='group'
          onClick={() =>
            copy('azrjas3', () => {
              setIsCopy(true)
              setTimeout(() => setIsCopy(false), 1000)
              trackEvent('referrer_code', {
                category: 'web::referrer_code',
                label: 'footer',
              })
            })
          }>
          <span class='px-4 py-2 text-xl font-medium text-white text-gray-500 bg-gray-200 rounded-l-lg cursor-not-allowed'>
            azrjas3
          </span>
          <button
            type='button'
            class='px-4 py-2 text-xl font-medium text-green-700 bg-green-100 rounded-r-md hover:text-green-900 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-green-700'>
            <div class='flex items-center gap-1'>
              <svg
                stroke='currentColor'
                fill='currentColor'
                stroke-width='0'
                viewBox='0 0 448 512'
                height='1em'
                width='1em'
                xmlns='http://www.w3.org/2000/svg'>
                <path d='M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z' />
              </svg>
              <p>{isCopy() ? 'Thank you !!' : 'Copy'}</p>
            </div>
          </button>
        </div>
      </div>

      <div class='py-8 bg-white xl:py-14 dark:bg-gray-800'>
        <div class='w-full px-4 mx-auto max-w-8xl'>
          <div class='grid gap-12 grid-cols-2 md:grid-cols-5 xl:gap-24'>
            <div class='col-span-2'>
              <a href='https://flowbite.com' class='flex mb-5'>
                <img src='/favicon.svg' class='h-10 mr-4' alt={rootPkg.name_display} />
                <span class='self-center text-xl font-semibold whitespace-nowrap dark:text-white'>
                  {rootPkg.name_display}
                </span>
              </a>
              <p class='max-w-lg text-gray-600 dark:text-gray-400'>{rootPkg.description}</p>
            </div>
            <div>
              <h3 class='mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white'>Resources</h3>
              <ul>
                <li class='mb-4'>
                  <a
                    href='https://funds.wahedinvest.com/'
                    target='_blank'
                    rel='noreferrer nofollow'
                    class='font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline'>
                    Wahed <br />
                    <b>(NYSE, NASDAQ)</b>
                  </a>
                </li>
                <li class='mb-4'>
                  <a
                    href='https://www.bursamalaysia.com/market_information/equities_prices?legend%5B%5D=%5BS%5D&sort_by=short_name&sort_dir=asc&page=1'
                    target='_blank'
                    rel='noreferrer nofollow'
                    class='font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline'>
                    Bursa Malaysia <br />
                    <b>(MYX)</b>
                  </a>
                </li>
                <li class='mb-4'>
                  <a
                    href='https://www.valuepartners-group.com.my/en/shariah-china/'
                    target='_blank'
                    rel='noreferrer nofollow'
                    class='font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline'>
                    VP-DJ Shariah China A-shares 100 ETF <br />
                    <b>(SSE, SZSE)</b>
                  </a>
                </li>
                <li class='mb-4'>
                  <a
                    href='https://github.com/AzrizHaziq/tradingview-syariah-indicator/releases'
                    target='_blank'
                    rel='noreferrer nofollow'
                    class='font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline'>
                    Release <b>({pkg.version})</b>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 class='mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white'>Follow us</h3>
              <ul>
                <li class='mb-4'>
                  <a
                    href='https://github.com/AzrizHaziq/tradingview-syariah-indicator'
                    target='_blank'
                    rel='noreferrer nofollow'
                    class='font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline'>
                    Github
                  </a>
                </li>
                <li class='mb-4'>
                  <a
                    href='https://twitter.com/tradingviewsha1'
                    target='_blank'
                    rel='noreferrer nofollow'
                    class='font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline'>
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 class='mb-6 text-sm font-semibold text-gray-400 uppercase dark:text-white'>Legal</h3>
              <ul>
                <li class='mb-4'>
                  <NavLink
                    class='font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline'
                    activeClass='!text-green-300'
                    href='/privacy-policy'>
                    Privacy Policy
                  </NavLink>
                </li>
                <li class='mb-4'>
                  <NavLink
                    class='font-normal text-gray-600 dark:text-gray-400 dark:hover:text-white hover:underline'
                    activeClass='!text-green-300'
                    href='guideline'>
                    Guidelines
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
          <hr class='my-8 border-gray-200 dark:border-gray-700 lg:my-12' />
          <span class='block text-center text-gray-600 dark:text-gray-400 font-'>
            © 2019-<span id='currentYear'>2021</span>
            {` `}
            <a href='https://tsi.azrizhaziq.com'>Tradingview Shariah Indicator</a>. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}
