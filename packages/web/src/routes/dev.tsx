import { JSX } from 'solid-js'
import { useTrackOnLoad } from '~/util'
import { Head, Title } from 'solid-start'
import { MetaSeo } from '~/components'

const props = {
  pageTittle: 'Developer',
  description: 'Guide how to start TSI for developers',
  path: 'dev',
}

export default function Dev(): JSX.Element {
  useTrackOnLoad()

  return (
    <>
      <Head>
        <Title></Title>
        <MetaSeo {...props} />
      </Head>

      <div class='mx-auto prose'>
        <h2 id='developers'>
          Developers
          <a class='!ml-2' href='#developers'>
            #
          </a>
        </h2>

        <p>Requirements</p>
        <ul>
          <li>
            node = look at <b>.nvmrc</b>
          </li>
          <li>pnpm = 6.24.1</li>
          <li>
            git clone this repository <br />
            <code>$ git clone git@github.com:AzrizHaziq/tradingview-syariah-indicator.git</code>
          </li>
          <li>
            Then run <code>$ pnpm</code> to install all dependencies.
          </li>
          <li>
            Create <b>.env</b>(for development) and <b>.env.production</b>(for production) file in every{' '}
            <a href='#development-mode-website'>Web</a>, and
            <a href='#development-mode-extension'>extension</a>, and please follow <b>.env.example</b>
          </li>
        </ul>

        <h2 id='how-to-use'>
          How to use
          <a class='!ml-2' href='#how-to-use'>
            #
          </a>
        </h2>
        <h3 id='development-mode-data'>
          Data
          <a class='!ml-2' href='#development-mode-data'>
            #
          </a>
        </h3>
        <ol>
          <li>
            Make sure your terminal inside <b>/packages/extension</b> directory
          </li>
          <li>
            Use this to scrape latest data <code>$ npm run update-data</code>. Will take a few X minutes.
          </li>
          <li>
            All new data will be written to
            <ul>
              <li>
                <b>/packages/data/stock-list.json</b>
              </li>
              <li>
                <b>/packages/data/stock-list.human.json</b>
              </li>
            </ul>
          </li>
        </ol>
        <h3 id='development-mode-extension'>
          Extension
          <a class='!ml-2' href='#development-mode-extension'>
            #
          </a>
        </h3>
        <ol>
          <li>
            Make sure your terminal inside <b>/packages/extension</b> directory
          </li>
          <li>Firefox</li>
          <ul class='ml-5'>
            <li>
              dev: <code>$ npm run start:firefox</code>
            </li>
            <li>
              prod:
              <code>$ npm run build:firefox</code>
            </li>
          </ul>
          <li>Chrome</li>
          <ul class='ml-5'>
            <li>
              dev: <code>$ npm run start:chrome</code>
            </li>
            <li>
              prod:
              <code>$ npm run build:chrome</code>
            </li>
          </ul>
          <li>
            Generated file production file is located in<b>/web-ext-artifacts/tradingview-shariah-indicator-XXX.zip</b>
          </li>
        </ol>

        <h3 id='development-mode-website'>
          Website
          <a class='!ml-2' href='#development-mode-website'>
            #
          </a>
        </h3>
        <ol>
          <li>
            Make sure your terminal inside <b>/packages/web</b> directory
          </li>
          <li>
            Type in terminal
            <ul>
              <li>
                Devs: <code>$ npm run dev</code>
              </li>
              <li>
                Build: <code>$ npm run build</code>
              </li>
            </ul>
          </li>
        </ol>
      </div>
    </>
  )
}

// export const documentProps = {
//   title: 'TSI: Developer Guideline',
//   description: 'For Devs who interested to contribute this project please read few guideline here',
// }
