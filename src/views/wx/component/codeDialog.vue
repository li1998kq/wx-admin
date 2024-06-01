<template>
  <el-dialog v-model="dialogVisible" title="二维码" width="450px" :before-close="handleClose">
    <div>
      <QRCodeVue3 style="width: 100%; height: 100%" :value="props.link" :width="400" />
      <!-- <canvas width="200" height="200" ref="codeRef" id="qrcode" style="width: 200px; height: 200px"></canvas> -->
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <!-- <el-button type="primary" @click="dialogVisible = false"> Confirm </el-button> -->
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineModel, onMounted, ref } from "vue";
import QRCodeVue3 from "qrcode-vue3";
const props = defineProps({
  link: {
    type: Boolean,
    default: false
  }
});
const codeRef = ref("");
const dialogVisible = defineModel("visible");
onMounted(() => {
  // init();
});
const init = () => {
  const qrcode = new QRCode("qrcode", {
    text: "https://juejin.cn/user/1582891999692093",
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff"
    // correctLevel: QRCode.CorrectLevel.H
  });
};
const handleClose = () => {
  dialogVisible.value = false;
  console.log("XX");
};
</script>

<style lang="scss" scoped></style>
