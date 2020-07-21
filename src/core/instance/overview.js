/*
 * @Author: your name
 * @Date: 2020-04-13 19:32:10
 * @LastEditTime: 2020-05-06 18:09:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\overview.js
 */
import { uuid } from '../util/index'
/* overview: {
    show: true,
    style: {
        width: 200,
        height: 100,
    },
    location: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }
}
*/
 export function initOverview(tp) {
    // ht.Default.def(ToggleOverview, ht.graph.Overview, {                
    // })
    const graphView = tp._graphView
    const option = tp.$option
    // 如果没有overview配置，则退出函数
    if (!option.overview) return
    let { show, style, location } = option

    const overview = new ToggleOverview(graphView)
    const viewDom = overview.getView()
    viewDom.className = 'htOverview animation'
    
    tp.$dom.appendChild(viewDom)
 }

export function ToggleOverview (graphView) {
    var self = this
    ToggleOverview.superClass.constructor.apply(self, [graphView])             
    self._expand = true

    var div = document.createElement("div")
    div.style.setProperty("width", "24px", null)
    div.style.setProperty("height", "24px", null)
    div.style.setProperty("position", "absolute", null)
    div.style.setProperty("right", "0", null)
    div.style.setProperty("top", "0", null)
    div.style.setProperty("background", 'red', null)
    div.style.setProperty("background-position", "center center", null)              
    self._view.appendChild(div)

    function handleTransitionEnd(e) {
        if (e.propertyName === "width"){
            self.invalidate()
        }                    
    }
    self._view.id = `overview${uuid()}`
    self._view.addEventListener("webkitTransitionEnd", handleTransitionEnd, false)
    self._view.addEventListener("transitionend", handleTransitionEnd, false)
    var eventName = ht.Default.isTouchable ? "touchstart" : "mousedown"
    div.addEventListener(eventName, function(e) {
        if (self._expand) {
            self._view.style.setProperty("width", "24px", null)
            self._view.style.setProperty("height", "24px", null)
            self._canvas.style.setProperty("opacity", "0", null)
            self._mask.style.setProperty("opacity", "0", null)
            div.style.setProperty("background-image", "url(expand.png)", null)
            div.style.setProperty("width", "24px", null)
            div.style.setProperty("height", "24px", null)
            self._expand = false;
        } else {
            self._view.style.setProperty("width", "", null)
            self._view.style.setProperty("height", "", null)
            self._canvas.style.setProperty("opacity", "1", null)
            self._mask.style.setProperty("opacity", "1", null)
            div.style.setProperty("background-image", "url(shrink.png)", null)
            div.style.setProperty("width", "24px", null)
            div.style.setProperty("height", "24px", null)
            self._expand = true
        }                    
        self.invalidate()                   
        e.stopPropagation()
    });
    self.setContentBackground("white")
}
