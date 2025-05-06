import React, { useState } from "react";
import homeBackground from "../../assets/HomePageBG/8307.jpg";
import NavBar from "../NavBar";
import MultiStepForm from "../form/MultiStepForm";

const HomePage = ({ className }) => {
  const buildClassName = (appClassName) => {
    const defaultClassName = "";
    return `${defaultClassName} ${appClassName} ${className}`;
  };
  const [formDisplay, setFormDisplay] = useState(false);

  return (
    <div className={buildClassName(``)}>
      {!formDisplay ? (
        <>
          <NavBar className="w-full" />
          <PageContent setFormDisplay={setFormDisplay} />
          <AboutUs />
          <Footer />
        </>
      ) : (
        <div className="w-screen min-h-screen overflow-y-scroll flex items-center justify-center font-sans bg-formBg bg-bgWave bg-no-repeat bg-contain">
          <MultiStepForm />
        </div>
      )}
    </div>
  );
};

export default HomePage;

export const StartButton = ({ setFormDisplay }) => {
  return (
    <button
      className="my-4 text-2xl font-semibold py-2 px-6 border border-light bg-light text-white rounded-md hover:text-light hover:bg-white"
      onClick={() => setFormDisplay(true)}
    >
      Get Started
    </button>
  );
};

const PageContent = ({ setFormDisplay }) => {
  return (
    <main className="mx-4 flex flex-col-reverse md:grid md:grid-cols-2">
      <div className="m-4 flex flex-col items-start justify-center md:pl-16">
        <div className="font-bold text-3xl md:text-5xl py-4 flex flex-col ">
          <span>Gift</span>
          <span>Recommendation</span>
          <span>System</span>
        </div>
        <div className="w-full ">
          <h1>Find the Perfect Gift in Seconds!</h1>
          <p>
            Let us help you discover meaningful and thoughtful gifts for every occasion.
          </p>
        </div>
        <StartButton setFormDisplay={setFormDisplay} />
      </div>
      <div>
        <img src={homeBackground} alt="Gift Recommendation" />
      </div>
    </main>
  );
};

const AboutUs = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#f9fafb] to-[#e2e8f0] py-16 px-6 md:px-20 font-sans text-gray-800 overflow-hidden">
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-pink-100 rounded-full opacity-30 z-0"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary mb-10 drop-shadow-sm">
          About Us
        </h2>
        <div className="text-lg leading-relaxed space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <p>
            At <span className="font-semibold text-purple-600">Surprizy</span>, we believe that every gift should feel special. 
            Our mission is to make gift-giving effortless and meaningful by helping you find the 
            perfect present in just a few clicks.
          </p>
          <p>
            With Surprizy, you don’t have to worry about endless searching or second-guessing. 
            Simply tell us who you’re buying for, their age, and the occasion, and we’ll provide 
            personalized gift recommendations curated from top platforms like Amazon and Flipkart.
          </p>
          <p>
            Whether it’s a birthday, anniversary, or festive celebration, Surprizy ensures your 
            gift stands out—thoughtful, unique, and just right. 
            <span className="font-medium text-purple-500"> Gift smarter, not harder</span>, with Surprizy!
          </p>
        </div>
      </div>
    </section>
  );
};


const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#dbe6f3] to-[#727982] py-16 px-6 md:px-20 font-sans text-gray-800 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-4xl font-extrabold #727982 tracking-wide">🎁 Surprizy</h3>
          <p className="mt-4 text-base md:text-lg text-gray-200 leading-relaxed">
            Making gifting smarter, easier, and more personal. Let Surprizy do the thinking while
            you make someone’s day extra special.
          </p>
        </div>

        <div>
          <h4 className="text-2xl font-semibold mb-4 #727982">Quick Links</h4>
          <ul className="space-y-3 text-base">
            <li><a href="#" className="hover:text-pink-300 transition duration-200">Home</a></li>
            <li><a href="#about" className="hover:text-pink-300 transition duration-200">About Us</a></li>
            <li><a href="#gift" className="hover:text-pink-300 transition duration-200">Start Gifting</a></li>
            <li><a href="#contact" className="hover:text-pink-300 transition duration-200">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-2xl font-semibold mb-4 #727982">Get in Touch</h4>
          <ul className="space-y-3 text-base">
            <li>
              <span className="text-gray-300">Email:</span>{" "}
              <a href="mailto:hello@surprizy.com" className="text-pink-200 hover:text-pink-400">
                hello@surprizy.com
              </a>
            </li>
            <li>
              <span className="text-gray-300">Instagram:</span>{" "}
              <a href="#" className="text-pink-200 hover:text-pink-400">
                @surprizy_official
              </a>
            </li>
            <li>
              <span className="text-gray-300">LinkedIn:</span>{" "}
              <a href="#" className="text-pink-200 hover:text-pink-400">
                Surprizy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-sm md:text-base text-gray-200 border-t border-indigo-700 pt-6">
        © {new Date().getFullYear()} Surprizy. All rights reserved.
      </div>
    </footer>
  );
};