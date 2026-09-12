<template>
  <!-- 工艺菜单按钮 -->
  <div class="menuBut a-fadeinL" v-show="visible">
    <div
      :class="selectedCraft === 'aeration' ? 'selected but' : 'but'"
      @click="menuChange('aeration')"
    >
      <img src="../../assets/shouye/aeration.png" style="margin-right: 3px" />
      {{ $t('craft.aeration') }}
    </div>
    <div
      :class="selectedCraft === 'dosing' ? 'selected but' : 'but'"
      @click="menuChange('dosing')"
    >
      <img src="../../assets/shouye/dosing.png" style="margin-right: 3px" />
      {{ $t('craft.dosing') }}
    </div>
    <div
      :class="selectedCraft === 'sludge' ? 'selected but' : 'but'"
      @click="menuChange('sludge')"
    >
      <img src="../../assets/shouye/sludge.png" style="margin-right: 3px" />
      {{ $t('craft.sludge') }}
    </div>
  </div>
  <!-- 工艺数据面板 -->
  <div
    class="craftPanel fadein"
    v-show="visible && selectedCraft !== '' ? true : false"
  >
    <div class="panelTitle">
      {{
        selectedCraft === "aeration"
          ? $t('craft.aeration')
          : selectedCraft === "dosing"
          ? $t('craft.dosing')
          : $t('craft.sludge')
      }}
    </div>
    <div class="panelMain">
      <div class="mainHeader">
        <div style="width: 5%"></div>
        <div style="width: 30%">{{ $t('craft.equipmentName') }}</div>
        <div style="width: 35%">{{ $t('craft.suggestion') }}</div>
        <div style="width: 30%">{{ $t('craft.realtime') }}</div>
      </div>
      <div class="mainContent">
        <div
          class="row"
          v-for="(item, index) in tableData"
          :key="index"
          @click="selectRow"
        >
          <div style="width: 5%">
            <input
              type="radio"
              name="radio"
              :id="item[0]"
              :value="item[0]"
              v-model="selectdDevice"
            />
          </div>
          <div class="row_common" style="width: 30%">
            {{ $t(item[0]) }}
          </div>
          <div class="row_common" style="width: 35%">
            {{ item[1] }}
          </div>
          <div class="row_common" style="width: 30%">
            {{ item[2] }}
          </div>
        </div>
      </div>
      <div class="footer">
        <div
          :class="selectdDevice !== '' ? 'execute pointer' : 'execute ban'"
          @click="startCompute"
        ></div>
        <div class="cancel" @click="cancelCompute"></div>
      </div>
    </div>
  </div>
  <!-- 工艺预估值和模拟值 -->
  <div class="estimate" v-show="estimateShow && visible">
    <div class="common">
      <div>0</div>
      <div>{{ $t('craft.simulated') }}</div>
    </div>
    <div class="common">
      <div>{{ actualValue }}</div>
      <div>{{ $t('craft.actual') }}</div>
    </div>
  </div>
</template>

<script setup>
import TWEEN from "@tweenjs/tween.js";
import { ref, watch, reactive } from "vue";
// 首页传值
const props = defineProps(["visible"]);
// 传递事件
const emit = defineEmits(["openAnimation"]);
// 当前组件是否显示
let visible = ref(false);
// 预估值模拟值是否显示
let estimateShow = ref(false);
// 选择的工艺
const selectedCraft = ref("");
// 选择的设备
const selectdDevice = ref("");
// 表格数据
let tableData = ref([]);
// 实际值
let actualValue = ref(357);
watch(props, (e) => {
  if (e.visible) {
    visible.value = true;
    queryData();
  } else {
    visible.value = false;
    selectedCraft.value = "";
    estimateShow.value = false;
    selectdDevice.value = "";
  }
});

watch(selectedCraft, (e) => {
  if (e === "aeration") {
    tableData.value = [
      ["craftDevices.westAerationFanFrequency", "", 167],
      ["craftDevices.east2FlowSetpoint", "", 472],
      ["craftDevices.east1FlowSetpoint", "", 796],
      ["craftDevices.eastAerationFanFrequency", "", 304],
      ["craftDevices.northAerationFanFrequency", "", 304],
      ["craftDevices.southAerationFanFrequency", "", 304],
    ];
  } else if (e === "dosing") {
    tableData.value = [
      ["craftDevices.pacFlowSetpoint", "", 9],
      ["craftDevices.sodiumAcetateFlowSetpoint", "", 18],
      ["craftDevices.glucoseFlowSetpoint", "", 41],
    ];
  } else {
    tableData.value = [
      ["craftDevices.westPreAnoxicDemandFlow", "", 148],
      ["craftDevices.eastPreAnoxicDemandFlow", "", 141],
    ];
  }
  selectdDevice.value = tableData.value[0][0];
  console.log(e, "eee");
});

function queryData() {
  tableData.value = [
    ["craftDevices.westAerationFanFrequency", "", 167],
    ["craftDevices.east2FlowSetpoint", "", 472],
    ["craftDevices.east1FlowSetpoint", "", 796],
    ["craftDevices.eastAerationFanFrequency", "", 304],
    ["craftDevices.northAerationFanFrequency", "", 304],
    ["craftDevices.southAerationFanFrequency", "", 304],
  ];
}

// 开始执行
function startCompute() {
  estimateShow.value = true;
  // 开启工艺动画
  emit("openAnimation", selectedCraft.value, selectdDevice.value);
  // 重置选择的工艺
  selectedCraft.value = "";

  new TWEEN.Tween({ value: actualValue.value })
    .to({ value: 0 }, 5000)
    .onUpdate((e) => {
      actualValue.value = parseFloat(e.value.toFixed(2));
    })
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .start();
}

function menuChange(value) {
  selectedCraft.value = value;
  actualValue.value = (Math.random() * 110 + 230).toFixed(2);
  console.log(selectdDevice.value, "selectdDevice.value");
}

// 取消执行
function cancelCompute() {
  selectedCraft.value = "";
  selectdDevice.value = "";
}

// 选中该行
function selectRow(e) {
  actualValue.value = (Math.random() * 110 + 230).toFixed(2);
  selectdDevice.value = e.target.parentNode.firstChild.firstChild.id;
  console.log(selectdDevice.value);
}
</script>

<style lang="less" scoped>
.menuBut {
  pointer-events: all;
  z-index: 999;
  height: 169px;
  left: 1%;
  position: absolute;
  top: 40%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-around;

  .but {
    width: 140px;
    height: 47px;
    background: url("../../assets/shouye/button2.png");
    background-size: 100% 100%;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-items: center;
  }
  .but:hover {
    cursor: pointer;
  }
  .selected {
    color: #00ffff;
    background: url("../../assets/shouye/selectedButton2.png");
    background-size: 100% 100%;
  }
}

.craftPanel {
  pointer-events: all;
  width: 1000px;
  height: 600px;
  background: url("../../assets/shouye/craftPanelBg.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  left: calc(960px - 500px);
  top: calc(470px - 300px);
  z-index: 999;

  .panelTitle {
    width: 100%;
    height: 80px;
    margin-top: 15px;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #afeeee;
    letter-spacing: 5px;
  }

  .panelMain {
    width: 90%;
    margin-left: 5%;
    margin-top: 10px;
    height: calc(100% - 125px - 100px);

    .mainHeader {
      width: 100%;
      height: 44px;
      display: flex;
      color: #afeeee;
      text-align: center;
      justify-content: center;
      align-items: center;
      font-size: 18px;
    }

    .mainContent {
      width: 100%;
      height: calc(100% - 36px);
      color: #afeeee;
      font-size: 16px;

      .row {
        width: 100%;
        height: 36px;
        margin: 6px 0;
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        background: rgba(9, 107, 207, 0.14);

        .row_common {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .row:hover {
        cursor: pointer;
        background: rgba(9, 107, 207, 0.5);
      }
    }
  }

  .footer {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;

    .execute {
      background: url("../../assets/shouye/execute.png") no-repeat;
      background-size: 100% 100%;
      width: 138px;
      height: 44px;
      margin: 0 20px;
    }

    .pointer {
      cursor: pointer;
    }

    .ban {
      cursor: not-allowed;
      pointer-events: none;
    }

    .cancel {
      background: url("../../assets/shouye/cancel.png") no-repeat;
      background-size: 100% 100%;
      width: 138px;
      height: 44px;
      margin: 0 20px;
      cursor: pointer;
    }
  }
}

.estimate {
  position: absolute;
  right: 0%;
  bottom: 0%;
  width: 350px;
  height: 145px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  .common {
    width: 177px;
    height: 100%;
    background: url("../../assets/shouye/estimateValueBg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 18px;
    color: #afeeee;

    div {
      height: 30%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
