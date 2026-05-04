import React from "react";
import AnimatedThemeToggler from "../AnimatedThemeToggler/AnimatedThemeToggler";

export default function ToggleMode() {
  return (
    <AnimatedThemeToggler
      shape="circle"
      duration={600}
      fromCenter={false}
      size={48}
    />
  );
}
