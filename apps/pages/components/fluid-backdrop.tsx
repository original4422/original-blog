'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from 'motion/react';
import { type ReactNode, useEffect, useRef } from 'react';

export function FluidBackdrop({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLElement>(null);
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const x = useSpring(pointerX, { stiffness: 65, damping: 24, mass: 0.5 });
  const y = useSpring(pointerY, { stiffness: 65, damping: 24, mass: 0.5 });
  const background = useMotionTemplate`radial-gradient(34rem circle at ${x}% ${y}%, rgba(222, 29, 141, .30), transparent 70%)`;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handlePointer = (event: PointerEvent) => {
      const bounds = stage.getBoundingClientRect();
      pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
      pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
    };

    stage.addEventListener('pointermove', handlePointer, { passive: true });
    return () => stage.removeEventListener('pointermove', handlePointer);
  }, [pointerX, pointerY]);

  return (
    <section ref={stageRef} className="fluid-stage">
      <div className="fluid-orb fluid-orb-one" />
      <div className="fluid-orb fluid-orb-two" />
      <div className="fluid-orb fluid-orb-three" />
      <motion.div className="fluid-pointer" style={{ background }} />
      <div className="fluid-content">{children}</div>
    </section>
  );
}
