import { useEffect } from "react";

const GlowingCursor = () => {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "glow-cursor";
    document.body.appendChild(cursor);

    const moveCursor = (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      cursor.remove();
    };
  }, []);

  return null;
};

export default GlowingCursor;
