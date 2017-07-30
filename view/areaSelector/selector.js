// pages/a/a.js
let service = require("../../utils/service.js");
import { province } from "./province.js"

export let AreaPicker = {
  // onAreaCommit(locationList){} 需要实现的方法
  showAreaSelector() {//显示地址选择器
    if (!this.data._area_areaList) {
      this._area_init();
    }
    this.setData({ _area_showSelector: true })
  },
  _area_hideAreaSelector() {//隐藏地址选择器
    this.setData({ _area_showSelector: false })
  },
  _area_init() {//初始化
    this.setData({
      _area_level: 4,//总共有几级地址
      _area_selectAllArea: true,//是否要求用户选到最后一级 
      _area_showSelector: false,//是否展示控件
      _area_activeTab: 0,//激活的选项卡
      _area_checkedIndexArr: [],//选中的地址下标
      _area_areaList: [province, null, null, null],//省市区街道二维数组
    })
  },
  _area_selectAreaItem(e) {
    let level = parseInt(e.target.dataset.level);
    let index = parseInt(e.target.dataset.index);
    let id = e.target.dataset.id;
    let newCheckedIndexArr = this.data._area_checkedIndexArr;
    let newAreaList = this.data._area_areaList;
    newCheckedIndexArr[level] = index;
    switch (level) {
      case 0:
        newCheckedIndexArr[1] = null;
        newCheckedIndexArr[2] = null;
        newCheckedIndexArr[3] = null;
        newAreaList[1] = null;
        newAreaList[2] = null;
        newAreaList[3] = null;
        break;
      case 1:
        newCheckedIndexArr[2] = null;
        newCheckedIndexArr[3] = null;
        newAreaList[2] = null;
        newAreaList[3] = null;
        break;
      case 2:
        newCheckedIndexArr[3] = null;
        newAreaList[3] = null;
        break;
    }
    this.setData({ _area_checkedIndexArr: newCheckedIndexArr, _area_areaList: newAreaList });
    if (level < this.data._area_level - 1) {
      //加载下一页地址选择数据
      this._area_loadArea(level + 1, id);
    } else {
      //选择完成
      this._area_commitArea();
    }
  },
  _area_reselectArea(e) {
    let level = parseInt(e.target.dataset.level);
    this.setData({ _area_activeTab: level });
  },
  _area_loadArea(level, areaId) {
    let _area_areaList = this.data._area_areaList;
    wx.showLoading({ title: '加载中' });
    service.getNextAreaList(areaId).then(data => {
      //确保返回数据一定有id和name这两个字段
      _area_areaList[level] = data;
      this.setData({ _area_areaList: _area_areaList });
      if (nextAreaList.length < 1) {//下级地址为空
        this._area_commitArea();
      } else {
        this.setData({ _area_activeTab: level });
      }
      wx.hideLoading();
    }).catch(e => {
      wx.showToast({ title: `获取地区失败，${JSON.stringify(e)}`, image: '/image/warn.png' })
    });
  },
  _area_areaSwipe(e) {
    let level = parseInt(e.detail.current);
    this.setData({
      _area_activeTab: level
    });
  },

  _area_commitArea() {
    let locationList = [];
    for (let i in this.data._area_checkedIndexArr) {
      let index = this.data._area_checkedIndexArr[i];
      if (index !== null) {
        let locationItem = {
          id: this.data._area_areaList[i][index].id,
          name: this.data._area_areaList[i][index].name,
        };
        locationList.push(locationItem);
      } else {
        break;
      }
    }
    if (this.onAreaCommit) {
      this.onAreaCommit(locationList);
    } else {
      console.warn('页面缺少 onAreaCommit(locationList) 回调函数');
    }
    this._area_init();//选择完成 重置选择器


  }

};
