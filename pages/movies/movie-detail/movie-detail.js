var util = require('../../../utils/util.js')
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movie: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var movieId = options.id;
        var detailUrl = app.globalData.doubanBase + "/subject/" + movieId + "?apikey=0df993c66c0c636e29ecbb5344252a4a"
        util.http(detailUrl, this.processDoubanData);
    },
    processDoubanData: function (data) {
        var director = {avatar: "", name: "", id: ""};
        if (data.directors[0] != null) {
            if (data.directors[0].avatars != null) {
                director.avatar = data.directors[0].avatars.large
            }
            director.name = data.directors[0].name
            director.id = data.directors[0].id
        }
        var movie = {
            movieImg: data.images ? data.images.large : "",
            country: data.countries[0],
            title: data.title,
            wishCount: data.wish_count,
            commentCount: data.comments_count,
            year: data.year,
            generes: data.genres.join("、"),
            stars: util.convertToStarsArray(data.rating.stars),
            score: data.rating.average,
            director: director,
            casts: util.convertToCastString(data.casts),
            castsInfo: util.convertToCastInfos(data.casts),
            summary: data.summary
        }
        console.log(movie)
        this.setData({
            movie: movie
        })
    },
    viewMoviePostImg: function (e) {
        var src = e.currentTarget.dataset.src;
        wx.previewImage({
            current: src,
            urls: [src]
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