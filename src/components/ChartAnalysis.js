// src/components/ChartAnalysis.js
import React, { useEffect, useRef } from 'react';

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
        "삼성전자": "005930.KS", // 검색 오류
      };

      const symbol = symbolMap[stockName] || `${stockName}`;

      new window.TradingView.widget({
        container_id: containerRef.current.id,
        width: "100%",
        height: 500,
        symbol: symbol, // 수정된 심볼 형식
        interval: 'D',
        timezone: 'Asia/Seoul',
        theme: 'light',
        style: '1',
        locale: 'kr',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        details: true,
        studies: ['Moving Average@tv-basicstudies'], // 이동평균선 추가
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
