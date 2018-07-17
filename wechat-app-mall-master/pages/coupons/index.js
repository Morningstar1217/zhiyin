// pages/coupons/index.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupons: [],
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCoupons()
  },

  getCoupons: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/coupons',
      data: {
        type: ''
      },
      success: function (res) {
        console.log(res.data.data)

        if (res.data.code == 0) {
          const arr = res.data.data
          const arr2 = []
          for (var i in arr) {
            if (arr[i].type != 1) {
              arr2.push(arr[i])
            }
          }
          that.setData({
            hasNoCoupons: false,
            coupons: arr2
          });
        }
      }
    })
  },
  gitCoupon: function (e) {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
      data: {
        id: e.currentTarget.dataset.id,
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        that.resMsg(res.data.code)
      }
    })
  },
  gitCoupon2: function () {
    const that = this
    if (!that.data.inputValue) {
      wx.showModal({
        title: '温馨提示',
        content: '请输入口令~',
        showCancel: false
      })
      return
    }
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/fetch',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        id: 2745,
        pwd: that.data.inputValue,
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        that.resMsg(res.data.code)
      }
    })
  },
  listenInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  resMsg: function (num) {
    if (num == 20001 || num == 20002) {
      wx.showModal({
        title: '温馨提示',
        content: '来晚了',
        showCancel: false
      })
      return;
    }
    if (num == 20000) {
      wx.showModal({
        title: '温馨提示',
        content: '口令错误~',
        showCancel: false
      })
      return;
    }
    if (num == 20003) {
      wx.showModal({
        title: '温馨提示',
        content: '你领过了，别贪心哦~',
        showCancel: false
      })
      return;
    }
    if (num == 30001) {
      wx.showModal({
        title: '温馨提示',
        content: '您的积分不足',
        showCancel: false
      })
      return;
    }
    if (num == 20004) {
      wx.showModal({
        title: '温馨提示',
        content: '已过期~',
        showCancel: false
      })
      return;
    }
    if (num == 0) {
      wx.showModal({
        title: '温馨提示',
        content: '领取成功~',
        showCancel: false
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: "领取失败~",
        showCancel: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})