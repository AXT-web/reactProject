import React from 'react'
import { Carousel, WingBlank, Flex, Grid } from 'antd-mobile';
import axios from 'axios'

import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

import './index.scss'

// 导航菜单的数据
const navs = [{
  id: 0,
  img: nav1,
  title: '整租',
  path: '/home/list'
}, {
  id: 1,
  img: nav2,
  title: '合租',
  path: '/home/list'
}, {
  id: 2,
  img: nav3,
  title: '地图找房',
  path: '/home/map'
}, {
  id: 3,
  img: nav4,
  title: '去出租',
  path: '/home/list'
}]

// 获取地理位置信息
navigator.geolocation.getCurrentPosition(position => {
  console.log('当前位置信息：', position)
})

export default class CityList extends React.Component {

  state = {
    // 轮播图状态
    swipers: [],
    // 轮播图数据是否加载完成
    isSwoperLoaded: false,
    // 租房小组状态
    groups: [],
    // 最新资讯
    news: [],
    // 当前城市名称
    curCityName: '上海'
  }

  // 声明周期钩子函数，修改状态，设置数据
  componentDidMount() {
    // 调用请求轮播图的方法
    this.getSwipers()
    this.getGroups()
    this.getNews()

    // 2 通过 IP 定位获取到当前城市名称。
    const curCity = new window.BMap.LocalCity()
    curCity.get(async res => {
      // console.log('当前城市信息：', res)
      const result = await axios.get(
        `http://localhost:8080/area/info?name=${res.name}`
      )
      // console.log(result)
      this.setState({
        curCityName: result.data.body.label
      })
    })
  }

  async getSwipers() {
    // 请求数据
    let { data: res } = await axios.get('http://localhost:8080/home/swiper')
    // 判断返回的状态是否是成功
    if (res.status !== 200) {
      console.error(res.description)
      return
    }
    // 把获取到的值设置给state
    this.setState({
      swipers: res.body,
      isSwoperLoaded: true
    })
  }
  async getGroups() {
    let { data: res } = await axios.get('http://localhost:8080/home/groups', {
      params: {
        'area': 'AREA%7C88cff55c-aaa4-e2e0'
      }
    })
    // 判断返回的状态是否是成功
    if (res.status !== 200) {
      console.error(res.description)
      return
    }
    // 把获取到的值设置给state
    this.setState({
      groups: res.body
    })
  }
  async getNews() {
    let { data: res } = await axios.get('http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    // 判断返回的状态是否是成功
    if (res.status !== 200) {
      console.error(res.description)
      return
    }
    // 把获取到的值设置给state
    this.setState({
      news: res.body
    })
  }

  // 渲染轮播图的逻辑模块
  renderSwipers() {
    return this.state.swipers.map(item => (
      <a
        key={item.id}
        href="http://www.itcast.cn"
        style={{ display: 'inline-block', width: '100%', height: 212 }}
      >
        <img
          src={`http://localhost:8080${item.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
        >
        </img>
      </a>
    ))
  }
  renderNavs() {
    return navs.map(item => (
      <Flex.Item
        key={item.id}
        onClick={() => this.props.history.push(item.path)}
      >
        <img src={item.img} alt="" />
        <h2>{item.title}</h2>
      </Flex.Item>
    ))
  }
  renderGrid(item) {
    return (
      <Flex className="group-item" justify="around">
        <div className="desc">
          <p className="title">{item.title}</p>
          <span className="info">{item.desc}</span>
        </div>
        <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
      </Flex>
    )
  }
  renderNews() {
    return this.state.news.map(item =>
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    )
  }

  render() {
    return (
      <div className="index">
        <div>
          {/* 搜索框 */}
          <Flex className="search-box">
            {/* 左侧白色区域 */}
            <Flex className="search">
              {/* 位置 */}
              <div
                className="location"
                onClick={() => this.props.history.push('/citylist')}
              >
                <span className="name">{this.state.curCityName}</span>
                <i className="iconfont icon-arrow" />
              </div>

              {/* 搜索表单 */}
              <div
                className="form"
                onClick={() => this.props.history.push('/search')}
              >
                <i className="iconfont icon-seach" />
                <span className="text">请输入小区或地址</span>
              </div>
            </Flex>
            {/* 右侧地图图标 */}
            <i
              className="iconfont icon-map"
              onClick={() => this.props.history.push('/map')}
            />
          </Flex>
        </div>

        <div className="swiper">
          {/* 轮播图数据加载完成才渲染轮播图 */}
          {this.state.isSwoperLoaded ? (
            <WingBlank>
              <Carousel
                // 自动切换
                autoplay={true}
                // 永久循环
                infinite
                // 自动切换速度
                autoplayInterval='2000'
              >
                {this.renderSwipers()}
              </Carousel>
            </WingBlank>
          ) : ('')}
        </div>

        {/* 导航菜单 */}
        <Flex className="nav">
          {this.renderNavs()}
        </Flex>

        {/* 租房小组 */}
        <div className="group">
          <h3 className="group-title">
            租房小组 <span className="more">更多</span>
          </h3>

          {/* 宫格组件 */}
          <Grid
            data={this.state.groups}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={item => (
              <Flex className="group-item" justify="around" key={item.id}>
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        {/* <div>
          {this.renderGrid}
        </div> */}

        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}
