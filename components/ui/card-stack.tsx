"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PenLine } from "lucide-react";

import { cn } from "@/lib/utils";

import { SparklesCore } from "./sparkles";

let interval: any;

type Card = {
  id: string;
  name: string;
  anthor: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
  onEdit,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
  onEdit: (id: string) => void;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);
  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, 5000);
  };

  const bgColors = [
    "bg-[#fff3fd]/80",
    "bg-[#ecfff5]/80",
    "bg-[#e4e5ff]/80",
    "bg-[#f9f9f9]/80",
  ];

  return (
    <div className="relative my-2 h-48 w-full">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className={
              "absolute flex h-48 w-full flex-col justify-between rounded-3xl border border-neutral-200 p-4 shadow-xl shadow-black/[0.1] backdrop-blur-md dark:border-white/[0.1] dark:bg-black dark:shadow-white/[0.05] " +
              bgColors[index % bgColors.length]
            }
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
          >
            <div className="font-normal text-neutral-700 dark:text-neutral-200">
              {card.content}
            </div>
            <div>
              <p className="font-medium text-neutral-500 dark:text-white">
                {card.name}
              </p>
              <div className="flex items-center justify-between text-sm font-normal text-neutral-400 dark:text-neutral-200">
                <span>
                  {card.anthor} {card.designation}
                </span>
                <PenLine className="size-4" onClick={() => onEdit(card.id)} />
              </div>
            </div>
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1200}
              className="absolute left-0 top-0 -z-10 h-full w-full"
              particleColor="#ff8383"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-emerald-100 px-1 py-0.5 font-bold text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500",
        className,
      )}
    >
      {children}
    </span>
  );
};
