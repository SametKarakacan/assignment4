// Samet Kaan Karakaçan, 2022502147
// What only TypeScript adds (topics T1 to T5). Run with `npx tsx ts/types.ts`.

type Film = { title: string; year: number; myRating: number; language?: string; poster: string | null }

const film: Film = { title: 'Parasite', year: 2019, myRating: 10, poster: null }

// T1: `{ title: string }` inside a pattern is a RENAME, not a type.
// This line makes a new variable called `string` and puts the title in it.
const { title: string } = film
console.log('T1 (rename, not a type):', string)

// The correct way: the type goes AFTER the whole pattern.
const { title }: { title: string } = film
console.log('T1 (typed):', title)

// T2: a tuple return type, and `as const`.
function titleAndYear(f: Film): [string, number] {
  return [f.title, f.year]
}
const [name, year] = titleAndYear(film) // name: string, year: number
console.log('T2 (tuple):', name, year + 1)

// Without `as const` the array type is (string | number)[]: every item can be either.
const loose = ['Eşkıya', 1996]
const [looseTitle] = loose // string | number | undefined
console.log('T2 (no as const):', looseTitle, typeof looseTitle)

// With `as const` it is the tuple readonly ['Eşkıya', 1996]: exact types by position.
const exact = ['Eşkıya', 1996] as const
const [exactTitle, exactYear] = exact // exactTitle: 'Eşkıya', exactYear: 1996
console.log('T2 (as const):', exactTitle, exactYear + 1)

// T3: noUncheckedIndexedAccess. From a string[] the first item is string | undefined.
const watchlist: string[] = []
const [firstFilm] = watchlist
// firstFilm.toUpperCase() would be a compile error here. Three ways to deal with it:
if (firstFilm !== undefined) console.log('T3 (checked):', firstFilm.toUpperCase())
console.log('T3 (??):', firstFilm ?? 'watchlist is empty')
const [firstOrDefault = 'nothing to watch'] = watchlist
console.log('T3 (default):', firstOrDefault.toUpperCase())

// T4: optional fields and defaults change the type of the variable.
const { language } = film // string | undefined (optional field)
const { language: lang = 'Korean' } = film // string (the default removes undefined)
const { poster = 'no-poster.png' } = film // string | null: a default does NOT remove null
console.log('T4:', language, '|', lang, '|', poster)

// T5: one compile error that destructuring causes. Film has no field called rating.
// The error message is in README.md (T5). The fix is to use the real name, myRating.
// @ts-expect-error Property 'rating' does not exist on type 'Film'.
const { rating } = film
console.log('T5 (what runs anyway):', rating)
const { myRating } = film
console.log('T5 (fixed):', myRating)
