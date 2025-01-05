"use client";
import PlanningLayout from "@/components/PlanningLayout";
import SelectionItem from "@/components/SelectionItem";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Purpose() {
  const [purposeData, setPurposeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(
    () => localStorage.getItem("selectedPurpose") || null
  );

  useEffect(() => {
    const fetchPurposeData = async () => {
      try {
        const docRef = doc(db, "travel_question", "travel_purpose");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPurposeData(docSnap.data());
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching purpose data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurposeData();
  }, []);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    localStorage.setItem("selectedPurpose", option);
    // console.log(`Selected: ${option}`);
  };

  console.log("purposeData", purposeData);
  console.log("selectedOption", selectedOption);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!purposeData) {
    return <p>No data available</p>;
  }
  return (
    <div>
      <PlanningLayout
        title="1. What is the purpose of your trip?"
        currentStep={1}
        isNextDisabled={!selectedOption}
      >
        <div className="grid grid-cols-2 gap-4">
          {purposeData.options?.map((option, index) => (
            <SelectionItem
              key={index}
              title={option}
              description=""
              isSelected={selectedOption === option ? true : false}
              onSelect={() => handleSelectOption(option)}
            />
          ))}
        </div>
      </PlanningLayout>
    </div>
  );
}
