import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

/**
 * 标题高亮状态
 */
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: true,
  more: false
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制FilterPicker或 FilterMore组件的展示和隐藏
    openType: "",
    // 所有筛选条件数据
    filtersData: {}
  }
  // 父元素提供子元素调用的函数
  onTitleClick = type => {
    this.setState(prevState => {
      return {
        titleSelectedStatus: {
          // 获取当前对象中所有属性的值
          ...prevState.titleSelectedStatus,
          [type]: true
        },
        // 展示对话框
        openType: type
      }
    })
  }
  // 取消,
  onCancel = () => {
    // 隐藏对话框
    this.setState({
      openType: ''
    })
  }
  // 保存，隐藏对话框
  onSave = () => {
    this.setState({
      openType: ""
    })
  }
  // 获取筛选数据
  async getFilterData() {
    let { value } = JSON.parse(localStorage.getItem("localCity"));
    let res = await instance.get(`/houses/condition?id=${value}`);
    console.log(res);
    this.setState({
      filtersData: res.data.body
    })
  }

  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price }
    } = this.state
    if (openType !== "area" && openType !== "mode" && openType !== "price")
      return null;
    let data = [];
    // pickerView显示的列数
    let cols = 3
    switch (openType) {
      case "area":
        // 区域数据
        data = [area, subway];
        break;
      case "mode":
        // 方式数据
        data = rentType;
        cols = 1
        break;
      case "price":
        // 租金数据
        data = price;
        cols = 1
        break;
    }
    return (
      <FilterPicker onCancel={this.onCancel} onSave={this.onSave} data={data} cols={cols} type={openType} />
    );
  }
  render() {
    let { titleSelectedStatus, openType } = this.state;
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <div className={styles.mask} onClick={this.onCancel} />
        ) : null}
        {/* 标题栏 */}{" "}
        <FilterTitle
          titleSelectedStatus={titleSelectedStatus}
          onClick={this.onTitleClick}
        />

        {/* 前三个菜单对应的内容： */}
        {this.renderFilterPicker()}

        {/* 最后一个菜单对应的内容： */}
        <FilterMore />
      </div>
    )
  }
}
