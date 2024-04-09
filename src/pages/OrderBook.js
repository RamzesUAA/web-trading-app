import React, { useState, useEffect } from 'react';
import { getOrderBook } from '../backend/api';

const OrderBook = () => {
  const [marketDepthData, setMarketDepthData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrderBook();
        setMarketDepthData(response);
      } catch (error) {
        console.error('Error fetching market depth data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Market Depth</h2>
      <div>
        <div>
          <h3>Bids</h3>
          <ul>
            {marketDepthData &&
              marketDepthData.bids.map((bid, index) => (
                <li key={index}>
                  Price: {bid[0]} | Volume: {bid[1]}
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h3>Asks</h3>
          <ul>
            {marketDepthData &&
              marketDepthData.asks.map((ask, index) => (
                <li key={index}>
                  Price: {ask[0]} | Volume: {ask[1]}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
