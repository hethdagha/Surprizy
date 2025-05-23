import React, { useEffect, useState } from "react";
import { UserContext } from "../../Context";
import PrevNext from "../../PrevNext";
import InterestCard from "../Interest/InterestCard";

const maleArray = [
  "For Him",
  "Husband",
  "Father",
  "Brother",
  "Friend",
  "Son",
  "Boss",
  "Colleague",
  "Grandfather",
  "Uncle",
  "Boyfriend",
  "Fiancé",
  "Teacher",
  "Mentor",
  "Teammate",
  "Neighbor",
  "Cousin",
  "Any"
];

const femaleArray = [
  "For Her",
  "Wife",
  "Mother",
  "Sister",
  "Friend",
  "Daughter",
  "Boss",
  "Colleague",
  "Grandmother",
  "Aunt",
  "Girlfriend",
  "Fiancée",
  "Teacher",
  "Mentor",
  "Teammate",
  "Neighbor",
  "Cousin",
  "Any"
];



const RelationshipInputStep = () => {
  const [selectedInterest, setInterest] = useState();
  const [activeInterest, setActiveInterest] = useState(null);
  const [alreadyFilled, setAlreadyFilled] = useState(false);
  const inputDetails = React.useContext(UserContext);
  const InterestArray =  inputDetails.userInput.gender=='Male'?maleArray:femaleArray;
  
  console.log(inputDetails);
  const setSelectedInterest = (interest) => {
    inputDetails.userInput.relationship = interest;
    setAlreadyFilled(true);
    console.log(inputDetails.userInput);
  };

  let interestValue;
  useEffect(() => {
    interestValue = inputDetails.userInput.relationship;
    console.log("interest value", interestValue);
    if (interestValue !== "") {
      setAlreadyFilled(true);
      setActiveInterest(InterestArray.indexOf(interestValue));
    }
  }, []);

  return (
    <div className=" w-full px-4 flex flex-col justify-between h-full">
      <h1 className="w-full py-4 heading-style text-white">
        Pick your Relationship with Recipient
      </h1>
      <div className="w-full py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {InterestArray && InterestArray.length ? (
          InterestArray.map((interest, index) => {
            return (
              <InterestCard
                key={index}
                setInterest={setSelectedInterest}
                setActiveInterest={setActiveInterest}
                active={activeInterest === index}
                interest={interest}
                index={index}
                selectedInterest={selectedInterest}
              ></InterestCard>
            );
          })
        ) : (
          <div className="w-full text-center font-semibold p-4 text-xl">
            Relationships were not found
          </div>
        )}
      </div>
      <PrevNext input={selectedInterest} alreadyFilled={alreadyFilled} />
    </div>
  );
};

export default RelationshipInputStep;
