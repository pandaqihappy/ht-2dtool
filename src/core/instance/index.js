/*
 * @Author: your name
 * @Date: 2020-04-13 19:09:34
 * @LastEditTime: 2020-05-09 14:17:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\init.js
 */
require('../../../lib/core/ht')
require('../../../lib/plugin/ht-flow')
require('../../../lib/plugin/ht-animation')
require('../../../lib/plugin/ht-htmlnode')
require('../../../lib/plugin/ht-overview')
require('../../../lib/plugin/ht-form')
require('../../../lib/plugin/ht-edgetype')
require('../../../lib/plugin/ht-cssanimation')
require('../../../lib/plugin/ht-palette')
require('../../../lib/plugin/ht-panel')
require('../../../lib/plugin/ht-quickfinder')
require('../../../lib/plugin/ht-autolayout')
require('../../../lib/plugin/ht-dashflow')
require('../../../lib/plugin/ht-dialog')
// require('../../../lib/plugin/ht-xeditinteractor')
require('../../../lib/plugin/ht-propertypane')
require('../../../lib/plugin/ht-contextmenu')
require('../../../lib/plugin/ht-quickfinder')
require('../../../lib/plugin/ht-menu')

import { initMixin } from './init'
import { ToggleOverview } from './overview'

ht.Default.def(ToggleOverview, ht.graph.Overview, {                
})

window.htconfig = {
    Color: {          
        label: '#fff'
    },
    Style: {
        'edge.color': '#fff'
    }
}

 function HtTopo (id, option) {
     this.$dom = document.querySelector(`#${id}`)
     this._init(option)
 }

 initMixin(HtTopo)

 export default HtTopo