import {Routes, Route} from "react-router-dom";
import routes from "./consts/pageRoutes.ts";
import Main from "./pages/Main";

function App() {
  if (window.Telegram) {
    window.Telegram.WebApp.expand();
  }

  return (
    <div className={"App"}>
      <main>
        <Routes>
          <Route path={routes.MAIN} element={<Main/>}/>
        </Routes>
      </main>


      {/*<Footer />*/}
    </div>
  )
}

export default App
