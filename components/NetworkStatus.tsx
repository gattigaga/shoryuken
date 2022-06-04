import React, { useEffect, useRef, useState } from "react";
import { MdSignalWifiBad } from "react-icons/md";
import { motion } from "framer-motion";

type Props = {};

const NetworkStatus: React.FC<Props> = ({}) => {
  const [isOnline, setIsOnline] = useState(true);

  const variants = {
    hidden: {
      left: -256,
    },
    visible: {
      left: 16,
    },
  };

  // Show offline/online status.
  useEffect(() => {
    const offlineCallback = () => setIsOnline(false);
    const onlineCallback = () => setIsOnline(true);

    window.addEventListener("offline", offlineCallback);
    window.addEventListener("online", onlineCallback);

    return () => {
      window.removeEventListener("offline", offlineCallback);
      window.removeEventListener("online", onlineCallback);
    };
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate={isOnline ? "hidden" : "visible"}
      variants={variants}
      transition={{
        duration: 0.3,
        ease: isOnline ? "easeIn" : "easeOut",
      }}
      className="absolute bottom-4 left-[-256px] w-[240px] bg-white px-4 py-2 rounded shadow-md flex items-center"
    >
      <MdSignalWifiBad className="text-red-700" size={24} />
      <p className="text-xs ml-4 text-slate-700">You are offline !</p>
    </motion.div>
  );
};

export default NetworkStatus;
