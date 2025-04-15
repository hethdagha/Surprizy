import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { Link } from "react-router-dom";

// Flask backend server address (port 5000)
const BASE_IMAGE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

// Tooltip text for star ratings
const tooltipArray = ["0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0"];

// Fill colors for star ratings
const fillColorArray = [
  "#f17a45", // Star 1
  "#f19745", // Star 2
  "#f1a545", // Star 3
  "#f1b345", // Star 4
  "#f1d045", // Star 5
];

const GiftCard = ({ productData, setrelevancyData, setIsOpenModal, setCurrModalData }) => {
  console.log("Product Data:", productData); // Debugging: Log productData
  const [rating, setRating] = useState(Number(productData?.Rating) || 0);

  // Handle rating change
  const handleRating = (rate) => {
    const updatedProductData = { ...productData, rating: rate }; // Update rating in productData
    setrelevancyData(updatedProductData); // Update relevancy data
    setRating(rate); // Update local state
  };

  return (
    <div className="px-3 py-2 w-72 min-h-[30rem] rounded-md overflow-hidden shadow-lg bg-white flex flex-col justify-evenly">
      {/* Gift Image */}
      <GiftImage imageLink={productData.ImageLink} />

      {/* Gift Name */}
      <GiftName giftName={productData.Gift} />

      {/* Gift Description */}
      <GiftDescription description={productData.Description} />

      {/* Rating Component */}
      <div className="w-full py-4 flex flex-col gap-2 justify-evenly items-start">
        <RatingComponent rating={rating} handleRating={handleRating} />
      </div>

      {/* Explore Button */}
      <ExploreLink productData={productData} />
    </div>
  );
};

export default GiftCard;

// Gift Image Component
const GiftImage = ({ imageLink }) => {
  const fullImageUrl = imageLink
    ? imageLink.startsWith("http") // Check if the URL starts with "http"
      ? imageLink
      : `${BASE_IMAGE_URL}/${imageLink}` // Append base URL if relative path
    : "/images/no-image.png"; // Fallback image

  return (
    <div className="w-full max-h-[10rem] rounded-md">
      <img
        className="rounded-md w-full max-h-[10rem] object-cover"
        src={fullImageUrl}
        alt="gift_image"
        onError={(e) => {
          e.target.src = "/images/no-image.png"; // Fallback image on error
        }}
      />
    </div>
  );
};

// Gift Name Component
const GiftName = ({ giftName }) => {
  return (
    <div className="py-2 text-xl font-semibold min-h-[4rem]">
      {giftName || "No name available."}
    </div>
  );
};

// Gift Description Component
const GiftDescription = ({ description }) => {
  return (
    <div className="text-md text-gray-600 min-h-[4rem] overflow-hidden">
      {description || "No description available."}
    </div>
  );
};

// Rating Component
const RatingComponent = ({ rating, handleRating }) => {
  return (
    <div className="w-full">
      <div className="font-medium">How helpful is this?</div>
      <Rating
        onClick={handleRating} // Handle rating change
        initialValue={rating} // Dynamically update the initial value
        tooltipArray={tooltipArray} // Tooltip text for each star
        fillColorArray={fillColorArray} // Fill colors for stars
        size={30} // Size of stars
        transition // Enable smooth transitions
        allowFraction // Allow fractional ratings
        showTooltip={true} // Show tooltips on hover
        tooltipDefaultText={`0.0`} // Default tooltip text
        tooltipClassName={`bg-white text-dark text-xl font-semibold py-2`} // Tooltip style
        emptyStyle={{ display: "flex" }} // Empty star style
        emptyClassName={`flex`} // Empty star class
        fillStyle={{ display: "-webkit-inline-box" }} // Filled star style
        fillClassName={`inline-box`} // Filled star class
        className="react-stars" // Custom class for debugging
      />
    </div>
  );
};

// Explore Link Component
const ExploreLink = ({ productData }) => {
  const amazonFallbackLink = `https://www.amazon.in/s?k=${encodeURIComponent(productData.Gift)}`;
  const redirectLink = productData.Link || amazonFallbackLink; // Use fallback link if no direct link exists

  return (
    <a
      href={redirectLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="w-full border font-semibold hover:border-white hover:bg-light bg-white text-light hover:text-white border-light hover:cursor-pointer py-2 px-4 rounded-md text-center">
        Explore
      </div>
    </a>
  );
};