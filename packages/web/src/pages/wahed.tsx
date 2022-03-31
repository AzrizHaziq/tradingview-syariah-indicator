import { createSignal, JSX } from 'solid-js'
import { useTrackOnLoad, copy, trackEvent } from '@util'

const [isCopy, setIsCopy] = createSignal(false)
const images = [
  [
    1,
    <div>
      <p>
        Get started here by downloading android/iphone at official website.{' '}
        <a href='https://wahedinvest.com/get-started/'>https://wahedinvest.com/get-started/</a>
      </p>
    </div>,
  ],
  [
    2,
    <div>
      <p>Insert your email eg: your.email@domain.com</p>
    </div>,
  ],
  [
    3,
    <div>
      <p>Create your own password and make sure it is compliance with these requirements</p>
    </div>,
  ],
  [
    4,
    <div>
      <p>Fill in the country where do you live at</p>
    </div>,
  ],
  [
    5,
    <div>
      <p>No, since i'm Malaysian</p>
    </div>,
  ],
  [
    6,
    <div>
      <p>
        This step contain a series of questionnaire which help you identify which kind of portfolio suites you the most.
      </p>
    </div>,
  ],
  [],
  [
    <div class='sticky pb-12 bg-gray-900 top-[20px] md:top-[90px] col-span-2'>
      <p class='py-3 text-xl text-center !my-0'>Answer few questionnaire below</p>
      <div
        class='overflow-x-scroll border-2 border-gray-900 grid top-[130px] overscroll-x-contain gap-2'
        style='grid-template-columns: repeat(9, 320px); scroll-snap-type: x mandatory;'>
        {Array(9)
          .fill(7)
          .map((_, i) => _ + i)
          .map((i) => (
            <img
              class='!my-0'
              alt={`Wahed steps at ${i}`}
              src={`/wahed_steps/${i}.jpeg`}
              style='aspect-ratio: 9/16; scroll-snap-align: center'
            />
          ))}
      </div>
    </div>,
  ],
  [
    16,
    <div>
      <p>
        Based on the questionnaire my suggested portfolio is <br />
        <b class='text-green-500'>Moderately Aggresive</b>
      </p>
    </div>,
  ],
  [
    17,
    <div>
      <p>
        <b class='text-green-500'>8.26%</b> based on historical returns. You also can select different portfolio by
        clicking the right/left arrow above.
      </p>
    </div>,
  ],
  [
    18,
    <div>
      <p>
        What is your investment goals? Mine was <b>building wealth</b>
      </p>
    </div>,
  ],
  [
    19,
    <div>
      <p>Insert your username here</p>
    </div>,
  ],
  [
    20,
    <div>
      <p>Create your account now!!. It's almost done, just few more steps 🙂</p>
    </div>,
  ],
  [
    21,
    <div>
      <p>Insert your first name and last name</p>
    </div>,
  ],
  [
    22,
    <div>
      <p>Also your home address in the box</p>
    </div>,
  ],
  [
    23,
    <div>
      <p>Some question related to Malaysian. In your case, it may be different.</p>
    </div>,
  ],
  [
    24,
    <div>
      <p>Some related question about myself.</p>
    </div>,
  ],
  [
    25,
    <div>
      <p>
        Check the <b>I agree to the term and conditions</b> and click 'Next' button
      </p>
    </div>,
  ],
  [
    26,
    <div>
      <p>Review again all your details. Make sure no miss spelling.</p>
    </div>,
  ],
  [
    27,
    <div>
      <p>
        If you scroll down there is a link for <b>referral code</b>. Click it.
      </p>
    </div>,
  ],
  [
    28,
    <div class='py-2'>
      <p>Much appreciated if you use my referrer code here 🙂, Thank you.</p>
      <div
        class='flex mx-auto xl:ml-auto xl:mr-0 rounded-md shadow-sm'
        role='group'
        onClick={() =>
          copy('azrjas3', () => {
            setIsCopy(true)
            setTimeout(() => setIsCopy(false), 1000)
            trackEvent('referrer_code', {
              category: 'web::referrer_code',
              label: 'wahed',
            })
          })
        }>
        <span class='px-4 py-2 text-xl font-medium text-white text-gray-500 bg-gray-200 rounded-l-lg cursor-not-allowed'>
          azrjas3
        </span>
        <button
          type='button'
          class='px-4 py-2 text-xl font-medium text-green-700 bg-green-100 rounded-r-md hover:text-green-900 focus:z-10 focus:ring-2 focus:ring-green-700 focus:text-green-700'>
          <div class='flex items-center gap-1'>
            <svg
              stroke='currentColor'
              fill='currentColor'
              stroke-width='0'
              viewBox='0 0 448 512'
              height='1em'
              width='1em'
              xmlns='http://www.w3.org/2000/svg'>
              <path d='M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z' />
            </svg>
            <p class='!my-0'>{isCopy() ? 'Thank you !!' : 'Copy'}</p>
          </div>
        </button>
      </div>
    </div>,
  ],
  [
    29,
    <div>
      <p>
        Once you added the referer code, it will state <b>Referral code added.</b> Afterwards, you can add funds by
        deposit or wire transfer with any amount to Wahed.
      </p>
    </div>,
  ],
].map(([i, text]) =>
  typeof i === 'number' ? (
    <>
      <img
        alt={`Wahed steps at ${i}`}
        src={`/wahed_steps/${i}.jpeg`}
        style='aspect-ratio:9/16'
        class='sticky bg-gray-900 md:w-full !my-0 top-[20px] md:top-[90px] col-span-2 md:col-span-1'
      />
      <div class='sticky px-5 pb-12 bg-gray-900 top-[20px] md:top-[90px] col-span-2 md:col-span-1 md:pb-0'>{text}</div>
    </>
  ) : (
    <>{i}</>
  )
)

export default function Guideline(): JSX.Element {
  useTrackOnLoad()

  return (
    <div class='mx-auto bg-gray-900 prose'>
      <h2>Below are the steps how to get started with Wahed Invest</h2>
      <div className='max-w-md mx-auto md:max-w-full grid grid-cols-2 gap-y-0 md:gap-y-2'>{images}</div>
    </div>
  )
}

export const documentProps = {
  title: 'TSI: Guide to use Wahed referrer code',
  description: 'How to use Wahed referrer code "azrjas3"',
}
