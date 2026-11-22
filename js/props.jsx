// Samet Kaan Karakaçan, 2022502147
// Props and children in plain JavaScript (JSX). Run with `npx tsx js/props.jsx`.
import { renderToStaticMarkup } from 'react-dom/server'

const render = (label, element) => console.log(label, renderToStaticMarkup(element))

// P1: props is ONE object. These two components are the same thing written two ways.
function FilmCardA(props) {
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function FilmCardB({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>
}
render('P1 A:', <FilmCardA title="Inception">Dreams inside dreams</FilmCardA>)
render('P1 B:', <FilmCardB title="Inception">Dreams inside dreams</FilmCardB>)

// What does the one object look like? Print its keys and values.
function ShowProps(props) {
  console.log('P1 props object:', props)
  return null
}
renderToStaticMarkup(<ShowProps title="Parasite" year={2019}>A family story</ShowProps>)

// P2: children is only a prop. Content between the tags and a children attribute give the same result.
render('P2 between tags:', <FilmCardB title="Eşkıya">Baran comes back</FilmCardB>)
render('P2 children attr:', <FilmCardB title="Eşkıya" children="Baran comes back" />)
// Both at the same time: the content between the tags wins.
render('P2 both:', <FilmCardB title="Eşkıya" children="from the attribute">from the tags</FilmCardB>)

// P3: what children can be.
function Shelf({ children }) {
  return <div className="shelf">{children}</div>
}
render('P3 string:', <Shelf>Spirited Away</Shelf>)
render('P3 number:', <Shelf>{2001}</Shelf>)
render('P3 zero:', <Shelf>{0}</Shelf>)
render('P3 one element:', <Shelf><em>Spirited Away</em></Shelf>)
render('P3 several elements:', <Shelf><em>Inception</em><em>Interstellar</em></Shelf>)
render('P3 array:', <Shelf>{['Kış Uykusu', ' / ', 'Eşkıya']}</Shelf>)
render('P3 undefined:', <Shelf>{undefined}</Shelf>)
render('P3 null:', <Shelf>{null}</Shelf>)
render('P3 false:', <Shelf>{false}</Shelf>)
render('P3 true:', <Shelf>{true}</Shelf>)
render('P3 nothing at all:', <Shelf />)
// A function is not rendered. React prints a warning (on stderr) and shows nothing.
render('P3 function:', <Shelf>{() => 'The Godfather'}</Shelf>)
// A function child is useful only when the component CALLS it (a "render prop").
function Repeat({ times, children }) {
  return <ul>{Array.from({ length: times }, (_, i) => <li key={i}>{children(i + 1)}</li>)}</ul>
}
render('P3 function called:', <Repeat times={2}>{(n) => `Watch Interstellar, part ${n}`}</Repeat>)
// A plain object is not allowed and throws.
try {
  renderToStaticMarkup(<Shelf>{{ title: 'Parasite' }}</Shelf>)
} catch (error) {
  console.log('P3 object:', error.message.split('.')[0])
}

// P4: separating children from the other props, and spreading the rest onto a DOM element.
function Panel({ title, children, ...rest }) {
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
render('P4 rest:', <Panel title="Watchlist" id="watch" className="panel">3 films</Panel>)

// Order decides who wins: whatever comes later on the element wins.
function SpreadFirst(props) {
  return <section {...props} className="fixed" />
}
function SpreadLast(props) {
  return <section className="fixed" {...props} />
}
render('P4 spread first:', <SpreadFirst className="from-caller" />)
render('P4 spread last:', <SpreadLast className="from-caller" />)

// P5: props or children? The same layout built twice.
function PageWithSlots({ header, footer, children }) {
  return <article><header>{header}</header><main>{children}</main><footer>{footer}</footer></article>
}
function PageWithChildren({ children }) {
  return <article>{children}</article>
}
render(
  'P5 slots:',
  <PageWithSlots header={<h1>My 2014 films</h1>} footer={<small>2 films</small>}>
    <p>Interstellar, Kış Uykusu</p>
  </PageWithSlots>,
)
render(
  'P5 children:',
  <PageWithChildren>
    <header><h1>My 2014 films</h1></header>
    <main><p>Interstellar, Kış Uykusu</p></main>
    <footer><small>2 films</small></footer>
  </PageWithChildren>,
)

// P6: defaults with form 7. undefined uses the default, null does not.
function Rating({ score = 'not rated' }) {
  return <p>Rating: [{score}]</p>
}
render('P6 no prop:', <Rating />)
render('P6 undefined:', <Rating score={undefined} />)
render('P6 null:', <Rating score={null} />)
render('P6 zero:', <Rating score={0} />)

// Things that do not work (see My own log in README.md).
// key is not a normal prop: the component cannot read it.
function ShowKey(props) {
  return <p>key is {String(props.key)}</p>
}
render('extra key:', <ShowKey key="f1" />)

// A component cannot change its props: the object is read-only.
function ChangeTitle(props) {
  try {
    props.title = 'Changed'
  } catch (error) {
    return <p>{error.constructor.name}</p>
  }
  return <p>{props.title}</p>
}
render('extra change props:', <ChangeTitle title="Babam ve Oğlum" />)
