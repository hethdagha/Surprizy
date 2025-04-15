import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import _ from "underscore";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context";
import GiftCard from "../../GiftCard";
import PrevNext from "../../PrevNext";
import Toast from "../../Toast";
import GiftHamper from "../../../assets/gift_hamper.jpeg";

const Result = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [relevancyData, setrelevancyData] = useState(null);
  const inputDetails = useContext(UserContext);
  const navigate = useNavigate();

  const customConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const oldUserInputValues = inputDetails.userInput;

  useEffect(() => {
    let userInputValues = {
      ...oldUserInputValues,
      age: Number(oldUserInputValues.age),
    };

    const usersName = JSON.stringify(userInputValues);

    if (_.isEmpty(data)) {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/getGift`, usersName, customConfig)
        .then((res) => {
          if (_.isEmpty(localStorage.getItem("token"))) {
            navigate("/login");
          }
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          if (_.isEmpty(localStorage.getItem("token"))) {
            navigate("/login");
          }
          setLoading(false);
          toast.error(err.message, {
            duration: 2000,
            position: "top-right",
          });
        });
    }
  }, []);

  const submitRelevancyRating = () => {
    if (relevancyData === null) {
      toast.info("Product Data not found!", {
        duration: 2000,
        position: "top-right",
      });
      return;
    }

    let userInputValues = {
      ...oldUserInputValues,
      age: Number(oldUserInputValues.age),
    };

    const relevancyDataToSend = { ...userInputValues, ...relevancyData };
    const userRating = JSON.stringify(relevancyDataToSend);

    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/addEntry`, userRating, customConfig)
      .then(() => {
        toast.success("Thanks for feedback!", {
          duration: 2000,
          position: "top-right",
        });
      })
      .catch((err) => {
        toast.error(err.message, {
          duration: 2000,
          position: "top-right",
        });
      });
  };

  if (loading) {
    return (
      <div className="w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-x-hidden">
      <Toast />
      <div className="text-white heading-style text-6xl">Recommendations</div>

      <div className="flex flex-row flex-wrap gap-4 justify-center items-center">
        {data && data.length
          ? data.map((item, ind) => (
              <GiftCard key={ind} productData={item} setrelevancyData={setrelevancyData} />
            ))
          : null}
      </div>

      <PrevNext alreadyFilled={true} submitRelevancyRating={submitRelevancyRating} />
      <GiftAdv />
    </div>
  );
};

export default Result;

const Loader = () => (
  <div className="w-full">
    <div className="py-4 text-white text-xl font-semibold text-center">
      Your Gifts are loading..
    </div>
    <div className="mx-auto w-72 h-72 square bg-giftLoadIcon bg-cover bg-top bg-no-repeat rounded-full bg-white"></div>
  </div>
);

const GiftAdv = () => (
  <div className="w-full p-8 rounded-lg shadow-lg bg-white flex mb-8">
    <div>
      <img src={GiftHamper} className="rounded-lg" alt="Gift Hamper" />
    </div>
    <div className="text-light font-semibold p-8">
      <h1 className="text-2xl mb-8">Check this, it’s something special for you!</h1>
      We at WhatTheFruit! believe that a gift should be an experience, not just an item.
      <br />
      <br />
      WhatTheFruit! has come up with a luxuriously curated Fruit Gift Hamper to surprise your loved ones.
      With a touch of luxury and full of health ✨
      <br />
      Fresh handpicked fruits, carefully packed and sent to your loved ones on a special occasion.
      <br />
      <br />
      Go to <b>whatthefruit.in</b> to explore more.
    </div>
  </div>
);
