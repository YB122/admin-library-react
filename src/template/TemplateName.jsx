import React, { useEffect, useState } from "react";
import styles from "./TemplateName.module.css";
export default function TemplateName() {
  let [state, setState] = useState(0);
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <>
      <div>TemplateName</div>
      <p>Hello TemplateName</p>
    </>
  );
}
