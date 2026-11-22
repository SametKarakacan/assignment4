// Samet Kaan Karakaçan, 2022502147
// Things that surprise people. Run with `node js/pitfalls.mjs`.

const film = { title: 'Interstellar', year: 2014, cast: { lead: 'Matthew McConaughey' } }

// Pitfall 1: destructuring undefined or null throws a TypeError.
try {
  const notLoaded = undefined
  const { title } = notLoaded
  console.log(title)
} catch (error) {
  console.log('pitfall 1:', error.constructor.name, '-', error.message)
}
try {
  const { title } = null
  console.log(title)
} catch (error) {
  console.log('pitfall 1 (null):', error.message)
}

// Pitfall 2: a default only applies to undefined, not to null
const fromServer = { title: 'Parasite', poster: null }
const { poster = 'no-poster.png' } = fromServer
console.log('pitfall 2:', poster)

// Pitfall 3: assigning without const/let needs parentheses, ({ a } = obj)
// `{ title } = film` at the start of a line is read as a block, so it is a syntax error.
// I put it in new Function() so this file can still run and show the error.
try {
  new Function('film', 'let title; { title } = film; return title')
} catch (error) {
  console.log('pitfall 3 (no parentheses):', error.constructor.name, '-', error.message)
}
let title
;({ title } = film)
console.log('pitfall 3 (with parentheses):', title)

// Pitfall 4: it copies references, not deep copies (nested objects are shared)
const { cast, ...copy } = film
cast.lead = 'Anne Hathaway'
console.log('pitfall 4:', film.cast.lead)
copy.year = 2000
console.log('pitfall 4 (top level is a copy):', film.year)

// Pitfall 5: in objects the order does not matter, in arrays it does
const { year, title: name } = film
console.log('pitfall 5 (object):', name, year)
const [second, first] = ['Inception', 'Interstellar']
console.log('pitfall 5 (array):', first, second)

// Pitfall 6 (extra): a line that starts with [ joins the line before it.
// Without the semicolon, `list` becomes something else and the swap never happens.
const result = new Function(`
  let a = 'Eşkıya', b = 'Inception'
  const list = ['x']
  [a, b] = [b, a]
  return { a, b, list }
`)()
console.log('pitfall 6:', result)
