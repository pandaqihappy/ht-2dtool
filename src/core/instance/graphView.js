/*
 * @Author: your name
 * @Date: 2020-04-13 19:32:37
 * @LastEditTime: 2020-04-24 11:35:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\graphView.js
 */
import CreateNodeInteractor from '../plugin/CreateNodeInteractor'

export function initGraphView (tp) {
    const graphView = tp._graphView
    const view = graphView.getView()

    view.style.width = '100%'
    view.style.height = '100%'
    view.id = 'htView'

    let createNodeInteractor = graphView.createNodeInteractor = new CreateNodeInteractor(graphView)
    
    graphView.setInteractors(new ht.List([
        new ht.graph.ScrollBarInteractor(graphView),
        new ht.graph.SelectInteractor(graphView),
        new ht.graph.MoveInteractor(graphView),
        new ht.graph.DefaultInteractor(graphView),
        new ht.graph.TouchInteractor(graphView),
        createNodeInteractor
    ]));

    window.addEventListener('resize', function (e) {
        graphView.invalidate()
    }, false)

    // 启动虚线流动
    graphView.enableDashFlow()
    // 启动Tip功能
    graphView.enableToolTip()
    // 设置图元可编辑
    // const editInteractor = new ht.graph.XEditInteractor(graphView)
    // graphView.setEditable = function (editable) {
    //     let self = this
    //     if (editable) {
    //         self.setInteractors([
    //             new ht.graph.SelectInteractor(self),
    //             editInteractor,
    //             new ht.graph.MoveInteractor(self),
    //             new ht.graph.DefaultInteractor(self),
    //             new ht.graph.TouchInteractor(self, {editable: false}),
    //         ])
    //     } else {
    //         self.setInteractors([
    //             new ht.graph.SelectInteractor(self),
    //             new ht.graph.MoveInteractor(self),
    //             new ht.graph.DefaultInteractor(self),
    //             new ht.graph.TouchInteractor(self, {editable: false}),
    //         ])
    //     }
    // }
}