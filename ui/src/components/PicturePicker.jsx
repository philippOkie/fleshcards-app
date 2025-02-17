function PicturePicker() {
  return (
    <div className="relative rounded-2xl bg-neutral text-neutral-content w-full p-4 pl-12 pr-12 flex flex-row items-center gap-8">
      <div className="avatar">
        <div className="w-32 rounded cursor-pointer">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
    </div>
  );
}

export default PicturePicker;
