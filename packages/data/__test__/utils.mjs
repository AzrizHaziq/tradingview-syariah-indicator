import test from 'ava'
import { pipe, delay } from '../scripts/utils.mjs'

test('pipe', t => {
  t.plan(1)
  const result = pipe(data => `Hello ${data}`)('Worlds')
  t.is(result, 'Hello Worlds')
})

test('delay', t => {
  t.plan(1)

  return delay(1).then(n => {
    t.is(1, 1)
  })
})
