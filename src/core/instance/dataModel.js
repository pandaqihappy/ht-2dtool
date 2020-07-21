/*
 * @Author: 潘文奇
 * @Date: 2020-04-21 18:02:28
 * @LastEditTime: 2020-04-27 15:18:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\dataModel.js
 */
/**
 * @description: 初始化DataModel
 * @param {type} 
 * @return: 
 */
export function initDataModel(tp) {
    const dataModel = tp._dataModel
    dataModel.enableAnimation(500)
    tp.search = search(tp) // 暂不使用，性能差
    tp.quickSearch = quickSearch(tp) // 全业务字段检索
    tp.quickSearchByAttrField = quickSearchByAttrField(tp) // 指定业务字段检索
}

/**
 * @description: 通过全业务字段检索节点功能
 * @param {dataModel} 数据管理
 * @param {fullText} 搜索内容
 * @return: 
 */
export function search(tp) {
    const dataModel = tp._dataModel
    const graphView = tp._graphView
    const option = tp.$option
    let searchCond
    if (!option.searchCond) {
        searchCond = ['name']
    } else {
        searchCond = option.searchCond
    }
    return function (fullText, cb) {
        let state
        if (typeof fullText !== 'string') {
            console.error(`The type of field searched is not a string`)
            return
        }
        // 获取搜索条件配置项
        
        let data = dataModel.getDataByTag(fullText)
        if (data) {
            // 平移拓扑以确保该图元在可见区域内
            graphView.fitData(data, true, 100, false, true)
            state = true
            if (cb) cb(state)
        } else {
            // 与dataModel.each，从高layer到低layer执行（待测试api）
            // graphView.each(() => {})

            dataModel.each(data => {
                // 如果与attr业务中字段或者拓扑name匹配成功，则聚焦到该拓扑数据
                if(searchForCond(data, fullText, searchCond) || fullText == data.getName()) {
                    /**
                     * @description: 聚焦到指定资源
                     * @param {Object} data 拓扑数据
                     * @param {Boolean} anim 是否启用动画，默认true（可选）
                     * @param {Number} padding 缩放后图元区域与拓扑边缘的距离，默认为20（可选）
                     * @param {Boolean} notZoomIn 是否将最小缩放值限定为1（可选）
                     * @param {Boolean} retry 当拓扑状态异常时，是否延时重试fitData，默认为true（可选）
                     * @return: void
                     */
                    graphView.fitData(data, true, 100, false, true)
                    state = true
                    if (cb) cb(state)
                } else {
                    state = false
                    if (cb) cb(state)
                }
            })
        }
    }
}

/**
 * @description: 通过查询条件查询数据是否有该字段，如果有，数据是否匹配
 * @param {Object} data 待查询数据
 * @param {String}  fullText 查询内容
 * @param {Array} searchCond 查询条件
 * @return {Boolean} isMatch 是否匹配
 */
function searchForCond (data, fullText, searchCond) {
    let attr = data.getAttrObject()
    // console.log('attr', attr)
    // console.log('searchCond', searchCond)
    let keys = Object.keys(attr)
    let isMatch = false 
    searchCond.forEach(cond => {
        keys.forEach(key => {
            if (cond === key) {
                if (data.getAttr(key) == fullText) {
                    isMatch = true
                    return
                }
            }
        })
    })
    return isMatch
}

/**
 * @description: 通过全业务字段检索节点功能
 * @param {dataModel} 数据管理
 * @param {fullText} 搜索内容
 * @return: 
 */
export function quickSearch (tp) {
    const dataModel = tp._dataModel
    const graphView = tp._graphView
    const option = tp.$option
    let searchCond
    if (!option.searchCond) {
        searchCond = ['name']
    } else {
        searchCond = option.searchCond
    }
    return function (fullText, cb) {
        const quickFinder = new ht.QuickFinder(dataModel, 'attr', 'attr', (data) => {
            console.log('data', data)
            // 如果与attr业务中字段或者拓扑name匹配成功，则聚焦到该拓扑数据
            if(searchForCond(data, fullText, searchCond) || fullText == data.getName()) {
                return data
            }
        })
        // const quickFinder = new ht.QuickFinder(dataModel, 'ip', 'attr')
        let data = quickFinder.findFirst(fullText)
        if (data) {
            /**
             * @description: 聚焦到指定资源
             * @param {Object} data 拓扑数据
             * @param {Boolean} anim 是否启用动画，默认true（可选）
             * @param {Number} padding 缩放后图元区域与拓扑边缘的距离，默认为20（可选）
             * @param {Boolean} notZoomIn 是否将最小缩放值限定为1（可选）
             * @param {Boolean} retry 当拓扑状态异常时，是否延时重试fitData，默认为true（可选）
             * @return: void
             */
            graphView.fitData(data, true, 100, false, true)
            if (cb) cb(true)
        } else {
            if (cb) cb(false)
        }
        quickFinder.dispose()
    }
}

/**
 * @description: 指定业务字段检索
 * @param {Object} tp 
 * @return: 
 */
export function quickSearchByAttrField (tp) {
    const dataModel = tp._dataModel
    const graphView = tp._graphView
    const option = tp.$option
    let searchCond
    if (!option.searchCond) {
        searchCond = ['name']
    } else {
        searchCond = option.searchCond
    }
    /**
     * @description: 按业务字段类型和内容
     * @param {String} text 搜索内容
     * @param {String} attrField 搜索attr业务属性中的字段
     * @param {Function} cb 回调函数
     * @return: 
     */
    return function (text, attrField, cb) {
        const quickFinder = new ht.QuickFinder(dataModel, attrField, 'attr')
        let node = quickFinder.findFirst(text)
        if (node) {
            graphView.fitData(data, true, 100, false, true)
            if (cb) cb(true)
        } else {
            if (cb) cb(false)
        }
        quickFinder.dispose()
    }
}

