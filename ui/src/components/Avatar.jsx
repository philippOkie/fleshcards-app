function Avatar() {
  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} className="btn btn-circle avatar">
        <div className="w-24 rounded-full"></div>
      </button>

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
  );
}

export default Avatar;
