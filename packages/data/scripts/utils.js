export const pipe = (...fn) => initialVal => fn.reduce((acc, fn) => fn(acc), initialVal)
