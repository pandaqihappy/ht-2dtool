/*
 * @Author: 连线数据
 * @Date: 2020-04-24 16:44:41
 * @LastEditTime: 2020-05-13 15:59:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\edge.js
 */
import { warn, verifyData } from '../util/index'
import { setLineStatus } from './status'
import { flowRight } from 'lodash'
/**
 * @description: 初始化连线功能接口
 * @param {type} 
 * @return: 
 */
export function initEdge(tp) {
    const setLineToView = tp.setLineToView = flowRight(addDataToDataModel.bind(tp), setLineStatus.bind(tp), createOrUpdateLine.bind(tp))
    tp.addLinesToView = addLinesToView(setLineToView)
    tp.updateLine = updateLine(tp)
    tp.removeLine = removeLine(tp)
}

export function createOrUpdateLine(data) {
    let tp = this
    const dataModel = tp._dataModel
    let { id } = data
    if (!id) {
        warn('has no id')
        return
    }
    let line = dataModel.getDataByTag(id)
    // 验证data
    if (!line) {
        return createLine.call(tp, data)
    } else if (line && line instanceof ht.Edge) {
        return _updateLine(data, line)
    } else if (!(line instanceof ht.Edge)) {
        warn('This is not an Line object')
        return null
    }
}

export function createLine(data) {
    if (!data) return
    const tp = this
    const dataModel = tp._dataModel

    let { source, target, sourceType, targetType, id, attr, lineType } = data

    if (!source || !target) {
        warn('Source and target are mandatory')
        return null
    }

    let sourceNode = dataModel.getDataByTag(source)
    let targetNode = dataModel.getDataByTag(target)

    if (sourceNode && targetNode) {
        let sourceId = sourceNode.getTag()
        let targetId = targetNode.getTag()
        let edge = new ht.Edge(sourceNode, targetNode)
        if (!edge) {
            warn('Edge does not exist')
            return null
        }

        if (id) { edge.setTag(id) } else {
            id = uuid()
        }

        if (attr) {
            // 给业务添加id属性
            attr.id = id
            attr.sourceId = sourceId
            attr.targetId = targetId
            edge.setAttrObject(attr)
        }


        setLineType(edge, lineType)
        return edge
    } else {
        if (!sourceNode) warn('The sourceNode could not be found')
        if (!targetNode) warn('The targetNode could not be found')
        return null
    }
}

/**
 * @description: 批量添加节点接口
 * @param {type} 
 * @return: 
 */
export function addLinesToView(f) {
    return function (dataArray) {
        dataArray.map(f)
    }
}

/**
 * @description: 添加edge到父级容器
 * @param {Object} 拓扑节点
 * @return: 
 */
function addDataToDataModel(line) {
    if (!line) return
    const tp = this
    const dataModel = tp._dataModel
    let id = line.getTag()
    if (dataModel.getDataByTag(id)) return
    dataModel.add(line)
}

/**
 * @description: 更新连线业务属性及样式（对外接口）
 * @param {type} 
 * @return: 
 */
const updateLine = tp => {
    const dataModel = tp._dataModel
    return (id, newAttr) => {
        let data = dataModel.getDataByTag(id)
        if (!data) {
            warn('has no data')
            return null
        } else if (!(data instanceof ht.Edge)) {
            warn('This is not an Edge object')
            return null
        }

        let oldAttr = data.getAttrObject()
        let attr = Object.assign({}, oldAttr, newAttr)
        // 更新连线业务属性
        data.setAttrObject(attr)
        // 更新连线样式
        setLineStatus.call(tp, data)
    }
}

const _updateLine = (data, line) => {
    let { attr } = data
    let oldAttr = line.getAttrObject()
    let newAttr = Object.assign({}, oldAttr, attr)
    // 更新连线业务属性
    line.setAttrObject(newAttr)
    return line
}

/**
 * @description: 删除连线
 * @param {String} lineId
 * @return: 
 */
const removeLine = tp => {
    const dataModel = tp._dataModel
    return lineId => {
        dataModel.removeDataById(lineId)
    }
}

/**
 * @description: 设置连线类型
 * @param {Object} data 连线数据
 * @param {String} lineType 连线类型，如直线、折线、曲线等
 * @return: 
 */
function setLineType(data, lineType) {
    // switch(lineType) {

    // }

    return data
}

/**
 * @description: 获取连线数据
 * @param {Oject} line 
 * @return: 
 */
export function getLineInfo (line) {
    let attr = line.getAttrObject()
    let name = line.getName()
    let id = line.getTag()
    let source = line.getSource()
    let target = line.getTarget()
    let sourceId = source.getTag()
    let targetId = target.getTag()

    return {
        id,
        sourceId,
        targetId,
        name,
        attr
    }
}