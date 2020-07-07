class FaceScan {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.degree = 0;
    this.init(canvas, width, height);
  }
  init(canvas, width, height) {
    this.canvasInfo = {
      dpr: wx.getSystemInfoSync().pixelRatio,
      width,
      height
    };

    const { dpr } = this.canvasInfo;
    const offsetTop = 50;
    const offsetLeftRight = 60;
    const radius = (width - 2 * offsetLeftRight) / 2;
    const centerX = width / 2;
    const centerY = offsetTop + radius;
    this.cameraInfo = {
      offsetTop,
      offsetLeftRight,
      radius,
      centerX,
      centerY
    };
    this.ctx.canvas.width = width * dpr;
    this.ctx.canvas.height = height * dpr;
    this.ctx.scale(dpr, dpr);

  }
  render() {
    const { ctx, canvas } = this;
    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.draw();
      canvas.requestAnimationFrame(renderLoop);
    }
    canvas.requestAnimationFrame(renderLoop);
  }
  draw() {
    const { ctx } = this;
    this.drawCameraViewfinder(ctx);
    this.drawCameraDecoration(ctx);
    this.drawTipsText(ctx);
    this.drawScan(ctx);
  }
  drawCameraViewfinder(ctx) {
    const { width, height } = this.canvasInfo;
    const { radius, centerX, centerY } = this.cameraInfo;
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = '#272E40';
    ctx.fill();
  }
  drawCameraDecoration(ctx) {
    const { width } = this.canvasInfo;
    const { offsetTop, centerX, centerY } = this.cameraInfo;
    
    const dwidth = 1;
    const dheight = 5;
    const x = (width - dwidth) / 2;
    const y = offsetTop - 10 - dheight;
    let i = 0;
    const degree = 10;
    ctx.save();
    while (i <= 360) {
      ctx.translate(centerX, centerY);
      ctx.rotate(degree * Math.PI / 180);
      ctx.translate(-centerX, -centerY);
      // 旋转前(红色矩形)
      ctx.fillStyle = '#9CA5AD';
      ctx.fillRect(x, y, dwidth, dheight);
      i += degree;
    }
    ctx.restore();
  }
  drawTipsText(ctx) {
    const { width: canvasWidth } = this.canvasInfo;
    const { offsetTop, radius } = this.cameraInfo;
    const text = '请将正脸面向屏幕';
    console.log(offsetTop, radius)
    ctx.font = '18px sans-serif';
    const { width } = ctx.measureText(text);
    const y = offsetTop + radius * 2 + 60;
    const x = (canvasWidth - width) / 2;
    ctx.fillStyle = '#fff';
    ctx.fillText(text, x, y);
  }
  drawScan(ctx) {
    const { radius, centerX, centerY } = this.cameraInfo;
    this.degree > 180 ? this.degree = 0 : this.degree++;
    const offsetDegree = this.degree;
    const linearGradientHeight = 50;
    const beginArc = this.computePoint(offsetDegree);
    const endArc = this.computePoint(offsetDegree + linearGradientHeight);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, beginArc.leftAngle, endArc.leftAngle, true);
    ctx.arc(centerX, centerY, radius, endArc.rightAngle, beginArc.rightAngle, true);
    ctx.closePath();
    const linearGradient = ctx.createLinearGradient(centerX, beginArc.leftY, centerX, endArc.leftY);
    linearGradient.addColorStop(0, 'rgba(25, 140, 255,0.6)');//25, 140, 255,0.6
    linearGradient.addColorStop(1, 'rgba(25, 140, 255,0)');
    ctx.fillStyle = linearGradient;
    ctx.fill();
  }
  computePoint(val) {
    const degree = val > 180 ? 180 : val;
    const oneDegree = Math.PI * 2 / 360;
    const { radius, centerX, centerY } = this.cameraInfo;
    //三角形斜边长度
    const cLength = radius;

    const computeDegree = degree > 90 ? 180 - degree : degree;
    //三角形分割线边长度
    const bLength = Math.cos(computeDegree * oneDegree) * cLength;
    //三角形短边长度
    const aLength = Math.sin(computeDegree * oneDegree) * cLength;
    //圆弧起始点及其对称点坐标
    const y = degree > 90 ? centerY + bLength : centerY - bLength;
    return {
      leftX: centerX - aLength,
      leftY: y,
      rightX: centerX + aLength,
      rightY: y,
      leftAngle: Math.PI * 1.5 - oneDegree * degree,
      rightAngle: Math.PI * 1.5 + oneDegree * degree
    }
  }
}

export default FaceScan;
