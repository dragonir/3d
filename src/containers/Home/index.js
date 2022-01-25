import React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MediaCard from '../../components/MediaCard/index';
import Grid from '@mui/material/Grid';
import cityImage from './images/city.png';
import panoramicImage from './images/panoramic.png';
import metaImage from './images/meta.png';
import earthImage from './images/earth.png';
import cellImage from './images/cell.png';
import lunarImage from './images/lunar.png';
import zeldaImage from './images/zelda.png';
import zeldaMapImage from './images/zelda_map.png';
import scanImage from './images/scan.png';
import carImage from './images/car.png';
import developingImage from './images/developing.png';
import segmentFaultImage from './images/segmengfault.png';
import humanImage from './images/human.png';
import './index.css';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const workList = [
  {
    link: '#/city',
    title: '数字城市',
    description: '🏙 3D数字城市 【⚠优化中】',
    image: cityImage,
    three: true
  },
  {
    link: 'https://dragonir.github.io/3d-meta-logo/',
    title: '脸书Meta元宇宙Logo',
    description: '🪐 Three.js + Blender 实现炫酷的Facebook元宇宙Logo.',
    image: metaImage,
    three: true
  },
  {
    link: 'https://dragonir.github.io/3d-panoramic-vision/',
    title: '全景侦探小游戏',
    description: '🕵️‍ 使用Three.js全景功能实现侦探小游戏。',
    image: panoramicImage,
    three: true
  },
  {
    link: '#/lunar',
    title: '虎年春节创意',
    description: '🐅 2022虎虎生威！',
    image: lunarImage,
    three: true
  },
  {
    link: '#/segmentfault',
    title: 'SegmentFault突破1000粉纪念',
    description: '🏆 1000+ followers ！',
    image: segmentFaultImage,
    three: true
  },
  {
    link: '#/human',
    title: 'Metahuman',
    description: '👦 元宇宙数字人类【⚠优化中】',
    image: humanImage,
    three: true
  },
  {
    link: '#/earth',
    title: '地球',
    description: '🌏 尽情探索3D Low Poly数字地球吧！【⚠优化中】',
    image: earthImage,
    three: true
  },
  {
    link: '#/cell',
    title: '动植物细胞结构',
    description: '👻 可以查看动物细胞和植物细胞的内部组成结构。【⚠优化中】',
    image: cellImage,
    three: true
  },
  {
    link: 'https://dragonir.github.io/zelda-map/',
    title: '塞尔达：旷野之息地图',
    description: '🗺 在地图上标记神庙、查询回忆点！',
    image: zeldaMapImage,
  },
  {
    link: 'https://dragonir.github.io/h5-scan-qrcode/',
    title: '浏览器扫码',
    description: '📷 使用原生浏览器就可以在h5页面实现扫码功能了，试试看！',
    image: scanImage,
  },
  {
    link: '#/car',
    title: 'Lamborghini Centenario LP-770',
    description: '📷车辆模型展示【⚠优化中】',
    image: carImage,
    three: true
  },
  {
    link: '#/zelda',
    title: '塞尔达：旷野之息3D',
    description: '📷 林克【⚠优化中】',
    image: zeldaImage,
    three: true
  },
  {
    link: '#/',
    title: '远航：无尽的拉格朗日',
    description: '开发中...',
    image: developingImage,
    three: true
  },
  {
    link: '#/',
    title: '探索：无人深空',
    description: '开发中...',
    image: developingImage,
    three: true
  },
  {
    link: '#/',
    title: '着陆：失落的星球',
    description: '开发中...',
    image: developingImage,
    three: true
  },
  {
    link: '#/',
    title: '航巡：迷失在黑洞',
    description: '开发中...',
    image: developingImage,
    three: true
  }
];

export default class Home extends React.Component {
  render () {
    return (
      <div className="home" style={{ padding: '24px'}}>
        <Box>
          <h1 className="page_title">dragonir's work list</h1>
        </Box>
        <Box sx={{ width: '100%' }} style={{ maxWidth: '1200px', margin: 'auto' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {workList.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Item elevation={0} className="grid_item">
                  {item.three ? (<i className="three_logo"></i>) : '' }
                  <MediaCard link={item.link} title={item.title} image={item.image} description={item.description} />
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    )
  }
}