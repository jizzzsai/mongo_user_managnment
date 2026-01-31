import { Routes, Route } from "react-router-dom";
import Items from "./pages/Item.jsx";
import ItemDetail from "./pages/ItemDetails.jsx";
 
function App() {
  return (
    <Routes>
      <Route path="/" element={<Items />} />
      <Route path="/items" element={<Items />} />
      <Route path="/items/:id" element={<ItemDetail />} />
    </Routes>
  );
}
 
export default App;