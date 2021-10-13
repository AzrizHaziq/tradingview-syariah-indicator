import { Component } from 'solid-js'

export const Page: Component = () => {
  return (
    <div class='prose'>
      <h2 id='developers'>Developers</h2>

      <p>Requirements</p>
      <ul>
        <li>
          node = look at <code>.nvmrc</code>
          <br />
        </li>
        <li>
          yarn = 1.22.10
          <br />
        </li>
        <li>git = 2.23.0</li>
      </ul>
      <ol>
        <li>
          Need to have node and npm (please look at package.json &gt; engine)
          <br />
        </li>
        <li>
          Type in terminal <code>$ yarn</code>
          <br />
        </li>
        <li>
          Type in 1st terminal: <code>$ yarn watch</code>
          <br />
          and then in another terminal type either below commands:
          <br />
          Firefox: <code>$ yarn watch:ff</code>
          <br />
          Chrome: <code>$ npm watch:c</code>
        </li>
      </ol>
      <h2 id='generate-production-ready-extension'>Generate Production ready extension</h2>
      <ol>
        <li>
          Git clone: AzrizHaziq/tradingview-syariah-indicator.git
          <br />
        </li>
        <li>
          npm install
          <br />
        </li>
        <li>
          create <code>.env.production</code> file in root, and please follow
          <code>.env.example</code>
          <br />
        </li>
        <li>
          Type in terminal <code>$ yarn build</code>
          <br />
        </li>
        <li>Generate a file located in /web-ext-artifacts/tradingview-shariah-indicator-XXX.zip</li>
      </ol>
      <h2 id='update-stock-list-data-will-take-a-few-x-minutes'>Update Stock list data (will take a few X minutes)</h2>
      <ol>
        <li>
          Type in terminal <code>$ npm run update-data</code>
        </li>
      </ol>
    </div>
  )
}
