// Generate the Vietnamese catalogue from the public English catalogue.
// Machine translation is a starting point; keep manual corrections in catalogue/i18n/vi.json.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { EXDB } from '../../frontend/src/lib/exercises-data.js'
import steps from '../../frontend/src/instr/en.js'
import descriptions from '../../frontend/src/exercise-desc/en.js'

const cacheFile = path.join(os.tmpdir(), 'opengym-vietnamese-catalogue-cache.json')
const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {}
const all = [...new Set(EXDB.flatMap(ex => [ex.n, descriptions[ex.id], ...(steps[ex.id] || [])]).filter(Boolean))]
const needed = all.filter(text => !cache[text])
const batches = []
let current = [], length = 0
for (const text of needed) {
  if (length + text.length > 3500 && current.length) { batches.push(current); current = []; length = 0 }
  current.push(text); length += text.length + 18
}
if (current.length) batches.push(current)

async function request(text) {
  const url = new URL('https://translate.googleapis.com/translate_a/single')
  for (const [key, value] of Object.entries({client:'gtx',sl:'en',tl:'vi',dt:'t',q:text})) url.searchParams.set(key, value)
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const response = await fetch(url, {signal:AbortSignal.timeout(25000)})
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      return data[0].map(part => part[0] || '').join('')
    } catch (error) {
      if (attempt === 5) throw error
      await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)))
    }
  }
}
let cursor = 0, completed = 0
async function worker() {
  while (cursor < batches.length) {
    const batch = batches[cursor++]
    const result = await request(batch.map((text, index)=>`OGV${index}OGV\n${text}`).join('\n'))
    const matches = [...result.matchAll(/OGV\s*(\d+)\s*OGV\s*\n?([\s\S]*?)(?=OGV\s*\d+\s*OGV|$)/g)]
    const byIndex = new Map(matches.map(match=>[Number(match[1]),match[2].trim()]))
    for (let i=0;i<batch.length;i++) {
      const translated = byIndex.get(i) || (await request(batch[i])).trim()
      if (!translated || /OGV\d+OGV/.test(translated)) throw new Error('Malformed translation batch')
      cache[batch[i]] = translated
    }
    completed++
    if (completed % 10 === 0 || completed === batches.length) {
      fs.writeFileSync(cacheFile, JSON.stringify(cache))
      console.log(`Catalogue Vietnamese: ${completed}/${batches.length} batches, ${Object.keys(cache).length}/${all.length} texts`)
    }
  }
}
await Promise.all(Array.from({length:4}, worker))
fs.writeFileSync(cacheFile, JSON.stringify(cache))
const names = {
  '1 2 stick drill':'bài tập 1–2 với gậy',
  '123 back drill':'bài tập lưng 1–2–3',
  '1 to 2 jump box':'bật nhảy một chân lên bục, tiếp đất hai chân',
  '2 to 1 jump box':'bật nhảy hai chân lên bục, tiếp đất một chân',
  'push-up':'chống đẩy', 'pull-up':'hít xà đơn', 'chin-up':'hít xà đơn tay ngửa',
  'squat':'squat', 'deadlift':'kéo tạ', 'barbell bench press':'đẩy ngực với tạ đòn',
  'dumbbell bench press':'đẩy ngực với tạ đơn', 'plank':'plank',
}
const gymTerms = [
  [/\bdrills?\b/i, [['máy khoan','bài tập'],['mũi khoan','bài tập'],['khoan','bài tập']]],
  [/\bbands?\b/i, [['ban nhạc','dây đàn hồi']]],
  [/kettlebell/i, [['chuông ấm','tạ ấm']]],
  [/dumbbell/i, [['quả tạ','tạ đơn']]],
  [/smith/i, [['máy rèn','máy Smith'],['thợ rèn','máy Smith']]],
  [/landmine/i, [['mìn','đế xoay tạ đòn']]],
  [/\blats\b/i, [['vĩ','cơ xô']]],
  [/\bdelts\b/i, [['vùng đồng bằng','cơ vai']]],
  [/\bquads\b/i, [['hình tứ giác','cơ đùi trước']]],
  [/\btraps\b/i, [['bẫy','cơ thang']]],
  [/\bcalf\b|\bcalves\b/i, [['bê','bắp chân']]],
  [/abductors?/i, [['kẻ bắt cóc','cơ dạng hông']]],
  [/adductors?/i, [['chất dẫn điện','cơ khép đùi']]],
  [/\breps\b|\brepetitions\b/i, [['đại diện','số lần']]],
  [/\bsets\b/i, [['bộ','hiệp']]],
]
function polish(source, translated, isName = false) {
  let text = translated
  for (const [pattern, pairs] of gymTerms) if (pattern.test(source)) {
    for (const [bad, good] of pairs) text = text.replace(new RegExp('(?<![\\p{L}])'+bad+'(?![\\p{L}])','giu'),good)
  }
  if (isName && /\bback\b/i.test(source)) text=text.replace(/trở lại/gi,'lưng')
  if (isName && /\brows?\b/i.test(source)) text=text.replace(/hàng/gi,'kéo')
  if (isName && /\bflies\b|\bfly\b/i.test(source)) text=text.replace(/bay/gi,'banh tay')
  if (isName && /\bpress\b/i.test(source)) text=text.replace(/báo chí/gi,'đẩy')
  if (isName && /\bcurl\b/i.test(source)) text=text.replace(/cuộn tròn|cuộn/gi,'gập')
  return text
}
const rows = Object.fromEntries(EXDB.map(ex => [ex.id, {
  name: polish(ex.n,names[ex.n] || cache[ex.n],true).toLocaleLowerCase('vi'),
  description: descriptions[ex.id] ? polish(descriptions[ex.id],cache[descriptions[ex.id]]) : '',
  instructions: (steps[ex.id] || []).map(text=>polish(text,cache[text])),
}]))
fs.writeFileSync(new URL('../../catalogue/i18n/vi.json', import.meta.url), JSON.stringify(rows,null,2) + '\n')
console.log(`Wrote ${Object.keys(rows).length} Vietnamese catalogue entries`)
