import Card from "./components/Card";

function App() {
  return (
    <div className="flex justify-center ">
      <Card props={{ forwardText: "hello", backText: "Привет" }}></Card>
    </div>
  );
}

export default App;
