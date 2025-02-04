import Card from "./components/Card";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <Header />
      <div className="flex justify-center">
        <Card props={{ forwardText: "Hello", backText: "Привет" }}></Card>
      </div>
      <Footer />
    </div>
  );
}

export default App;
