//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false, // loading
    userInfo: {},
    swiperCurrent: 0,
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    recommendStatusGoods: [],
    scrollTop: "0",
    loadingMoreHidden: true,
    hasNoCoupons: true,
    coupons: [],
    searchInput: '',
    menuData: [
      {
        url: '/pages/signIn/signIn',
        text: '签到',
        imgUrl: "/images/icons/Signin.png"
      },
      {
        url: '/pages/coupons/index',
        text: '礼券',
        imgUrl: "/images/icons/coupons.png"
      },
      {
        url: '/pages/signIn/signIn',
        text: '砍价',
        imgUrl: "/images/icons/bargain.png"
      },
      {
        url: '/pages/signIn/signIn',
        text: '专栏',
        imgUrl: "/images/icons/column.png"
      }
    ]
  },

  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function (e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function (e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  scroll: function (e) {
    var that = this,
      scrollTop = that.data.scrollTop;
    that.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  onLoad: function () {
    var that = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/banner/list',
      data: {
        key: 'mallName'
      },
      success: function (res) {
        if (res.data.code == 404) {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })
        } else {
          that.setData({
            banners: res.data.data
          });
        }
      }
    })
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/category/all',
      success: function (res) {
        var categories = [{
          id: 0,
          name: "全部"
        }];
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            categories.push(res.data.data[i]);
          }
        }
        that.setData({
          categories: categories,
          activeCategoryId: 0
        });
        that.getGoodsList(0);
      }
    })
    that.getCoupons();
    that.getNotice();
    //获取推荐商品
    wx.request({
      url: 'https://api.it120.cc/zdandan/shop/goods/list',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        recommendStatus: 1
      },
      success: function (res) {
        that.setData({
          recommendStatusGoods: res.data.data
        })
      }
    })
  },
  getGoodsList: function (categoryId) {
    if (categoryId == 0) {
      categoryId = "";
    }
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/list',
      data: {
        categoryId: categoryId,
        nameLike: that.data.searchInput
      },
      success: function (res) {
        that.setData({
          goods: [],
          loadingMoreHidden: true
        });
        var goods = [];
        if (res.data.code != 0 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden: false,
          });
          return;
        }
        for (var i = 0; i < res.data.data.length; i++) {
          goods.push(res.data.data[i]);
        }
        that.setData({
          goods: goods,
        });
      }
    })
  },
  getCoupons: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/coupons',
      data: {
        type: ''
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            hasNoCoupons: false,
            coupons: res.data.data
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
        if (res.data.code == 20001 || res.data.code == 20002) {
          wx.showModal({
            title: '温馨提示',
            content: '来晚了',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20003) {
          wx.showModal({
            title: '温馨提示',
            content: '你领过了，别贪心哦~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 30001) {
          wx.showModal({
            title: '温馨提示',
            content: '您的积分不足',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 20004) {
          wx.showModal({
            title: '温馨提示',
            content: '已过期~',
            showCancel: false
          })
          return;
        }
        if (res.data.code == 0) {
          wx.showModal({
            title: '温馨提示',
            content: '领取成功~',
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('mallName') + '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      imageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531824017525&di=d4798643d1f6d09fe2fc9dbfd633d04e&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01c6d8577270370000012e7e30d877.jpg%401280w_1l_2o_100sh.jpg',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getNotice: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/list',
      data: {
        pageSize: 5
      },
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            noticeList: res.data.data
          });
        }
      }
    })
  },
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })
  },
  toSearch: function () {
    this.getGoodsList(this.data.activeCategoryId);
  }
})