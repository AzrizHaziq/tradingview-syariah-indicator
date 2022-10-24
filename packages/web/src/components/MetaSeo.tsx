import { JSX, mergeProps } from 'solid-js'
import { Meta, Title } from '@solidjs/meta'
import rootPkg from '../../../../package.json'

type Props = {
  title: string
  pageTittle: string
  description: string
  path: string
  imgPath: string
  imgAlt: string
  baseLink: string
  children?: JSX.Element
}

const defaultProps: Props = {
  title: 'Tradingview Shariah Indicator(TSI)',
  pageTittle: '',
  description: rootPkg.description,
  baseLink: 'https://tsi.azrizhaziq.com',
  imgPath: '/tradingview-shariah-indicator.jpg',
  imgAlt: 'Tradingview Shariah Indicator(TSI)',
  path: '/',
}

export const MetaSeo = (props: Partial<Props>) => {
  const merged = mergeProps(defaultProps, props)

  return (
    <>
      <Meta charset='utf-8' />
      <Meta name='viewport' content='width=device-width, initial-scale=1' />
      <Meta name='theme-color' content='#7ee2a8' />
      <link rel='icon' href='/favicon.svg' />
      <Title>{merged.title + (merged.path ? ' - ' + merged.path : '')}</Title>
      <Meta name='description' content={merged.description} />

      <Meta property='og:title' content={merged.title} />
      <Meta property='og:type' content='website' />
      <Meta property='og:url' content={merged.baseLink + (merged.path ? '/' + merged.path : '')} />
      <Meta property='og:image' content={merged.baseLink + merged.imgPath} />
      <Meta property='og:image:alt' content={merged.imgAlt} />
      <Meta property='og:site_name' content={merged.title + (merged.pageTittle ? ' - ' + merged.pageTittle : '')} />
      <Meta property='og:description' content={merged.description} />

      <Meta property='og:locale' content='en_us' />

      <Meta name='twitter:title' content={merged.title} />
      <Meta property='twitter:url' content={merged.baseLink + (merged.path ? '/' + merged.path : '')} />
      <Meta name='twitter:card' content='@azrizhaziq' />
      <Meta name='twitter:site' content='summary_large_image' />
      <Meta name='twitter:description' content={merged.description} />
      <Meta name='twitter:image' content={merged.baseLink + merged.imgPath} />
      {merged.children}
    </>
  )
}
