import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { getOrderBook } from '../backend/api';

const MarketDepthChart = () => {
  const [marketDepthData, setMarketDepthData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOrderBook();
        const bids = response.bids.slice(0, 500).map(([price, volume]) => [price, volume]);
        const asks = response.asks.slice(0, 500).map(([price, volume]) => [price, volume]);
  
        setMarketDepthData({bids, asks});
      } catch (error) {
        console.error('Error fetching market depth data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    chart: {
      type: 'area',
      zoomType: 'xy'
    },
    title: {
      text: 'ETH-BTC Market Depth'
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

  console.log(marketDepthData?.bids)

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default MarketDepthChart;
