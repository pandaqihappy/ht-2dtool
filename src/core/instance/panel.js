/*
 * @Author: your name
 * @Date: 2020-04-23 13:21:26
 * @LastEditTime: 2020-04-23 16:09:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\panel.js
 */
import { uuid } from '../util/index'
export function initPanel (tp) {
    tp._panels = []
    createPanel(tp, '资源面板', 'resource', {
        content: '<div>设备资源</div>'
    })

}

export function createPanel (tp, title, tag, opt) {
    if (hasSameTag(tp, tag)) {
        console.error(`The panel's name ${tag} already exists`)
        return 
    } 
    let id = uuid()
    const panel = new ht.widget.Panel()
    const panels = tp._panels
    let config = {
        id,
        title,
        exclusive: true, // 是否只允许打开一个子面板
        titleColor: "#fff",
        width: 300,
        // content: content || `<div>${content}</div>`,
        resizeMode: "wh",
        narrowWhenCollapse: true,
        titleIconSize: 16,
        // restoreToolTip: "Restore",
        items: []
    }
    const tpDom = tp.$dom

    // let { title, titleColor, content, items } = opt
    if (opt) config = Object.assign({}, config, opt)

    panel.setConfig(config)

    // 添加唯一标识
    panel.tag = tag
    console.log('panel', panel)
    panels.push(panel)
    tpDom.appendChild(panel.getView())
}

/**
 * @description: 添加子集panel
 * @param {String} panelTag panel唯一标识
 * @return: 
 */
export function addSubsetPanel (tp, panelTag, content, opt) {
    // let { title, buttons, width, items } = opt
    const id = uuid()
    const panel = findPanel(tp, panelTag)
    if (panel) {
        const baseConfig = {
            id,
            exclusive: true, // 是否只允许打开一个子面板
            titleColor: "#fff",
            resizeMode: "wh",
            narrowWhenCollapse: true,
            titleIconSize: 16,
            content: content || '<div>无内容</div>'
        }
        opt = Object.assign({}, baseConfig, opt)
        console.log('panel', panel)
        panel.setInnerPanel(opt)
    }
}

/**
 * @description: 判断是否有同名面板
 * @param {Object} tp 拓扑实例 
 * @param {String} panelTag 面板标识
 * @return: 
 */
export function hasSameTag (tp, panelTag) {
    // 判断是否有相同tag的面板
    const panels = tp._panels
    if (panels && panels.length > 0) {
        const sameTag = panels.some(panel => panel.tag === panelTag)
        return sameTag
    } else {
        return false
    }
}

/**
 * @description: 查找panel
 * @param {type} 
 * @return: 
 */
export function findPanel (tp, panelTag) {
    const panels = tp._panels
    if (panels && panels.length > 0) {
        const panel = panels.find(panel => panel.tag === panelTag)
        if (panel) {
            return panel
        } else {
            console.error(`don't have ${panelTag} panel`)
            return null
        }
        
    } else {
        console.warn(`don't have panel`)
    }
}