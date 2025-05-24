import {Routes, Route} from "react-router-dom";
import Main from "./pages/Main";

function App() {
  return (
    <div className={"App"}>
      <main>
        <Routes>
          <Route path={"/"} element={<Main/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App
