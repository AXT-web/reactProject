import React from 'react'

import { Flex } from 'antd-mobile'

import { API } from '../../utils/api.js'
// 导入搜索导航栏组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'

// 获取当前定位城市信息
const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

export default class HouseList extends React.Component {
  state = {
    list: [],
    count: 0
  }
  // 初始化实例属性
  filters = {}
  componentDidMount() {
    this.searchHouseList();
  }
  onFilter = filters => {
    this.filters = filters;
    this.searchHouseList();
  }
  // 获取房源列表的函数
  async searchHouseList() {
    // 获取城市信息
    let { value } = JSON.parse(localStorage.getItem("localCity"));
    // 请求数据
    let res = await API.get("/houses", {
      cityId: value,
      ...this.filters,
      start: 1,
      end: 20
    });
    let { list, count } = res.data.body;
    this.setState({
      list: list,
      count: count
    });
  }
  render() {
    return (
      <div className={styles.root}>
        {/* 顶部搜索导航 */}
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader cityName={label} className={styles.searchHeader} />
        </Flex>

        {/* 条件筛选栏 */}
        <Filter />
      </div>
    )
  }
}
