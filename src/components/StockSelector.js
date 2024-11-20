import React from 'react';
import '../styles.css';
const StockSelector = ({ stockName, setStockName }) => {
  const handleChange = (event) => {
    setStockName(event.target.value);
  };
  return (
    <div className="stock-selector" class="search-box">
    <input class="search-txt" type="text" value={stockName} onChange={handleChange} placeholder="종목을 검색하세요" />
    <button class="search-btn" type="submit">
      <i class="fas fa-search"></i>
      </button>
  </div>
  );
};
export default StockSelector;