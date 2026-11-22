// Samet Kaan Karakaçan, 2022502147
// Destructuring in parameters and loops (forms 11 and 12). Run with `node js/params.mjs`.

// Form 11: an options object in the parameter list, with defaults.
function describeFilm({ title = 'Untitled', year, myRating = 'not rated' } = {}) {
  return `${title} (${year}) - ${myRating}`
}
console.log('form 11:', describeFilm({ title: 'Parasite', year: 2019, myRating: 10 }))
console.log('form 11 (no rating):', describeFilm({ title: 'Spirited Away', year: 2001 }))
console.log('form 11 (empty object):', describeFilm({}))
console.log('form 11 (no argument):', describeFilm())

// Without `= {}` at the end, calling with no argument crashes.
function describeStrict({ title }) {
  return title
}
try {
  describeStrict()
} catch (error) {
  console.log('form 11 (no = {}):', error.message)
}

// Form 11b: the same idea with an array parameter, ([x, y]) => ...
const pairs = [
  ['Inception', 2010],
  ['Eşkıya', 1996],
]
const lines = pairs.map(([name, when]) => `${name} came out in ${when}`)
console.log('form 11b:', lines)

// Form 12: loops over entries, Object.entries and a Map
const myRatings = { Inception: 9, Parasite: 10, Eşkıya: 8 }
for (const [name, score] of Object.entries(myRatings)) {
  console.log('form 12 (object):', name, score)
}

const directors = new Map([
  ['Kış Uykusu', 'Nuri Bilge Ceylan'],
  ['Spirited Away', 'Hayao Miyazaki'],
])
for (const [name, director] of directors) {
  console.log('form 12 (map):', name, '->', director)
}

// Object.entries gives an array of [key, value] arrays. That is why an array pattern fits.
console.log('form 12 (entries):', Object.entries(myRatings))
