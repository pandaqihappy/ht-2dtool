/*
 * @Author: your name
 * @Date: 2020-04-13 19:32:44
 * @LastEditTime: 2020-05-09 17:41:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\tool.js
 */
const toolName = {
    zoomIn: '放大',
    zoomOut: '缩小',
    fitContent: '总览',
    choice: '选择',
    edit: '编辑',
    edge: '直线',
    foldLine: '折线',
    layout: '布局',
    printing: '打印拓扑',
    toggle: '鹰眼',
}

import CreatEdgeInteractor from '../plugin/CreateEdgeInteractor'

/**
 * @description: 
 * @param {Object} tp 拓扑实例 
 * @return: 
 */
export function initTool(tp) {
    const option = tp.$option
    let tool = option.toolbar
    
    // 配置对外布局方法
    tp.viewLayout = setViewLayout(tp)
    const toolObj = initToolFn(tp)

    // 添加外部提供的工具方法
    if (tool.addTools && tool.addTools.length > 0) {
        let addTools = tool.addTools
        addTools.map(op => {
            toolObj.addTool(op)
        })
    }

    /**
     * @description: 可直接调用工具方法的接口，用于自定义工具栏UI，也可用于外部调用
     * @param {Function} useTool 参数 name
     * @return: 
     */
    tp.useTool = toolObj.useTool

    // 配置hightopo提供的工具栏
    const toolMap = tp.toolMap = toolObj.toolMap
    if (tool.show) setToolBar.call(tp, toolMap)
}

/**
 * @description: 创建hightopo工具栏
 * @param {type} toolMap
 * @return: 
 */
function setToolBar (toolMap) {
    const tp = this
    const toolbar = new ht.widget.Toolbar()
    const tools = []
    let uuid = 1
    for (let key in toolMap) {
        toolMap[key].uuid = uuid
        tools.push(toolMap[key])
        uuid++
    }
    toolbar.setItems(tools)
    tp._toolbar = toolbar
}

function initToolFn (tp) {
    const graphView = tp._graphView
    const element = createLayoutDom(tp)
    const toolMap = {
        zoomIn: {
            type: 'action',
            label: toolName['zoomIn'],
            toolTip: toolName['zoomIn'],
            icon: 'zoomIn',
            action: function () {
                console.log('zoomIn')
                graphView.zoomIn(true)
            },
        },
        zoomOut: {
            type: 'action',
            label: toolName['zoomOut'],
            toolTip: toolName['zoomOut'],
            icon: 'zoomOut',
            action: function () {
                graphView.zoomOut(true)
            },
        },
        fitContent: {
            type: 'action',
            label: toolName['fitContent'],
            toolTip: toolName['fitContent'],
            icon: 'fitContent',
            action: function () {
                graphView.fitContent(true, 20, 1)
            }
        },
        choice: {
            type: 'action',
            label: toolName['choice'],
            toolTip: toolName['choice'],
            icon: 'choice',
            action: function () {
                graphView.setEditable(false)
            }
        },
        edit: {
            type: 'action',
            label: toolName['edit'],
            toolTip: toolName['edit'],
            icon: 'edit',
            action: function () {
                graphView.setEditable(true)
            }
        },
        edge: {
            type: 'action',
            label: toolName['edge'],
            toolTip: toolName['edge'],
            icon: 'edge',
            action: function (cb) {
                console.log('cb', cb)
                graphView.setInteractors([
                    new ht.graph.DefaultInteractor(graphView),
                    new ht.graph.TouchInteractor(graphView, {
                        selectable: true
                    }),
                    new CreatEdgeInteractor(graphView, cb)
                ])
            }
        },
        layout: {
            type: 'element',
            label: toolName['layout'],
            toolTip: toolName['layout'],
            element: element,
        },
        toggle: {
            type: 'action',
            label: toolName['toggle'],
            toolTip: toolName['toggle'],
            action: function () {
                tp._overview.show = tp._overview.show? false: true
            }
        },
        remark: {
            type: 'action',
            label: '文本框',
            toolTip: '文本框',
            action: function () {
                tp.createHtmlNode()
            }
        }
    }

    return {
        toolMap: toolMap,
        // 使用工具（外部接口使用）
        useTool: function (name, callback) {
            toolMap[name].action(callback)
        },
        addTool: function(op) {
            addToolFn(op, toolMap)
        }
    }
}

/**
 * @description: 
 * @param {type} 
 * @return: 
 */
function addToolFn ({type, label, name, icon, toolTip, action, element} = {}, toolMap) {
    if (toolMap[name]) {
        console.error('the tool name has used')
        return
    }
    if (!type || (type !=='action' && type !=='element')) {
        console.error('You did not enter a valid type')
        return
    }
    toolMap[name] = {}
    toolMap[name].type = type
    switch (type) {
        case 'action':
            if (!action) {
                console.error(`The function doesn't exist`)
                return
            } else if (typeof action !== 'function') {
                console.error('This is not a function')
                return
            } else {
                toolMap[name].action = action
            }
            if (icon) {
                toolMap[name].icon = icon
            }
            if (label && typeof label === 'string' && label.length > 0) toolMap[name].label = label
            if (toolTip && typeof toolTip === 'string' && toolTip.length > 0) toolMap[name].toolTip = toolTip
            break
        case 'element':
            if (element) toolMap[name].element = element
            break
        default: 
            return
    }
}

/**
 * @description: 节点布局
 * @param {Object} 拓扑实例 
 * @return: 
 */
function setViewLayout (tp) {
    const graphView = tp._graphView
    let autoLayout = new ht.layout.AutoLayout(graphView)

    return function (animate, type) {
        autoLayout.setAnimate(animate)
        autoLayout.layout(type)
    }
}

/**
 * @description: 创建布局节点
 * @param {Object} tp 
 * @return: 
 */
function createLayoutDom (tp) {
    const option = tp.$option
    let tool = option.toolbar
    let layout = tp.viewLayout
    if (!tool.show) return
    let dom = tp.$dom
    let layoutBox = `
        <select id='layoutBox'>
            <option value='circular'>圆形布局</option>
            <option value='symmetric'>对称布局</option>
            <option value='towardnorth'>树形布局</option>
            <option value='hierarchical'>层次布局</option>
        </select>
    `
    dom.innerHTML += layoutBox

    let layoutDom = document.querySelector('#layoutBox')
    layoutDom.addEventListener('change', function (e) {
        const value = e.target.value
        switch (value) {
            case 'circular':
                layout(true, 'circular')
                break
            case 'symmetric':
                layout(true, 'symmetric')
                break
            case 'towardnorth':
                layout(true, 'towardnorth')
                break
            case 'hierarchical':
                layout(true, 'hierarchical')
        }
    })
    return layoutDom
}
