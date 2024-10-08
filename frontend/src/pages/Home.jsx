import { useState, useEffect } from "react";
import api from "../api";
import FashionItem from "../components/FashionItem";
import ImageCarousel from "../components/Carousel";
import Chatbot from "../components/Chatbot";
import ConveyorBeltCarousel from "../components/ConveyorBeltCarousel";
import "../styles/Home.css";

function Home() {
  const [fashionItems, setFashionItems] = useState([]);

  useEffect(() => {
    getFashionItems();
  }, []);

  const getFashionItems = () => {
    api
      .get("/fashion-items/")
      .then((res) => res.data)
      .then((data) => {
        setFashionItems(data);
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="page-container">
      <div className="header">
        <h1 className="app-name">StyleSavvy</h1>
        <h2 className="sub-title">Fashion Items</h2>
      </div>
      <div className="content-wrapper">
        <div className="carousel-wrapper">
          <ImageCarousel />
        </div>
        <div className="center-wrapper">
          <div className="fashion-item-list">
            {fashionItems.map((item) => (
              <FashionItem item={item} key={item.id} />
            ))}
          </div>
        </div>
        <div className="carousel-wrapper">
          <ImageCarousel />
        </div>
      </div>
      <ConveyorBeltCarousel />
      <div className="chatbot-wrapper">
        <Chatbot />
      </div>
    </div>
  );
}

export default Home;
