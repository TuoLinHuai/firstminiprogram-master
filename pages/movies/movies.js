var util = require('../../utils/util.js')
var app = getApp();
Page({
    data: {
        inTheater: {},
        comingSoon: {},
        searchResult: {},
        top250: {},
        notData: false,
        containerShow: true,
        searchPannel: false
    },
    onLoad: function () {
        // 获取正在热映: https://douban.uieee.com/v2/movie/in_theaters
        // 获取电影Top250：https://douban.uieee.com/v2/movie/top250
        // 获取即将上映电影：https://douban.uieee.com/v2/movie/coming_soon
        var inTheaterUrl = app.globalData.doubanBase + "/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/coming_soon?apikey=0df993c66c0c636e29ecbb5344252a4a&start=0&count=3";
        var top250 = app.globalData.doubanBase + "/top250?apikey=0df993c66c0c636e29ecbb5344252a4a&start=0&count=3";
        this.getMovieListData(inTheaterUrl, "inTheater", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250, "top250", "豆瓣Top250");
    },
    getMovieListData: function (url, key, category) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                "Content-Type": "application/xml"
            },
            success: function (res) {
                that.processDoubanData(res.data, key, category)
            },
            fail: function (res) {
            },
        })
    },

    processDoubanData: function (moviesParam, key, category) {
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
        var readyData = {};
        readyData[key] = {movies: movies, category: category};
        if (key === "searchResult" && movies.length === 0) {
            this.setData({notData: true})
        }
        this.setData(readyData)
    },
    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: "more-movie/more-movie?category=" + category
        });
    },
    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPannel: true
        })
    },
    onCancelImgTap: function (event) {
        this.setData({
            containerShow: true,
            searchPannel: false,
            searchResult: {}
        })
    },
    onBindChange: function (event) {
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase + "/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "")
    },
    onMovieTap: function (event) {
        wx.navigateTo({
            url: "movie-detail/movie-detail?id="+event.currentTarget.dataset.movieId
        });
    }
})