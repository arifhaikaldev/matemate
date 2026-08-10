import { BrowserRouter, Routes, Route } from "react-router-dom";
import MathMateLesson from "./components/MathMateLesson";
import bab61 from "./data/bab6-1.json";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MathMateLesson data={bab61 as any} />} />
      </Routes>
    </BrowserRouter>
  );
}