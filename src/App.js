import React, { useState } from 'react';
import StockSelector from './components/StockSelector';
import './styles.css';
import axios from 'axios';

function App() {
  const [stockName, setStockName] = useState("");
  const [monthlyData, setMonthlyData] = useState([]); // 빈 배열로 초기화
  const [stats, setStats] = useState({ mean: 0, std: 0 });
  const [graph, setGraph] = useState("");

  const fetchStockData = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/stock-analysis', {
        stock_name: stockName,
      });

      const { monthly_data, stats, graph } = response.data;

      setMonthlyData(monthly_data || []); // 데이터를 가져오지 못한 경우 빈 배열 설정
      setStats(stats);
      setGraph(graph);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
      setMonthlyData([]); // 에러 발생 시 빈 배열 설정
    }
  };

  return (
    <div className="App">
      <h1>주식 분석</h1>
      <StockSelector stockName={stockName} setStockName={setStockName} />

      <button onClick={fetchStockData}>데이터 가져오기</button>

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
            {monthlyData && monthlyData.length > 0 ? (
              monthlyData.map((item, index) => (
                <tr key={index}>
                  <td>{item.Month}</td>
                  <td>{item.Close.toFixed(2)}</td>
                  <td>{item.Prediction.toFixed(2)}</td>
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
