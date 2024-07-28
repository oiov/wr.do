import React from "react";

interface SectionColumnsType {
  title: string;
  children: React.ReactNode;
}

export function FormSectionColumns({ title, children }: SectionColumnsType) {
  return (
    <div className="grid grid-cols-1 items-center gap-x-12 gap-y-2 py-2">
      <h2 className="col-span-4 text-base font-semibold leading-none">
        {title}
      </h2>
      <div className="col-span-6">{children}</div>
    </div>
  );
}
