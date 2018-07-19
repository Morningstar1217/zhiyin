// pages/column-datail/index.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDetail(options.id)
  },
  /* 获取文章详情 */
  getDetail: function (id) {
    const that = this
    wx.request({
      url: 'https://api.it120.cc/zdandan/cms/news/detail',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        id: id
      },

      success: function (res) {
        console.log(res.data.data)
        if (res.data.code == 0) {
          that.setData({
            notice: res.data.data
          });
          WxParse.wxParse('article', 'html', res.data.data.content, that, 5);
        }
      }
    })
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