/*
 * @Author: your name
 * @Date: 2020-04-13 19:32:00
 * @LastEditTime: 2020-05-08 17:28:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \htTool\src\core\instance\image.js
 */
import { warn } from '../util/index'
 // 判断是否为base64正则
let reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i;
/**
 * @description: 图片注册初始化
 * @param {Object} tp 实例
 */
export function initImage(tp) {
    const option = tp.$option
    const images = option.images
    
    if (images && images.length > 0) {
        images.map(registerImage)
    }

    tp.registerImage = registerImage

    initAlarmImage()
}

/**
 * @description: 注册图片
 * @param {data} 注册图片配置项
 * @return: void
 */
export function registerImage(data) {
    let { imageName, width, height, src } = data
    if (!src) return

    // 如果已有相同名称的图片，跳出函数
    let hasImage = ht.Default.getImage(imageName)
    if (hasImage) {
        // 如果路径或者base64图片字符串相同，提示给图片重命名
        if (src && src === hasImage.src) {
            warn(`There is image ${src} with the same name. Please rename it`)
            return
        } else {
            return
        }
    }
    if (reg.test(src)) {
        if (!width && !height) {
            ht.Default.setImage(imageName, src)
        } else if (width && height) {
            ht.Default.setImage(imageName, width, height, src)
        } else {
            warn('Please pass in both width and height')
        }
    }
    urlToCanvas(src).then(base64Img => {
        if (!width && !height) {
            ht.Default.setImage(imageName, base64Img)
        } else if (width && height) {
            ht.Default.setImage(imageName, width, height, base64Img)
        } else {
            warn('Please pass in both width and height')
        }
        return data
    })
}

/**
 * @description: 将url转为canvas
 * @param {String} url 图片路径 
 * @return: canvas 添加了图片的canvas
 */
function urlToCanvas(url) {
    let href = window.location.href
    let img = new Image()
    img.src = href.slice(0, href.length - 1) + url
    // 将img转为base64格式
    return new Promise(async (reject, resolve) => {
        img.onload = await function () {
            let canvas = document.createElement("canvas")
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img, 0, 0)
            let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
            let base64Img = canvas.toDataURL("image/" + ext);
            reject(base64Img)
        };
    })
};

/**
 * @description: 注册告警图片
 * @param {type} 
 * @return: 
 */
function initAlarmImage () {
    ht.Default.setImage('alarm-icon', {
        width: 100,
        height: 100,
        opacity: { func: 'attr@alarm.opacity' },
        comps: [
            {
                type: 'triangle',
                rect: [2, 2, 96, 96],
                background: { 
                    value : 'gray',
                    func: 'attr@alarm.color'
                }
            },
            {
                type: 'rect',
                rect: [45, 30, 10, 40],
                background: 'white'
            },
            {
                type: 'circle',
                rect: [40, 72, 20, 20],
                background: 'white'
            }
        ]
    })
}