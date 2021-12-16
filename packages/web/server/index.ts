import express from 'express'
import { createPageRenderer } from 'vite-plugin-ssr'

const root = `${__dirname}/..`
const isVercel = process.env.VERCEL === '1'
const isProduction = process.env.NODE_ENV === 'production'

startServer()

async function startServer() {
  const app = express()
  app.disable('x-powered-by')

  let viteDevServer
  if (isProduction) {
    const staticPath = `${root}/${isVercel ? '.output/static' : 'dist/client'}`
    console.log(`>>> Using ${isVercel ? 'Vercel' : 'Vite'}`)
    app.use(express.static(staticPath))
  } else {
    // eslint-disable-next-line
    const vite = require('vite')
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: true },
    })
    app.use(viteDevServer.middlewares)
  }

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root })
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl
    const pageContextInit = { url }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext

    if (!httpResponse) return next()

    const { statusCode, body } = httpResponse
    res.status(statusCode).send(body)
  })

  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`Server running at http://localhost:${port}`)
}
