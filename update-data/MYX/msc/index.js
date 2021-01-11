import fs from 'fs'
import path from 'path'

export function generateMidSmallCap() {
  const mscInput = fs.readFileSync(path.join('update-data/MYX/msc', 'msc.txt'), 'utf8')
  let [mscAt, mscLink, ...mscList] = mscInput.split(/\n/g)

  mscList = mscList.filter(Boolean).reduce((acc, msc) => {
    const [code, stockName] = msc.split('\t')
    return {
      ...acc,
      [code]: {
        code,
        stockName,
        msc: 1,
      },
    }
  }, {})

  return {
    mscAt: new Date(mscAt),
    mscLink,
    mscList,
  }
}
