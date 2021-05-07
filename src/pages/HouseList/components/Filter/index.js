import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

import { API } from '../../../../utils/api.js'

/**
 * 标题高亮状态
 * true 表示高亮； false 表示不高亮
 */
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: true,
  more: false
}

// FilterPicker 和 FilterMore 组件的选中值
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus,
    // 控制FilterPicker或 FilterMore组件的展示和隐藏
    openType: "",
    // 所有筛选条件数据
    filtersData: {},
    // 筛选默认选中的状态值
    selectedValues
  }

  componentDidMount() {
    this.getFiltersData()
  }

  // 父元素提供子元素调用的函数
  onTitleClick = type => {
    const { titleSelectedStatus, selectedValues } = this.state;
    // 创建新的标题选中状态对象
    let newTitleSelectedStatus = { ...titleSelectedStatus };
    Object.keys(titleSelectedStatus).forEach(key => {
      // key表示数组中每一项
      if (key === type) {
        // 当前标题
        newTitleSelectedStatus[type] = true;
        return;
      }
      // 其他标题
      let selectedVal = selectedValues[key];
      if (
        (key === "area" && selectedVal.length !== 2) ||
        selectedVal[0] !== "area"
      ) {
        newTitleSelectedStatus[type] = true;
      } else if (key === "more" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[type] = true;
      } else if (key === "price" && selectedVal[0] !== "null") {
        newTitleSelectedStatus[type] = true;
      } else if (key === "more") {
        // 更多选择
      } else {
        newTitleSelectedStatus[type] = false;
      }
    });

    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: type
    });
  }
  // 取消,
  onCancel = type => {
    const { titleSelectedStatus, selectedValues } = this.state;
    let newTitleSelectedStatus = { ...titleSelectedStatus };
    let selectedVal = selectedValues[type];
    if (
      type === "area" &&
      (selectedVal.length !== 2 || selectedVal[0] !== "area")
    ) {
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && selectedVal[0] !== "null") {
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && selectedVal.length !== 0) {
      // 更多选择
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }
    // 隐藏对话框
    this.setState({
      openType: "",
      titleSelectedStatus: newTitleSelectedStatus
    });
  };
  // 保存，隐藏对话框
  onSave = (type, value) => {
    const { titleSelectedStatus } = this.state
    let newTitleSelectedStatus = { ...titleSelectedStatus }
    let selectedVal = value
    if (type === "area" && (selectedVal.length !== 2 || selectedVal[0] !== "area")) {
      newTitleSelectedStatus[type] = true;
    } else if (type === "mode" && (selectedVal.length !== 2 || selectedVal[0] !== "null")) {
      newTitleSelectedStatus[type] = true;
    } else if (type === "price" && (selectedVal.length !== 2 || selectedVal[0] !== "null")) {
      newTitleSelectedStatus[type] = true;
    } else if (type === "more" && (selectedVal.length !== 2 || selectedVal[0] !== 0)) {
      newTitleSelectedStatus[type] = true;
    } else {
      newTitleSelectedStatus[type] = false;
    }
    // 组拼数据格式
    let newSelectedValues = {
      ...selectedValues,
      [type]: value
    };
    const { area, mode, price, more } = newSelectedValues;
    // 筛选条件数据
    const filters = {};
    // 区域
    const areaKey = area[0];
    let areaValue = "null";
    if (area.length === 3) {
      areaValue = area[2] !== "null" ? area[2] : area[1];
    }
    filters[areaKey] = areaValue;
    // 方式和租金
    filters.mode = mode[0];
    filters.price = price[0];
    // more
    filters.more = more.join(",");

    // 调用父组件中的方法，来将筛选数据传递给父组件
    this.props.onFilter(filters)

    // 隐藏对话框
    this.setState({
      openType: '',
      // 更新菜单高亮状态数据
      titleSelectedStatus: newTitleSelectedStatus,
      selectedValues: newSelectedValues
    })
  }
  // 获取筛选数据
  async getFilterData() {
    const { value } = JSON.parse(localStorage.getItem("localCity"));
    const res = await API.get(`/houses/condition?id=${value}`);

    this.setState({
      filtersData: res.data.body
    })
  }

  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, subway, rentType, price },
      selectedValues
    } = this.state

    if (openType !== "area" && openType !== "mode" && openType !== "price")
      return null;

    let data = []
    // pickerView显示的列数
    let cols = 3
    let defaultValue = selectedValues[openType]
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
      default:
        data = null;
        cols = 0
        break
    }
    return (
      <FilterPicker
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        type={openType}
        defaultValue={defaultValue}
      />
    );
  }

  renderFilterMore() {
    // 获取对应数据 roomType，oriented，floor，characteristic
    const {
      openType,
      filtersData: { roomType, oriented, floor, characteristic }
    } = this.state;
    // 把数据封装到一个对象中，方便传递
    const data = {
      roomType,
      oriented,
      floor,
      characteristic
    };
    if (openType !== "more") {
      return null;
    }
    // 获取当前选中值传递个子组件filterMore
    let defaultValues = selectedValues.more
    // 传递给子组件
    return <FilterMore data={data} type={openType} onSave={this.onSave} defaultValues={defaultValues} onCancel={this.onCancel} />;
  }

  render() {
    let { titleSelectedStatus, openType } = this.state;
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {openType === 'area' || openType === 'mode' || openType === 'price' ? (
          <div className={styles.mask} onClick={this.onCancel} />
        ) : null}

        <div className={styles.content}>
          {/* 标题栏 */}{" "}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
