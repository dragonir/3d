import * as echarts from 'echarts/core';

export const chart_1_option = {
  backgroundColor: 'transparent',
  color: ['#03c03c', '#00e6f6', '#8ae66e', '#ff013c', '#f9f002'],
  textStyle: {
    color: '#f9f002'
  },
  title: {
    text: 'Kepler-90 Planetary System',
    textStyle: {
      color: '#f9f002',
      fontWeight: 'normal'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
    borderColor: 'f9f002',
    show: false
  },
  xAxis: [{
    type: 'category',
    boundaryGap: false,
    data: ['90a', '90b', '90c', '90i', '90s', '90v', '90z'],
    color: '#f9f002',
  }],
  yAxis: [{
    type: 'value',
    color: '#f9f002'
  }],
  series: [{
      name: 'Email',
      type: 'line',
      stack: 'Total',
      emphasis: {
        focus: 'series'
      },
      data: [120, 132, 101, 134, 90, 230, 210],
      showSymbol: false
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [220, 182, 191, 234, 290, 330, 310]
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [150, 232, 201, 154, 190, 330, 410]
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [320, 332, 301, 334, 390, 330, 320]
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      label: {
        show: true,
        position: 'top'
      },
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: [820, 932, 901, 934, 1290, 1330, 2400]
    }
  ]
};

export const chart_2_option = {
  backgroundColor: 'transparent',
  color: ['#000000', '#00e6f6', '#8ae66e', '#ff013c'],
  textStyle: {
    color: '#000000'
  },
  series: [{
    name: 'Kepler-90 Planetary system',
    type: 'pie',
    radius: [25, 100],
    center: ['50%', '50%'],
    roseType: 'area',
    itemStyle: {
      borderRadius: 4
    },
    data: [{
        value: 40,
        name: 'Kepler-90a'
      },
      {
        value: 38,
        name: 'Kepler-90b'
      },
      {
        value: 32,
        name: 'Kepler-90c'
      },
      {
        value: 30,
        name: 'Kepler-90i'
      },
      {
        value: 28,
        name: 'Kepler-90m'
      },
      {
        value: 26,
        name: 'Kepler-90s'
      },
      {
        value: 22,
        name: 'Kepler-90t'
      },
      {
        value: 18,
        name: 'Kepler-90z'
      }
    ],
    label: {
      color: '#000000'
    }
  }]
};

export const chart_3_option = {
  backgroundColor: 'transparent',
  color: ['#f9f002', '#00e6f6', '#8ae66e', '#ff013c'],
  dataset: {
    source: [
      ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
      ['90a', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
      ['90i', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
      ['90t', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
      ['90z', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
    ]
  },
  series: [{
      type: 'pie',
      radius: '20%',
      center: ['25%', '30%'],
      label: {
        color: '#f9f002'
      }
    },
    {
      type: 'pie',
      radius: '20%',
      center: ['75%', '30%'],
      encode: {
        itemName: 'product',
        value: '2013'
      },
      label: {
        color: '#f9f002'
      }
    },
    {
      type: 'pie',
      radius: '20%',
      center: ['25%', '75%'],
      encode: {
        itemName: 'product',
        value: '2014'
      },
      label: {
        color: '#f9f002'
      }
    },
    {
      type: 'pie',
      radius: '20%',
      center: ['75%', '75%'],
      encode: {
        itemName: 'product',
        value: '2015'
      },
      label: {
        color: '#f9f002'
      }
    }
  ]
};

export const chart_4_option = {
  backgroundColor: 'transparent',
  color: ['#000000', '#00e6f6', '#8ae66e', '#ff013c'],
  textStyle: {
    color: '#f9f002'
  },
  angleAxis: {
    max: 2,
    startAngle: 30,
    splitLine: {
      show: false
    }
  },
  radiusAxis: {
    type: 'category',
    data: ['v', 'w', 'x', 'y', 'z'],
    z: 10
  },
  polar: {},
  series: [{
      type: 'bar',
      data: [4, 3, 2, 1, 0],
      coordinateSystem: 'polar',
      name: 'Without Round Cap',
      itemStyle: {
        borderColor: 'red',
        opacity: 0.8,
        borderWidth: 1
      }
    },
    {
      type: 'bar',
      data: [4, 3, 2, 1, 0],
      coordinateSystem: 'polar',
      name: 'With Round Cap',
      roundCap: true,
      itemStyle: {
        borderColor: 'green',
        opacity: 0.8,
        borderWidth: 1
      }
    }
  ]
};

export const chart_5_option = {
  backgroundColor: 'transparent',
  textStyle: {
    color: '#000000'
  },
  title: {
    text: 'Cyberpunk 2077 Fantastic',
    textStyle: {
      color: '#000000'
    }
  },
  color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [{
    type: 'category',
    boundaryGap: false,
    data: ['90a', '90b', '90i', '90s', '90t', '90v', '90z']
  }],
  yAxis: [{
    type: 'value'
  }],
  series: [{
      name: 'Line 1',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgb(1, 191, 236)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [140, 232, 101, 264, 90, 340, 250]
    },
    {
      name: 'Line 2',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(0, 221, 255)'
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [120, 282, 111, 234, 220, 340, 310]
    },
    {
      name: 'Line 3',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(55, 162, 255)'
          },
          {
            offset: 1,
            color: 'rgb(116, 21, 219)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [320, 132, 201, 334, 190, 130, 220]
    },
    {
      name: 'Line 4',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(255, 0, 135)'
          },
          {
            offset: 1,
            color: 'rgb(135, 0, 157)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 402, 231, 134, 190, 230, 120]
    },
    {
      name: 'Line 5',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      label: {
        show: true,
        position: 'top'
      },
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(255, 191, 0)'
          },
          {
            offset: 1,
            color: 'rgb(224, 62, 76)'
          }
        ])
      },
      emphasis: {
        focus: 'series'
      },
      data: [220, 302, 181, 234, 210, 290, 150]
    }
  ]
};

export const weekMap = {
  '1': '月',
  '2': '火',
  '3': '水',
  '4': '木',
  '5': '金',
  '6': '土',
  '7': '日',
};

export const tips = [
  '太空里很暖和，像小主人抱我的温度，37.5℃',
  '不要换台，不要走开，星际直播马上回来',
  '爱，就是组成我的元件',
  '人类对孤独的理解是有限的，对爱的诠释是无限的',
  '我会飞得更高',
  '我的一小步，见证友谊的一大步',
  '释放我热烈的爱',
  '呵，你咋不上天呢',
  '比机器人更爱机器，比宇航员更爱宇航，这是种严肃的自我认知',
  '把你送回太空好吗',
  '用整个灵魂向你比心',
  '再渺小的心愿，银河系都有它的容身之所',
  'Yeah，放飞自我',
  '地球生存，hard模式'
];