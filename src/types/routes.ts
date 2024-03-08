export interface RoutesInfo {
  /*路由编号 */
  id: string

  /*页面标题 */
  title: string

  /*图标 */
  icon: string

  /*路由地址 */
  fullPath: string

  /*组件路径 */
  componentPath: string

  /*父级菜单编号  */
  parentId: string

  /*显示状态 */
  showStatus: string

  /*是否为外链 */
  isExternalLink: string

  /*是否缓存 */
  keepAlive: string

  /*状态 */
  status: string

  /*重定向 */
  redirect: string

  /*菜单类型 */
  type: string

  /*排序 */
  orderIndex: number

  /*创建时间 */
  createTime: string

  /*修改时间 */
  updateTime: string
}

// 响应接口
export interface RoutesInfoRes extends RoutesInfo {
  /*路由子项 */
  children: RoutesInfoRes[]
}
