import { FC } from 'react';
import styles from "./Preloader.module.scss";
import classNames from "classnames";

const Preloader: FC = () => {
  return (
      <div className="w-screen h-screen fixed z-[999] flex items-center justify-center">
        <div className={classNames(styles.preloader)}></div>
      </div>
  );
};

export default Preloader;
