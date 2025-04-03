import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

export const SearchSection = (): JSX.Element => {
  // Data for statistics to enable mapping
  const statistics = [
    { number: "5", text: "Même questions" },
    { number: "1", text: "Page = une question" },
    { number: "30", text: "personnalités" },
    { number: "3", text: "Secteurs différents" },
  ];

  return (
      <section className="w-full mx-auto">
          {/* Section visible uniquement sur mobile */}
          <div className="block md:hidden">
              <Card className="w-full bg-[#242565] max-w-4xl rounded-[20px] shadow-[0px_10px_50px_#3c36f140]">
                  <CardContent className="p-0">
                      <div
                          className="pb-20 flex flex-col sm:space-y-8 md:flex-row justify-between sm:px-6 px-[60px] py-[41px]">
                          {statistics.map((stat, index) => (
                              <div
                                  key={index}
                                  className="mt-8 font-['DM_Sans',Helvetica] font-bold text-white text-[22px] text-center"
                              >
                                  {stat.number}
                                  <br/>
                                  {stat.text}
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Section visible uniquement sur desktop */}
          <div className="hidden md:block">
              <Card className="w-full bg-[#242565] max-w-5xl rounded-[20px] shadow-[0px_10px_50px_#3c36f140] mx-auto">
                  <CardContent className="p-0">
                      <div className="flex flex-row justify-between px-[60px] py-[41px]">
                          {statistics.map((stat, index) => (
                              <div
                                  key={index}
                                  className="font-['DM_Sans',Helvetica] font-bold text-white text-[22px] text-center"
                              >
                                  {stat.number}
                                  <br/>
                                  {stat.text}
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>
      </section>

  );
};
