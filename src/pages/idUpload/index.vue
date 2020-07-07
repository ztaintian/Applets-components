<template>
  <div class="img-upload">
    <div class="title">请您上传：身份证正面照</div>
    <div
      @click="uploadImg('imgUrl1')"
      class="upload"
      :style="'background:url('+imgUrl1+') center center no-repeat;background-size:contain;'"
    >
      <i class="icon iconfont">&#xe626;</i>
    </div>
    <!-- <ul>
      <li>姓名：朱元璋</li>
      <li>身份证号：11011010010101010</li>
    </ul>-->
    <div class="title">请您上传：身份证反面照</div>
    <div
      @click="uploadImg('imgUrl2')"
      class="upload"
      :style="'background:url('+imgUrl2+') center center no-repeat;background-size:contain;'"
    >
      <i class="icon iconfont">&#xe626;</i>
    </div>
    <!-- <ul>
      <li>证件有效期：2012/02/03--2055/02/03</li>
    </ul>-->
    <div class="common-btn mt60" @click="authentication">保存确认</div>
    <canvas canvas-id="front" class="canvas-css"></canvas>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgUrl1: "",
      imgUrl2: ""
    };
  },
  methods: {
    authentication() {
      // 实名认证
      wx.navigateTo({
        url: "/pages/index/index"
      });
    },
    uploadImg(type) {
      const that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["camera", "album"],
        success(res) {
          wx.getImageInfo({
            src: res.tempFilePaths[0],
            success(resInfo) {
              if (resInfo.width < resInfo.height) {
                const front = wx.createCanvasContext("front");
                var imgWidth = 300;
                var imgHeight = 150;
                front.rotate((270 * Math.PI) / 180);
                front.drawImage(
                  res.tempFilePaths[0],
                  -150,
                  0,
                  imgHeight,
                  imgWidth
                );
                // front.draw();
                //绘制完成后回调，第一个参数是是否清空上一次绘画结果，第二个参数是回调函数
                front.draw(false, function() {
                  wx.canvasToTempFilePath({
                    canvasId: "front",
                    success: function(resCanvas) {
                      var tempFilePath = resCanvas.tempFilePath;
                      that[type] = tempFilePath;
                      console.log("dfada", tempFilePath);
                    },
                    fail: function(res) {
                      console.log(res);
                    }
                  });
                });
              } else {
                that[type] = res.tempFilePaths[0];
                // wx.uploadFile({
                //   url: "http://10.17.5.120:8888/openapi/v2/uploadFaceImage",
                //   filePath: res.tempFilePaths[0],
                //   name: "file",
                //   formData: {
                //     account: "test"
                //   },
                //   success: function(resFile) {
                //     console.log(resFile);
                //     that[type] = res.tempFilePaths[0];
                //   }
                // });
              }
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.img-upload {
  .title {
    font-size: 30rpx;
    font-weight: bold;
    width: 600rpx;
    margin: 40rpx auto 0;
  }
  .mt-60 {
    margin-top: 60rpx;
  }
  .canvas-css {
    position: absolute;
    top: -20000px;
    z-index: -99999;
  }
  ul {
    width: 600rpx;
    margin: 0 auto;
    color: #ababab;
    li {
      line-height: 60rpx;
      font-size: 30rpx;
    }
  }
  .upload {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1rpx dashed #eee;
    width: 600rpx;
    margin: 20rpx auto;
    height: 300rpx;
    .iconfont {
      font-size: 40rpx;
      color: #109cee;
    }
  }
  .common-btn {
    width: 600rpx;
    color: #fff;
    text-align: center;
    margin: 60rpx auto 0;
    font-size: 30rpx;
    background: #409eff;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 50rpx;
    font-weight: bold;
  }
}
</style>