import Card from "./components/Card";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex justify-center gap-10">
        <Sidebar />
        <div className="flex flex-col items-center ">
          <Card props={{ forwardText: "Hello", backText: "Привет" }} />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;
