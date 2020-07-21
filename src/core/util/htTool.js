/*
 * @Author: your name
 * @Date: 2020-04-16 16:16:55
 * @LastEditTime: 2020-05-13 10:33:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\util\htTool.js
 */
import { warn } from './index'

export function zoomIn (graphView) {
    graphView.zoomIn(true)
}

export function zoomOut (graphView) {
    graphView.zoomOut(true)
}

export function fitContent (graphView) {
    graphView.fitContent(true, 20, 1)
}

export function choice (graphView) {
    graphView.setEditable(false)
}

export function edit (graphView) {
    graphView.setEditable(true)
}

export function edge (graphView) {
    graphView.setInteractors([
        new ht.graph.DefaultInteractor(graphView),
        new ht.graph.TouchInteractor(graphView, {
            selectable: true
        }),
   ph ])
}

export function setViewLayout (tp) {
    const graphView = tp._graphView
    let autoLayout = new ht.layout.AutoLayout(graphView)

    return function (animate, type) {
        autoLayout.setAnimate(animate)
        autoLayout.layout(type)
    }
}

export function verifyData  (data) {
    const tp = this
    const dataModel = tp._dataModel
    let { id } = data
    if (id) {
        let htData = dataModel.getDataByTag(id)
        if (htData) {
            warn('Data with the same id')
            return {}
        }
    }
    return data
}
