/*
 * @Author: your name
 * @Date: 2020-04-26 09:46:51
 * @LastEditTime: 2020-05-22 17:06:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\util\debug.js
 */
 /**
  * @description: 告警函数
  * @param {String} sm 告警信息 
  * @return: 
  */
 export const warn = (sm, tp) => {
     console.error(`[HtTool]: ${sm}`)
 }