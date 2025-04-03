import React from "react";
import { Button } from "../../../../components/ui/button";

export const CreateEventsSection = (): JSX.Element => {
  return (
    <section className="w-full py-12 bg-[#eee1ff] relative">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="relative w-full md:w-1/2 mb-8 md:mb-0">
          <img
            className="w-full max-w-[545px] h-auto object-cover -mt-12"
            alt="People waiting in line illustration"
            src="public/image-3-1.png"
          />
        </div>
      </div>
    </section>
  );
};