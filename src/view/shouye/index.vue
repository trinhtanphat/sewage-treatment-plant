<template>
  <div id="whole" ref="whole">
    <!-- 页面阴影背景元素 -->
    <div class="back fadein" ref="shadowBg"></div>
    <!-- 头部栏 -->
    <div class="title a-fadeinT" ref="title"><span>{{ $t('app.title') }}</span><select class="language-switcher" :value="locale" @change="changeLocale($event.target.value)"><option value="vi">VI</option><option value="en">EN</option><option value="zh-CN">中文</option></select></div>
    <!-- 左侧面板 -->
    <div ref="leftPanel" class="leftPanel a-fadeinL">
      <!-- 电耗情况 -->
      <div class="common">
        <div class="leftTitleName">{{ $t('dashboard.power') }}</div>
        <div class="titleBg"></div>
        <div class="content power">
          <div class="common">
            <div class="top">
              {{ $t('dashboard.monthlyPower') }}<br />
              （kw-h）
            </div>
            <div class="bottom">
              <div class="number">
                <img src="../../assets/shouye/power.png" alt="" />
                <div style="color: #dab73f; width: 50%; margin-left: 10px">
                  69435
                </div>
              </div>
              <div class="number" style="color: #c8d4ea">
                <div>{{ $t('common.mom') }}</div>
                <div style="width: 50%; margin-left: 10px">176183</div>
              </div>
              <div class="number" style="color: #c8d4ea">
                <div>{{ $t('common.yoy') }}</div>
                <div style="width: 50%; margin-left: 10px">176183</div>
              </div>
            </div>
          </div>
          <div class="common">
            <div class="top">
              {{ $t('dashboard.dailyPower') }}<br />
              （kw-h）
            </div>
            <div class="bottom">
              <div class="number">
                <img src="../../assets/shouye/power.png" alt="" />
                <div style="color: #dab73f; width: 50%; margin-left: 10px">
                  69435
                </div>
              </div>
              <div class="number" style="color: #c8d4ea">
                <div>{{ $t('common.mom') }}</div>
                <div style="width: 50%; margin-left: 10px">176183</div>
              </div>
              <div class="number" style="color: #c8d4ea">
                <div>{{ $t('common.yoy') }}</div>
                <div style="width: 50%; margin-left: 10px">176183</div>
              </div>
            </div>
          </div>
          <div class="common">
            <div class="top">
              {{ $t('dashboard.perTonPower') }}<br />
              （kw-h）
            </div>
            <div class="bottom">
              <div class="number">
                <img src="../../assets/shouye/waterConsume.png" alt="" />
                <div style="color: #dab73f; width: 50%; margin-left: 10px">
                  69435
                </div>
              </div>
              <div class="number" style="color: #c8d4ea">
                <div>{{ $t('common.mom') }}</div>
                <div style="width: 50%; margin-left: 10px">176183</div>
              </div>
              <div class="number" style="color: #c8d4ea">
                <div>{{ $t('common.yoy') }}</div>
                <div style="width: 50%; margin-left: 10px">176183</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 水质实时数据 -->
      <div class="common">
        <div class="leftTitleName">{{ $t('dashboard.realtimeWater') }}</div>
        <div class="titleBg"></div>
        <div class="content waterData">
          <table class="waterTable">
            <tr>
              <th><img src="../../assets/shouye/item.png" alt="" /> {{ $t('common.item') }}</th>
              <th>
                <img src="../../assets/shouye/eventWater.png" alt="" /> {{ $t('common.inflow') }}
              </th>
              <th>
                <img src="../../assets/shouye/outWater.png" alt="" /> {{ $t('common.outflow') }}
              </th>
            </tr>
            <tr>
              <td>COD</td>
              <td>59.8597</td>
              <td>59.8597</td>
            </tr>
            <tr>
              <td>{{ $t('common.ammonia') }}</td>
              <td>59.8597</td>
              <td>59.8597</td>
            </tr>
            <tr>
              <td>TP</td>
              <td>59.8597</td>
              <td>59.8597</td>
            </tr>
            <tr>
              <td>TN</td>
              <td>59.8597</td>
              <td>59.8597</td>
            </tr>
            <tr>
              <td>pH</td>
              <td>59.8597</td>
              <td>59.8597</td>
            </tr>
            <tr>
              <td>SS</td>
              <td>59.8597</td>
              <td>59.8597</td>
            </tr>
            <!-- <thead>
              <tr>
                <td>
                  <img src="../../assets/shouye/item.png" alt="" />
                  项目
                </td>
              </tr>
              <tr>
                <td>
                  <img src="../../assets/shouye/eventWater.png" alt="" />
                  进水
                </td>
              </tr>
              <tr>
                <td>
                  <img src="../../assets/shouye/outWater.png" alt="" />
                  出水
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>COD</td>
                <td>59.8597</td>
                <td>59.8597</td>
              </tr>
              <tr>
                <td>COD</td>
                <td>59.8597</td>
                <td>59.8597</td>
              </tr>
            </tbody> -->
          </table>
        </div>
      </div>
      <!-- 今日水质趋势 -->
      <div class="common">
        <div class="leftTitleName">{{ $t('dashboard.todayTrend') }}</div>
        <div class="titleBg"></div>
        <div class="content waterLine">
          <div class="select">
            <div
              :class="obj.state ? 'sewageIndex selected' : 'sewageIndex'"
              v-for="(obj, index) in sewageArr"
              :index="index"
              @click="sewageIndexChange(obj)"
            >
              {{ obj.labelKey ? $t(obj.labelKey) : obj.name }}
            </div>
          </div>
          <div class="echartsLine" id="echartsLine" ref="echartsLine"></div>
        </div>
      </div>
    </div>
    <!-- 右侧面板 -->
    <div ref="rightPanel" class="rightPanel a-fadeinR">
      <!-- 污水处理情况 -->
      <div class="common">
        <div class="rightTitleName">{{ $t('dashboard.treatment') }}</div>
        <div class="titleBg"></div>
        <div class="content sewageHandle">
          <div class="left">
            <div class="common">
              <div style="height: 32px">
                <img src="../../assets/shouye/eventWaterNum.png" />
              </div>
              <div style="height: 32px">
                <div>{{ $t('common.tons', { value: 4010 }) }}</div>
                <div style="height: 2px">
                  <img
                    style="position: relative; top: -8px"
                    src="../../assets/shouye/line.png"
                  />
                </div>
                <div style="color: #86d2de">{{ $t('dashboard.todayInflow') }}</div>
              </div>
            </div>
            <div class="common">
              <div style="height: 32px">
                <img src="../../assets/shouye/outWaterNum.png" />
              </div>
              <div style="height: 32px">
                <div>{{ $t('common.tons', { value: 4010 }) }}</div>
                <div style="height: 2px">
                  <img
                    style="position: relative; top: -8px"
                    src="../../assets/shouye/line.png"
                  />
                </div>
                <div style="color: #86d2de">{{ $t('dashboard.todayOutflow') }}</div>
              </div>
            </div>
            <div class="common">
              <div style="height: 32px">
                <img src="../../assets/shouye/design.png" />
              </div>
              <div style="height: 32px">
                <div>{{ $t('common.tons', { value: 4010 }) }}</div>
                <div style="height: 2px">
                  <img
                    style="position: relative; top: -8px"
                    src="../../assets/shouye/line.png"
                  />
                </div>
                <div style="color: #86d2de">{{ $t('dashboard.designScale') }}</div>
              </div>
            </div>
          </div>
          <div class="right" id="echartsGauge"></div>
        </div>
      </div>
      <!-- 设备运行时间 -->
      <div class="common">
        <div class="rightTitleName">{{ $t('dashboard.equipmentRuntime') }}</div>
        <div class="titleBg"></div>
        <div class="content device">
          <table>
            <tr>
              <th style="width: 10%">{{ $t('dashboard.sequence') }}</th>
              <th style="width: 40%">{{ $t('dashboard.equipmentName') }}</th>
              <th style="width: 25%">{{ $t('dashboard.continuousRun') }}</th>
              <th style="width: 25%">{{ $t('dashboard.cumulativeRun') }}</th>
            </tr>
            <tr>
              <td style="width: 10%">
                <div></div>
                <div>0</div>
              </td>
              <td style="width: 40%"><div>{{ $t('dashboard.pumpName') }}</div></td>
              <td style="width: 25%"><div>2024h</div></td>
              <td style="width: 25%"><div>2024h</div></td>
            </tr>
            <tr>
              <td style="width: 10%">
                <div></div>
                <div>0</div>
              </td>
              <td style="width: 40%"><div>{{ $t('dashboard.pumpName') }}</div></td>
              <td style="width: 25%"><div>2024h</div></td>
              <td style="width: 25%"><div>2024h</div></td>
            </tr>
            <tr>
              <td style="width: 10%">
                <div></div>
                <div>0</div>
              </td>
              <td style="width: 40%"><div>{{ $t('dashboard.pumpName') }}</div></td>
              <td style="width: 25%"><div>2024h</div></td>
              <td style="width: 25%"><div>2024h</div></td>
            </tr>
            <tr>
              <td style="width: 10%">
                <div></div>
                <div>0</div>
              </td>
              <td style="width: 40%"><div>{{ $t('dashboard.pumpName') }}</div></td>
              <td style="width: 25%"><div>2024h</div></td>
              <td style="width: 25%"><div>2024h</div></td>
            </tr>
            <tr>
              <td style="width: 10%">
                <div></div>
                <div>0</div>
              </td>
              <td style="width: 40%"><div>{{ $t('dashboard.pumpName') }}</div></td>
              <td style="width: 25%"><div>2024h</div></td>
              <td style="width: 25%"><div>2024h</div></td>
            </tr>
            <tr>
              <td style="width: 10%">
                <div></div>
                <div>0</div>
              </td>
              <td style="width: 40%"><div>{{ $t('dashboard.pumpName') }}</div></td>
              <td style="width: 25%"><div>2024h</div></td>
              <td style="width: 25%"><div>2024h</div></td>
            </tr>
            <tr>
              <td style="width: 10%">
                <div></div>
                <div>0</div>
              </td>
              <td style="width: 40%"><div>{{ $t('dashboard.pumpName') }}</div></td>
              <td style="width: 25%"><div>2024h</div></td>
              <td style="width: 25%"><div>2024h</div></td>
            </tr>
            <tr>
              <td style="width: 10%">
                <div></div>
                <div>0</div>
              </td>
              <td style="width: 40%"><div>{{ $t('dashboard.pumpName') }}</div></td>
              <td style="width: 25%"><div>2024h</div></td>
              <td style="width: 25%"><div>2024h</div></td>
            </tr>
            <tr>
              <td style="width: 10%">
                <div></div>
                <div>0</div>
              </td>
              <td style="width: 40%"><div>{{ $t('dashboard.pumpName') }}</div></td>
              <td style="width: 25%"><div>2024h</div></td>
              <td style="width: 25%"><div>2024h</div></td>
            </tr>
          </table>
        </div>
      </div>
      <!-- 报警信息 -->
      <div class="common">
        <div class="rightTitleName">{{ $t('dashboard.alarms') }}</div>
        <div class="titleBg"></div>
        <div class="content warnInfo">
          <div class="top">
            <div class="redWarn">
              <div class="marker">
                <div></div>
              </div>
              <div class="info">
                <div>3</div>
                <div>{{ $t('dashboard.criticalAlarm') }}</div>
              </div>
            </div>
            <div class="yellowWarn">
              <div class="marker">
                <div></div>
              </div>
              <div class="info">
                <div>3</div>
                <div>{{ $t('dashboard.generalAlarm') }}</div>
              </div>
            </div>
            <div class="blueWarn">
              <div class="marker">
                <div></div>
              </div>
              <div class="info">
                <div>3</div>
                <div>{{ $t('dashboard.reminderAlarm') }}</div>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="tableTead">
              <div style="width: 35%">{{ $t('dashboard.alarmTime') }}</div>
              <div style="width: 20%">{{ $t('dashboard.alarmLevel') }}</div>
              <div style="width: 20%">{{ $t('dashboard.alarmContent') }}</div>
              <div style="width: 25%">{{ $t('dashboard.realtimeThreshold') }}</div>
            </div>
            <div class="tableMain">
              <div class="tableRow">
                <div style="width: 35%; font-size: 12px">
                  2022-06-20 12:34:10
                </div>
                <div style="width: 20%; color: #fc4a6e">{{ $t('dashboard.criticalAlarm') }}</div>
                <div style="width: 20%">{{ $t('dashboard.effluentPh') }}</div>
                <div style="width: 25%">0.0</div>
              </div>
              <div class="tableRow">
                <div style="width: 35%; font-size: 12px">
                  2022-06-20 12:34:10
                </div>
                <div style="width: 20%; color: #fc4a6e">{{ $t('dashboard.criticalAlarm') }}</div>
                <div style="width: 20%">{{ $t('dashboard.effluentPh') }}</div>
                <div style="width: 25%">0.0</div>
              </div>
              <div class="tableRow">
                <div style="width: 35%; font-size: 12px">
                  2022-06-20 12:34:10
                </div>
                <div style="width: 20%; color: #fc4a6e">{{ $t('dashboard.criticalAlarm') }}</div>
                <div style="width: 20%">{{ $t('dashboard.effluentPh') }}</div>
                <div style="width: 25%">0.0</div>
              </div>
              <div class="tableRow">
                <div style="width: 35%; font-size: 12px">
                  2022-06-20 12:34:10
                </div>
                <div style="width: 20%; color: #fc4a6e">{{ $t('dashboard.criticalAlarm') }}</div>
                <div style="width: 20%">{{ $t('dashboard.effluentPh') }}</div>
                <div style="width: 25%">0.0</div>
              </div>
              <div class="tableRow">
                <div style="width: 35%; font-size: 12px">
                  2022-06-20 12:34:10
                </div>
                <div style="width: 20%; color: #fc4a6e">{{ $t('dashboard.criticalAlarm') }}</div>
                <div style="width: 20%">{{ $t('dashboard.effluentPh') }}</div>
                <div style="width: 25%">0.0</div>
              </div>
              <div class="tableRow">
                <div style="width: 35%; font-size: 12px">
                  2022-06-20 12:34:10
                </div>
                <div style="width: 20%; color: #fc4a6e">{{ $t('dashboard.criticalAlarm') }}</div>
                <div style="width: 20%">{{ $t('dashboard.effluentPh') }}</div>
                <div style="width: 25%">0.0</div>
              </div>
              <div class="tableRow">
                <div style="width: 35%; font-size: 12px">
                  2022-06-20 12:34:10
                </div>
                <div style="width: 20%; color: #fc4a6e">{{ $t('dashboard.criticalAlarm') }}</div>
                <div style="width: 20%">{{ $t('dashboard.effluentPh') }}</div>
                <div style="width: 25%">0.0</div>
              </div>
              <div class="tableRow">
                <div style="width: 35%; font-size: 12px">
                  2022-06-20 12:34:10
                </div>
                <div style="width: 20%; color: #fc4a6e">{{ $t('dashboard.criticalAlarm') }}</div>
                <div style="width: 20%">{{ $t('dashboard.effluentPh') }}</div>
                <div style="width: 25%">0.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div ref="bottomBut" class="button a-fadeinB">
      <div
        :class="selectedMenu === 'shouye' ? 'selected common' : 'common'"
        @click="shouYeClick"
      >
        <img
          src="../../assets/shouye/menu1.png"
          style="margin-right: 3px"
        /> {{ $t('nav.home') }}
      </div>
      <div
        :class="selectedMenu === 'data' ? 'selected common' : 'common'"
        @click="historyDataClick"
      >
        <img
          src="../../assets/shouye/menu2.png"
          style="margin-right: 3px"
        /> {{ $t('nav.history') }}
      </div>
      <div
        :class="selectedMenu === 'craft' ? 'selected common' : 'common'"
        @click="craftAssistClick"
      >
        <img
          src="../../assets/shouye/menu3.png"
          style="margin-right: 3px"
        /> {{ $t('nav.process') }}
      </div>
      <div
        :class="selectedMenu === 'inspect' ? 'selected common' : 'common'"
        @click="inspectClick"
      >
        <img
          src="../../assets/shouye/menu4.png"
          style="margin-right: 3px"
        /> {{ $t('nav.inspection') }}
      </div>
    </div>
    <!-- 历史数据 -->
    <historyData
      :visible="selectedMenu === 'data' ? true : false"
    ></historyData>
    <!-- 工艺辅助 -->
    <craftAssist
      :visible="selectedMenu === 'craft' ? true : false"
      @openAnimation="openAnimation"
    >
    </craftAssist>
  </div>
  <!-- 三维污水厂 -->
  <sewageFactory
    @closeInspect="closeInspect"
    @craftAnimationEnd="craftAnimationEnd"
    :craftAnimationStatus="craftAnimationStatus"
    :craftAnimationType="craftAnimationType"
    :selectedMenu="selectedMenu"
  ></sewageFactory>
</template>
<script setup>
import moment from "moment";
import * as echarts from "echarts";
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { setLocale } from "../../i18n/index.js";
// 三维污水厂
import sewageFactory from "../threejs/index.vue";
// 历史数据
import historyData from "./historyData.vue";
// 工艺辅助
import craftAssist from "./craftAssist.vue";
const { locale, t } = useI18n();
// 污染物数组
const sewageArr = reactive([
  { name: "COD", state: true },
  { name: "SS", state: false },
  { name: "氨氮", labelKey: "common.ammonia", state: false },
  { name: "TP", state: false },
  { name: "TN", state: false },
  { name: "pH", state: false },
]);
// 阴影背景元素
const shadowBg = ref();
// 左侧面板元素
const leftPanel = ref();
// 右侧面板元素
const rightPanel = ref();
// 底部按钮元素
const bottomBut = ref();
// 顶部标题元素
const title = ref();
// 底部菜单选中项
const selectedMenu = ref("shouye");

// 总元素
const whole = ref();
// 工艺动画播放状态
let craftAnimationStatus = ref(false);
// 工艺动画类型
let craftAnimationType = ref("");

// 实时监听页面尺寸变化，做出相应适配
window.addEventListener("resize", () => {
  // 当前body元素的渲染尺寸和页面分辨率尺寸比值，
  const scale = `${document.body.clientWidth / 1920},${
    document.body.clientHeight / 941
  }`;
  whole.value.style.width = "1920px";
  whole.value.style.height = "941px";
  whole.value.style.transform = `scale(${scale})`;
});
onMounted(() => {
  // 当前body元素的渲染尺寸和页面分辨率尺寸比值
  const scale = `${document.body.clientWidth / 1920},${
    document.body.clientHeight / 941
  }`;
  whole.value.style.width = "1920px";
  whole.value.style.height = "941px";
  whole.value.style.transform = `scale(${scale})`;

  let chart = echarts.init(document.getElementById("echartsLine"));
  const options = {
    xAxis: {
      type: "time",
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#0081FF",
          opacity: 0.8,
        },
      },
      axisLabel: {
        color: "#C8D3EA",
        formatter: function (params) {
          const currentDate = moment(params).format("HH:mm");
          return currentDate;
        },
      },
    },
    tooltip: {
      trigger: "axis",
      borderWidth: 0,
      extraCssText: "background: linear-gradient(#026DFF 0%, #000 100%);",
      formatter: function (params) {
        // 日期
        const date = `<div style="color:#fff">${moment(
          params[0].value[0]
        ).format("MM-DD HH:mm")}</div>`;
        // 数据
        let data = "";
        params.map((item) => {
          // 标记
          const marker = item.marker;
          data += `<div style="color:#fff">${marker} ${item.seriesName}：${item.value[1]}</div>`;
        });
        return `${date}${data}`;
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#0081FF",
          opacity: 0.8,
        },
      },
      axisLabel: {
        color: "#C8D3EA",
      },
    },
    series: [
      {
        name: t("dashboard.outletCOD"),
        data: [
          ["2023-10-01 00:00", 670],
          ["2023-10-01 01:00", 730],
          ["2023-10-01 02:00", 620],
          ["2023-10-01 03:00", 634],
          ["2023-10-01 04:00", 633],
          ["2023-10-01 05:00", 660],
          ["2023-10-01 06:00", 690],
        ],
        type: "line",
        smooth: true,
        areaStyle: {
          normal: {
            // 渐变填充色（线条下半部分）
            color: new echarts.graphic.LinearGradient(0, 0.2, 0, 1, [
              { offset: 0, color: "#20DDFF" },
              { offset: 1, color: "#000000" },
            ]),
          },
        },
        color: "#20DDFF",
      },
      {
        name: t("dashboard.inletCOD"),
        data: [
          ["2023-10-01 00:00", 600],
          ["2023-10-01 01:00", 700],
          ["2023-10-01 02:00", 640],
          ["2023-10-01 03:00", 664],
          ["2023-10-01 04:00", 653],
          ["2023-10-01 05:00", 690],
          ["2023-10-01 06:00", 693],
        ],
        type: "line",
        smooth: true,
        areaStyle: {
          normal: {
            // 渐变填充色（线条下半部分）
            color: new echarts.graphic.LinearGradient(0, 0.2, 0, 1, [
              { offset: 0, color: "#026DFF" },
              { offset: 1, color: "#000000" },
            ]),
          },
        },
        color: "#026DFF",
      },
    ],
    grid: {
      top: 30,
      left: 40,
      right: 5,
      bottom: 20,
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
  chart.setOption(options);
  window.onresize = function () {
    chart.resize();
  };

  let chart1 = echarts.init(document.getElementById("echartsGauge"));
  const option = {
    series: [
      {
        name: t("dashboard.loadRate"),
        type: "gauge",
        radius: "80%",
        splitNumber: 10,
        axisLine: {
          show: true,
          lineStyle: {
            color: [[1, "#09497B"]],
          },
        },
        progress: {
          show: true,
          itemStyle: {
            color: "#0E85D2",
          },
        },
        axisTick: {
          show: true,
          distance: 5,
          splitNumber: 1,
          lineStyle: {
            color: "#fff",
          },
          length: 5,
        },
        axisLabel: {
          distance: 5,
          color: "#fff",
        },
        splitLine: {
          show: false,
        },
        title: {
          name: t("dashboard.loadRate"),
          text: t("dashboard.loadRate"),
          show: true,
          color: "#C1DCED",
          offsetCenter: [0, "100%"],
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}%",
          offsetCenter: [0, "-3%"],
          color: "#fff",
          fontSize: 20,
        },
        pointer: {
          show: false,
        },
        data: [{ value: 75, name: "负荷率" }],
      },
    ],
  };
  chart1.setOption(option);
  window.onresize = function () {
    chart1.resize();
  };
});
function changeLocale(value) {
  setLocale(value);
  window.location.reload();
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
}
// 首页按钮点击事件
function shouYeClick() {
  leftPanel.value.style.pointerEvents = "all";
  rightPanel.value.style.pointerEvents = "all";
  // 侧边栏和阴影背景删除淡出动画类名
  leftPanel.value.classList.remove("a-fadeoutL");
  rightPanel.value.classList.remove("a-fadeoutR");
  shadowBg.value.classList.remove("fadeout");
  // 侧边栏和阴影背景添加淡入动画类名
  leftPanel.value.classList.add("a-fadeinL");
  rightPanel.value.classList.add("a-fadeinR");
  shadowBg.value.classList.add("fadein");
  // 选择菜单切换为首页shouye
  selectedMenu.value = "shouye";
}
// 历史数据按钮点击事件
function historyDataClick() {
  // 侧边栏和阴影背景删除淡入动画类名
  leftPanel.value.classList.remove("a-fadeinL");
  rightPanel.value.classList.remove("a-fadeinR");
  shadowBg.value.classList.remove("fadein");
  // 侧边栏和阴影背景添加淡出动画类名
  leftPanel.value.classList.add("a-fadeoutL");
  rightPanel.value.classList.add("a-fadeoutR");
  shadowBg.value.classList.add("fadeout");
  // 选择的菜单切换为历史数据data
  selectedMenu.value = "data";
}
// 工艺辅助按钮点击事件
function craftAssistClick() {
  leftPanel.value.style.pointerEvents = "none";
  rightPanel.value.style.pointerEvents = "none";
  // 侧边栏和阴影背景删除淡入动画类名
  leftPanel.value.classList.remove("a-fadeinL");
  rightPanel.value.classList.remove("a-fadeinR");
  shadowBg.value.classList.remove("fadein");
  // 侧边栏和阴影背景添加淡出动画类名
  leftPanel.value.classList.add("a-fadeoutL");
  rightPanel.value.classList.add("a-fadeoutR");
  shadowBg.value.classList.add("fadeout");
  selectedMenu.value = "craft";
}
// 巡检按钮点击事件
function inspectClick() {
  selectedMenu.value = "inspect";
  // 侧边栏、底部按钮、顶部标题。阴影背景删除淡入动画类名
  leftPanel.value.classList.remove("a-fadeinL");
  rightPanel.value.classList.remove("a-fadeinR");
  bottomBut.value.classList.remove("a-fadeinB");
  title.value.classList.remove("a-fadeinT");
  shadowBg.value.classList.remove("fadein");
  // 侧边栏、底部按钮、顶部标题、阴影背景添加淡出动画类名
  leftPanel.value.classList.add("a-fadeoutL");
  rightPanel.value.classList.add("a-fadeoutR");
  bottomBut.value.classList.add("a-fadeoutB");
  title.value.classList.add("a-fadeoutT");
  shadowBg.value.classList.add("fadeout");
}
// 关闭巡检
function closeInspect() {
  selectedMenu.value = "shouye";
  // 侧边栏、底部按钮、顶部标题、阴影背景删除淡出动画类名
  leftPanel.value.classList.remove("a-fadeoutL");
  rightPanel.value.classList.remove("a-fadeoutR");
  bottomBut.value.classList.remove("a-fadeoutB");
  title.value.classList.remove("a-fadeoutT");
  shadowBg.value.classList.remove("fadeout");
  // 侧边栏、底部按钮、顶部标题、阴影添加淡入动画类名
  leftPanel.value.classList.add("a-fadeinL");
  rightPanel.value.classList.add("a-fadeinR");
  bottomBut.value.classList.add("a-fadeinB");
  title.value.classList.add("a-fadeinT");
  shadowBg.value.classList.add("fadein");
}
// 工艺动画播放开启
function openAnimation(type, device) {
  // 工艺动画播放状态为true，子页面监听后开启播放相应的工艺动画
  craftAnimationStatus.value = true;
  craftAnimationType.value = type;
}
// 工艺动画播放结束
function craftAnimationEnd() {
  craftAnimationStatus.value = false;
}
</script>
<style lang="less">
@import "./index.less";
</style>
