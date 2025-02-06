import Sidebar from "./Sidebar";
import Card from "./Card";
import CardRateBtns from "./CardRateBtns";
import ShowAnswerBtn from "./ShowAnswerBtn";

function Home({ showAnswerBtnClicked, handleShowAnswerBtnClick }) {
  return (
    <div className="flex flex pl-12 gap-18">
      <Sidebar />
      <div className="flex flex-col pr-32">
        <Card
          showAnswerBtnClicked={showAnswerBtnClicked}
          props={{ forwardText: "Hello", backText: "Привет" }}
        />
        <div className="flex justify-center mt-10">
          {showAnswerBtnClicked ? (
            <CardRateBtns />
          ) : (
            <ShowAnswerBtn onShowAnswerBtnClick={handleShowAnswerBtnClick} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
