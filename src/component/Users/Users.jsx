import React, { useEffect, useState } from "react";
import styles from "./Users.module.css";
export default function Users() {
  let [state, setState] = useState(0);
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <>
      <div>Users</div>
      <p>Hello Users</p>
    </>
  );
}
