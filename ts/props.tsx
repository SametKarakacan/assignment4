// Samet Kaan Karakaçan, 2022502147
// Props and children in TypeScript (P1 to P7). Run with `npx tsx ts/props.tsx`.
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const render = (label: string, element: ReactNode) => console.log(label, renderToStaticMarkup(element))

// P1: props is one object. The type describes that one object, and goes after the whole pattern.
type FilmCardProps = { title: string; children?: ReactNode }

function FilmCardA(props: FilmCardProps) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function FilmCardB({ title, children }: FilmCardProps) {
  return <section><h2>{title}</h2>{children}</section>
}
render('P1 A:', <FilmCardA title="Inception">Dreams inside dreams</FilmCardA>)
render('P1 B:', <FilmCardB title="Inception">Dreams inside dreams</FilmCardB>)

// P2: children is only a prop, so it can also be written as an attribute.
render('P2 between tags:', <FilmCardB title="Eşkıya">Baran comes back</FilmCardB>)
render('P2 children attr:', <FilmCardB title="Eşkıya" children="Baran comes back" />)
// Writing both is a compile error in TypeScript (see README, P2). In JavaScript the tags win.

// P3: what children can be. ReactNode allows string, number, elements, arrays, null, undefined, boolean.
function Shelf({ children }: { children?: ReactNode }) {
  return <div className="shelf">{children}</div>
}
render('P3 string:', <Shelf>Spirited Away</Shelf>)
render('P3 number:', <Shelf>{2001}</Shelf>)
render('P3 several elements:', <Shelf><em>Inception</em><em>Interstellar</em></Shelf>)
render('P3 null:', <Shelf>{null}</Shelf>)
render('P3 false:', <Shelf>{false}</Shelf>)
// A function is NOT a ReactNode. To pass a function, the children type must say so.
function Repeat({ times, children }: { times: number; children: (n: number) => ReactNode }) {
  return <ul>{Array.from({ length: times }, (_, i) => <li key={i}>{children(i + 1)}</li>)}</ul>
}
render('P3 function called:', <Repeat times={2}>{(n) => `Watch Interstellar, part ${n}`}</Repeat>)

// P4: separate title and children from the rest, and spread the rest onto a <section>.
type PanelProps = { title: string; children?: ReactNode } & ComponentProps<'section'>
function Panel({ title, children, ...rest }: PanelProps) {
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
render('P4 rest:', <Panel title="Watchlist" id="watch" className="panel">3 films</Panel>)

function SpreadFirst(props: ComponentProps<'section'>) {
  return <section {...props} className="fixed" />
}
function SpreadLast(props: ComponentProps<'section'>) {
  return <section className="fixed" {...props} />
}
render('P4 spread first:', <SpreadFirst className="from-caller" />)
render('P4 spread last:', <SpreadLast className="from-caller" />)

// P5: named slots (header and footer props) against children only.
type PageProps = { header: ReactNode; footer: ReactNode; children: ReactNode }
function PageWithSlots({ header, footer, children }: PageProps) {
  return <article><header>{header}</header><main>{children}</main><footer>{footer}</footer></article>
}
render(
  'P5 slots:',
  <PageWithSlots header={<h1>My 2014 films</h1>} footer={<small>2 films</small>}>
    <p>Interstellar, Kış Uykusu</p>
  </PageWithSlots>,
)

// P6: a default with form 7. The type must allow the default value too (number | string).
function Rating({ score = 'not rated' }: { score?: number | string | null }) {
  return <p>Rating: [{score}]</p>
}
render('P6 no prop:', <Rating />)
render('P6 undefined:', <Rating score={undefined} />)
render('P6 null:', <Rating score={null} />)

// P7: three ways to type children and props.
// 1) children?: ReactNode written by hand (FilmCardProps above).
// 2) PropsWithChildren adds `children?: ReactNode` to my own type.
type PosterProps = PropsWithChildren<{ year: number }>
function Poster({ year, children }: PosterProps) {
  return <figure>{children}<figcaption>{year}</figcaption></figure>
}
render('P7 PropsWithChildren:', <Poster year={2019}>Parasite</Poster>)
render('P7 PropsWithChildren, no children:', <Poster year={2019} />)

// 3) ComponentProps<'button'> is every prop a real <button> accepts (onClick, disabled, type...).
function PlayButton({ children, ...rest }: ComponentProps<'button'>) {
  return <button type="button" {...rest}>▶ {children}</button>
}
render('P7 ComponentProps:', <PlayButton disabled title="Play the film">Inception</PlayButton>)

// What the compiler rejects. Each line below is a compile error, so it stays a comment.
// The real messages from my machine are in README.md (P7).
// <Shelf>{{ title: 'Parasite' }}</Shelf>          an object is not a ReactNode
// <Poster>Parasite</Poster>                        year is missing
// <PlayButton href="/watch">Inception</PlayButton> a <button> has no href
// <FilmCardB title={2010} />                       title must be a string
