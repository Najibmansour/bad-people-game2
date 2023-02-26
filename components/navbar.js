import LoginDiv from "./login";
import ThemeSwitcher from "./themeSwitcher";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-3xl" href="/">
          <p className="text-primary">Bad </p> People
        </a>
      </div>
      <div className="">
        <ThemeSwitcher />
      </div>
      <div className="flex-none">
        <LoginDiv />
      </div>
    </div>
  );
};

export default Navbar;
