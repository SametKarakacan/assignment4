// Samet Kaan Karakaçan, 2022502147
// Bonus 2: Depth, TypeScript at the type level. Run with `npx tsx ts/depth.ts`.
// The same idea as destructuring, but for TYPES: `infer` takes a part out of a type.

type Film = { title: string; year: number; myRating: number }

// D4a. First, Rest and Last of a tuple type, like [first, ...rest] on a value.
type First<T extends readonly unknown[]> = T extends readonly [infer Head, ...unknown[]] ? Head : never
type Rest<T extends readonly unknown[]> = T extends readonly [unknown, ...infer Tail] ? Tail : never
type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer End] ? End : never

type Row = [string, number, boolean] // title, year, watched
const head: First<Row> = 'Parasite' // First<Row> is string
const tail: Rest<Row> = [2019, true] // Rest<Row> is [number, boolean]
const end: Last<Row> = true // Last<Row> is boolean
console.log('D4a First/Rest/Last:', head, tail, end)

// The value-level and type-level versions side by side.
const row: Row = ['Eşkıya', 1996, true]
const [rowTitle, ...rowRest] = row // rowTitle: string, rowRest: [number, boolean]
console.log('D4a value-level:', rowTitle, rowRest)

// D4b. Taking a field type out of an object type, like { year } on a value.
type YearOf<T> = T extends { year: infer Y } ? Y : never
const filmYear: YearOf<Film> = 2010 // number
console.log('D4b YearOf<Film>:', filmYear)

// D4c. Parameters<F> and ReturnType<F> take a function type apart.
function describeFilm({ title, year }: Film, prefix: string): string {
  return `${prefix} ${title} (${year})`
}
type DescribeArgs = Parameters<typeof describeFilm> // [Film, string]
type FirstArg = First<DescribeArgs> // Film
const args: DescribeArgs = [{ title: 'Inception', year: 2010, myRating: 9 }, 'Tonight:']
const firstArg: FirstArg = args[0]
console.log('D4c Parameters:', describeFilm(...args), '| first arg title:', firstArg.title)

// Spreading a tuple into a call works because the tuple has the exact length and types.
const result: ReturnType<typeof describeFilm> = describeFilm(...args)
console.log('D4c ReturnType is string:', typeof result)
