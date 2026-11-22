// Samet Kaan Karakaçan, 2022502147
// Bonus 2: Depth. Experiments that go past the twelve forms. Run with `node js/depth.mjs`.

const film = { title: 'Kış Uykusu', year: 2014, director: 'Nuri Bilge Ceylan' }

// D1. An array pattern works on ANY iterable, not only arrays.
const [firstLetter, secondLetter, ...restLetters] = 'Eşkıya'
console.log('D1 string:', firstLetter, secondLetter, restLetters)

const [firstGenre, secondGenre] = new Set(['drama', 'drama', 'crime'])
console.log('D1 Set (duplicates removed first):', firstGenre, secondGenre)

const [[firstKey, firstValue]] = new Map([['Parasite', 2019], ['Eşkıya', 1996]])
console.log('D1 Map (each item is a pair):', firstKey, firstValue)

// What does the pattern really call? An iterable that logs every step.
function loggingReel(titles) {
  return {
    [Symbol.iterator]() {
      let i = 0
      console.log('D1   [Symbol.iterator]() called')
      return {
        next() {
          console.log('D1   next() called')
          return i < titles.length ? { value: titles[i++], done: false } : { value: undefined, done: true }
        },
        return() {
          console.log('D1   return() called: the pattern closed the iterator early')
          return { value: undefined, done: true }
        },
      }
    },
  }
}
const [reel1, reel2] = loggingReel(['Inception', 'Interstellar', 'Parasite'])
console.log('D1 custom iterable:', reel1, reel2)

// A generator stops where the pattern stops: the third "yield" is never reached.
function* watchOrder() {
  console.log('D1   generator: before Inception')
  yield 'Inception'
  console.log('D1   generator: before Interstellar')
  yield 'Interstellar'
  console.log('D1   generator: before Parasite (never printed)')
  yield 'Parasite'
}
const [g1, g2] = watchOrder()
console.log('D1 generator:', g1, g2)

// An object pattern works on anything that has properties, even a string.
const { length } = 'Parasite'
console.log('D1 object pattern on a string:', length)

// But an array pattern on a plain object fails: an object is not iterable.
try {
  const [x] = film
  console.log(x)
} catch (error) {
  console.log('D1 array pattern on an object:', error.message)
}

// D2. The order of evaluation of defaults.
function makeDefault(name) {
  console.log(`D2   computing the default for ${name}`)
  return `default ${name}`
}
const [given = makeDefault('given'), missing = makeDefault('missing')] = ['Babam ve Oğlum']
console.log('D2 lazy defaults:', given, '|', missing)

// A default can use a variable that came EARLIER in the same pattern...
const { title, slug = title.toLowerCase().replaceAll(' ', '-') } = film
console.log('D2 default uses an earlier variable:', slug)

// ...but not a LATER one: that one is not created yet.
try {
  new Function('const [early = late, late = 1] = []; return early')()
} catch (error) {
  console.log('D2 default uses a later variable:', error.constructor.name, '-', error.message)
}

// Defaults run from left to right, each only when needed.
let counter = 0
const next = () => ++counter
const [n1 = next(), n2 = next(), n3 = next()] = [undefined, 50]
console.log('D2 left to right:', n1, n2, n3, '| counter =', counter)

// D3. Destructuring in other places.
try {
  throw new RangeError('Seat H99 does not exist in hall 3')
} catch ({ name, message }) {
  console.log('D3 catch ({ name, message }):', name, '-', message)
}

// Assignment targets do not have to be variables: object properties work too.
const ticket = {}
;[ticket.film, ticket.seat] = ['Inception', 'H12']
;({ year: ticket.year } = film)
console.log('D3 targets are properties:', ticket)

// Swapping two items INSIDE an array, without a temporary variable.
const ranking = ['Eşkıya', 'Parasite', 'Inception']
;[ranking[0], ranking[2]] = [ranking[2], ranking[0]]
console.log('D3 swap inside an array:', ranking)

// for...of gives values (so a pattern can take them apart); for...in gives only keys (strings).
for (const [i, name] of ['Inception', 'Parasite'].entries()) console.log('D3 for...of:', i, name)
for (const key in film) console.log('D3 for...in:', key)

// A dynamic import returns an object, and it can be destructured like any object.
const { basename, extname } = await import('node:path')
console.log('D3 dynamic import:', basename('/films/eskiya.mp4'), extname('/films/eskiya.mp4'))

// A static `import { a as b }` is NOT destructuring: it uses `as`, and `:` is a syntax error there.
// I run it as a real module in a second Node process and print the first line of its error.
const { spawnSync } = await import('node:child_process')
const { stderr } = spawnSync(process.execPath, ['--input-type=module', '-e', 'import { basename: base } from "node:path"'], {
  encoding: 'utf8',
})
console.log('D3 import with a colon:', stderr.split('\n').find((line) => line.startsWith('SyntaxError')))

// D5. Readability: a deep pattern against a refactoring.
const festival = { edition: { year: 2014, winner: { film: { title: 'Kış Uykusu', director: { name: 'Nuri Bilge Ceylan' } } } } }
const {
  edition: {
    year: festivalYear,
    winner: {
      film: { title: winnerTitle, director: { name: winnerDirector } },
    },
  },
} = festival
console.log('D5 deep pattern:', festivalYear, winnerTitle, winnerDirector)

// The same values in two short steps: easier to read and easier to debug.
const { year: year2, winner } = festival.edition
const { title: title2, director } = winner.film
console.log('D5 refactored:', year2, title2, director.name)
