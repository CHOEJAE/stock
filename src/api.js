import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [stockName, setStockName] = useState(""); 
  const [statistics, setStatistics] = useState([]); 
  const [graph, setGraph] = useState(""); 
  const [news, setNews] = useState([]);

  const fetchStockData = async () => {
    try {
      const analyzeResponse = await axios.get('http://127.0.0.1:5000/api/stock/analyze', {
        params: {
          stockName,
      
        },
      });

      setStatistics(analyzeResponse.data.statistics || []);
      setGraph(analyzeResponse.data.visualization || "");

      const newsResponse = await axios.get('http://127.0.0.1:5000/api/news', {
        params: { stockName },
      });

      setNews(newsResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="App">
      <h1>주식 분석</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="주식 이름"
          value={stockName}
          onChange={(e) => setStockName(e.target.value)}
        />
      
       
        <button onClick={fetchStockData}>데이터 가져오기</button>
      </div>

      <div className="result-section">
        {graph && <img src={`data:image/png;base64,${graph}`} alt="Graph" />}
        {statistics.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Mean</th>
                <th>Std Dev</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((stat, index) => (
                <tr key={index}>
                  <td>{stat.Month}</td>
                  <td>{stat.mean}</td>
                  <td>{stat.std}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {news.length > 0 && (
          <div className="news-section">
            <h2>관련 뉴스</h2>
            <ul>
              {news.map((item, index) => (
                <li key={index}>
                  <strong>{item.title}</strong> - {item.date}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
