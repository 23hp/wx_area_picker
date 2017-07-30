# 微信小程序-地址选择器

高仿京东，功能强大可配置的支持选择器

![实例效果](https://github.com/23hp/wx_area_picker/blob/master/sample.PNG)


## 功能：

- 支持一至四级地址选择
- 支持选择部分地址（不选完）
- 灵活的地址数据源，可以从开发者服务器数据获取数据，也可以读取内置地址数据
- 返回每一级地址的ID及名称

## 使用方法：

1. 复制view下的areaSelector目录到你的项目
2. 复制utils下的service.js到你的项目
3. 在需要的页面引入areaSelector

js文件

        import { AreaPicker } from "../../view/areaSelector/selector.js"
        
        //使用Object.assign方法使地址选择器合并到你写的对象
        Page(Object.assign({}, AreaPicker, {
            
            data{
                ...
            }

            //添加用户选择地区完成的回调
            onAreaCommit(locationList) {
                
            }

          })) //别忘了这里多一个括号


wxml布局文件

        <!--引入选择器布局-->
        <include src="../../view/areaSelector/selector.wxml" />
        <!--加上点击事件-->
        <view bindtap="showAreaSelector">选择地址</view>

wxss样式文件

        /* 引入地址选择器样式 */
        @import "/view/areaSelector/selector.wxss";

## 配置方法：

找到areaSelector下的selector.js文件，找到_area_init()方法

        //选择器初始化
        _area_init() {
            this.setData({
                _area_level: 4,//总共有几级地址
                _area_selectAllArea: true,//是否要求用户选到最后一级 
                ...
            })
        },

_area_level控制地址的层级，_area_selectAllArea为false时，用户可以提前结束地址选择。


## 修改地址数据源：

看，我们把获取地址的逻辑抽离了出来

    _area_loadArea(level, areaId) {
        let _area_areaList = this.data._area_areaList;
        wx.showLoading({ title: '加载中' });

        service.getNextAreaList(areaId).then(data => {
            //确保返回的数据一定有ID和name这两个字段
            _area_areaList[level] = data;
            this.setData({ 
                _area_areaList: _area_areaList 
            });
            
            ...
            wx.hideLoading();
        }).catch(e => {
            wx.showToast({ title: `获取地区失败，${JSON.stringify(e)}`, image: '/image/warn.png' })
        });
    },

找到utils下的service.js文件，这里配置你的地址数据

        /**
        * 获取服务器返回的地址数据
        * @areaId 地址ID
        * 返回Promise对象
        */
        export function getNextAreaList(areaId) {
        return new Promise((resolve) => {
            setTimeout(() => {
            let nextAreaList = [
                { id: 1, name: '地区A' },
                { id: 2, name: '地区B' },
                { id: 3, name: '地区C' },
                { id: 4, name: '地区D' },
                { id: 5, name: '地区E' },
            ];
            resolve(nextAreaList)
            }, 300);
        })
        }

DEMO中使用了虚拟数据，现在我们替换为自己的数据源：

        export function getNextAreaList(areaId) {
            return new Promise((resolve,reject) => {
                wx.request({
                    url:'xxx'//你的接口地址
                    param:{...}//参数
                    success(res){
                        
                        let list=[]
                        for(let item of res.data){
                            list.push({
                                id:item.id,//id对应地区ID
                                name:item.name//name对应地区名称
                            })
                        }
                        //成功回调 要确保数组中的对象有id和name字段
                        resolve(list);

                    },
                    fail(err){
                        //失败回调
                        reject(err)

                    }

                })
            })
        }