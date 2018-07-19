// pages/column/index.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    columnType: [],
    colList: [],
    // typeNum: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getcolType()
    const that = this
    wx.request({
      url: 'https://api.it120.cc/zdandan/cms/category/list',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            typeNum: res.data.data[0].id
          })
        }
        that.getcolList(that.data.typeNum)
      }
    })

  },
  /* 获取文章分类 */
  getcolType: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/zdandan/cms/category/list',
      success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            columnType: res.data.data
          })
        }
      }
    })
  },
  /* 获取文章 */
  getcolList: function (num) {
    const that = this
    wx.request({
      url: 'https://api.it120.cc/zdandan/cms/news/list',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        categoryId: num
      },
      success: function (res) {
        if (res.data.code === 0) {
          that.setData({
            colList: res.data.data
          })
        } else if (res.data.code === 404) {
          that.setData({
            colList: []
          })
        }
      }
    })
  },
  /* 切换分类 */
  changeType: function (options) {
    this.getcolList(options.currentTarget.dataset.id)
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