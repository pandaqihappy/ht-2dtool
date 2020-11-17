# ht-2dtool

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



## addLinesToView(lines) 添加连线

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

| Name     | Type     | Description          | Attributes |
| -------- | -------- | -------------------- | ---------- |
| useTool  | String   | 工具名称：           |            |
| callback | Function | 使用工具后的回调函数 | 可选       |