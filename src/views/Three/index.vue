<template>
  <div>
    <div class="content">
      <div class="neirong">
        <!--图例-->
        <div class="legend">
          <canvas ref="legend"></canvas>
        </div>
        <!--瀑布图-->
        <div class="waterFall" ref="waterFallContent" @mousemove="waterFallMove($event)" @mouseleave="waterFallLeave">
          <canvas ref="waterFall"></canvas>
          <!--鼠标移入弹出框-->
          <div ref="tip" class="tip"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import colormap from 'colormap'
// colormap：颜色库
// legend：图例
// waterFall：瀑布图
// waterFallList：瀑布图源数据
// waterFallIndex：瀑布图定时器用到的计数标识
// waterFallCopyList：瀑布图二维数组（用来显示数据做的临时储存）
// waterFallIntervals：瀑布图定时器
// waterFallWidth：瀑布图的宽度（后端返回的数据length）
// waterFallHeight：瀑布图定高度（也可以理解成渲染次数 例如30次渲染完成）
// maxNum：图例最大值
// minNum：图例最小值
export default {
  name: "index",
  data () {
    return {
      colormap: [],
      legend: null,
      waterFall: null,
      waterFallList: [],
      waterFallIndex: 0,
      waterFallCopyList: [],
      waterFallIntervals: null,
      waterFallWidth: 0,
      waterFallHeight: 0,
      maxNum: 10,
      minNum: 0
    }
  },
  mounted () {
    let dx = this
    dx.setColormap()
    dx.createLegendCanvas()
    dx.queryChartList()
  },
  destroyed () {
    let dx = this
    clearInterval(dx.waterFallIntervals)
  },
  methods: {
    setColormap () {
      let dx = this
      dx.colormap = colormap({
        colormap: 'jet',
        nshades: 150,
        format: 'rba',
        alpha: 1,
      })
    },
    //创建图例
    createLegendCanvas () {
      let dx = this
      let legendRefs = dx.$refs.legend
      dx.legend = legendRefs.getContext('2d')
      let legendCanvas = document.createElement('canvas')
      legendCanvas.width = 1
      let legendCanvasTemporary = legendCanvas.getContext('2d')
      const imageData = legendCanvasTemporary.createImageData(1, dx.colormap.length)
      for (let i = 0; i < dx.colormap.length; i++) {
        const color = dx.colormap[i]
        imageData.data[imageData.data.length - i * 4 + 0] = color[0]
        imageData.data[imageData.data.length - i * 4 + 1] = color[1]
        imageData.data[imageData.data.length - i * 4 + 2] = color[2]
        imageData.data[imageData.data.length - i * 4 + 3] = 255
      }
      legendCanvasTemporary.putImageData(imageData, 0, 0)
      dx.legend.drawImage(legendCanvasTemporary.canvas,
        0, 0, 1, dx.colormap.length, 50, 0, 200, dx.legend.canvas.height)
    },
    // 创建瀑布图
    createWaterFallCanvas () {
      let dx = this
      let waterFall = dx.$refs.waterFall
      dx.waterFall = waterFall.getContext('2d')
      waterFall.width = dx.waterFallWidth
      waterFall.height = dx.$refs.waterFallContent.offsetHeight
    },
    //单行图像
    rowToImageData (data) {
      let dx = this
      if (dx.$refs.waterFallContent !== undefined) {
        let canvasHeight = Math.floor(dx.$refs.waterFallContent.offsetHeight / dx.waterFallHeight)
        let imgOld = dx.waterFall.getImageData(0, 0, dx.waterFallWidth, canvasHeight * dx.waterFallIndex + 1)
        const imageData = dx.waterFall.createImageData(data.length, 1)
        for (let i = 0; i < imageData.data.length; i += 4) {
          const cindex = dx.colorMapData(data[i / 4], 0, 130)
          const color = dx.colormap[cindex]
          imageData.data[i + 0] = color[0]
          imageData.data[i + 1] = color[1]
          imageData.data[i + 2] = color[2]
          imageData.data[i + 3] = 255
        }
        for (let i = 0; i < canvasHeight; i++) {
          dx.waterFall.putImageData(imageData, 0, i)
        }
        dx.waterFall.putImageData(imgOld, 0, canvasHeight)
      }
    },
    //返回对于颜色库
    colorMapData (data, outMin, outMax) {
      let dx = this
      if (data <= dx.minNum) {
        return outMin
      } else if (data >= dx.maxNum) {
        return outMax
      }
      return Math.round(((data - dx.minNum) / (dx.maxNum - dx.minNum)) * outMax)
    },

    //鼠标移入瀑布图
    waterFallMove (event) {
      let dx = this
      let dataWidth = (dx.$refs.waterFallContent.offsetWidth / dx.waterFallWidth).toFixed(2)
      let dataHeight = (dx.$refs.waterFallContent.offsetHeight / dx.waterFallHeight).toFixed(2)
      let x = Math.floor(event.offsetX / dataWidth)
      let y = Math.floor(event.offsetY / dataHeight)
      try {
        dx.$refs.tip.innerHTML = '数值：' + JSON.parse(JSON.stringify(dx.waterFallCopyList[y][x]))
        let xx = event.offsetX + 5
        let yy = event.offsetY - 20
        if (event.offsetX > 1300) {
          xx = event.offsetX - 160
          yy = event.offsetY - 20
        }
        dx.$refs.tip.style.position = 'absolute'
        dx.$refs.tip.style.left = xx + 'px'
        dx.$refs.tip.style.top = yy + 'px'
        dx.$refs.tip.style.display = 'block'
      } catch (e) {
        dx.$refs.tip.style.display = 'none'
      }
    },
    waterFallLeave () {
      let dx = this
      dx.$refs.tip.style.display = 'none'
    },

    //假数据模拟
    queryChartList () {
      let dx = this
      dx.waterFallWidth = 1500
      dx.waterFallHeight = 30
      let data = []
      for (let i = 0; i < 1500; i++) {
        data.push(Math.floor(Math.random() * (20 - 1)) + 1)
      }
      if (dx.waterFall === null) {
        dx.createWaterFallCanvas(data.length)
      }
      dx.rowToImageData(data)
      dx.waterFallCopyList.unshift(data)
      dx.waterFallIndex++
      if (dx.waterFallIndex > dx.waterFallHeight) {
        dx.waterFallCopyList.pop()
      }
      dx.waterFallIntervals = setTimeout(() => {
        dx.queryChartList()
      }, 1000)
    },



  }
}


</script>

<style lang="less" scoped>
.neirong {
  width: 1800px;
  height: 100%;
  margin: 80px auto;
  display: flex;
  justify-content: center;
}

.legend {
  width: 25px;
  height: 500px;
}

canvas {
  width: 100%;
  height: 100%;
}

.waterFall {
  width: 1500px;
  height: 500px;
  position: relative;
}

.tip {
  pointer-events: none;
  display: none;
  background-color: #0404049e;
  border-radius: 10px;
  color: #fff;
  padding: 10px;
  box-sizing: border-box;
}
</style>
