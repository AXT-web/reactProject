import React from 'react'
import { Route } from 'react-router-dom'
// 导入 TabBar
import { TabBar } from 'antd-mobile'

import Index from '../Index'
import HouseList from '../CityList'
import News from '../News'
import Profile from '../Profile'

// 导入自定义的样式
import './index.css'
import Item from 'antd-mobile/lib/popover/Item'

const tabItems = [{
  title: '首页',
  icon: 'icon-ind',
  path: '/home/index'
},
{
  title: '找房',
  icon: 'icon-findHouse',
  path: '/home/list'
},
{
  title: '资讯',
  icon: 'icon-infom',
  path: '/home/news'
},
{
  title: '我的',
  icon: 'icon-my',
  path: '/home/profile'
}]

export default class Home extends React.Component {
  state = {
    // 选中的菜单项,记录当前的pathname来匹配对应的tab
    selectedTab: this.props.location.pathname,
    // 用于控制TabBar的展示和隐藏。这个值应该是false，也就是不隐藏！
    hidden: false,
    // 全屏
    fullScreen: false
  }

    // 渲染 TabBar.Item
    renderTabBarItem() {
      return tabItems.map(item => (
        <TabBar.Item
          title={item.title}
          key={item.title}
          icon={<i className={`iconfont ${item.icon}`} />}
          selectedIcon={<i className={`iconfont ${item.icon}`} />}
          selected={this.state.selectedTab === item.path}
          onPress={() => {
            this.setState({
              selectedTab: item.path
            })
  
            // 路由切换
            this.props.history.push(item.path)
          }}
        />
      ))
    }

  renderTabBarItem() {
    return tabItems.map(item => {
      return (
        <TabBar.Item
          title={item.title}
          key={item.title}
          /*默认的图标*/
          icon={
            <i className="iconfont icon-ind"></i>
          }
          /*选中图标*/
          selectedIcon={
            <i className="iconfont icon-ind"></i>
          }
          selected={this.state.selectedTab === item.path}
          onPress={() => {
            this.setState({
              selectedTab: item.path,
            });
            {/* 切换路由 */ }
            this.props.history.push(item.path)
          }}
        >
        </TabBar.Item>
      )
    })
  }

  render() {
    return (
      <div style={{ backgroundColor: 'skyblue', padding: 10 }}>
        {/* 2.3 渲染子路由 */}
        <Route exact path="/home/index" component={Index}></Route>
        <Route path="/home/list" component={HouseList}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        {/* TabBar */}
        <div
          style={
            this.state.fullScreen
              ? { position: 'fixed', height: '100%', width: '100%', top: 0 }
              : { height: 400 }
          }
        >
          <TabBar
            // 未选中的颜色
            unselectedTintColor="#000"
            // 选中的颜色
            tintColor="skyblue"
            barTintColor="white"
            // noRenderContent={true}
          >
            {this.renderTabBarItem()}
          </TabBar>
        </div>
      </div>
    )
  }
}
