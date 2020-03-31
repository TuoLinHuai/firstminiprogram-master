//index.js
//获取应用实例
const app = getApp()

Page({
    data: {},
    //事件处理函数
    onTap: function () {
        /*wx.navigateTo({
            url: '../posts/post'
        });*/

        wx.redirectTo({
            url: '../posts/post',
            success(res) {
                // 成功才执行该方法
            },
            fail(res) {
                // 失败才执行该方法
            },
            complete(res) {
                // 跳转结束，不管成功与否都执行
            }
        })
    },
    onLoad: function () {

    },
})
