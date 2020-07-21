/*
 * @Author: your name
 * @Date: 2020-04-24 10:44:56
 * @LastEditTime: 2020-05-09 14:01:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\plugin\CreateNodeInteractor.js
 */
require('../../../lib/core/ht')
var CreateNodeInteractor = function (graphView, cb) {
    CreateNodeInteractor.superClass.constructor.call(this, graphView);
    this._cb = cb;         
};
ht.Default.def(CreateNodeInteractor, ht.graph.Interactor, {  
    handle_mousedown: function (e) {
        this.handle_touchstart(e);
    },
    handle_touchstart: function (e) {
        this.isLeftClick = ht.Default.isLeftButton(e) && ht.Default.getTouchCount(e) === 1;                 
    },    
    handle_mouseup: function (e) {
        this.handle_touchend(e);
    },
    handle_touchend: function (e) {
        var graphView = this._graphView;
        let cb = this._cb
        if(graphView.getDataAt(e) == null && !graphView._panning && this.isLeftClick && this._image){
            var node = new ht.Node();
            node.setPosition(graphView.getLogicalPoint(e));
            node.setParent(graphView.getCurrentSubGraph());
            node.setImage(this._image);
            graphView.getDataModel().add(node);   
            graphView.getSelectionModel().setSelection(node);
            delete this.isLeftClick;
            if (cb) cb()
        }
    }
});

export default CreateNodeInteractor
