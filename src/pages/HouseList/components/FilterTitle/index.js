import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

export default function FilterTitle({titleSelectedStatus}) {
  return (
    <Flex align="center" className={styles.root}>
      {/* 遍历标题数组 */}
      {titleList.map(item => {
        // 获取父组件传递过来的状态
        let isSelected = titleSelectedStatus[item.type];
        return (
          <Flex.Item key={item.type}>
            {/* 选中类名： selected */}{" "}
            <span
              className={[
                styles.dropdown,
                // 判断当前的标题是否是选中状态，如果是，设置选中的样式
                isSelected ? styles.selected : ""
              ].join(" ")}
            >
              <span>{item.title}</span> <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        );
      })}
    </Flex>
  );
}