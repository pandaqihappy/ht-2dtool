/*
 * @Author: your name
 * @Date: 2020-04-20 17:34:25
 * @LastEditTime: 2020-05-12 14:23:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\events.js
 */
import { getNodeInfo } from './node'

export function initEvents (tp) {
    tp.on = initEvent(tp)
}

export function onDataDoubleClicked (data, cb) {
    let className = data.getClassName()
    switch(className) {
        case 'ht.Node':
            let info = getNodeInfo(data)
            cb(info)
            break
        case 'ht.Edge':
            break
    }
}

function initEvent (tp) {
    const graphView = tp._graphView
    return (type, cb) => {
        switch(type) {
            case 'dbClick':
                graphView.onDataDoubleClicked = data => {
                    onDataDoubleClicked(data, cb)
                }
        }
    }
}