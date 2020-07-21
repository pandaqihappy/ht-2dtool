/*
 * @Author: your name
 * @Date: 2020-04-27 16:15:35
 * @LastEditTime: 2020-05-14 09:42:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\menu.js
 */
require('../plugin/key') // 快捷键常量
import { getNodeInfo } from './node'
import { getLineInfo } from './edge'

export function initRightMenu(tp) {
    const opt = tp.$option
    const dom = tp.$dom
    const menu = opt.rightMenu

    const nodeMenu = menu.node
    const lineMenu = menu.line

    const graphView = tp._graphView
    const contextMenu = new ht.widget.ContextMenu(menu)
    contextMenu.beforeShow = function (e) {
        let data = graphView.getDataAt(e)

        if (data) {
            let className = data.getClassName()
            switch (className) {
                case 'ht.Node':
                    // // 获取业务数据
                    // let nodesAttr = data.getAttrObject()
                    // // 获取与节点相连接的连线
                    // let lines = data.getAgentEdges()
                    // let linesAttr = []
                    // lines.each((line) => {
                    //     let attr = line.getAttrObject()
                    //     linesAttr.push(attr)
                    // })
                    // decorator(nodeMenu, nodesAttr, linesAttr)
                    if (nodeMenu) {
                        handleNode(nodeMenu, data)
                        this.setItems(nodeMenu)
                    }
                    break
                case 'ht.Edge':
                    if (lineMenu) {
                        handleLine(lineMenu, data)
                        this.setItems(lineMenu)
                    }
                    break
                default:
                    this.setItems([])
            }
        } else {
            this.setItems([])
        }

    }
    contextMenu.addTo(dom)
}

function handleNode (nodeMenu, node) {
    // 获取业务数据
    let nodeAttr = node.getAttrObject()
    // 获取与节点相连接的连线
    let lines = node.getAgentEdges()
    let lineAttr = []
    if (lines) {
        lines.each((line) => {
            let attr = line.getAttrObject()
            lineAttr.push(attr)
        })
    }
    
    decorator(nodeMenu, nodeAttr, lineAttr)
}

function handleLine (lineMenu, line) {
    let lineInfo = getLineInfo(line)

    let targetNode = line.getTargetAgent()
    let sourceNode = line.getSourceAgent()

    let targetNodeInfo = getNodeInfo(targetNode)
    let sourceNodetInfo = getNodeInfo(sourceNode)
    let nodeInfo = [targetNodeInfo, sourceNodetInfo]
    decorator(lineMenu, nodeInfo, lineInfo)
}

/**
 * @description: 装饰action
 * @param {Object} menu 菜单配置
 * @param {Object} nodeAttr 节点业务数据
 * @param {Object} linesAttr 与节点相关的连线设置
 * @return: void
 */
function decorator(menu, nodeInfo, lineInfo) {
    menu.forEach(item => {
        if (item.callback) {
            item.action = (item, event) => {
                item.callback(nodeInfo, lineInfo, event)
            }
            if (item.items && item.items.length > 0) {
                decorator(item.items, nodeInfo, lineInfo)
            }
        }
    })
}