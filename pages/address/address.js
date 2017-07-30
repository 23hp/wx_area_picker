import { AreaPicker } from "../../view/areaSelector/selector.js"

Page(Object.assign({}, AreaPicker, {
  data: {
    province: null,//省 {id,name}
    city: null,//市
    district: null,//县 区
    street: null,//村 街道 

  },

  onAreaCommit(locationList) {//当用户更换地区
    console.log(locationList);
    this.setData({
      province: locationList[0] || {},
      city: locationList[1] || {},
      district: locationList[2] || {},
      street: locationList[3] || {},
    });
  }
}))