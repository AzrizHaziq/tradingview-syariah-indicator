export function debounce(func, wait = 300) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

export const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((y, f) => f(y), x)

export const TArrayConcat = (a, c) => [...a, c]
export const TFilter = (predicate) => (step) => (a, c) => predicate(c) ? step(a, c) : a
