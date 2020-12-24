import fs from 'fs'
import path from 'path'

export function generateMidSmallCap() {
  const mscInput = fs.readFileSync(path.join('update-data/MYX/msc', 'msc.txt'), 'utf8')
  const [mscAt, mscLink, ...mscList] = mscInput.split(/\n/g)

  return {
    mscAt: new Date(mscAt),
    mscLink,
    mscList: mscList.filter(Boolean).reduce(
      (acc, stockCode) => ({
        ...acc,
        [stockCode]: {
          msc: 1,
        },
      }),
      {}
    ),
  }
}
