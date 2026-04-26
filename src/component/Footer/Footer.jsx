import React, { useEffect, useState } from "react";
import styles from "./Footer.module.css";
export default function Footer() {
  let [state, setState] = useState(0);
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <>
      <div>Footer</div>
      <p>Hello Footer</p>
    </>
  );
}
