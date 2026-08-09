import MathMateLesson from '../components/MathMateLesson'
import bab6 from '../data/bab6.json'

export function PedagogiBab6Page() {
  return <MathMateLesson data={bab6 as any} />
}