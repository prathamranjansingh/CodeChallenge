const Header = () => {
  return (
    <div>
      <div className="top-grad flex justify-center w-full h-[100vh]">
        <div className="container text-center">
          <div className="cnt">
            <h1 className="text-white pt-[186px] pb-28">
              <em>Elevate</em> your data structures{" "}
              <em>and algorithm skills</em>
            </h1>
            <button className="text-white border border-[#ffffff5d] bg-[#ffffff05] hover:bg-[#ffffff18]  py-4 px-6 rounded-lg relative overflow-hidden mt-4">
              <h2 className="text-lg relative font-semibold z-10">
                Get Started
              </h2>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
