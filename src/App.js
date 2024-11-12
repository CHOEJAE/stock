// src/App.js
import React, { useState, useEffect } from 'react';
import ChartAnalysis from './components/ChartAnalysis'; //차트 분석
import StockSelector from './components/StockSelector'; //종목 선택
import { fetchNews } from './api'; // 뉴스 API 함수 가져오기
import '../src/css/styles.css'; 

function App() {
  const [stockName, setStockName] = useState("");
  const [newsArticles, setNewsArticles] = useState([]); // 뉴스 기사 상태 추가
// 뉴스관련 코드
  useEffect(() => { 
    const getNews = async () => {
      if (stockName) {
        const news = await fetchNews(stockName);
        setNewsArticles(news);
      }
    };
    getNews();
  }, [stockName]);

  return (
    <div className="App">

      <span className="selector-container">
        <StockSelector stockName={stockName} setStockName={setStockName} />
      </span>
      <div>
        <h2 className="chart-title">{stockName} 차트 분석</h2>
        <ChartAnalysis stockName={stockName} />
      </div>

      <div className="analysis-container">
        <h3 className="section-title">분기 분석</h3>
        <p className="query-period">조회 기간: 0000.00.00 - 0000.00.00</p>
    {/* 분기분석 내용 여기에 기능? */}
        <table className="analysis-table">
          <thead>
            <tr>
              <th>Month/Year</th> <th>이슈 주제 (댓글, 뉴스)</th> <th>동반상승한 종목</th> <th>등락폭</th> <th>거래량</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>2024/01</td> <td>주요 이슈 내용</td> <td>종목명1, 종목명2</td> <td>+2.5%</td> <td>1M</td>
            </tr>
          </tbody>
        </table>

        <div className="analysis-result">
          <h3 className="result-title">분기 분석 결과</h3>
          <p className="result-text">
            00 종목은 최근 #월/년간 #기간에 주가가 평균 X% 상승했습니다. 이번 #시기에 해당 종목을 구매하는 것을 추천합니다.
          </p>
        </div>
      </div>
      {/* 백엔드 연동필요.. */}
      <div className="news-container">
        <h3 className="news-title">주요 뉴스</h3>
        <div className="news-list">
          
                  
              </div>
            </div>
    
        </div>

  
  )
}

export default App;
