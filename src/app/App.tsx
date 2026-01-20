import {BrowserRouter} from "react-router-dom";
import {AppLayout} from "./layout/AppLayout/AppLayout.tsx";
import {AppRoutes} from "./routes/AppRoutes.tsx";

function App() {
  return (
      <BrowserRouter>
          <AppLayout>
              <AppRoutes />
          </AppLayout>
      </BrowserRouter>
  )
}

export default App
