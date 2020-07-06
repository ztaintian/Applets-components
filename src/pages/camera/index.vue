<template>
  <view class="camera-wrapper">
    <camera class="camera" device-position="front" flash="off" binderror="error" />
    <view class="canvas-warpper">
      <canvas type="2d" id="canvas" style="width: 100%;height: 100%;"></canvas>
    </view>
  </view>
</template>

<script>
import FaceScan from "./face-scan";
export default {
  mounted() {
    const query = wx.createSelectorQuery();
    query
      .select("#canvas")
      .fields({ node: true, size: true })
      .exec(this.initCanvas.bind(this));
  },
  methods: {
    initCanvas(res) {
      const { node, width, height } = res[0];
      this.facescan = new FaceScan(node, width, height);
      this.facescan.render();
    },
    takePhoto() {
      const ctx = wx.createCameraContext();
      ctx.takePhoto({
        quality: "high",
        success: res => {
          this.setData({
            src: res.tempImagePath
          });
        }
      });
    }
  }
};
</script>

<style>
.camera-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.camera-wrapper .camera {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
.camera-wrapper .canvas-warpper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>