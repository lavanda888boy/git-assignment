import Navbar from "./components/shared/Navbar";
import "./reset.css";
import "./App.css";
import Statusbar from "./components/shared/Statusbar";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Records from "./pages/Records";
import { PageContextProvider } from "./PageContext";

function App() {
  return (
    <PageContextProvider>
      <Statusbar />
      <Navbar />
      <Doctors />
    </PageContextProvider>
  );
}

export default App;