// Samet Kaan Karakaçan, 2022502147
// The same four array forms as js/arrays.mjs, now typed. Run with `npx tsx ts/arrays.ts`.

type Film = { title: string; year: number; minutes: number }

const films: Film[] = [
  { title: 'Inception', year: 2010, minutes: 148 },
  { title: 'Interstellar', year: 2014, minutes: 169 },
  { title: 'The Godfather', year: 1972, minutes: 175 },
  { title: 'Kış Uykusu', year: 2014, minutes: 196 },
]

// Form 1: the return type is a tuple, [number, number], so both variables are number.
function runtimeRange(list: Film[]): [number, number] {
  const minutes = list.map((f) => f.minutes)
  return [Math.min(...minutes), Math.max(...minutes)]
}
const [shortest, longest] = runtimeRange(films)
console.log('form 1:', shortest, longest)

// Form 2: skip and rest. watchlist is string[], so with noUncheckedIndexedAccess
// secondFilm is string | undefined. The rest is always string[].
const watchlist: string[] = ['Inception', 'Interstellar', 'Parasite', 'Spirited Away', 'Eşkıya']
const [, secondFilm, ...laterFilms] = watchlist
console.log('form 2:', secondFilm ?? '(none)', laterFilms)

// Form 3: swap. Both variables must have types that fit each other's values.
let tonight: string = 'Kış Uykusu'
let tomorrow: string = 'Eşkıya'
;[tonight, tomorrow] = [tomorrow, tonight]
console.log('form 3:', tonight, tomorrow)

// Form 4: defaults. A default removes undefined from the type: first is string, not string | undefined.
const picked: string[] = ['Parasite']
const [first = 'no film yet', second = 'no film yet'] = picked
console.log('form 4:', first, '|', second)
