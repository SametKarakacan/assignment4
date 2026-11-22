// Samet Kaan Karakaçan, 2022502147
// Object destructuring (forms 5 to 10) with one of my favourite films. Run with `node js/objects.mjs`.

const film = {
  id: 'f1',
  title: 'Inception',
  year: 2010,
  director: 'Christopher Nolan',
  myRating: 9,
  genres: ['sci-fi', 'thriller'],
  cast: { lead: 'Leonardo DiCaprio', support: 'Tom Hardy' },
}

// Form 5: take properties out of an object by name.
let { title, year } = film
console.log('form 5:', title, year)

// A name that is not in the object gives undefined.
let { budget } = film
console.log('form 5 (missing field):', budget)

// let (not const) means I can change the variable later. The object does not change.
title = 'Inception (2010)'
console.log('form 5 (after change):', title, '| object still has:', film.title)

// Form 6: rename while you take it, { title: heading }
const { title: filmName, director: madeBy } = film
console.log('form 6:', filmName, 'by', madeBy)
// `director` was renamed, so there is no variable called director here.
console.log('form 6 (old name):', typeof director)

// Form 7: default values, { language = 'English' }
const { language = 'English', myRating = 0 } = film
console.log('form 7:', language, myRating) // language is missing, myRating is not

const unrated = { title: 'Eşkıya', myRating: undefined }
const unknown = { title: 'Babam ve Oğlum', myRating: null }
const { myRating: r1 = 'not rated' } = unrated
const { myRating: r2 = 'not rated' } = unknown
console.log('form 7 (undefined vs null):', r1, '|', r2)

// Form 8: rest, { id, ...others }
const { id, ...withoutId } = film
console.log('form 8:', id, Object.keys(withoutId))
console.log('form 8 (original unchanged):', 'id' in film)

// Form 9: nested patterns, and arrays inside objects
const {
  cast: { lead },
  genres: [mainGenre],
} = film
console.log('form 9:', lead, mainGenre)
// Only lead and mainGenre are variables. cast and genres are only the path.
console.log('form 9 (path names):', typeof cast, typeof genres)

// A default for the nested object stops the crash when the field is missing.
const { studio: { name: studioName } = {} } = film
console.log('form 9 (missing nested, with default):', studioName)

// Form 10: computed key, { [key]: value }
const key = 'director'
const { [key]: value } = film
console.log('form 10:', value)

for (const field of ['title', 'year', 'myRating']) {
  const { [field]: v } = film
  console.log('form 10 (loop):', field, '=', v)
}
