import { Show } from 'solid-js'

export type InputStateTypes = Parameters<typeof InputState>[0]['state']
export const InputState = (prop: { state: 'loading' | 'error' | 'success' | '' }) => {
  return (
    <>
      <Show when={prop.state === ''}>{null}</Show>

      <Show when={prop.state === 'loading'}>
        {/* loading */}
        <svg
          stroke='currentColor'
          fill='currentColor'
          stroke-width='0'
          version='1.1'
          viewBox='0 0 16 16'
          height='1em'
          width='1em'
          xmlns='http://www.w3.org/2000/svg'
          class='transition ease-in-out animate-spin'>
          {/*<title>{loading() ? popup_loading_icon : popup_refresh_icon}</title>*/}
          <path
            fill='#2fcc71'
            d='M8 0c-4.355 0-7.898 3.481-7.998 7.812 0.092-3.779 2.966-6.812 6.498-6.812 3.59 0 6.5 3.134 6.5 7 0 0.828 0.672 1.5 1.5 1.5s1.5-0.672 1.5-1.5c0-4.418-3.582-8-8-8zM8 16c4.355 0 7.898-3.481 7.998-7.812-0.092 3.779-2.966 6.812-6.498 6.812-3.59 0-6.5-3.134-6.5-7 0-0.828-0.672-1.5-1.5-1.5s-1.5 0.672-1.5 1.5c0 4.418 3.582 8 8 8z'
          />
        </svg>
      </Show>

      <Show when={prop.state === 'error'}>
        <svg class='text-red-500' height='20' width='20' viewBox='0 0 24 24'>
          <path
            fill='currentColor'
            d='M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z'
          />
        </svg>
      </Show>

      <Show when={prop.state === 'success'}>
        <svg height='20' width='20' viewBox='0 0 24 24' class='text-green-500'>
          <path fill='currentColor' d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z' />
        </svg>
      </Show>
    </>
  )
}
