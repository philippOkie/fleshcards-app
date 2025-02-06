function CreateDeckFooter() {
  return (
    <footer className="flex flex-row justify-between bg-base-100 fixed text-center p-4  bottom-0 left-0 pl-12 pr-12 w-full">
      <div className="flex flex-row gap-8">
        <input
          type="text"
          placeholder="Type your deck name here!"
          className="input w-full max-w-xs"
        />

        <input
          type="text"
          style={{ width: "500px" }}
          placeholder='You can add topics here "@anatomy @english" etc.'
          className="input w-full max-w-lg"
        />
      </div>

      <button className="btn btn-lg btn-success">Save</button>
    </footer>
  );
}

export default CreateDeckFooter;
