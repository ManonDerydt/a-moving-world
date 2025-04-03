import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const TestimonialsSection = (): JSX.Element => {
  return (
    <section className="w-full relative py-12">
      <div className="relative w-full">
        <div className="w-full h-[252px] bg-[#eee1ff] relative">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="relative">
              <img
                className="w-[545px] h-[303px] -mt-[51px] object-cover"
                alt="People collaborating on a project"
                src="public/image-3-1.png"
              />
            </div>

            <Card className="border-none shadow-none bg-transparent ml-0 md:ml-10 mt-6 md:mt-0">
              <CardContent className="p-0">
                <h2 className="font-['DM_Sans',Helvetica] font-bold text-black text-[34px] mb-5">
                  Un Concept pour un Projet
                </h2>
                <p className="font-['DM_Sans',Helvetica] font-normal text-[#272727] text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
