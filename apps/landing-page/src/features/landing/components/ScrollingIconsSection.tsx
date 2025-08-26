"use client";

import Marquee from "react-fast-marquee";
import AtomIcon from "@/icons/AtomIcon";
import BeakerIcon from "@/icons/BeakerIcon";
import BookIcon from "@/icons/BookIcon";
import CalculatorIcon from "@/icons/CalculatorIcon";
import CodeIcon from "@/icons/CodeIcon";
import EquationIcon from "@/icons/EquationIcon";
import EraserIcon from "@/icons/EraserIcon";
import GlobeIcon from "@/icons/GlobeIcon";
import GraphIcon from "@/icons/GraphIcon";
import HeadphonesIcon from "@/icons/HeadphonesIcon";
import MusicIcon from "@/icons/MusicIcon";
import React from "react";

const icons = [
  { component: AtomIcon, name: "AtomIcon" },
  { component: BeakerIcon, name: "BeakerIcon" },
  { component: BookIcon, name: "BookIcon" },
  { component: CalculatorIcon, name: "CalculatorIcon" },
  { component: CodeIcon, name: "CodeIcon" },
  { component: EquationIcon, name: "EquationIcon" },
  { component: EraserIcon, name: "EraserIcon" },
  { component: GlobeIcon, name: "GlobeIcon" },
  { component: GraphIcon, name: "GraphIcon" },
  { component: HeadphonesIcon, name: "HeadphonesIcon" },
  { component: MusicIcon, name: "MusicIcon" }
];

interface ScrollingIconsSectionProps {
  direction?: "left" | "right";
}

const ScrollingIconsSection = ({ direction = "left" }: ScrollingIconsSectionProps) => {
  return (
    <section className="py-4">
      <Marquee
        direction={direction}
        speed={35}
        autoFill
      >
        {icons.map(({ component: Icon, name }) => (
          <div key={name} className="mx-12">
            <Icon className="w-9 h-9 text-[var(--primary-100)]" />
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default ScrollingIconsSection; 