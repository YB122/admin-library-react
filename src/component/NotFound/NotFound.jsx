import React, { useEffect, useState } from "react";
import styles from "./NotFound.module.css";
export default function NotFound() {
  let [state, setState] = useState(0);
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <>
      <div>NotFound</div>
      <p>Hello NotFound</p>
    </>
  );
}
