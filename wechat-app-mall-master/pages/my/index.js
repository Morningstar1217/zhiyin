const app = getApp()

Page({
  data: {
    balance: 0,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0,
    payNum: 0,
    fahuoNum: 0,
    shouhuoNum: 0,
    pingjiaNum: 0
  },
  onLoad() {

  },
  onShow() {

    this.setData({
      payNum: 0,
      fahuoNum: 0,
      shouhuoNum: 0,
      pingjiaNum: 0
    })
    let that = this;
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    } else {
      that.setData({
        userInfo: userInfo,
        version: app.globalData.version
      })
    }
    this.getUserApiInfo();
    this.getUserAmount();
    this.checkScoreSign();

    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/list',
      data: {
        token: wx.getStorageSync('token')
      },
      success: (res) => {
        const that = this
        if (res.data.code === 0) {
          const arr = res.data.data.orderList
          for (var i in arr) {
            if (arr[i].statusStr === "待支付") {
              that.setData({
                payNum: that.data.payNum + 1
              })
            } else if (arr[i].statusStr === "待发货") {
              that.setData({
                fahuoNum: that.data.fahuoNum + 1
              })
            } else if (arr[i].statusStr === "已发货待确认") {
              that.setData({
                shouhuoNum: that.data.shouhuoNum + 1
              })
            } else if (arr[i].statusStr === "待评价") {
              that.setData({
                pingjiaNum: that.data.pingjiaNum + 1
              })
            }
          }
        }
      }
    })
  },

  getPhoneNumber: function (e) {
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: '无法获取手机号码',
        showCancel: false
      })
      return;
    }
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/bindMobile',
      data: {
        token: wx.getStorageSync('token'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          that.getUserApiInfo();
        } else {
          wx.showModal({
            title: '提示',
            content: '绑定失败',
            showCancel: false
          })
        }
      }
    })
  },
  getUserApiInfo: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/detail',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            apiUserInfoMap: res.data.data,
            // userMobile: res.data.data.base.mobile
          });
        }
      }
    })

  },
  getUserAmount: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            balance: res.data.data.balance,
            freeze: res.data.data.freeze,
            score: res.data.data.score
          });
        }
      }
    })

  },
  checkScoreSign: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/today-signed',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            score_sign_continuous: res.data.data.continuous
          });
        }
      }
    })
  },
  scoresign: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/score/sign',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.getUserAmount();
          that.checkScoreSign();
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  relogin: function () {
    wx.navigateTo({
      url: "/pages/authorize/index"
    })
  },
  recharge: function () {
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  withdraw: function () {
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  },
  mygoorderlist: function (e) {
    wx.navigateTo({
      url: "/pages/order-list/index"
    });
    app.orderListId = e.currentTarget.dataset.id;
  }
})