import { Component } from 'solid-js'

export const Page: Component = () => {
  return (
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
        <li>yarn = 1.22.10</li>
        <li>
          git clone this repository <br />
          <code>$ git clone git@github.com:AzrizHaziq/tradingview-syariah-indicator.git</code>
        </li>
        <li>
          Then run <code>$ yarn</code> to install all dependencies.
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
          Use this to scrape latest data <code>$ yarn update-data</code>. Will take a few X minutes.
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
        <li>
          Type in 1st terminal: <code>$ yarn watch</code> and then in another terminal type either below commands:
          <ul>
            <li>
              Firefox: <code>$ yarn watch:ff</code>
            </li>
            <li>
              Chrome: <code>$ yarn watch:c</code>
            </li>
            <li>
              <code>$ yarn build</code> to generate production file. Generated file located in
              <b>/web-ext-artifacts/tradingview-shariah-indicator-XXX.zip</b>
            </li>
          </ul>
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
              Devs: <code>$ yarn dev</code>
            </li>
            <li>
              Build: <code>$ yarn build</code>
            </li>
          </ul>
        </li>
      </ol>
    </div>
  )
}
