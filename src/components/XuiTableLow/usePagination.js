/*
 * @Author: zjhoo
 * @Date: 2023-09-04 14:34:13
 * @LastEditors: zjhoo
 * @LastEditTime: 2023-09-10 11:23:05
 * @Description: 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
import { reactive } from "vue"

// interface DefaultPaginationData {
//   total: number
//   currentPage: number
//   pageSizes: number[]
//   pageSize: number
//   layout: string
// }

// interface PaginationData {
//   total?: number
//   currentPage?: number
//   pageSizes?: number[]
//   pageSize?: number
//   layout?: string
// }

/** 默认的分页参数 */
const defaultPaginationData = {
  total: 100,
  currentPage: 1,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  layout: "total, sizes, prev, pager, next, jumper"
}

export function usePagination(initialPaginationData) {
  /** 合并分页参数 */
  const paginationData = reactive({ ...defaultPaginationData, ...initialPaginationData })
  /** 改变当前页码 */
  const handleCurrentChange = (value) => {
    paginationData.currentPage = value
  }
  /** 改变页面大小 */
  const handleSizeChange = (value) => {
    paginationData.currentPage = 1
    paginationData.pageSize = value
  }

  return { paginationData, handleCurrentChange, handleSizeChange }
}
