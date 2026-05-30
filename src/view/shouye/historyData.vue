<template>
  <!-- 历史数据 -->
  <div ref="historyData" class="historyData fadein" v-show="visible">
    <!-- 顶部框 -->
    <div class="topFrame">
      <div class="bangs"></div>
      <div class="header">
        <div class="header_menu" style="width: 35%">
          <a-range-picker
            v-model:value="queryDate"
            format="YYYY-MM-DD"
            style="width: 100%"
          />
        </div>
        <div class="header_menu">
          <a-button type="primary"><SearchOutlined />查询</a-button>
        </div>
      </div>
      <div class="chartRegion">
        <div class="topChart" id="topChart1" ref="topChart1"></div>
        <div class="topChart" id="topChart2" ref="topChart2"></div>
        <div class="topChart" id="topChart3" ref="topChart3"></div>
      </div>
    </div>
    <!-- 底部区域-->
    <div class="bottomRegion">
      <!-- 左边框 -->
      <div class="leftFrame">
        <div class="bangs"></div>
        <div class="header">
          <div class="select">
            <div
              :class="obj.state ? 'sewageIndex selected' : 'sewageIndex'"
              v-for="(obj, index) in sewageArr"
              :index="index"
              @click="sewageIndexChange(obj)"
            >
              {{ obj.name }}
            </div>
          </div>
        </div>
        <div class="leftEchart" id="leftEchart"></div>
      </div>
      <!-- 右边框 -->
      <div class="rightFrame">
        <div class="bangs"></div>
        <div class="rightEchart" id="rightEchart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, nextTick, reactive, onMounted } from "vue";
import moment from "moment";
import * as echarts from "echarts";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons-vue";

// 首页传值
const props = defineProps(["visible"]);
// 当前组件是否显示
let visible = ref(false);
// 首次进入历史数据进行查询，之后只切换历史数据面板的显示
let firstQuery = ref(true);
// 查询日期
let queryDate = ref([dayjs().subtract(7, "day"), dayjs()]);
// 污染物数组
const sewageArr = reactive([
  { name: "COD", state: true },
  { name: "SS", state: false },
  { name: "氨氮", state: false },
  { name: "TP", state: false },
  { name: "TN", state: false },
  { name: "pH", state: false },
]);

onMounted(() => {});

watch(props, (e) => {
  if (e.visible) {
    visible.value = true;
    if (firstQuery.value) {
      // 宽度缩放比
      const widthScale = document.body.clientWidth / screen.availWidth;
      // 高度缩放比
      const heightScale =
        document.body.clientHeight / (screen.availHeight - 109);
      // 时间控件大小根据页面缩放比自适应
      const timeControlScale = setInterval(() => {
        // 获取时间控件
        const timeControl = [
          ...document.getElementsByClassName("ant-picker-dropdown"),
        ];
        // 存在长度length则表示获取到时间控件元素
        if (timeControl.length) {
          // 设置缩放比
          timeControl[0].style.transform = `scale(${widthScale},${heightScale})`;
          timeControl[0].style.transformOrigin = "left top";
          // 销毁这个定时器
          clearInterval(timeControlScale);
        }
      }, 500);
      // 初始化视图
      initEcahrt();
      firstQuery.value = false;
    }
  } else {
    visible.value = false;
  }
});

function initEcahrt() {
  // 使用nextTick等待echarts视图容器加载出来，否则会出现视图过小原因
  nextTick(() => {
    // 顶部视图1
    const chart1 = echarts.init(document.getElementById("topChart1"));
    const options1 = {
      title: {
        text: "电耗趋势",
        x: "center",
        y: "top",
        textStyle: {
          color: "#BBFFFF",
          fontWeight: "500",
        },
      },
      xAxis: {
        type: "time",
        interval: 2,
        splitNumber: 3,
        axisLine: {
          lineStyle: {
            color: "#BBFFFF",
          },
        },
        axisLabel: {
          interval: 2,
          formatter: (e) => {
            return `${moment(e).month() + 1}月${moment(e).date()}日`;
          },
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#BBFFFF",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#AFEEEE",
          },
        },
      },
      grid: {
        left: "10%",
        right: "5%",
        top: "10%",
        bottom: "12%",
      },
      tooltip: {
        show: true,
        trigger: "axis",
        extraCssText:
          "background: linear-gradient(270deg, #1D4A63 0%, #0F244D 100%);border:0px;color:#BBFFFF;",
        formatter: (e) => {
          const dataTime = moment(e[0].data[0]);
          const date = `${dataTime.year()}年${
            dataTime.month() + 1
          }月${dataTime.date()}日`;
          const marker = e[0].marker;
          const data = e[0].data[1];
          return `${marker}${date}：${data}`;
        },
      },
      series: [
        {
          data: [
            ["2024-03-01", 120],
            ["2024-03-02", 200],
            ["2024-03-03", 150],
            ["2024-03-04", 80],
            ["2024-03-05", 70],
            ["2024-03-06", 110],
            ["2024-03-07", 130],
          ],
          type: "bar",
          barWidth: "50%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#04CDF0",
                },
                {
                  offset: 1,
                  color: "#062C50",
                },
              ]),
            },
          },
        },
      ],
    };
    chart1.setOption(options1);
    // 顶部视图2
    const chart2 = echarts.init(document.getElementById("topChart2"));
    const options2 = {
      title: {
        text: "药耗趋势",
        textAlign: "left",
        x: "center",
        y: "top",
        textStyle: {
          color: "#BBFFFF",
          fontWeight: "500",
        },
      },
      xAxis: {
        type: "time",
        interval: 2,
        splitNumber: 3,
        axisLine: {
          lineStyle: {
            color: "#BBFFFF",
          },
        },
        axisLabel: {
          interval: 2,
          formatter: (e) => {
            return `${moment(e).month() + 1}月${moment(e).date()}日`;
          },
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#BBFFFF",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#AFEEEE",
          },
        },
      },
      grid: {
        left: "10%",
        right: "5%",
        top: "10%",
        bottom: "12%",
      },
      tooltip: {
        show: true,
        trigger: "axis",
        extraCssText:
          "background: linear-gradient(270deg, #1D4A63 0%, #0F244D 100%);border:0px;color:#BBFFFF;",
        formatter: (e) => {
          const dataTime = moment(e[0].data[0]);
          const date = `${dataTime.year()}年${
            dataTime.month() + 1
          }月${dataTime.date()}日`;
          const marker = e[0].marker;
          const data = e[0].data[1];
          return `${marker}${date}：${data}`;
        },
      },
      series: [
        {
          data: [
            ["2024-03-01", 160],
            ["2024-03-02", 200],
            ["2024-03-03", 180],
            ["2024-03-04", 120],
            ["2024-03-05", 140],
            ["2024-03-06", 150],
            ["2024-03-07", 140],
          ],
          type: "bar",
          barWidth: "50%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#04CDF0",
                },
                {
                  offset: 1,
                  color: "#062C50",
                },
              ]),
            },
          },
        },
      ],
    };
    chart2.setOption(options2);
    // 顶部视图3
    const chart3 = echarts.init(document.getElementById("topChart3"));
    const options3 = {
      title: {
        text: "产泥趋势",
        textAlign: "left",
        x: "center",
        y: "top",
        textStyle: {
          color: "#BBFFFF",
          fontWeight: "500",
        },
      },
      xAxis: {
        type: "time",
        splitNumber: 3,
        axisLine: {
          lineStyle: {
            color: "#BBFFFF",
          },
        },
        axisLabel: {
          formatter: (e) => {
            return `${moment(e).month() + 1}月${moment(e).date()}日`;
          },
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#BBFFFF",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#AFEEEE",
          },
        },
      },
      grid: {
        left: "10%",
        right: "5%",
        top: "10%",
        bottom: "12%",
      },
      tooltip: {
        show: true,
        trigger: "axis",
        extraCssText:
          "background: linear-gradient(270deg, #1D4A63 0%, #0F244D 100%);border:0px;color:#BBFFFF;",
        formatter: (e) => {
          const dataTime = moment(e[0].data[0]);
          const date = `${dataTime.year()}年${
            dataTime.month() + 1
          }月${dataTime.date()}日`;
          const marker = e[0].marker;
          const data = e[0].data[1];
          return `${marker}${date}：${data}`;
        },
      },
      series: [
        {
          data: [
            ["2024-03-01", 160],
            ["2024-03-02", 150],
            ["2024-03-03", 155],
            ["2024-03-04", 140],
            ["2024-03-05", 145],
            ["2024-03-06", 170],
            ["2024-03-07", 160],
          ],
          type: "bar",
          barWidth: "50%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#04CDF0",
                },
                {
                  offset: 1,
                  color: "#062C50",
                },
              ]),
            },
          },
        },
      ],
    };
    chart3.setOption(options3);

    setLeftEchart("COD");

    // 右侧视图
    let rightChart = echarts.init(document.getElementById("rightEchart"));
    const rightOptions = {
      title: {
        text: "进出水量趋势",
        textAlign: "left",
        x: "center",
        y: "5%",
        textStyle: {
          color: "#BBFFFF",
          fontWeight: "500",
        },
      },
      grid: {
        left: "10%",
        right: "5%",
        top: "15%",
        bottom: "10%",
      },
      tooltip: {
        trigger: "axis",
        extraCssText:
          "background: linear-gradient(270deg, #1D4A63 0%, #0F244D 100%);border:0px;color:#BBFFFF;",
        formatter: function (params) {
          // 日期
          const date = `<div >${moment(params[0].name).format(
            "YYYY-MM-DD"
          )}</div>`;
          // 数据
          let data = "";
          params.map((item) => {
            // 标记
            const marker = item.marker;
            data += `<div >${marker} ${item.seriesName}：${item.value}</div>`;
          });
          return `${date}${data}`;
        },
      },
      legend: {
        top: "0%",
        right: "2%",
        icon: "roundRect",
        textStyle: {
          color: "#AFEEEE",
          lineHeight: 0,
        },
        itemWidth: 15,
        itemHeight: 15,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "2024-03-01",
            "2024-03-02",
            "2024-03-03",
            "2024-03-04",
            "2024-03-05",
            "2024-03-06",
            "2024-03-07",
          ],
          splitNumber: 2,
          axisLine: {
            lineStyle: {
              color: "#BBFFFF",
            },
          },
          axisLabel: {
            formatter: (e) => {
              return `${moment(e).month() + 1}月${moment(e).date()}日`;
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#BBFFFF",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#AFEEEE",
            },
          },
        },
      ],
      series: [
        {
          name: "进水量",
          type: "bar",
          data: [22.0, 42.9, 37.0, 33.2, 25.6, 76.7, 35.6],
          barWidth: "30%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#04CDF0",
                },
                {
                  offset: 1,
                  color: "#062C50",
                },
              ]),
            },
          },
        },
        {
          name: "出水量",
          type: "bar",
          data: [32.6, 51.9, 29.0, 26.4, 28.7, 40.7, 75.6],
          barWidth: "30%",
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#1B8CDC",
                },
                {
                  offset: 1,
                  color: "#062C50",
                },
              ]),
            },
          },
        },
      ],
    };
    rightChart.setOption(rightOptions);
    window.onresize = function () {
      chart1.resize();
      chart2.resize();
      chart3.resize();
      leftChart.resize();
      rightChart.resize();
    };
  });
}
// 设置左侧视图
function setLeftEchart(factor) {
  const factorDataObj = {
    COD: {
      enterWater: [
        ["2023-10-01 00:00", 670],
        ["2023-10-01 01:00", 730],
        ["2023-10-01 02:00", 620],
        ["2023-10-01 03:00", 634],
        ["2023-10-01 04:00", 633],
        ["2023-10-01 05:00", 660],
        ["2023-10-01 06:00", 690],
      ],
      outWater: [
        ["2023-10-01 00:00", 600],
        ["2023-10-01 01:00", 700],
        ["2023-10-01 02:00", 640],
        ["2023-10-01 03:00", 664],
        ["2023-10-01 04:00", 653],
        ["2023-10-01 05:00", 690],
        ["2023-10-01 06:00", 693],
      ],
    },
    SS: {
      enterWater: [
        ["2023-10-01 00:00", 546],
        ["2023-10-01 01:00", 345],
        ["2023-10-01 02:00", 324],
        ["2023-10-01 03:00", 624],
        ["2023-10-01 04:00", 1033],
        ["2023-10-01 05:00", 620],
        ["2023-10-01 06:00", 310],
      ],
      outWater: [
        ["2023-10-01 00:00", 985],
        ["2023-10-01 01:00", 233],
        ["2023-10-01 02:00", 528],
        ["2023-10-01 03:00", 129],
        ["2023-10-01 04:00", 648],
        ["2023-10-01 05:00", 125],
        ["2023-10-01 06:00", 759],
      ],
    },
    氨氮: {
      enterWater: [
        ["2023-10-01 00:00", 23],
        ["2023-10-01 01:00", 43],
        ["2023-10-01 02:00", 82],
        ["2023-10-01 03:00", 84],
        ["2023-10-01 04:00", 46],
        ["2023-10-01 05:00", 243],
        ["2023-10-01 06:00", 64],
      ],
      outWater: [
        ["2023-10-01 00:00", 34],
        ["2023-10-01 01:00", 132],
        ["2023-10-01 02:00", 53],
        ["2023-10-01 03:00", 87],
        ["2023-10-01 04:00", 93],
        ["2023-10-01 05:00", 111],
        ["2023-10-01 06:00", 32],
      ],
    },
    TP: {
      enterWater: [
        ["2023-10-01 00:00", 1253],
        ["2023-10-01 01:00", 1277],
        ["2023-10-01 02:00", 1420],
        ["2023-10-01 03:00", 1230],
        ["2023-10-01 04:00", 1902],
        ["2023-10-01 05:00", 1620],
        ["2023-10-01 06:00", 1750],
      ],
      outWater: [
        ["2023-10-01 00:00", 920],
        ["2023-10-01 01:00", 968],
        ["2023-10-01 02:00", 1302],
        ["2023-10-01 03:00", 704],
        ["2023-10-01 04:00", 689],
        ["2023-10-01 05:00", 732],
        ["2023-10-01 06:00", 946],
      ],
    },
    TN: {
      enterWater: [
        ["2023-10-01 00:00", 12],
        ["2023-10-01 01:00", 6],
        ["2023-10-01 02:00", 7],
        ["2023-10-01 03:00", 3],
        ["2023-10-01 04:00", 25],
        ["2023-10-01 05:00", 26],
        ["2023-10-01 06:00", 12],
      ],
      outWater: [
        ["2023-10-01 00:00", 52],
        ["2023-10-01 01:00", 12],
        ["2023-10-01 02:00", 56],
        ["2023-10-01 03:00", 2],
        ["2023-10-01 04:00", 3],
        ["2023-10-01 05:00", 12],
        ["2023-10-01 06:00", 12],
      ],
    },
    pH: {
      enterWater: [
        ["2023-10-01 00:00", 7.2],
        ["2023-10-01 01:00", 6.5],
        ["2023-10-01 02:00", 7.3],
        ["2023-10-01 03:00", 7],
        ["2023-10-01 04:00", 8.7],
        ["2023-10-01 05:00", 9.2],
        ["2023-10-01 06:00", 9],
      ],
      outWater: [
        ["2023-10-01 00:00", 6.8],
        ["2023-10-01 01:00", 7],
        ["2023-10-01 02:00", 7.2],
        ["2023-10-01 03:00", 7.2],
        ["2023-10-01 04:00", 6],
        ["2023-10-01 05:00", 6.4],
        ["2023-10-01 06:00", 7.8],
      ],
    },
  };

  // 左侧视图
  let leftChart = echarts.init(document.getElementById("leftEchart"));
  const leftOptions = {
    xAxis: {
      type: "time",
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#AFEEEE",
        },
      },
      axisLabel: {
        color: "#AFEEEE",
        formatter: function (params) {
          const currentDate = moment(params).format("HH:mm");
          return currentDate;
        },
      },
    },
    tooltip: {
      show: true,
      trigger: "axis",
      extraCssText:
        "background: linear-gradient(270deg, #1D4A63 0%, #0F244D 100%);border:0px;color:#BBFFFF;",
      formatter: function (params) {
        // 日期
        const date = `<div >${moment(params[0].value[0]).format(
          "MM-DD HH:mm"
        )}</div>`;
        // 数据
        let data = "";
        params.map((item) => {
          // 标记
          const marker = item.marker;
          data += `<div >${marker} ${item.seriesName}：${item.value[1]}</div>`;
        });
        return `${date}${data}`;
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        lineStyle: {
          color: "#AFEEEE",
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#AFEEEE",
        },
      },
      axisLabel: {
        color: "#AFEEEE",
      },
      splitNumber: 4,
    },
    series: [
      {
        name: "出水口COD",
        data: factorDataObj[factor]["outWater"],
        type: "line",
        color: "#04CDF0",
      },
      {
        name: "进水口COD",
        data: factorDataObj[factor]["enterWater"],
        type: "line",
        color: "#1B8CDC",
      },
    ],
    grid: {
      top: "10%",
      left: "10%",
      right: "5%",
      bottom: "10%",
    },
    legend: {
      show: true,
      top: 0,
      icon: "roundRect",
      textStyle: {
        color: "#AFEEEE",
        lineHeight: 0,
      },
      itemWidth: 15,
      itemHeight: 15,
    },
  };
  leftChart.setOption(leftOptions);
}
// 污染指标切换事件
function sewageIndexChange(e) {
  sewageArr.map((obj) => {
    if (e.name !== obj.name) {
      obj.state = false;
    } else {
      obj.state = true;
    }
  });
  setLeftEchart(e.name);
}
</script>

<style >
::v-deep .ant-picker-dropdown {
  transform: calc(2) !important;
}
</style>
