import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { PronunciationAssessment } from "@/components/PronunciationAssessment";
import { assignments } from "@/data/assignmentData";

export default function Assignment() {

  const [selectedWord, setSelectedWord] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">

      <Navigation />

      <div className="container mx-auto px-4 py-10">

        <h1 className="text-4xl font-bold mb-8 text-center text-sacred-gold">
          Sanskrit Pronunciation Assignments
        </h1>

        {!selectedWord && (

          <div className="space-y-10">

            {assignments.map((level) => (

              <div key={level.level}>

                <h2 className="text-2xl font-bold mb-4">
                  Level {level.level} — {level.title}
                </h2>

                <div className="grid md:grid-cols-3 gap-4">

                  {level.exercises.map((word, i) => (

                    <Card
                      key={i}
                      className="p-6 text-center cursor-pointer hover:shadow-lg transition"
                      onClick={() => setSelectedWord(word)}
                    >

                      <div className="text-3xl mb-2">
                        {word.devanagari}
                      </div>

                      <div className="text-muted-foreground">
                        {word.roman}
                      </div>

                      <div className="text-sm text-blue-400 mt-2">
                         {word.meaning}
                      </div>
                

                      <Button className="mt-4">
                        Practice
                      </Button>

                    </Card>

                  ))}

                </div>

              </div>

            ))}

          </div>

        )}

        {selectedWord && (

          <div className="space-y-6">

            <Button
              variant="outline"
              onClick={() => setSelectedWord(null)}
            >
              ← Back to Assignments
            </Button>

            <PronunciationAssessment
              lessonWord={selectedWord.devanagari}
              romanization={selectedWord.roman}
            />

          </div>

        )}

      </div>

    </div>
  );
}