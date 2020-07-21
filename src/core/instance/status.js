import { warn } from '../util'
import { setFlow } from './flow'
/*
 * @Author: 潘文奇
 * @Date: 2020-04-26 14:25:59
 * @LastEditTime: 2020-05-06 16:04:23
 * @LastEditors: Please set LastEditors
 * @Description: 业务状态
 * @FilePath: \htTool\src\core\instance\alarm.js
 */
export function initBizStatus (tp) {
    const opt = tp.$option
    const status = opt.status

    const nodeOpts = status.node
    const lineOpts = status.line
    handleNodesStatusFn(tp, nodeOpts)
    handleLinesStatusFn(tp, lineOpts)

    
}

/**
 * @description: 配置节点不同状态下需要调用的方法
 * @param {type} 
 * @return: 
 */
function handleNodesStatusFn (tp, nodeOpts) {
    const nodeStatus = tp._nodeStatus = {}
    nodeOpts.map(opt => {
        // 通过业务字段和业务状态配置状态展示方法，
        // 每个业务字段建立一个对象，状态值作为属性缓存业务状态展示方法
        let { field, status, alarmIcon, img, color } = opt
        if (!nodeStatus[field]) {
            nodeStatus[field] = {}
        }
        nodeStatus[field][status] = node => {
            let attr = node.getAttrObject()
            if (attr[field]) {
                setNodeStyle(node, { color })
                // 设置告警图标
                if (alarmIcon) {
                    setAlarm(node, alarmIcon)
                }
                // 设置图片图标
                if (img) {
                    setImg(node, img)
                }
            }
        }
    })
}

/**
 * @description: 配置连线不同状态下需要调用的方法
 * @param {type} 
 * @return: 
 */
function handleLinesStatusFn (tp, lineOpts) {
    const lineStatus = tp._lineStatus = {}
    lineOpts.map(opt => {
        // 通过业务字段和业务状态配置状态展示方法，
        // 每个业务字段建立一个对象，状态值作为属性缓存业务状态展示方法
        let { field, status, alarmIcon, img, color, flow } = opt
        if (!lineStatus[field]) {
            lineStatus[field] = {}
        }
        if (!status) {
            warn('has no status')
        }
        lineStatus[field][status] = line => {
            let attr = line.getAttrObject()
            console.log('attr', attr)
            console.log('flow', flow)
            if (attr[field]) {
                // 设置连线样式
                setLineStyle(line, { color })
                // 设置告警图标
                if (alarmIcon) {
                    setAlarm(line, alarmIcon)
                }
                // 设置图片图标
                if (img) {
                    setImg(line, img)
                }
                // 设置是否流动
                if (typeof flow === 'boolean') {
                    setFlow(line, flow)
                }
            }
        }
    })
}

function setDefaultLineStatus (line) {
    setLineStyle(line, {color: 'blue'})
    setFlow(line, false)
    setAlarm(line)
}

/**
 * @description: 配置节点告警
 * @param {type} 
 * @return: 
 */
function setAlarm (node, alarmIcon) {
    // 如果没有样式参数，则停止动画
    if (!alarmIcon) {
        node.setAnimation(null)
        return
    }
    let { color, width, height } =  alarmIcon
    if (color) node.setAttr('alarm.color', color)
    node.addStyleIcon('alarm', {
        position: 24, // 状态图标距离拓扑位置
        width: width || 18, // 状态图标宽度
        height: height || 18, // 状态图标高度
        names: ['alarm-icon']
    })
    node.setAnimation({
        hide: {
            property: "alarm.opacity",
            accessType: "attr", 
            from: 1, 
            to: 0.3,
            frames: 1,
            next: "show"
        },
        show: {
            property: "alarm.opacity",
            accessType: "attr", 
            from: 0.3,
            to: 1,
            frames: 1,
            next: "hide"
        },
        start: ["hide"]
    })
}

/**
 * @description: 给拓扑节点添加业务状态
 * @param {Object} node 拓扑节点
 * @return {Object} node
 */
export function setNodeStatus (node) {
    const tp = this
    const nodeStatus = tp._nodeStatus
    let attr = node.getAttrObject()
    if (attr) {
        for (let key in attr) {
            if (nodeStatus[key] && nodeStatus[key][attr[key]]) {
                nodeStatus[key][attr[key]](node)
            }
        }
    }
    return node
}

/**
 * @description: 给连线添加业务状态
 * @param {type} 
 * @return: 
 */
export function setLineStatus (line) {
    if (line) {
        const tp = this
        const lineStatus = tp._lineStatus
        let attr = line.getAttrObject()
        if (attr) {
            for (let key in attr) {
                if (lineStatus[key] && lineStatus[key][attr[key]]) {
                    lineStatus[key][attr[key]](line)
                }
            }
        }
    }
    
    return line
}

/**
 * @description: 设置node节点样式
 * @param {type} 
 * @return: 
 */
function setNodeStyle (node, opt) {

}

/**
 * @description: 设置连线样式
 * @param {type} 
 * @return: 
 */
function setLineStyle (line, opt) {
    let { color } = opt
    if (color) line.setStyle('edge.color', color)
}