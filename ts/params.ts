// Samet Kaan Karakaçan, 2022502147
// Forms 11 and 12 in TypeScript. Run with `npx tsx ts/params.ts`.

type FilmOptions = { title?: string; year?: number; myRating?: number | string }

// Form 11: the type goes after the WHOLE pattern, and `= {}` after the type.
function describeFilm({ title = 'Untitled', year, myRating = 'not rated' }: FilmOptions = {}): string {
  return `${title} (${year}) - ${myRating}`
}
console.log('form 11:', describeFilm({ title: 'Parasite', year: 2019, myRating: 10 }))
console.log('form 11 (no rating):', describeFilm({ title: 'Spirited Away', year: 2001 }))
console.log('form 11 (no argument):', describeFilm())

// Form 11b: an array parameter. The tuple type gives name: string and when: number.
const pairs: [string, number][] = [
  ['Inception', 2010],
  ['Eşkıya', 1996],
]
const lines = pairs.map(([name, when]) => `${name} came out in ${when}`)
console.log('form 11b:', lines)

// Form 12: Object.entries returns [string, number][] here, so name is string and score is number.
const myRatings: Record<string, number> = { Inception: 9, Parasite: 10, Eşkıya: 8 }
for (const [name, score] of Object.entries(myRatings)) {
  console.log('form 12 (object):', name, score)
}

// A Map<string, string> gives [string, string] pairs.
const directors = new Map<string, string>([
  ['Kış Uykusu', 'Nuri Bilge Ceylan'],
  ['Spirited Away', 'Hayao Miyazaki'],
])
for (const [name, director] of directors) {
  console.log('form 12 (map):', name, '->', director)
}
