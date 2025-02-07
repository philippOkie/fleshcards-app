function CreateDeckFooter() {
  return (
    <footer className="flex flex-row justify-between bg-base-100  text-center p-6 pl-12 pr-12 w-full">
      <div className="flex flex-row gap-8">
        <input
          type="text"
          placeholder="Type your deck name here!"
          className="input w-full max-w-xs"
        />

        <input
          type="text"
          style={{ width: "600px" }}
          placeholder='You can add topics here "@anatomy @english_spanish"'
          className="input w-full max-w-lg"
        />
      </div>

      <button className="btn btn-lg fixed btn-success bottom-6 right-12">
        Save
      </button>
    </footer>
  );
}

export default CreateDeckFooter;
