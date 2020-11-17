# ht-2dtool

## 初始化

```javascript
let tp = new Htopo("topo", option)
```

| Name   | Type   | Description | Attributes |
| ------ | ------ | ----------- | ---------- |
| id     | String | 节点id      |            |
| option | Object | 配置项      | 可选       |

## 配置项

```javascript
const option = {
        toolbar: { // 工具栏配置
          show: false, // 是否显示工具栏
          addTools: [ // 添加自定义工具回调
            {
              type: "action", // 自定义工具类型
              name: "save", // 自定义工具唯一标识，必须为英文，用于接口参数传递
              label: "保存拓扑", // 自定义工具名称
              action: () => { // 自定义工具回调函数
                this.tp.getAllData(data => {
                  this.getSaveTopo(data);
                });
              }
            }
          ]
        },
        overview: { // 鹰眼配置
          show: true, // 是否显示
          style: { // 鹰眼样式配置
            width: 200, // 鹰眼图宽度
            height: 100 // 鹰眼图高度
          }
        },
        // 初始化图片
        images: [
            {
              imageName: "ROUTER", // 图片名称
              src: require("../../../../static/img/ROUTER.png") // 图片路径
            },
            {
              imageName: "SERVER",
              src: require("../../../../static/img/SERVER.png")
            }
        ],
        // 要监听的业务状态
        status: {
          node: [ // 需要监听的节点业务属性
            {
              field: "state", // 业务key
              status: "WARN", // 业务value
              alarmIcon: { // 预置需要使用的状态图片、颜色大小
                type: "warn", // 告警类型，决定了使用什么告警图片
                color: "yellow", // 图片颜色
                animation: "flicker", // 使用什么动画
                width: 30, // 图片宽度
                height: 30 // 图片高度
              }
            },
            {
              field: 'state',
              status: 'offLine',
              color: '#FF0000'
            }
          ],
          line: [
            {
              field: "type", // 业务key
              status: "line", // 业务value
              flow: false, // 是否流动
              color: "green" // 线条颜色
            },
            {
              field: "state",
              status: "NOT_MONITORED",
              color: "blue"
            }
          ]
        },
        // 图元搜索字段映射配置
        searchCond: ["name", "ip", "instanceId"],
        // 图形面板
        imagePalette: [
          {
            name: "设备资源",
            images: this.images
          }
        ],
        // 右键菜单配置项
        rightMenu: {
          node: [ // 选中节点时的菜单配置项
            {
              label: "删除",
              callback: (node, line, event) => {}
            },
            {
              label: "关联资源",
              callback: (node, line, event) => {}
            }
          ],
          line: [ // 选中连线时的菜单配置项
            {
              label: "删除",
              callback: (node, line, event) => {}
            },
            {
              label: "关联链路",
              callback: (node, line, event) => {}
            }
          ]
        }
      };
```



## addNodesToView(nodes)

添加节点

```javascript
let nodes = [
    {
          id: 1,
          name: 'node',
          width: 40,
          height: 40,
          x: 120,
          y: 100,
          attr: { ... }, // 业务数据
          imageName: 'switch',
          src: '../../img/switch.png'
    },
    ...
]
```



| Name      | Type   | Description                                      | Attributes |
| --------- | ------ | ------------------------------------------------ | ---------- |
| id        | String | 节点唯一标识，相关接口将通过它进行更新删除等操作 |            |
| name      | String | 节点名称                                         | 可选       |
| width     | number | 节点图片宽度                                     | 可选       |
| height    | number | 节点图片高度                                     | 可选       |
| x         | number | 节点横坐标                                       | 可选       |
| y         | number | 节点纵坐标                                       |            |
| attr      | Object | 存放任意业务属性                                 | 可选       |
| imageName | String | 注册时的图片名称                                 | 可选       |
| src       | String |                                                  | 可选       |



## addLinesToView(lines) 

添加连线

```javascript
let nodes = [
    {
          source: 3,
          target: 4,
          sourceType: 'node',// 暂未使用
          targetType: 'node',// 暂未使用
          id: id,
          attr: {...},
          lineType: "" // 暂未使用
    },
    ...
]
```

| Name       | Type   | Description                                      | Attributes |
| ---------- | ------ | ------------------------------------------------ | ---------- |
| id         | String | 连线唯一标识，相关接口将通过它进行更新删除等操作 |            |
| source     | String | 起始节点id                                       |            |
| target     | String | 目标节点id                                       |            |
| sourceType | String | 起始节点类型                                     | 未使用     |
| targetType | String | 目标节点类型                                     | 未使用     |
| attr       | Object | 业务属性                                         | 可选       |
| lineType   | Object | 存放任意业务属性                                 | 未使用     |



## updateNode(id, attr)

更新节点

| Name | Type   | Description                                      | Attributes |
| ---- | ------ | ------------------------------------------------ | ---------- |
| id   | String | 节点唯一标识，相关接口将通过它进行更新删除等操作 |            |
| attr | String | 业务数据对象，可更新原数据                       |            |



## updateLine(id, attr)

更新连线

| Name | Type   | Description                                      | Attributes |
| ---- | ------ | ------------------------------------------------ | ---------- |
| id   | String | 连线唯一标识，相关接口将通过它进行更新删除等操作 |            |
| attr | String | 业务数据对象，可更新原数据                       |            |



## removeNode(id, callback)

删除节点

| Name     | Type     | Description                                      | Attributes |
| -------- | -------- | ------------------------------------------------ | ---------- |
| id       | String   | 节点唯一标识，相关接口将通过它进行更新删除等操作 |            |
| callback | Function | 删除节点后的回调函数                             | 可选       |



## removeLine(id, callback)

删除连线

| Name     | Type     | Description                                      | Attributes |
| -------- | -------- | ------------------------------------------------ | ---------- |
| id       | String   | 连线唯一标识，相关接口将通过它进行更新删除等操作 |            |
| callback | Function | 删除连线后的回调函数                             | 可选       |



## search(fullText, callback)

搜索节点

| Name     | Type     | Description                                | Attributes |
| -------- | -------- | ------------------------------------------ | ---------- |
| fullText | String   | 搜索条件，会在节点名称和业务文本中查找数据 |            |
| callback | Function | 搜索后的回调函数                           | 可选       |



## useTool(toolName)

使用拓扑工具

| Name     | Type     | Description                                                  | Attributes |
| -------- | -------- | ------------------------------------------------------------ | ---------- |
| useTool  | String   | 工具名称参数：<br />放大：‘zoomIn’<br />缩小：'zoomOut'<br />总览：'fitContent'<br />选择：'choice'<br />编辑：'edit'<br />连线：'edge'<br /> |            |
| callback | Function | 使用工具后的回调函数                                         | 可选       |



## viewLayout(animate,  type)

视图布局

| Name    | Type    | Description                                                  | Attributes |
| ------- | ------- | ------------------------------------------------------------ | ---------- |
| animate | Boolean | 是否使用动画过度                                             |            |
| type    | String  | 布局类型：<br />circular：圆形布局<br />symmetric：对称布局<br />towardnorth：树形布局<br />hierarchical：层次布局 |            |