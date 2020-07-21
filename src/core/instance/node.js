/*
 * @Author: 潘文奇
 * @Date: 2020-04-17 11:18:50
 * @LastEditTime: 2020-05-14 11:32:46
 * @LastEditors: Please set LastEditors
 * @Description: 拓扑节点功能初始化
 * @FilePath: \htTool\src\core\instance\node.js
 */
import { registerImage } from './image'
import { setNodeStatus } from './status'

// 工具引入
import { uuid, warn, verifyData } from '../util/index'
import { flowRight } from 'lodash'


export function initNode(tp) {
    // tp.createNode = createNode
    tp.createHtmlNode = createHtmlNode(tp)
    const addNodeToView = tp.addNodeToView = flowRight(addDataToDataModel.bind(tp), setNodeStatus.bind(tp), createOrUpdateNode.bind(tp))
    tp.addNodesToView = addNodesToView(addNodeToView)
    // 更新节点接口
    tp.updateNode = updateNode(tp)
    // 删除节点接口
    tp.removeNode = removeNode(tp)
}

/**
 * @description: 创建节点
 * @param {Object} data 传入的节点数据
 * @param {Object} attr 业务数据
 * @return: node
 */
export function createNode(data) {
    if (!data) return
    // 注册图片
    registerImage(data)

    // 配置node
    let {
        id,
        name,
        imageName,
        width,
        height,
        x,
        y,
        attr, // 业务数据
        src, // 图片路径
        parentId, // 父级group的Id, 暂未采用该功能
    } = data
    let node = new ht.Node()

    if (name) {
        node.setName(name)
        node.setTag(name)
    }
    if (width) node.setWidth(width)
    if (height) node.setHeight(height)
    if (x && y) node.setPosition(x, y)

    if (id) {
        node.setTag(id)

    } else {
        id = uuid()
        node.setTag(id)
        node.setAttr('id', id)
    }

    if (attr) {
        attr.id = id
        node.setAttrObject(attr)
    } // 设置业务属性
    if (imageName) node.setImage(imageName)
    return node
}

export function createOrUpdateNode(data) {
    let tp = this
    const dataModel = tp._dataModel
    let { id } = data
    if (!id) {
        warn('has no id')
        return
    }
    let node = dataModel.getDataByTag(id)
    // 验证data
    if (!node) {
        return createNode(data)
    } else if (node && node instanceof ht.Node) {
        return _updateNode(data, node)
    } else if (!(node instanceof ht.Node)) {
        warn('This is not an Node object')
        return null
    }
}

/**
 * @description: 更新节点（对外接口）
 * @param {type} 
 * @return: 
 */
const updateNode = tp => {
    const dataModel = tp._dataModel
    return (id, newAttr) => {
        let data = dataModel.getDataByTag(id)
        // 验证data
        if (!data) {
            warn('has no data')
            return null
        } else if (!(data instanceof ht.Node)) {
            warn('This is not an Node object')
            return null
        }

        let oldAttr = data.getAttrObject()
        let attr = Object.assign({}, oldAttr, newAttr)
        // 更新节点业务属性
        data.setAttrObject(attr)
        // 更新节点样式
        setNodeStatus.call(tp, data)
    }
}

const _updateNode = (data, node) => {
    let { attr, name } = data
    let oldAttr = node.getAttrObject()
    let newAttr = Object.assign({}, oldAttr, attr)

    if (name) {
        node.setName(name)
    }

    // 更新节点业务属性
    node.setAttrObject(newAttr)
    return node
}


/**
 * @description: 添加Node到父级容器
 * @param {Object} 拓扑节点
 * @return: 
 */
export function addDataToDataModel(node) {
    if (!node) return
    let id = node.getTag()
    
    const dataModel = this._dataModel
    if (dataModel.getDataByTag(id)) return
    dataModel.add(node)
}

/**
 * @description: 设置
 * @param {type} 
 * @return: 
 */
export function addNodesToView(f) {
    return function (dataArray) {
        dataArray.map(f)
    }
}

/**
 * @description: 创建HtmlNode
 * @param {Object} tp 拓扑实例
 * @return: 
 */
function createHtmlNode(tp) {
    return function (text, x, y) {
        let node = new ht.HtmlNode()
        let id = uuid()
        node.setTag(id)
        node.setAttr('id', id)
        node.setPosition(x || 200, y || 200)
        setTextBoxHtml.call(tp, node, text || '')
    }
}

function setTextBoxHtml(node, text) {
    const tp = this
    const dataModel = tp._dataModel
    const graphView = tp._graphView

    let { root, textarea } = createHtmlNodeRoot(text)

    node.setHtml(root)
    // 如果没有id，则是新创建的node，如果有id，则是执行setTextBoxHtml的递归，跳过该步骤
    if (!node.id) {
        node.id = uuid()
        dataModel.add(node)
    }

    let textDomId = uuid()
    let textDom = document.createElement('p')

    textDom.id = textDomId
    // 双击递归setTextBoxHtml方法
    textDom.addEventListener('dblclick', e => {
        let id = textDom.id
        let text = e.target.innerText
        setTextBoxHtml.call(tp, node, text)
        textDom = null
    })

    graphView.onBackgroundClicked = (event) => {
        // console.log('event', event)
        let value = textarea.value
        // value = value.replace(/\n/g, "</br>")
        textDom.innerText = value
        let color = textarea.style.color
        textDom.style.color = color
        if (value.length > 0) {
            node.setHtml(textDom)
            // 重构函数
            graphView.onBackgroundClicked = () => function () { }
            root = null
            textarea = null
        }
    }

    return node
}

/**
 * @description: 创建文本域
 * @param {type} 
 * @return: 
 */
function createTextarea(text) {
    let textareaId = uuid()
    let textarea = document.createElement('textarea')
    textarea.id = textareaId
    textarea.value = text
    textarea.rows = '10'
    textarea.cols = '50'
    textarea.style.width = '200px'
    textarea.style.height = '100px'
    textarea.style.resize = 'none'
    textarea.maxLength = '100'
    return textarea
}

/**
 * @description: 创建html根节点
 * @param {String} text textAare中的文本
 * @return: 
 */
function createHtmlNodeRoot(text) {
    let colorUuid = uuid()
    let rootId = uuid()
    let textToolId = uuid()

    let select = document.createElement('select')
    select.id = colorUuid
    select.innerHTML = `<option value='#000' default>黑色</option>
    <option value='red'>红色</option>`

    select.addEventListener('change', (e) => {
        let value = e.target.value
        switch (value) {
            case '#000':
                textarea.style = Object.assign(textarea.style, {
                    color: '#000'
                })
                break
            case 'red':
                textarea.style.color = 'red'
                break
            case 'yellow':
                textarea.style.color = 'yellow'
        }
    })

    let textTool = document.createElement('div')
    textTool.id = textToolId

    textTool.appendChild(select)

    let textarea = createTextarea(text)

    let root = document.createElement('div')
    root.id = rootId
    root.appendChild(textTool)
    root.appendChild(textarea)
    return {
        root,
        textarea
    }
}

/**
 * @description: 删除节点
 * @param {String} nodeId
 * @return: 
 */
const removeNode = tp => {
    const dataModel = tp._dataModel
    return nodeId => {
        dataModel.removeDataById(nodeId)
    }
}

/**
 * @description: 获取节点数据
 * @param {type} 
 * @return: 
 */
export function getNodeInfo (node) {
    let attr = node.getAttrObject()
    let name = node.getName()
    let id = node.getTag()
    let { x, y } = node.getPosition()
    let { width, height } = node.getSize()
    let image = node.getImage()
    return {
        id,
        x,
        y,
        width,
        height,
        image,
        name,
        attr
    }
}
