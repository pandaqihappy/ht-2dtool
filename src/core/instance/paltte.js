/*
 * @Author: 潘文奇
 * @Date: 2020-04-22 16:56:09
 * @LastEditTime: 2020-05-27 15:25:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\paltte.js
 */

import { createNode, addDataToDataModel } from './node'
import { compose, isDom, uuid } from '../util/index'
import { addSubsetPanel } from './panel'
import { flowRight } from 'lodash'
let dropCallback = () => { console.log('没有回调') }

// 创建node和配置node组合函数
const createPaltteNode = compose(_setNodeForPalette, createNode)

export function initPaltte (tp) {
    const opts = tp.$option.imagePalette // 获取配置数据
    if (!opts || opts.length === 0) return
    
    const palette = new ht.widget.Palette() // 创建面板
    let dm = palette.dm() // 获取palette数据模板
    tp._palette = palette

    let style = palette.getView().style
    style.display = 'flex'
    style.flexDirection = 'column'
    
    
    // palette.setItemImageWidth(50) // 设置paltte中节点大小
    opts.map(opt => {initPaletteData.call(tp, opt)}) // 处理

    // 初始化palette监听事件
    initPaletteListener(tp, palette)

    tp.addPaletteDom = addPaletteDom(palette)

    tp.palette = {}
    tp.palette.on = addPaletteListener(tp)
    
    // 刷新palette组件
    tp.palette.refresh = palette.iv

    window.addEventListener("resize", function(e) {
        palette.iv();
    })

    // 将palette添加入panel（暂不使用）
    // addPaletteToPanel(tp, 'resource', palette, {
    //     title: '设备',
    //     contentHeight: 500
    // })

    return palette
}

/**
 * @description: 初始化group，并向group中添加node节点
 * @param {Object} opt palette配置
 * @return: 
 */
function initPaletteData (opt) {
    const tp = this
    const palette = tp._palette
    const dm = palette.dm()
    let images = opt.images
    // 创建group
    const group = new ht.Group()

    group.setName(opt.name)
    group.setExpanded(true)
    
    if (images && images.length > 0) {
        images.map(image => {
            let node = createPaltteNode(image)
            dm.add(node) // palette面板数据添加图元
            group.addChild(node) // group添加图元
        })
    }

    dm.add(group)
}

/**
 * @description: 给node添加palette特有属性
 * @param {Object} node 待处理的节点 
 * @return {Object} node 已处理节点
 */
function _setNodeForPalette (node) {
    // node.setStyle({
    //     'draggable': true, // 设置是否可拖拽
    //     'image.stretch': 'centerUniform' // 设置图片与节点边框位置
    // })
    node.setStyle('draggable', true)
    node.setStyle('image.stretch', 'centerUniform')
    // node.setSize(40, 40)
    return node
}

/**
 * @description: palette添加新node功能
 * @param {Object} image 节点配置 里面包括 src路径和imageName参数
 * @return: 
 */
export const addPaletteNode = (tp, group) => {
    const palette = tp._palette
    const dm = palette.dm()
    return image => {
        let node = createPaltteNode(image)
        dm.add(node) // palette面板数据添加图元
        group.addChild(node) // group添加图元
    }
}

/**
 * @description: 语义化包裹
 * @param {Object} tp 拓扑实例
 * @param {String} panelTag panel唯一识别标识
 * @param {Object} palette palette实例
 * @param {Object} opt 配置
 * @return: void
 */
function addPaletteToPanel (tp, panelTag, palette, opt) {
    addSubsetPanel(tp, panelTag, palette, opt)
}

function initPaletteListener (tp, palette) {
    // 创建node和将node添加进容器的组合函数
    const createNodeAndAddDataToDataModel = flowRight(addDataToDataModel.bind(tp), createNode)
    
    const graphView = tp._graphView
    const createNodeInteractor = graphView.createNodeInteractor

    palette.sm().ms((e) => {
        let selectedNode = palette.sm().ld()
        if (selectedNode) {
            createNodeInteractor._image = selectedNode.getImage()
        }
    })

    graphView.getView().addEventListener("dragover", dragover)

    graphView.getView().addEventListener("drop", onDrop.bind(tp))

    graphView.getView().addEventListener("click", e => {
        createNodeInteractor._image = null
    })
}

function onDrop (e) {
        const tp = this
        const graphView = tp._graphView
        const createNodeInteractor = graphView.createNodeInteractor
        const palette = tp._palette

        e.preventDefault()
        e.stopPropagation()
        let id = e.dataTransfer.getData("Text").replace(/nodeid:/g, "")
        if (id) {
            let paletteNode = palette.dm().getDataByTag(id)

            
               
            if (paletteNode) {
                let nodeId = uuid()
                let lp = graphView.lp(e) // 将event转为canvas坐标
                let { x, y } = lp

                let imageName = paletteNode.getImage()
                
                let attr = paletteNode.getAttrObject()
                let width = paletteNode.getWidth()
                let height = paletteNode.getHeight()

                let param = { x, y, attr, width, height, imageName }
                // return param
                if (dropCallback) dropCallback(param)
            }
            // return {}
        }
        createNodeInteractor._image = null
}

function dragover (e) {
    e.preventDefault();
    // e.dataTransfer.dropEffect = "copy"
}

/**
 * @description: 将palette添加到项目的节点中
 * @param {HTMLdom} parentDom
 * @return: 
 */
function addPaletteDom(palette) {
    const pDom = palette.getView()
    return function (parentDom) {
        console.log('isDom', isDom(parentDom))
        if (!isDom(parentDom)) {
            console.error('This is not a HTMLElement')
            return
        }
        let width = parentDom.clientWidth
        let height = parentDom.clientHeight
        pDom.style.width = `${width}px`
        pDom.style.height = '600px'

        palette.iv()
        parentDom.appendChild(pDom)
    }
}

const addPaletteListener = (tp) => {
    const graphView = tp._graphView
    return (listenerType, cb) => {
        dropCallback = cb
    }
}

