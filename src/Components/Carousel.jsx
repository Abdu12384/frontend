// Carousel.jsx
import React,{useState,useEffect} from "react";
import img1 from "../assets/images/img1.png"
import img2 from  "../assets/images/img2.png"
import img3 from  "../assets/images/img3.png"
import img4 from  "../assets/images/img4.png"


const Carousel = () => {
  const images=[img1,img2,img3,img4,img1]
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 


    return () => clearInterval(interval);
  }, [images.length]);

  
  return (
    
        <div id="default-carousel" className="relative  w-[640px]  h-[700px]" data-carousel="slide">

          <div className=" 	w-[100%] h-[110%] overflow-hidden  rounded-lg">

            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index=== activeIndex ? 'opacity-150':'opacity-0'} `}
                data-carousel-item
              >
                <img
                  src={image}
                  className="absolute h-[120%] block w-[120%] object-cover  -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
          </div>

         
        </div>
      );
    };
    
export default Carousel;
