import { Accessor, createSignal, onCleanup, onMount } from 'solid-js'

let xs = null,
  sm = null,
  md = null,
  lg = null,
  xl = null

type TailwindResponsiveSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export const createMediaQuery = (): Accessor<TailwindResponsiveSize> => {
  const [size, setSize] = createSignal<TailwindResponsiveSize>('xs')

  const matches = (sz: TailwindResponsiveSize) => _ => {
    setSize(sz)
  }

  onMount(() => {
    xs = window.matchMedia('(min-width: 0px) and (min-width: 640px)')
    sm = window.matchMedia('(min-width: 641px) and (min-width: 768px)')
    md = window.matchMedia('(min-width: 769px) and (min-width: 1024px)')
    lg = window.matchMedia('(min-width: 1025px) and (min-width: 1280px)')
    xl = window.matchMedia('(min-width: 1281px) and (min-width: 1536px)')

    xs.addEventListener('change', matches('xs'))
    sm.addEventListener('change', matches('sm'))
    md.addEventListener('change', matches('md'))
    lg.addEventListener('change', matches('lg'))
    xl.addEventListener('change', matches('xl'))
  })

  onCleanup(() => {
    // does not work properly at the moment
    xs.removeEventListener('change', matches('xs'))
    sm.removeEventListener('change', matches('sm'))
    md.removeEventListener('change', matches('md'))
    lg.removeEventListener('change', matches('lg'))
    xl.removeEventListener('change', matches('xl'))
  })

  return size
}
