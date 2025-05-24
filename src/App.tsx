import {Routes, Route} from "react-router-dom";
import Main from "./pages/Main";

function App() {
  if (window.Telegram) {
    window.Telegram.WebApp.expand();
  }

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
