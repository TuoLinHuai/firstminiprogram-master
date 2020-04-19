const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

module.exports = {
    formatTime: formatTime,
    convertToStarsArray: convertToStarsArray,
    http: http,
    convertToCastString: convertToCastString,
    convertToCastInfos: convertToCastInfos
}

function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        } else {
            array.push(0)
        }
    }
    return array;
}

function http(url, callbakc) {
    wx.request({
        url: url,
        method: 'GET',
        header: {
            "Content-Type": "application/xml"
        },
        success: function (res) {
            callbakc(res.data);
        },
        fail: function (res) {
        },
    })
}

function convertToCastString(casts) {
    var castsjoin = "";
    for (var index in casts) {
        castsjoin = castsjoin + casts[index].name + " / "
    }
    return castsjoin.substring(0, castsjoin.length - 2)
}

function convertToCastInfos(casts) {
    var castsArray = []
    for (var index in casts) {
        var cast = {
            img: casts[index].avatars ? casts[index].avatars.large : "",
            name: casts[index].name
        }
        castsArray.push(cast);
    }
    return castsArray;
}