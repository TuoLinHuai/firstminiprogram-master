var app = getApp();
var util = require("../../../utils/util.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigateTitle: "",
        movies: [],
        requestUrl: "",
        totalCount: 0,
        isEmpty: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var category = options.category;
        //this.data.navigateTitle = category;
        this.setData({
            navigateTitle: category
        })
        // 获取正在热映: https://douban.uieee.com/v2/movie/in_theaters
        // 获取电影Top250：https://douban.uieee.com/v2/movie/top250
        // 获取即将上映电影：https://douban.uieee.com/v2/movie/coming_soon
        var inTheaterUrl = app.globalData.doubanBase + "/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a";
        var comingSoonUrl = app.globalData.doubanBase + "/coming_soon?apikey=0df993c66c0c636e29ecbb5344252a4a";
        var top250 = app.globalData.doubanBase + "/top250?apikey=0df993c66c0c636e29ecbb5344252a4a";
        var dataUrl = "";
        switch (category) {
            case "正在热映":
                dataUrl = inTheaterUrl;
                break;
            case "即将上映":
                dataUrl = comingSoonUrl;
                break;
            case "豆瓣Top250":
                dataUrl = top250;
                break;
        }
        this.data.requestUrl = dataUrl
        wx.showNavigationBarLoading()
        util.http(dataUrl, this.processDoubanData)
    },
    processDoubanData: function (moviesParam) {
        var movies = [];
        for (var idx in moviesParam.subjects) {
            var subject = moviesParam.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "···";
            }
            var starts = util.convertToStarsArray(subject.rating.stars);
            var temp = {
                stars: starts,
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp);

        }
        var totalMovies = "";
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies)
        } else {
            this.data.isEmpty = false;
            totalMovies = movies;
        }
        this.data.totalCount += 20;
        this.setData({movies: totalMovies})
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
    },
    onReady: function (options) {
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
            success(res) {
            }
        })
    },
    onReachBottom: function (event) {
        var newUrl = this.data.requestUrl + "&start=" + this.data.totalCount + "&count=20"
        util.http(newUrl, this.processDoubanData)
        wx.showNavigationBarLoading()
    },
    onPullDownRefresh: function (event) {
        var newUrl = this.data.requestUrl + "&start=0&count=20"
        this.data.movies = {};
        this.data.isEmpty = true;
        this.data.totalCount = 0;
        util.http(newUrl, this.processDoubanData)
        wx.showNavigationBarLoading()
    },
    onMovieTap: function (event) {
        wx.navigateTo({
            url: "../movie-detail/movie-detail?id="+event.currentTarget.dataset.movieId
        });
    }
})