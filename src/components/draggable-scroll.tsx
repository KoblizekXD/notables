"use client";
import { useRef, useState } from "react";

type props = { children: React.ReactNode; className?: string };

const DraggableScroll = ({ children, className }: props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDrag = () => setIsDragging(false);

  return (
    <div
      ref={scrollRef}
      className={`scroll-hide ${className}`}
      onMouseDown={onMouseDown}
      onMouseLeave={stopDrag}
      onMouseUp={stopDrag}
      onMouseMove={onMouseMove}>
      {children}
    </div>
  );
};

export default DraggableScroll;