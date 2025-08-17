import type { ReactNode } from "react"
import { createPortal } from "react-dom";
import { useState, useRef } from "react";

interface TooltipProps {
  comment?: string;
  children: ReactNode;
}

export default function Tooltip({ comment, children }: TooltipProps) {
  if (!comment) return <>{children}</>

  const [show, setShow] = useState(false);
  const [coordinates, setCoordinates] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseEnter() {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCoordinates({
        top: rect.top - 30,
        left: rect.left + rect.width / 2
      });
    }
    setShow(true);
  }

  function handleMouseLeave() {
    setShow(false);
  }

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative inline-block"
      >
        <span className="tooltip-text">
          {children}
        </span>
      </div>
      {show && createPortal(
        <div
          style={{
            top: coordinates.top,
            left: coordinates.left
          }}
          className="fixed transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded mb-2 py-1 px-2 whitespace-nowrap z-50 pointer-events-none"
          role="tooltip"
        >
          {comment}
        </div>,
        document.body
      )}
      {/*
      <div className="fixed bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
        {comment}
      </div>
      */}
    </>
  )
}