<template>
  <div class="card content-box">
    <el-container class="wh-full t-center">
      <el-aside style="width: 50%">
        <avue-form :option="option"></avue-form>
        <!-- <el-button type="primary" style="width: 90%" @click="showDialog">登录</el-button> -->
        <div style="margin-left: 5%; text-align: start">
          <el-tag type="" effect="dark"> xxxxxxxxx</el-tag> <br />
          <el-tag type="success" effect="dark"> xxxxxxx</el-tag><br />
          <el-tag type="info" effect="dark"> xxxxxxxxx</el-tag><br />
          <el-tag type="danger" effect="dark"> xxxxx</el-tag><br />
          <el-tag type="warning" effect="dark"> xxxxxxxx</el-tag>
        </div>
      </el-aside>
      <el-main style="padding: 0">
        <el-button type="success" style="width: 90%" @click="showDialog">生成支付二维码</el-button>
      </el-main>
    </el-container>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { WxLogin } from "@/api/modules/hlw";
import NStorage from "@/utils/storage";
//获取this
// 过期
const store = new NStorage();
store.set("name", "小红", { expires: 20, unit: "s" });
// setInterval(() => {
//   console.log("存在name", store.hasKey("name"));
// }, 1000);
let { proxy } = getCurrentInstance();
let wxData = reactive({});
let option = ref({});
option.value = {
  submitText: "登录",
  emptyBtn: false,
  span: 24,
  column: [
    {
      label: "A16",
      prop: "login",
      type: "textarea",
      minRows: 3,
      maxRows: 5,
      rules: [
        {
          required: true,
          message: "请输入",
          trigger: "blur"
        }
      ]
    },
    {
      label: "小程序",
      prop: "appid",
      type: "select",

      dicData: [
        {
          label: "新联惠购",
          value: "wxded2e7e6d60ac09d"
        },
        {
          label: "贵旅优品",
          value: "wx61549642d715f361"
        },
        {
          label: "空港乐购",
          value: "wx613ba8ea6a002aa8"
        },
        {
          label: "贵盐黔品",
          value: "wx5508e31ffe9366b8"
        },
        {
          label: "遵航出山",
          value: "wx624149b74233c99a"
        },
        {
          label: "乐旅商城",
          value: "wx821fb4d8604ed4d6"
        },
        {
          label: "航旅黔购",
          value: "wx936aa5357931e226"
        },
        {
          label: "驿路黔寻",
          value: "wxee0ce83ab4b26f9c"
        }
      ],
      rules: [
        {
          required: true,
          message: "请选择",
          trigger: "blur"
        }
      ]
    }
  ]
};
function showDialog() {
  console.log(store.get("wxData"));
  proxy.$DialogForm({
    title: "请登录",
    width: "50%",
    menuPosition: "right",

    beforeClose: done => {
      done();
    },
    callback: res => {
      store.set("wxData", JSON.stringify(res.data));
      WxLogin(res.data)
        .then(r => {
          console.log("res", r);
          wxData = r.data;
          res.done();
        })
        .catch(() => {
          res.done();
        })
        .finally(() => {
          res.close();
        });
    }
  });
}
</script>
