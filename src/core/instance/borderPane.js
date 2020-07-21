/*
 * @Author: your name
 * @Date: 2020-04-16 18:31:44
 * @LastEditTime: 2020-05-09 11:05:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\borderPane.js
 */
export function initBorderPane (tp) {
    const borderPane = new ht.widget.BorderPane()
    const view = borderPane.getView()
    view.id = 'borderPane'
    const toolbar = tp._toolbar
    const graphView = tp._graphView
    let style = view.style

    Object.assign(style, {
        // position: 'absolute',
        // top: 0,
        // right: 0,
        // bottom: 0,
        // left: 0,
        width: '100%',
        height: '100%',
    })

    if (toolbar) borderPane.setTopView(toolbar)
    if (graphView) borderPane.setCenterView(graphView)

    window.addEventListener('resize', function (e) {
        borderPane.invalidate()
    }, false)


    const dom = tp.$dom
    dom.appendChild(view)
}