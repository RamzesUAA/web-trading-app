import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as signalR from '@microsoft/signalr';

const MarketDepthChart = () => {
  const [marketDepthData, setMarketDepthData] = useState(null);
  const [userBtcAmount, setUserBtcAmount] = useState(0);
  const [userQuote, setUserQuote] = useState(0);
  const [hubConnection, setHubConnection] = useState(null);

  const calculateQuote = () => {
    if (!marketDepthData || !userBtcAmount) return;

    const bestAskPrice = marketDepthData.asks[0][0];
    setUserQuote(bestAskPrice * userBtcAmount);
  };
console.log(process.env.REACT_APP_SIGNALR_CONNECTION)
  useEffect(() => {
    const newHubConnection = new signalR.HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_SIGNALR_CONNECTION + "orderbookhub")
      .configureLogging(signalR.LogLevel.Information)
      .build();


    setHubConnection(newHubConnection);

    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (hubConnection) {
      hubConnection
        .start()
        .then(() => {
          console.log('Connection established.');
          hubConnection.on('ReceiveOrderBookUpdate', (orderBook) => {
            const bids = orderBook.bids.slice(0, 200).map(([price, volume]) => [price, volume]);
            const asks = orderBook.asks.slice(0, 200).map(([price, volume]) => [price, volume]);
            setMarketDepthData({ bids, asks });
          });
        })
        .catch((error) => {
          console.error('Error establishing connection:', error);
        });
    }
  }, [hubConnection]);

  useEffect(() => {
    calculateQuote();
  }, [marketDepthData, userBtcAmount]);

  const handleBtcAmountChange = (event) => {
    setUserBtcAmount(parseFloat(event.target.value));
    calculateQuote();
  };

  const options = {
    chart: {
      type: 'area',
      zoomType: 'xy'
    },
    title: {
      text: 'BTC-EUR Market Depth'
    },
    xAxis: {
      minPadding: 0,
      maxPadding: 0,
      plotLines: [{
        color: '#888',
        value: 0.1523,
        width: 1,
        label: {
          text: 'Actual price',
          rotation: 90
        }
      }],
      title: {
        text: 'Price'
      }
    },
    yAxis: [{
      lineWidth: 1,
      gridLineWidth: 1,
      title: null,
      tickWidth: 1,
      tickLength: 5,
      tickPosition: 'inside',
      labels: {
        align: 'left',
        x: 8
      }
    }, {
      opposite: true,
      linkedTo: 0,
      lineWidth: 1,
      gridLineWidth: 0,
      title: null,
      tickWidth: 1,
      tickLength: 5,
      tickPosition: 'inside',
      labels: {
        align: 'right',
        x: -8
      }
    }],
    legend: {
      enabled: false
    },
    plotOptions: {
      area: {
        fillOpacity: 0.2,
        lineWidth: 1,
        step: 'center'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size=10px;">Price: {point.key}</span><br/>',
      valueDecimals: 2
    },
    series: [{
      name: 'Bids',
      data: marketDepthData?.bids ?? [],
      color: '#03a7a8'
    },
    {
      name: 'Asks',
      data: marketDepthData?.asks ?? [],
      color: '#fc5857'
    }]
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Enter BTC amount"
        value={userBtcAmount}
        onChange={handleBtcAmountChange}
      />
      <p>Quote: {userQuote.toFixed(2)} EUR</p>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default MarketDepthChart;
