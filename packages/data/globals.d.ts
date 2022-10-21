declare var Error: ErrorConstructor
interface ErrorConstructor {
  new (message?: string, { cause }?: { cause: Error })
}

// overwrite  ErrorConstructor so that we can use Error cause
// throw Error(`Failed scrape CHINA`, { cause: e })

declare module 'pdfreader'