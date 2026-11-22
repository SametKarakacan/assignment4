// Samet Kaan Karakaçan, 2022502147
// The same six object forms as js/objects.mjs, now typed. Run with `npx tsx ts/objects.ts`.

type Film = {
  id: string
  title: string
  year: number
  director: string
  myRating: number
  genres: string[]
  cast: { lead: string; support: string }
  language?: string // optional: not every film in my list has it
  studio?: { name: string }
}

const film: Film = {
  id: 'f1',
  title: 'Inception',
  year: 2010,
  director: 'Christopher Nolan',
  myRating: 9,
  genres: ['sci-fi', 'thriller'],
  cast: { lead: 'Leonardo DiCaprio', support: 'Tom Hardy' },
}

// Form 5: the types come from Film. title is string, year is number. No annotation needed.
let { title, year } = film
console.log('form 5:', title, year)
title = 'Inception (2010)' // ok: still a string
console.log('form 5 (after change):', title)

// Form 6: rename. filmName has the type of title (string).
const { title: filmName, director: madeBy } = film
console.log('form 6:', filmName, 'by', madeBy)

// Form 7: default. language is optional (string | undefined); with a default it becomes string.
const { language = 'English', myRating = 0 } = film
console.log('form 7:', language, myRating)

// Form 8: rest. withoutId has the type Omit<Film, 'id'>.
const { id, ...withoutId } = film
console.log('form 8:', id, Object.keys(withoutId))

// Form 9: nested. lead is string. mainGenre is string | undefined (noUncheckedIndexedAccess).
const {
  cast: { lead },
  genres: [mainGenre],
} = film
console.log('form 9:', lead, mainGenre ?? '(no genre)')

// studio is optional, so the nested pattern needs a default object.
const { studio: { name: studioName } = { name: 'unknown studio' } } = film
console.log('form 9 (optional nested):', studioName)

// Form 10: computed key. With a literal key the type is exact (string).
const key = 'director'
const { [key]: value } = film
console.log('form 10:', value)

// With a key of type keyof Film the value is the union of all field types.
const fields: (keyof Film)[] = ['title', 'year', 'myRating']
for (const field of fields) {
  const { [field]: v } = film
  console.log('form 10 (loop):', field, '=', v)
}
