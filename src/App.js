import React, { useState } from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
function App() {
    const [symbol, setSymbol] = useState("");
    const [stockData, setStockData] = useState(null);
    const [error, setError] = useState(null);
    const [results,setResults] = useState(null);
    const today = new Date();
    const year = today.getFullYear()-1;
    const month = String(today.getMonth()+1).padStart(2,'0');
    const day = String(today.getDate()).padStart(2,'0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateto = new Date();
    dateto.setDate(dateto.getDate()+32);
    const toyear = dateto.getFullYear()-1;
    const tomonth = String(dateto.getMonth()+1).padStart(2,'0');
    const tday = String(dateto.getDate()).padStart(2,'0');
    const formattedto = `${toyear}-${tomonth}-${tday}`;
    console.log(formattedto);
    const fetchStockData = async () => {
        setError(null);
        setStockData(null);

        try {
            const response = await fetch(`https://api.polygon.io/v1/open-close/${symbol}/${formattedDate}?adjusted=true&apiKey=AyzaOO4pE0jAcyxWsoV0vcc4kH2joFPN`);
            if (!response.ok) {
                throw new Error("Failed to fetch stock data");
            }
            const data = await response.json();
            const res = await fetch(`https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${formattedDate}/${formattedto}?adjusted=true&sort=asc&limit=30&apiKey=AyzaOO4pE0jAcyxWsoV0vcc4kH2joFPN`)
            const res_data = await res.json();
            setResults(res_data.results);
            setStockData(data);
            console.log(data)
        } catch (err) {
            setError(err.message);
        }
    };
    const chartData = results&&results.map((item) => ({
      date: new Date(item.t).toLocaleDateString("en-US"),
      close: item.c,
      high: item.h,
      low: item.l,
      volume: item.v,
    }));
    console.log(chartData);
    const StockChart = () => {
      return (
        <div style={{ width: "100%", height: 400 }}>
          <h3 style={{ textAlign: "center" }}>Stock Closing Prices</h3>
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="close" stroke="#8884d8" name="Closing Price" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    };
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Real-Time Stock Market Application</h1>
            <h3>Track Stock Here</h3>
            <input
                type="text"
                placeholder="Stock Symbol (e.g., IBM)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />
            <button onClick={fetchStockData}>Get Stock</button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <h3>{stockData&&stockData.from}</h3>
            {stockData && (
                <div style={{ marginTop: "20px" }}>
                    <p>Company: {stockData.symbol}</p>
                    <p>Current Price: ${stockData.open}</p>
                    <p>High Price: ${stockData.high}</p>
                    <p>Low Price: ${stockData.low}</p>
                    <p>Open Price: ${stockData.close}</p>
                    <p>Previous Close: ${stockData.volume}</p>
                </div>
            )}
           {StockChart()}
        </div>
    );
}

export default App;
