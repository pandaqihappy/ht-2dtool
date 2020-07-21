/*
 * @Author: your name
 * @Date: 2020-04-20 16:47:46
 * @LastEditTime: 2020-04-24 15:28:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\util\util.js
 */
export function uuid() {
    let len = 32
    let $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz23456789'
    let maxPos = $chars.length
    let pwd = ''
    while (len > 0) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
        len--
    }
    return pwd
}

export function isDom(HTMLDom) {
    let isDOM = (typeof HTMLElement === 'object') ?
        function (obj) {
            return obj instanceof HTMLElement
        } :
        function (obj) {
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'
        }
    return isDOM(HTMLDom)
}