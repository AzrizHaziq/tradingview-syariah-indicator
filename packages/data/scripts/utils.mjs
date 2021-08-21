export const pipe = (...fn) => initialVal => fn.reduce((acc, fn) => fn(acc), initialVal)

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min) //The maximum is exclusive and the minimum is inclusive
}

export function delay(delay = getRandomInt(1, 2)) {
  return new Promise(resolve => {
    setTimeout(() => resolve(delay), delay * 1000)
  })
}
