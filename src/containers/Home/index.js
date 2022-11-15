import './index.styl';
import React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MediaCard from '../../components/MediaCard/index';
import Grid from '@mui/material/Grid';
import developingImage from './images/developing.png';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const workList = [
  {
    link: '#/human',
    title: 'Metahuman',
    description: '👦 元宇宙数字人类【⚠优化中】',
    image: require('@/containers/Home/images/human.png'),
    three: true
  },
  {
    link: '#/shadow',
    title: '光与影之诗',
    description: '🗿 光影效果构成创意页面',
    image: require('@/containers/Home/images/shadow.png'),
    three: true
  },
  {
    link: '#/rickAndMorty',
    title: 'Rick And Morty',
    description: '🛸 瑞克和莫蒂着色器',
    image: require('@/containers/Home/images/rick_and_morty.gif'),
    three: true
  },
  {
    link: '#/gravity',
    title: '地心引力',
    description: '👨‍🚀 迷失太空',
    image: require('@/containers/Home/images/gravity.gif'),
    three: true
  },
  {
    link: '#/olympic',
    title: '2022冬奥会3D趣味页面',
    description: '🐼 萌萌的冰墩墩和雪容融送给大家！',
    image: require('@/containers/Home/images/olympic.png'),
    three: true
  },
  {
    link: '#/fans',
    title: '掘金1000粉！！！',
    description: '🏆 谢谢关注',
    image: require('@/containers/Home/images/fans.png'),
    three: true
  },
  {
    link: '#/ocean',
    title: '梦中情岛',
    description: '🌊 缤纷夏日3D梦中情岛！',
    image: require('@/containers/Home/images/ocean.png'),
    three: true
  },
  {
    link: '#/ring',
    title: '艾尔登法环Logo',
    description: '🔥 火焰效果老头环 ？？？',
    image: require('@/containers/Home/images/ring.png'),
    three: true
  },
  {
    link: '#/earth',
    title: '地球',
    description: '🌏 宇宙中孤独的蔚蓝色星球！',
    image: require('@/containers/Home/images/earth.png'),
    three: true
  },
  {
    link: '#/metaverse',
    title: '阿狸的多元宇宙',
    description: '🦊 阿狸的星际旷野之息！',
    image: require('@/containers/Home/images/metaverse.png'),
    three: true
  },
  {
    link: '#/floating',
    title: '悬浮文字',
    description: '🎋 Fantastic floating text',
    image: require('@/containers/Home/images/floating.png'),
    three: true
  },
  {
    link: '#/earthDigital',
    title: '赛博朋克2077风格数字地球',
    description: '🆒 Cyberpunk!!!',
    image: require('@/containers/Home/images/earthDigital.png'),
    three: true
  },
  {
    link: '#/comic',
    title: '3D漫画',
    description: '🕷 spider man',
    image: require('@/containers/Home/images/comic.png'),
    three: true
  },
  {
    link: '#/scroll',
    title: '基于滚动的3D布局',
    description: '🥑 Gsap 动画应用！',
    image: require('@/containers/Home/images/scroll.png'),
    three: true
  },
  {
    link: '#/city',
    title: '数字城市',
    description: '🏙 3D数字城市 【⚠优化中】',
    image: require('@/containers/Home/images/city.png'),
    three: true
  },
  {
    link: '#/tennis',
    title: '网球',
    description: '🎾 物理效果模拟',
    image: require('@/containers/Home/images/tennis.png'),
    three: true
  },
  {
    link: 'https://dragonir.github.io/3d-meta-logo/',
    title: '脸书Meta元宇宙Logo',
    description: '🪐 Three.js + Blender 实现炫酷的Facebook元宇宙Logo.',
    image: require('@/containers/Home/images/meta.png'),
    three: true
  },
  {
    link: '#/lunar',
    title: '虎年春节创意',
    description: '🐅 2022虎虎生威！',
    image: require('@/containers/Home/images/lunar.png'),
    three: true
  },
  {
    link: 'https://dragonir.github.io/3d-panoramic-vision/',
    title: '全景侦探小游戏',
    description: '🕵️‍ 使用Three.js全景功能实现侦探小游戏。',
    image: require('@/containers/Home/images/panoramic.png'),
    three: true
  },
  {
    link: '#/segmentfault',
    title: 'SegmentFault突破1000粉纪念',
    description: '🏆 1000+ followers ！',
    image: require('@/containers/Home/images/segmengfault.png'),
    three: true
  },
  {
    link: '#/live',
    title: '虚拟主播',
    description: '💃 虚拟主播初音未来【⚠优化中】',
    image: require('@/containers/Home/images/live.png'),
    three: true
  },
  {
    link: '#/cell',
    title: '动植物细胞结构',
    description: '👻 可以查看动物细胞和植物细胞的内部组成结构。【⚠优化中】',
    image: require('@/containers/Home/images/cell.png'),
    three: true
  },
  {
    link: '#/car',
    title: 'Lamborghini Centenario LP-770',
    description: '📷车辆模型展示【⚠优化中】',
    image: require('@/containers/Home/images/car.png'),
    three: true
  },
  {
    link: '#/zelda',
    title: '塞尔达：旷野之息3D',
    description: '📷 林克【⚠优化中】',
    image: require('@/containers/Home/images/zelda.png'),
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
  },
  {
    link: 'https://dragonir.github.io/h5-scan-qrcode/',
    title: '浏览器扫码',
    description: '📷 使用原生浏览器就可以在h5页面实现扫码功能了，试试看！',
    image: require('@/containers/Home/images/scan.png'),
  },
  {
    link: 'https://dragonir.github.io/zelda-map/',
    title: '塞尔达：旷野之息地图',
    description: '🗺 在地图上标记神庙、查询回忆点！',
    image: require('@/containers/Home/images/zelda_map.png'),
  }
];

export default class Home extends React.Component {
  render () {
    return (
      <div className="home_page" style={{ padding: '24px'}}>
        <Box>
          <h1 className="page_title">3D Example List</h1>
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