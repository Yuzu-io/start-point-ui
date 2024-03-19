export interface RoleInfo {
  id: string

  /*角色名称 */
  roleName: string

  /*权限字符 */
  roleKey: string

  /*状态 */
  status: string

  /*排序 */
  orderIndex: string

  /*创建时间 */
  createTime: string

  /*修改时间 */
  updateTime: string

  /*权限菜单列表 */
  routesIdList: string[]
}