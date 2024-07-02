import { useState, useEffect } from "react";
import api from "../api";
import FashionItem from "../components/FashionItem";
import "../styles/Home.css"
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../components/Carousel";

function Home() {
  const [fashionItems, setFashionItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getFashionItems();
  }, []);

  const getFashionItems = () => {
    api
        .get("/api/fashion-items/")
        .then((res) => res.data)
        .then((data) => {
          setFashionItems(data);
        })
        .catch((err) => alert(err));
  };

  return (
    <div className="page-container">
      <div className="carousel-wrapper">
        <ImageCarousel/>
      </div>
      <div className="center-wrapper">
        <h1 className="app-name">StyleSavvy</h1>
        <h2>Fashion Items</h2>
        <div className="fashion-item-list">
          {fashionItems.map((item) => (
            <FashionItem item={item} key={item.id} />
          ))}
        </div>
        <button className="nav-button" onClick={() => navigate("/virtual-closet")}>
          Virtual Closet
        </button>
        <button className="nav-button" onClick={() => navigate("/rate-outfit")}>
          Rate Outfit
        </button>
      </div>
      <div className="carousel-wrapper">
        <ImageCarousel />
      </div>
    </div>
  );
}
export default Home;
