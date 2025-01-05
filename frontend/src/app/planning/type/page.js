"use client";
import PlanningLayout from "@/components/PlanningLayout";
import SelectionItem from "@/components/SelectionItem";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
// import { styleData } from "@/data/planningData";

export default function Type() {
  const [travelStyleData, setTravelStyleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(
    () => localStorage.getItem("selectedTravelStyle") || null
  );

  useEffect(() => {
    const fetchTravelStyleData = async () => {
      try {
        const docRef = doc(db, "travel_question", "travel_style");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTravelStyleData(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching travel style data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelStyleData();
  }, []);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    localStorage.setItem("selectedStyle", option);
    console.log(`Selected: ${option}`);
  };

  console.log("travelStyleData", travelStyleData);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!travelStyleData) {
    return <p>No data available</p>;
  }

  return (
    <PlanningLayout
      title="2. What travel style do you prefer?"
      currentStep={2}
      isNextDisabled={!selectedOption}
    >
      <div className="grid grid-cols-2 gap-4">
        {travelStyleData.options?.map((option, index) => (
          <SelectionItem
            key={index}
            title={option}
            isSelected={selectedOption === option ? true : false}
            onSelect={() => handleSelectOption(option)}
          />
        ))}
      </div>
    </PlanningLayout>
  );
}
