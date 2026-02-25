"use client";

interface LegoFoundationProps {
  width?: number;
}

export default function LegoFoundation({ width }: LegoFoundationProps) {
  return (
    <div
      className="h-[8px] rounded-[2px]"
      style={{
        width: width ? `${width}px` : "100%",
        backgroundColor: "#4ADE80",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.15), 2px 0 0 rgba(0,0,0,0.1)",
      }}
    >
      {/* Baseplate studs */}
      <div className="flex justify-center gap-[4px] -mt-[2px]">
        {[0, 1, 2, 3].map((stud) => (
          <div
            key={stud}
            className="w-[5px] h-[2px] rounded-t-[1px]"
            style={{
              backgroundColor: "#4ADE80",
              boxShadow: "0 -1px 0 rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
