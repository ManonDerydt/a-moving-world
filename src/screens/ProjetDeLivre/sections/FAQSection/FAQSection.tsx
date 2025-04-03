import { ChevronDownIcon } from "lucide-react";
import React, { useState } from "react";
import { Card } from "../../../../components/ui/card";
import { motion } from "framer-motion";

export const FAQSection = (): JSX.Element => {
  const { personalities, loading } = useFirebaseData();
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const categories = [
    "Tous",
    "Dirigeant de média",
    "Journaliste",
    "Influenceurs/Youtubeurs"
  ];

  const filteredPersonalities = personalities.filter(personality => 
    selectedCategory === "Tous" || personality.category === selectedCategory
  );

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <section className="w-full bg-gradient-to-b from-white to-[#f5f7ff] py-24">
      <div className="w-full max-w-[1200px] mx-auto px-4">
        <h2 className="text-center text-[#242565] text-5xl font-bold mb-16">
          Les personnalités
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#242565] text-white shadow-lg"
                  : "bg-white text-[#242565] hover:bg-[#242565]/5 border border-[#242565]/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPersonalities.map((personality) => (
            <motion.div
              key={personality.id}
              className="perspective-1000 w-full"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className={`relative w-full h-[420px] cursor-pointer transition-transform duration-700 transform-gpu ${
                  flippedCard === personality.id ? 'rotate-y-180' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => setFlippedCard(flippedCard === personality.id ? null : personality.id)}
              >
                {/* Front of card */}
                <Card className="absolute w-full h-full backface-hidden">
                  <div className="relative w-full h-full">
                    <img
                      className="w-full h-full object-cover object-center rounded-lg"
                      alt={personality.name}
                      src={personality.imageUrl}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="font-bold text-2xl mb-2">
                        {personality.name}
                      </h3>
                      <p className="text-base text-white/90">
                        {personality.title}
                      </p>
                      <p className="text-base font-bold">
                        {personality.company}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Back of card */}
                <Card className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#242565] text-white p-6">
                  <div className="flex flex-col h-full">
                    <h3 className="text-2xl font-bold mb-4">{personality.name}</h3>
                    <p className="text-lg leading-relaxed flex-grow overflow-auto">
                      {personality.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-sm opacity-80">
                        {personality.category}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};