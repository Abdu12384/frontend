import React from "react";
import { Mail, MapPin,ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import contactImg1 from '../../../src/assets/images/contactImg.jpg'
import contactImg2 from '../../../src/assets/images/contactImg2.png'


export default function ContactPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${contactImg2})`, // Replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#bca89f] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#bca89f] rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

      <div className="container mx-auto px-4 py-16 relative">
      <Link
          to="/"
          className="absolute top-4 left-4 flex items-center text-[#3d251e] hover:text-[#765341] transition-colors"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          <span className="font-medium text-lg">Home</span>
        </Link>
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-[#3d251e] mb-4">Get In Touch</h1>
          <p className="text-[#765341] text-lg">
            Fill up the form and our team will get back to you within 24 hours.
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-6xl mx-auto bg-[#d8cbc4] rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#4c3228] mb-6">
                  Let's Work Together!
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-[#6a4a3a]">
                    <MapPin className="w-5 h-5 text-[#8b6c5c]" />
                    <p>1140 3rd Street Ne Washington DC, 20002</p>
                  </div>
                  <div className="flex items-center space-x-4 text-[#6a4a3a]">
                    <Mail className="w-5 h-5 text-[#8b6c5c]" />
                    <p>info@red@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Decorative Image */}
              <div className="relative">
                <img
                  src={contactImg1}
                  alt="Decorative"
                  className="w-full max-w-md rounded-2xl"
                />
                {/* Decorative leaf */}
                <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-24 h-24 text-[#d8cbc4]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#4c3228] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-[#a08679] focus:ring-2 focus:ring-[#8b6c5c] focus:border-[#8b6c5c] transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4c3228] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-[#a08679] focus:ring-2 focus:ring-[#8b6c5c] focus:border-[#8b6c5c] transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4c3228] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-[#a08679] focus:ring-2 focus:ring-[#8b6c5c] focus:border-[#8b6c5c] transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4c3228] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-[#a08679] focus:ring-2 focus:ring-[#8b6c5c] focus:border-[#8b6c5c] transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4c3228] mb-2">
                  Message
                </label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-[#a08679] focus:ring-2 focus:ring-[#8b6c5c] focus:border-[#8b6c5c] transition-colors resize-none"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button className="w-full bg-[#8b6c5c] hover:bg-[#765341] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-[1.02]">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
