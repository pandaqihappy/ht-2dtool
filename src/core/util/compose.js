/*
 * @Author: your name
 * @Date: 2020-04-17 14:36:59
 * @LastEditTime: 2020-04-17 16:43:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\util\compose.js
 */
/**
 * @description: 代码组合，传入函数从左至右执行
 * @param {Function} g 第一个执行函数，返回的结果传入第二个执行函数
 * @param {Function} f 第二个执行函数，返回处理结果
 * @return: 
 */
export const compose = function (f, g) { return function (x) { return f(g(x)); }; };