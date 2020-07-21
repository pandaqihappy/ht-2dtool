/*
 * @Author: your name
 * @Date: 2020-04-13 19:09:34
 * @LastEditTime: 2020-05-22 14:41:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\init.js
 */
import { initGraphView } from './graphView'
import { initOverview } from './overview'
import { initTool } from './tool'
import { initBorderPane } from './borderPane'
import { initImage } from './image'
import { initNode } from './node'
import { initEvents } from './events'
import { initDataModel } from './dataModel'
import { initPanel } from './panel'
import { initPaltte } from './paltte'
import { initEdge } from './edge'
import { initBizStatus } from './status'
import { initRightMenu } from './rightMenu'
import { initFlow } from './flow'

export function initMixin (HtTool) {
    HtTool.prototype._init = function (option) {
        const tp = this
        tp.$option = option
        const dataModel = tp._dataModel = new ht.DataModel()
        tp._graphView = new ht.graph.GraphView(dataModel)
        initBizStatus(tp)
        initImage(tp)
        initGraphView(tp)
        initBorderPane(tp)
        initTool(tp)
        initBorderPane(tp)
        initOverview(tp)
        initNode(tp)
        initEdge(tp)
        initEvents(tp)
        initDataModel(tp)
        // initPanel(tp)
        initPaltte(tp)
        initRightMenu(tp)
        initFlow(tp)
    }
}