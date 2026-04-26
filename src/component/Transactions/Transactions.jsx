import React, { useEffect, useState } from "react";
import styles from "./Transactions.module.css";
export default function Transactions() {
  let [state, setState] = useState(0);
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <>
      <div>Transactions</div>
      <p>Hello Transactions</p>
    </>
  );
}
