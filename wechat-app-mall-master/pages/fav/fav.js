//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    favGoods: []
  },

  //事件处理函数

  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },

  onLoad: function (e) {

  },
  onShow: function (e) {
    const that = this
    wx.request({
      url: 'https://api.it120.cc/zdandan/shop/goods/fav/list',
      data: {
        token: wx.getStorageSync('token')
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.data) {
          that.setData({
            favGoods: res.data.data,
            loadingMoreHidden: true,
          })
        } else {
          that.setData({
            favGoods:[],
            loadingMoreHidden: false,
          });
          return;
        }
      }
    })
  }
})