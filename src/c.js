import React, { useEffect, useRef } from 'react';
import './styles.css'
const ChartAnalysis = ({ stockName }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ''; 

//심볼형식으로만 검색되는 목록들 || 백엔드로 연동가능
      const symbolMap = {
        "테슬라": "TSLA",
        "애플": "AAPL",
        "구글": "GOOGL",
        "아마존": "AMZN",
        "마이크로소프트": "MSFT",
        "삼성전자": "005930", 
      };

      const symbol = symbolMap[stockName] || `${stockName}`;

      new window.TradingView.widget({
        container_id: containerRef.current.id,
        width: "100%",
        height: 300,
        symbol: symbol, 
        interval: 'D',
        timezone: 'Asia/Seoul',
        theme: 'light',
        style: '1', // 0: 영역, 1:캔들 , 2: 막대, 3:선
        locale: 'kr',
        toolbar_bg: '#f1f3f6',
        enable_publishing: true,
        allow_symbol_change: true,
        details: true,
        studies: ['Moving Average@tv-basicstudies'],
      });
    }
  }, [stockName]);

  return (
    <div className="chart-container">
      <div ref={containerRef} id="tradingview-widget" />
    </div>
  );
};

export default ChartAnalysis;