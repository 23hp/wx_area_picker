
/**
 * 获取服务器返回的地址数据
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