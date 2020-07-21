/*
 * @Author: your name
 * @Date: 2020-05-06 13:32:47
 * @LastEditTime: 2020-05-06 15:48:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\flow.js
 */
export function initFlow (tp) {
    const graphView = tp._graphView
    graphView.enableFlow(50)
}

/**
 * @description: 流动
 * @param {Object} line 连线
 * @param {Boolean} isFlow 是否流动
 * @return: 
 */
export const setFlow = (line, isFlow) => {
    let color = line.getStyle('edge.color')
    console.log('color', color)
    if (line && typeof isFlow === 'boolean' ) {
        console.log('hahahah1')
        line.setStyle("flow", isFlow)
        line.setStyle("flow.element.max", 10)
        line.setStyle("flow.element.background", color)
        // line.setStyle("flow.element.shadow.begincolor", color)
        // line.setStyle("flow.element.shadow.endcolor", color)
    }
    return line
}