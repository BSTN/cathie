import about from '@/data/about.md?raw'
import contact from '@/data/contact.md?raw'

const list = import.meta.glob('@/data/exhibitions/*.yml')
const exhibitions:any = []
for(let i in list) {
  const xh = list[i]
  const x = await xh()
  exhibitions.push(x.default)
}

function getstamp(date: string) {
  const d = new Date(date) 
  return d.getTime()
}

exhibitions.sort((a, b) => getstamp(b.date) - getstamp(a.date))

export const useData = () => {
  return { exhibitions, about, contact }
}
