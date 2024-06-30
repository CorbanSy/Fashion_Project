import { useState, useEffect } from "react";
import api from "../api";
import FashionItem from "../components/FashionItem";
import "../styles/Home.css"
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Fashion Items</h2>
      <div className="fashion-item-list">
        {fashionItems.map((item) => (
          <FashionItem item={item} key={item.id}/>
        ))}
      </div>
      <button onClick={() => navigate("/upload")}>Upload Outfit</button>
    </div>
  );
}
export default Home;
