# Destructuring Field Guide

Name: Samet Kaan Karakaçan  
Student number: 2022502147

MIS 233 Web Based Application Programming, Assignment 4.

Bonuses claimed: **Bonus 4: Git repository** (see the end of this file).

All my examples use my own film list: Inception, Interstellar, The Godfather, Kış Uykusu,
Parasite, Spirited Away, Eşkıya and Babam ve Oğlum. Every output below is copied from
`output.txt`, which is the real output of `npm run all` on my machine.

## Run

```
npm install
npm run all      # runs the JS and TS examples
npm run check    # type-checks in strict mode
npm run all > output.txt
```

## The idea in one sentence

Destructuring is a short way to write several assignments at once: the left side is a
**pattern** that has the same shape as the value, and every name in the pattern becomes a
variable. The best way I found to read a pattern is to write it out as plain assignments,
one line per variable, so I do that in every entry.

**Rest and spread use the same three dots for opposite jobs.** In a pattern, on the left
(`const [first, ...others] = list`), the dots **collect** what is left into a new array or
object. In an expression, on the right (`[...list]`, `{ ...film }`, `<section {...rest}>`),
the dots **expand** an array or object into separate items or fields.

## Field guide

### Form 1: values by position, `const [x, y] = f()`

**Syntax:** `const [shortest, longest] = runtimeRange(films)`

**Example** (from `js/arrays.mjs`):

```js
function runtimeRange(list) {
  const minutes = list.map((f) => f.minutes)
  return [Math.min(...minutes), Math.max(...minutes)]
}
const [shortest, longest] = runtimeRange(films)
console.log('form 1:', shortest, longest)

const [a, b, c] = runtimeRange(films)
console.log('form 1 (third item):', a, b, c)
```

**Output:**

```
form 1: 148 196
form 1 (third item): 148 196 undefined
```

**Without destructuring:** `const range = runtimeRange(films); const shortest = range[0]; const longest = range[1]`

**Use it when:** a function gives back a few values in a fixed order, like `useState` or
`useReducer` in React (`const [state, dispatch] = useReducer(...)`).

**Watch out:** the names do not matter, only the position. If I write
`const [longest, shortest]` the names are swapped and nothing warns me. Asking for a position
that does not exist gives `undefined`, not an error.

### Form 2: skip and collect the rest, `const [, second, ...others] = list`

**Syntax:** `const [, secondFilm, ...laterFilms] = watchlist`

**Example** (from `js/arrays.mjs`):

```js
const watchlist = ['Inception', 'Interstellar', 'Parasite', 'Spirited Away', 'Eşkıya']
const [, secondFilm, ...laterFilms] = watchlist
console.log('form 2:', secondFilm, laterFilms)

const [onlyOne, ...nothingLeft] = ['Babam ve Oğlum']
console.log('form 2 (empty rest):', onlyOne, nothingLeft)
```

**Output:**

```
form 2: Interstellar [ 'Parasite', 'Spirited Away', 'Eşkıya' ]
form 2 (empty rest): Babam ve Oğlum []
```

**Without destructuring:** `const secondFilm = watchlist[1]; const laterFilms = watchlist.slice(2)`

**Use it when:** I need the first items separately and the rest as a list.

**Watch out:** the empty place before the comma is easy to miss when reading. The rest must be
the last item in the pattern, and it is always a new array, even when it is empty (`[]`, not
`undefined`).

### Form 3: swap two variables, `[a, b] = [b, a]`

**Syntax:** `;[tonight, tomorrow] = [tomorrow, tonight]`

**Example** (from `js/arrays.mjs`):

```js
let tonight = 'Kış Uykusu'
let tomorrow = 'Eşkıya'
;[tonight, tomorrow] = [tomorrow, tonight]
console.log('form 3:', tonight, tomorrow)
```

**Output:** `form 3: Eşkıya Kış Uykusu`

**Without destructuring:** `const temp = tonight; tonight = tomorrow; tomorrow = temp`

**Use it when:** two variables must change places.

**Watch out:** the right side `[tomorrow, tonight]` is a new array made first, with the old
values, and only then are they assigned. The variables must be `let`. In code without
semicolons the line needs a `;` in front, because a line that starts with `[` joins the line
before it (pitfall 6).

### Form 4: defaults in arrays, `const [a = 1, b = 2] = []`

**Syntax:** `const [first = 'no film yet', second = 'no film yet'] = ['Parasite']`

**Example** (from `js/arrays.mjs`):

```js
const [first = 'no film yet', second = 'no film yet'] = ['Parasite']
console.log('form 4:', first, '|', second)

const [x = 'default', y = 'default'] = [undefined, null]
console.log('form 4 (undefined vs null):', x, y)
```

**Output:**

```
form 4: Parasite | no film yet
form 4 (undefined vs null): default null
```

**Without destructuring:** `const second = list[1] === undefined ? 'no film yet' : list[1]`

**Use it when:** the array can be shorter than I expect.

**Watch out:** the default is used only when the item is `undefined` (missing or written as
`undefined`). `null` is a real value, so `y` stayed `null`.

### Form 5: properties by name, `let { a, b } = t`

**Syntax:** `let { title, year } = film`

**Example** (from `js/objects.mjs`):

```js
let { title, year } = film
console.log('form 5:', title, year)

let { budget } = film
console.log('form 5 (missing field):', budget)

title = 'Inception (2010)'
console.log('form 5 (after change):', title, '| object still has:', film.title)
```

**Output:**

```
form 5: Inception 2010
form 5 (missing field): undefined
form 5 (after change): Inception (2010) | object still has: Inception
```

**Without destructuring:** `let title = film.title; let year = film.year`

**Use it when:** I need a few fields of an object many times and `film.` everywhere is noise.

**Watch out:** the variable name must be the same as the property name. A wrong name gives
`undefined` silently in JavaScript. Changing the variable does not change the object: the
value was copied out.

### Form 6: rename while you take it, `const { a: alpha } = t`

**Syntax:** `const { title: filmName, director: madeBy } = film`

**Example** (from `js/objects.mjs`):

```js
const { title: filmName, director: madeBy } = film
console.log('form 6:', filmName, 'by', madeBy)
console.log('form 6 (old name):', typeof director)
```

**Output:**

```
form 6: Inception by Christopher Nolan
form 6 (old name): undefined
```

**Without destructuring:** `const filmName = film.title; const madeBy = film.director`

**Use it when:** the property name is already used by another variable, or a different name is
clearer in this place.

**Watch out:** the left of the colon is the property, the right is the new variable. After this,
`director` is not a variable (`typeof director` is `"undefined"`). In TypeScript this colon looks
like a type, but it is not (T1).

### Form 7: defaults in objects, `const { a = 1 } = t`

**Syntax:** `const { language = 'English', myRating = 0 } = film`

**Example** (from `js/objects.mjs`):

```js
const { language = 'English', myRating = 0 } = film
console.log('form 7:', language, myRating)

const unrated = { title: 'Eşkıya', myRating: undefined }
const unknown = { title: 'Babam ve Oğlum', myRating: null }
const { myRating: r1 = 'not rated' } = unrated
const { myRating: r2 = 'not rated' } = unknown
console.log('form 7 (undefined vs null):', r1, '|', r2)
```

**Output:**

```
form 7: English 9
form 7 (undefined vs null): not rated | null
```

**Without destructuring:** `const language = film.language === undefined ? 'English' : film.language`

**Use it when:** a field is optional and there is a sensible value to use when it is missing.

**Watch out:** like form 4, only `undefined` triggers the default. Data from a server often has
`null`, and then the default is NOT used (pitfall 2). Rename and default can be combined:
`{ myRating: r1 = 'not rated' }`.

### Form 8: rest in an object, `const { a, ...others } = t`

**Syntax:** `const { id, ...withoutId } = film`

**Example** (from `js/objects.mjs`):

```js
const { id, ...withoutId } = film
console.log('form 8:', id, Object.keys(withoutId))
console.log('form 8 (original unchanged):', 'id' in film)
```

**Output:**

```
form 8: f1 [ 'title', 'year', 'director', 'myRating', 'genres', 'cast' ]
form 8 (original unchanged): true
```

**Without destructuring:** `const id = film.id; const withoutId = Object.assign({}, film); delete withoutId.id`

**Use it when:** I want an object without some fields, for example props without `children`
before I spread them onto a DOM element (P4).

**Watch out:** `withoutId` is a new object, but it is a shallow copy: nested objects like `cast`
are shared with the original (pitfall 4).

### Form 9: nested patterns, `const { p: { x }, list: [first] } = t`

**Syntax:** `const { cast: { lead }, genres: [mainGenre] } = film`

**Example** (from `js/objects.mjs`):

```js
const {
  cast: { lead },
  genres: [mainGenre],
} = film
console.log('form 9:', lead, mainGenre)
console.log('form 9 (path names):', typeof cast, typeof genres)

const { studio: { name: studioName } = {} } = film
console.log('form 9 (missing nested, with default):', studioName)
```

**Output:**

```
form 9: Leonardo DiCaprio sci-fi
form 9 (path names): undefined undefined
form 9 (missing nested, with default): undefined
```

**Without destructuring:** `const lead = film.cast.lead; const mainGenre = film.genres[0]`

**Use it when:** I need one or two values deep inside an object and the shape is known.

**Watch out:** `cast` and `genres` here are only the path, not variables. If a middle level is
missing, it crashes like pitfall 1. `film` has no `studio`, so without `= {}` the last line
would throw. Deep patterns get hard to read quickly.

### Form 10: computed key, `const { [key]: value } = t`

**Syntax:** `const { [key]: value } = film`

**Example** (from `js/objects.mjs`):

```js
const key = 'director'
const { [key]: value } = film
console.log('form 10:', value)

for (const field of ['title', 'year', 'myRating']) {
  const { [field]: v } = film
  console.log('form 10 (loop):', field, '=', v)
}
```

**Output:**

```
form 10: Christopher Nolan
form 10 (loop): title = Inception
form 10 (loop): year = 2010
form 10 (loop): myRating = 9
```

**Without destructuring:** `const value = film[key]`

**Use it when:** the property name is in a variable and only known when the code runs.

**Watch out:** a computed key always needs a rename (`[key]: value`), because there is no fixed
name to use as the variable. Here the plain `film[key]` is shorter, so this form is rarely
worth it.

### Form 11: patterns in parameters, `function f({ a = 1, b } = {})`

**Syntax:** `function describeFilm({ title = 'Untitled', year, myRating = 'not rated' } = {})`

**Example** (from `js/params.mjs`):

```js
function describeFilm({ title = 'Untitled', year, myRating = 'not rated' } = {}) {
  return `${title} (${year}) - ${myRating}`
}
console.log('form 11:', describeFilm({ title: 'Parasite', year: 2019, myRating: 10 }))
console.log('form 11 (no rating):', describeFilm({ title: 'Spirited Away', year: 2001 }))
console.log('form 11 (no argument):', describeFilm())

function describeStrict({ title }) { return title }
try { describeStrict() } catch (error) { console.log('form 11 (no = {}):', error.message) }

const lines = pairs.map(([name, when]) => `${name} came out in ${when}`)
console.log('form 11b:', lines)
```

**Output:**

```
form 11: Parasite (2019) - 10
form 11 (no rating): Spirited Away (2001) - not rated
form 11 (no argument): Untitled (undefined) - not rated
form 11 (no = {}): Cannot destructure property 'title' of 'undefined' as it is undefined.
form 11b: [ 'Inception came out in 2010', 'Eşkıya came out in 1996' ]
```

**Without destructuring:** `function describeFilm(options) { const title = options.title === undefined ? 'Untitled' : options.title; ... }`

**Use it when:** a function takes several options. The caller can give them in any order and
leave some out. Every React component with `({ title, children })` uses this form.

**Watch out:** there are two different defaults: `= 'Untitled'` inside is for one missing field,
`= {}` at the end is for a missing argument. Without `= {}` a call with no argument crashes.

### Form 12: patterns in loops, `for (const [k, v] of Object.entries(o))`

**Syntax:** `for (const [name, score] of Object.entries(myRatings))`

**Example** (from `js/params.mjs`):

```js
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
console.log('form 12 (entries):', Object.entries(myRatings))
```

**Output:**

```
form 12 (object): Inception 9
form 12 (object): Parasite 10
form 12 (object): Eşkıya 8
form 12 (map): Kış Uykusu -> Nuri Bilge Ceylan
form 12 (map): Spirited Away -> Hayao Miyazaki
form 12 (entries): [ [ 'Inception', 9 ], [ 'Parasite', 10 ], [ 'Eşkıya', 8 ] ]
```

**Without destructuring:** `for (const entry of Object.entries(myRatings)) { const name = entry[0]; const score = entry[1] }`

**Use it when:** I loop over key and value pairs of an object or a Map.

**Watch out:** the last output shows why an **array** pattern is used: `Object.entries` returns
an array of `[key, value]` arrays. A Map gives the same pairs directly. With `for...in` there is
no pair, only the key.

## Pitfalls

All from `js/pitfalls.mjs`.

### Pitfall 1: destructuring `undefined` or `null` throws

```js
const notLoaded = undefined
const { title } = notLoaded
```

```
pitfall 1: TypeError - Cannot destructure property 'title' of 'notLoaded' as it is undefined.
pitfall 1 (null): Cannot destructure property 'title' of 'null' as it is null.
```

**Why:** to read `title`, JavaScript must look inside the value, and `undefined` and `null` have
nothing inside. It is the same as writing `notLoaded.title`. Fix: a default (`= {}`) or a check.

### Pitfall 2: a default is not used for `null`

```js
const fromServer = { title: 'Parasite', poster: null }
const { poster = 'no-poster.png' } = fromServer
```

```
pitfall 2: null
```

**Why:** the default runs only when the value is exactly `undefined`. `null` means "there is a
value and it is empty", so it is kept. Fix: `const shown = poster ?? 'no-poster.png'`.

### Pitfall 3: assignment to existing variables needs parentheses

```js
let title
{ title } = film      // SyntaxError
;({ title } = film)   // works
```

```
pitfall 3 (no parentheses): SyntaxError - Unexpected token '='
pitfall 3 (with parentheses): Interstellar
```

**Why:** a line that starts with `{` is read as a block of code, not as an object pattern, so the
`=` after the block is unexpected. The parentheses make it an expression.

### Pitfall 4: it is not a deep copy

```js
const { cast, ...copy } = film
cast.lead = 'Anne Hathaway'
copy.year = 2000
```

```
pitfall 4: Anne Hathaway
pitfall 4 (top level is a copy): 2014
```

**Why:** destructuring copies the values of the top-level fields. For a nested object the value
is a reference, so `cast` and `film.cast` are the same object. Changing `copy.year` does not
touch `film`, but changing `cast.lead` does.

### Pitfall 5: order matters in arrays, not in objects

```js
const { year, title: name } = film
const [second, first] = ['Inception', 'Interstellar']
```

```
pitfall 5 (object): Interstellar 2014
pitfall 5 (array): Interstellar Inception
```

**Why:** an object pattern finds values by name, so the order of the names does not matter. An
array pattern finds values by position, so `second` got the first item just because it was
written first.

### Pitfall 6 (extra): a line that starts with `[` joins the line before

```js
let a = 'Eşkıya', b = 'Inception'
const list = ['x']
[a, b] = [b, a]
```

```
pitfall 6: { a: 'Eşkıya', b: 'Inception', list: [ 'Inception', 'Eşkıya' ] }
```

**Why:** without a semicolon JavaScript reads the last two lines as one:
`const list = ['x'][a, b] = [b, a]`. So nothing was swapped and `list` got the swapped array.
That is why form 3 starts with `;`.

## Props and children

A React component receives **one object**, its props. Every attribute I write in JSX becomes a
field of that object, and the content between the opening and closing tag becomes one more
field, called `children`. Everything in this section is from `js/props.jsx` and `ts/props.tsx`,
rendered with `renderToStaticMarkup`.

### P1: props is one object

```jsx
function FilmCardA(props) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function FilmCardB({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>
}
function ShowProps(props) {
  console.log('P1 props object:', props)
  return null
}
```

```
P1 A: <section><h2>Inception</h2>Dreams inside dreams</section>
P1 B: <section><h2>Inception</h2>Dreams inside dreams</section>
P1 props object: { title: 'Parasite', year: 2019, children: 'A family story' }
```

Both give the same HTML. `FilmCardB` is **form 11** (a pattern in the parameter list) that uses
**form 5** (properties by name): React calls `FilmCardB(props)` and the pattern takes `title`
and `children` out of that one object. The printed object shows there is nothing special:
`children` is just a field next to `title` and `year`.

### P2: children is only a prop

```jsx
<FilmCardB title="Eşkıya">Baran comes back</FilmCardB>
<FilmCardB title="Eşkıya" children="Baran comes back" />
<FilmCardB title="Eşkıya" children="from the attribute">from the tags</FilmCardB>
```

```
P2 between tags: <section><h2>Eşkıya</h2>Baran comes back</section>
P2 children attr: <section><h2>Eşkıya</h2>Baran comes back</section>
P2 both: <section><h2>Eşkıya</h2>from the tags</section>
```

The first two are the same, because JSX puts the content between the tags into the `children`
field. When both are written, the content between the tags wins. In TypeScript, writing both is
a compile error: `TS2710: 'children' are specified twice. The attribute named 'children' will be
overwritten.` (see P7).

### P3: what children can be

```
P3 string: <div class="shelf">Spirited Away</div>
P3 number: <div class="shelf">2001</div>
P3 zero: <div class="shelf">0</div>
P3 one element: <div class="shelf"><em>Spirited Away</em></div>
P3 several elements: <div class="shelf"><em>Inception</em><em>Interstellar</em></div>
P3 array: <div class="shelf">Kış Uykusu / Eşkıya</div>
P3 undefined: <div class="shelf"></div>
P3 null: <div class="shelf"></div>
P3 false: <div class="shelf"></div>
P3 true: <div class="shelf"></div>
P3 nothing at all: <div class="shelf"></div>
Functions are not valid as a React child. ...
P3 function: <div class="shelf"></div>
P3 function called: <ul><li>Watch Interstellar, part 1</li><li>Watch Interstellar, part 2</li></ul>
P3 object: Objects are not valid as a React child (found: object with keys {title})
```

| children | What appears |
|---|---|
| string, number | the text. Also `0`: zero is shown, it is not treated as "nothing" |
| one element, several elements, an array | all of them, in order |
| `undefined`, `null`, `false`, `true`, no children | nothing, the `div` is empty |
| a function | nothing, and React prints a warning. The warning goes to the terminal (stderr), so it is not in `output.txt`. A function works only when the component **calls** it (`children(n)` in `Repeat`) |
| a plain object | an error: React cannot render it |

The `0` is important: `{count && <p>...</p>}` with `count = 0` shows a `0` on the screen.

### P4: separating children from the other props

```jsx
function Panel({ title, children, ...rest }) {
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
function SpreadFirst(props) { return <section {...props} className="fixed" /> }
function SpreadLast(props)  { return <section className="fixed" {...props} /> }
```

```
P4 rest: <section id="watch" class="panel"><h3>Watchlist</h3>3 films</section>
P4 spread first: <section class="fixed"></section>
P4 spread last: <section class="from-caller"></section>
```

`title` and `children` are taken out by name (form 5) and everything else goes into `rest`
(form 8). `{...rest}` on the `section` is **spread**: it puts `id` and `className` back as
attributes. `title` is not spread because it is not in `rest`, and that is good, because
`title` on a `section` would become an HTML tooltip.

Order: attributes are applied from left to right and **the last one wins**. With the spread
first, my `className="fixed"` overwrites the caller's. With the spread last, the caller can
overwrite my default.

### P5: props or children?

```jsx
<PageWithSlots header={<h1>My 2014 films</h1>} footer={<small>2 films</small>}>
  <p>Interstellar, Kış Uykusu</p>
</PageWithSlots>

<PageWithChildren>
  <header><h1>My 2014 films</h1></header>
  <main><p>Interstellar, Kış Uykusu</p></main>
  <footer><small>2 films</small></footer>
</PageWithChildren>
```

```
P5 slots: <article><header><h1>My 2014 films</h1></header><main><p>Interstellar, Kış Uykusu</p></main><footer><small>2 films</small></footer></article>
P5 children: <article><header><h1>My 2014 films</h1></header><main><p>Interstellar, Kış Uykusu</p></main><footer><small>2 films</small></footer></article>
```

The HTML is the same. The difference is who decides the structure. With **header and footer
props**, the component decides where each part goes and the caller only fills the places; this
is better when the layout must always be the same (every page has its header on top). With
**children only**, the caller writes everything and the component is just a frame; this is
better when the content is free and different every time. Elements can be passed as normal
props too (`header={<h1>...</h1>}`), so children is not the only way to pass JSX.

### P6: defaults

```jsx
function Rating({ score = 'not rated' }) {
  return <p>Rating: [{score}]</p>
}
```

```
P6 no prop: <p>Rating: [not rated]</p>
P6 undefined: <p>Rating: [not rated]</p>
P6 null: <p>Rating: []</p>
P6 zero: <p>Rating: [0]</p>
```

This is form 7 inside form 11. A prop that is not written and a prop written as `undefined` are
the same thing for the pattern, so both get the default. `null` is a real value, so the default
is not used, and React renders `null` as nothing: the brackets are empty on the screen. `0` is a
real value too and is shown.

### P7: types

From `ts/props.tsx`:

```tsx
type FilmCardProps = { title: string; children?: ReactNode }      // 1) by hand
type PosterProps = PropsWithChildren<{ year: number }>             // 2) adds children?: ReactNode
function PlayButton({ children, ...rest }: ComponentProps<'button'>) {  // 3) all <button> props
  return <button type="button" {...rest}>▶ {children}</button>
}
```

```
P7 PropsWithChildren: <figure>Parasite<figcaption>2019</figcaption></figure>
P7 PropsWithChildren, no children: <figure><figcaption>2019</figcaption></figure>
P7 ComponentProps: <button type="button" disabled="" title="Play the film">▶ Inception</button>
```

- `children?: ReactNode` written by hand: children is optional and can be anything React can
  render (string, number, element, array, `null`, `undefined`, boolean). A function or a plain
  object is not a `ReactNode`. For a function child, the type must say it (`Repeat` uses
  `children: (n: number) => ReactNode`).
- `PropsWithChildren<{ year: number }>` is the same as `{ year: number; children?: ReactNode }`.
  It is shorter, but children is always optional.
- `ComponentProps<'button'>` is the type of every prop a real `<button>` accepts. With rest and
  spread, `PlayButton` accepts `disabled`, `title`, `onClick` without me listing them.

What the compiler rejects. I put these five lines in a temporary file `ts/rejected.tsx`, ran
`npm run check`, copied the messages and deleted the file again (so `npm run check` passes now).
The same lines are listed as comments at the end of `ts/props.tsx`.

| Code | Error on my machine |
|---|---|
| `<Shelf>{{ title: 'Parasite' }}</Shelf>` | `TS2353: Object literal may only specify known properties, and 'title' does not exist in type 'ReactElement<...> \| Iterable<ReactNode> \| ReactPortal \| Promise<...>'.` |
| `<Poster>Parasite</Poster>` (no year) | `TS2741: Property 'year' is missing in type '{ children: string; }' but required in type '{ year: number; }'.` |
| `<PlayButton href="/watch">Inception</PlayButton>` | `TS2322: ... Property 'href' does not exist on type 'IntrinsicAttributes & ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement>'. Did you mean 'ref'?` |
| `<FilmCardB title={2010} />` | `TS2322: Type 'number' is not assignable to type 'string'.` |
| `<FilmCardB title="Parasite" children="a">b</FilmCardB>` | `TS2710: 'children' are specified twice. The attribute named 'children' will be overwritten.` |

What the messages show:

- An object is not a `ReactNode`. The long type in the first message is the list of things
  `ReactNode` can be; a plain `{ title }` object is none of them. JavaScript only finds this out
  when it renders (P3 object), TypeScript finds it before the code runs.
- `PropsWithChildren` makes only `children` optional; my own `year` is still required. The
  message also shows that the content between the tags arrived as `{ children: string }`, which
  is P2 again: children is just a prop.
- `ComponentProps<'button'>` knows exactly which attributes a real `<button>` has, so `href`
  (a link attribute) is rejected.
- In JavaScript, writing `children` twice was allowed and the tags won (P2 both). TypeScript
  turns the same thing into an error.

### TypeScript topics T1 to T5

From `ts/types.ts`.

**T1: a colon in a pattern is a rename, not a type.**

```ts
const { title: string } = film            // a NEW VARIABLE called `string`
const { title }: { title: string } = film // the type goes after the whole pattern
```

```
T1 (rename, not a type): Parasite
T1 (typed): Parasite
```

The first line is valid code, which is the dangerous part: it makes a variable named `string`.

**T2: tuples and `as const`.**

```ts
function titleAndYear(f: Film): [string, number] { return [f.title, f.year] }
const [name, year] = titleAndYear(film)      // string, number
const loose = ['Eşkıya', 1996]               // (string | number)[]
const [looseTitle] = loose                   // string | number | undefined
const exact = ['Eşkıya', 1996] as const      // readonly ['Eşkıya', 1996]
const [exactTitle, exactYear] = exact        // 'Eşkıya', 1996
```

```
T2 (tuple): Parasite 2020
T2 (no as const): Eşkıya string
T2 (as const): Eşkıya 1997
```

Without the tuple type or `as const`, TypeScript sees an array where every item can be a string
or a number, so `looseTitle + 1` would not be allowed. `as const` keeps the length and the
exact type of every position.

**T3: `noUncheckedIndexedAccess`.** With this option, `const [firstFilm] = watchlist` (a
`string[]`) has the type `string | undefined`, because the array can be empty. Three ways to deal
with it: check it (`if (firstFilm !== undefined)`), use `??`, or give a default in the pattern.

```
T3 (??): watchlist is empty
T3 (default): NOTHING TO WATCH
```

The `if` line printed nothing, because my watchlist here is empty on purpose.

**T4: optional fields and defaults.**

```ts
const { language } = film                     // string | undefined
const { language: lang = 'Korean' } = film    // string
const { poster = 'no-poster.png' } = film     // string | null
```

```
T4: undefined | Korean | null
```

A default removes `undefined` from the type, but not `null`, the same rule as pitfall 2.

**T5: a compile error caused by destructuring.**

```ts
// @ts-expect-error Property 'rating' does not exist on type 'Film'.
const { rating } = film
```

The message is `error TS2339: Property 'rating' does not exist on type 'Film'.` In JavaScript
the same line just gives `undefined` (`T5 (what runs anyway): undefined`). The fix is the real
field name: `const { myRating } = film` printed `T5 (fixed): 10`.

## JavaScript vs TypeScript

The messages are from `tsc` in strict mode with `noUncheckedIndexedAccess`.

| Form | Same in TypeScript | What I must add | Error when I get it wrong |
|---|---|---|---|
| 1 tuple from a function | the pattern | a tuple return type `[number, number]` | with `number[]` instead, the items become `number \| undefined`: `TS18048: 'first' is possibly 'undefined'.` |
| 2 skip and rest | the pattern | nothing | using `secondFilm` directly: `TS18048: 'secondFilm' is possibly 'undefined'.` |
| 3 swap | the pattern | the two variables need the same type | `let a = 'x'; let b = 2; [a, b] = [b, a]`: `TS2322: Type 'number' is not assignable to type 'string'.` |
| 4 / 7 defaults | the pattern | the default must fit the field type | `{ year = 'unknown' }: { year?: number }`: `TS2322: Type 'string' is not assignable to type 'number'.` |
| 5 by name | the pattern | the field must exist in the type | `const { rating } = film`: `TS2339: Property 'rating' does not exist on type 'Film'.` |
| 6 rename | the colon means rename | the type goes AFTER the pattern | `const { title: string } = film; const n: number = string`: `TS2322: Type 'string' is not assignable to type 'number'.` |
| 7 optional field | the pattern | a default, or a check before use | `language.toUpperCase()`: `TS18048: 'language' is possibly 'undefined'.` |
| 9 array inside an object | the pattern | nothing, but the item is `string \| undefined` | `mainGenre.toUpperCase()`: `TS18048` |
| 11 parameters | the pattern and the defaults | a type after the pattern | no type: `TS7031: Binding element 'title' implicitly has an 'any' type.`; no `= {}`: `TS2554: Expected 1 arguments, but got 0.` |
| `as const` tuple | the pattern | `as const` for exact types | reading a 3rd item: `TS2493: Tuple type 'readonly ["Eşkıya", 1996]' of length '2' has no element at index '2'.` |
| 12 entries | the loop | nothing: `Object.entries` on `Record<string, number>` gives `[string, number][]` | none |

## Bonus 4: Git repository

https://github.com/SametKarakacan/assignment4

The history shows the work in steps: the examples, the guide draft, the P7 messages and my
log, then `output.txt`. All commits are from the same evening (22 November), because I did
the assignment in one session.

## My own log

These are real things that went wrong or surprised me while I did this assignment, in the order
they happened.

1. **npm in the wrong folder.** I ran `npm install` in `C:\Users\HECTOR` instead of the project
   folder and got `npm error enoent Could not read package.json: Error: ENOENT: no such file or
   directory, open 'C:\Users\HECTOR\package.json'`. npm looks for `package.json` in the current
   folder, so I must `cd` into the project first.
2. **The folder was not where I thought.** `cd $HOME\Downloads\starter_1\assignment4` failed with
   `Cannot find path ... because it does not exist.` I had not unzipped the starter where I
   thought. I unzipped the project again into a short, known path (`C:\Users\HECTOR\assignment4`)
   and checked the `PS C:\...>` prompt before every command.
3. **Two commands on one line.** I pasted `npm run check` and the next command without pressing
   Enter in between, so npm received one command, `npm run checknpm run check...`, and answered
   `npm error Missing script: "checknpm"`. The same thing happened with a pasted PowerShell block:
   `Set-Content : A positional parameter cannot be found that accepts argument 'check'.` I learned
   to press Enter after a paste and wait for the prompt before the next command.
4. **The missing semicolon (pitfall 6 in my own code).** I deleted the `;` in front of
   `[tonight, tomorrow] = [tomorrow, tonight]` in `js/arrays.mjs` and ran it. Forms 1 and 2 still
   printed, then it stopped with `ReferenceError: Cannot access 'tomorrow' before initialization`.
   JavaScript joined the line with the line before it and read
   `let tomorrow = 'Eşkıya'[tonight, tomorrow] = [tomorrow, tonight]`, so it used `tomorrow` while
   it was still being created. In `pitfalls.mjs` the same mistake gave no error at all, only a
   wrong result, which I find even more dangerous. I put the `;` back.
5. **What TypeScript rejects in props.** I wrote five wrong component calls in a temporary file
   and `npm run check` reported `Found 5 errors in the same file`. Two things surprised me: the
   error for an object child lists the whole `ReactNode` type, and writing `children` both as an
   attribute and between the tags is an error (`TS2710`) in TypeScript, although in JavaScript it
   ran and the tags simply won. The messages are in the P7 table.
6. **Two lines did not go into output.txt.** When I ran `npm run all > output.txt`, two lines
   still appeared in the terminal: `Functions are not valid as a React child...` and
   ``ShowKey: `key` is not a prop...``. They are not in `output.txt`. React prints its warnings
   with `console.error`, which writes to stderr, and `>` only redirects stdout. Also, the first
   `output.txt` I made in PowerShell was saved as UTF-16 (Git showed `0 insertions, 0 deletions`
   when I replaced it), so I made it again with `cmd /c "npm run all > output.txt"` to get
   normal UTF-8 text with the Turkish letters.
