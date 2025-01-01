const Hero = () => {
  return (
    <div className="relative h-[32rem]">
      {" "}
      {/* Increased height */}
      <img
        src="uploads/Hero/breno-assis-r3WAWU5Fi5Q-unsplash.jpg"
        alt="House"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <h1 className="text-8xl font-bold text-white max-w-7xl mx-auto text-center">
          Real Estate at Your Fingertips!
        </h1>
      </div>
    </div>
  );
};

export default Hero;
