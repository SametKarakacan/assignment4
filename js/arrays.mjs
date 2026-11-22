// Samet Kaan Karakaçan, 2022502147
// Array destructuring (forms 1 to 4) with my film list. Run with `node js/arrays.mjs`.

const films = [
  { title: 'Inception', year: 2010, minutes: 148 },
  { title: 'Interstellar', year: 2014, minutes: 169 },
  { title: 'The Godfather', year: 1972, minutes: 175 },
  { title: 'Kış Uykusu', year: 2014, minutes: 196 },
]

// Form 1: take values out of an array by position.
// The function returns two values in an array: [shortest, longest].
function runtimeRange(list) {
  const minutes = list.map((f) => f.minutes)
  return [Math.min(...minutes), Math.max(...minutes)]
}
const [shortest, longest] = runtimeRange(films)
console.log('form 1:', shortest, longest)

// The same thing without destructuring, one line per variable:
const range = runtimeRange(films)
const shortest2 = range[0]
const longest2 = range[1]
console.log('form 1 (plain):', shortest2, longest2)

// Asking for more positions than there are gives undefined, not an error.
const [a, b, c] = runtimeRange(films)
console.log('form 1 (third item):', a, b, c)

// Form 2: skip an item and collect the rest, [, second, ...others]
const watchlist = ['Inception', 'Interstellar', 'Parasite', 'Spirited Away', 'Eşkıya']
const [, secondFilm, ...laterFilms] = watchlist
console.log('form 2:', secondFilm, laterFilms)

// The rest is always a new array, even when nothing is left.
const [onlyOne, ...nothingLeft] = ['Babam ve Oğlum']
console.log('form 2 (empty rest):', onlyOne, nothingLeft)

// Form 3: swap two variables without a temporary, [a, b] = [b, a]
let tonight = 'Kış Uykusu'
let tomorrow = 'Eşkıya'
// The line starts with [ so it needs a semicolon in front (see pitfall 6).
;[tonight, tomorrow] = [tomorrow, tonight]
console.log('form 3:', tonight, tomorrow)

// Form 4: default values, const [a = 1] = []
const [first = 'no film yet', second = 'no film yet'] = ['Parasite']
console.log('form 4:', first, '|', second)

// A default is used for undefined only. null is a real value, so it stays null.
const [x = 'default', y = 'default'] = [undefined, null]
console.log('form 4 (undefined vs null):', x, y)
