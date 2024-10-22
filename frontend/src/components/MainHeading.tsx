import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { motion } from "framer-motion";

export const SlideTabsExample = () => {
  return (
    <div className="py-20">
      <MainHeading />
    </div>
  );
};

const MainHeading = ({ data }: { data?: MainHeadingData }) => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  return (
    <>
      <div className="flex items-center justify-center md:justify-between mx-2 h-20">
        <Link to="/" className="select-none hidden md:block">
          <h1 className="text-white text-2xl font-normal ">CodeStakes</h1>
        </Link>
        <ul
          onMouseLeave={() => {
            setPosition((pv) => ({
              ...pv,
              opacity: 0,
            }));
          }}
          className="relative flex w-fit rounded-2xl border border-[#ffffff5d] bg-[#ffffff18] p-1"
        >
          <Tab setPosition={setPosition}>Home</Tab>
          <Tab setPosition={setPosition}>Pricing</Tab>
          <Tab setPosition={setPosition}>Features</Tab>
          <Tab setPosition={setPosition}>Docs</Tab>
          <Tab setPosition={setPosition}>Blog</Tab>

          <Cursor position={position} />
        </ul>
      </div>
    </>
  );
};

const Tab = ({ children, setPosition }) => {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-3 text-base uppercase text-white  md:px-5 md:py-3 md:text-base"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-12 rounded-2xl bg-[#ffffff21] md:h-12"
    />
  );
};

export default MainHeading;
