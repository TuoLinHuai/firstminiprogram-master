var postsData = require('../../../data/post-data.js');

Page({
    data: {
      isPlayingMusic: false
    },
    onLoad: function (option) {
        var postId = option.id;
        let postData = postsData.postList[postId];
        this.setData({
            postData: postData,
            postId: option.id
        })
        var postsCollected = {
            1: "false",
            2: "false",
            3: "false",
            4: "false",
            5: "false",
        }
        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {}
            postsCollected[postId] = false
            wx.setStorageSync('posts_collected', postsCollected)
        }
    },
    onColletionTap: function (event) {
        var postsCollected = wx.getStorageSync('posts_collected')
        var postCollected = postsCollected[this.data.postId];
        postCollected = !postCollected
        postsCollected[this.data.postId]=postCollected
        wx.setStorageSync('posts_collected', postsCollected)
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? '收藏成功' : '取消收藏',
            duration: 1000,
            icon: 'success'
        })
    },
    onShareTap: function (event) {
        wx.showActionSheet({
            itemList: [
                "分享给微信好友",
                "分享到朋友去",
                "分享到QQ",
                "分享到微博",
            ],
            itemColor: "#405f80",
            success(res) {
                // res.cancel 用户是否点击了取消按钮
                // res.tapIndex 数组元素的序号，从0开始
            }
        })
    },
    onMusicTap: function (event) {
        let playingMusic = this.data.isPlayingMusic;
        if (playingMusic) {
            wx.pauseBackgroundAudio()
            this.setData({
                isPlayingMusic: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: 'http://ws.stream.qqmusic.qq.com/C100000Zn0vS4fKKo8.m4a?fromtag=38',
                title: '夜夜夜夜-齐秦',
                coverImgUrl: 'http://y.gtimg.cn/music/photo_new/T002R150x150M000001TEc6V0kjpVC.jpg?max_age=2592000'
            })
            this.setData({
                isPlayingMusic: false
            })
        }
    }
})