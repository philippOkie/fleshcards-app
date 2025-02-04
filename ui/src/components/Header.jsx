function Header() {
  return (
    <div className="navbar bg-base-100 mb-10 mt-2">
      <div className="navbar-start flex gap-2 items-center pl-10">
        <div className="text-4xl w-[120px]">Spacer</div>
        <a className="btn btn-neutral w-32 !text-xl">Decks</a>
        <a className="btn btn-accent w-16 !text-2xl">+</a>
      </div>

      <div className="navbar-end pr-10">
        <div className="dropdown dropdown-end ">
          <div tabIndex={0} role="button" className="btn btn-circle avatar ">
            <div className=" w-24 rounded-full"></div>
          </div>
          <ul
            tabIndex={0}
            className="menu bg-neutral menu-sm dropdown-content bg-base-500 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Change Avatar</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
