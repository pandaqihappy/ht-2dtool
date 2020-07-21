/*
 * @Author: your name
 * @Date: 2020-04-14 13:58:04
 * @LastEditTime: 2020-04-15 09:29:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\util\abserve.js
 */

 export const watcher = (object, onChange) => {
    const handler = {
      get(target, property, receiver) {
        try {
          return new Proxy(target[property], handler)
        } catch (err) {
          return Reflect.get(target, property, receiver)
        }
      },
      set(target, key, value, receiver) {
        onChange(value);
        return Reflect.set(target, key, value, receiver)
      }
    }
    return new Proxy(object, handler)
  }