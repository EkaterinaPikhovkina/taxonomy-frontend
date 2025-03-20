import TreeView from "./components/visualisation/TreeView.jsx";
import {useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import TaxonomyEditor from "./components/TaxonomyEditor.jsx";

function App() {
    const [taxonomyData, setTaxonomyData] = useState(null);


  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<HomePage setTaxonomyData={setTaxonomyData} />} />
              <Route path="/editor" element={<TaxonomyEditor taxonomyData={taxonomyData} setTaxonomyData={setTaxonomyData} />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
