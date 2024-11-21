import React, { useState } from 'react';
import StockSelector from './components/StockSelector';
import './styles.css';
import axios from 'axios';

function App() {
  const [stockName, setStockName] = useState("");
  const [resultData, setResultData] = useState([]); // 결과 데이터 
  const [stats, setStats] = useState({ mean: 0, std: 0 }); // 통계 데이터
  const [graph, setGraph] = useState(""); // 그래프 이미지 
  const [error, setError] = useState(""); // 에러 메시지 

  const fetchStockData = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/stock-analysis", {
        stock_name: stockName,
      });

      const { monthly_data, forecast_data, stats, graph } = response.data;
      const combinedData = [
        ...monthly_data.map((item) => ({ ...item, Prediction: null })),
        ...forecast_data.map((item) => ({ Month: item.Month, Close: null, Prediction: item.Prediction })), // 예측 데이터
      ];
      setResultData(combinedData);
      setStats(stats || { mean: 0, std: 0 });
      setGraph(graph || "");
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
      setResultData([]);
    }
  };

  return (
    <div className="App">
      <h1>주식 분석</h1>
      <StockSelector stockName={stockName} setStockName={setStockName} />

      <button onClick={fetchStockData}>데이터 가져오기</button>
      {error && <div className="error-message">{error}</div>}

      <div className="chart-container">
        {graph ? <img src={`data:image/png;base64,${graph}`} alt="Stock Analysis Graph" /> : null}
      </div>

      <div className="analysis-table-container">
        <table className="analysis-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>종가</th>
              <th>예측값</th>
            </tr>
          </thead>
          <tbody>
            {resultData && resultData.length > 0 ? (
              resultData.map((item, index) => (
                <tr key={index}>
                  <td>{item.Month}</td>
                  <td>{item.Close !== null ? item.Close.toFixed(2) : "N/A"}</td>
                  <td>{item.Prediction !== null ? item.Prediction.toFixed(2) : "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="analysis-result">
        <h3>통계</h3>
        <p>평균: {stats.mean.toFixed(2)}</p>
        <p>표준편차: {stats.std.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default App;
