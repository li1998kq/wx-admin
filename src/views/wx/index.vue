<template>
  <div class="card content-box">
    <avue-crud
      @row-del="rowDel"
      ref="crudRef"
      :before-open="beforeOpen"
      v-model="form"
      :option="option"
      @row-save="rowSave"
      :data="data"
    >
      <!-- <template #token="{ row }">
        <el-button @click="copyText(row.token)" type="primary">{{ row.token }}</el-button>
      </template> -->
      <template #menu="{ row }">
        <el-button @click="copyText(row.token)" type="text">复制token</el-button>
        <el-button @click="fetchCheckOrder(row)" type="text">生成支付二维码</el-button>
      </template>
    </avue-crud>
    <codeDialog v-if="dialogVisible" v-model:visible="dialogVisible" :link></codeDialog>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance, watch } from "vue";
import codeDialog from "./component/codeDialog.vue";
//获取this
let { proxy } = getCurrentInstance();
const option = ref(null);
const data = ref(null);
const form = ref({});
const setform = ref({});
const link = ref("");
const dialogVisible = ref(false);

// const wxData = reative([]);
option.value = {
  index: true,
  delBtn: true,
  editBtn: false,
  refreshBtn: false,
  columnBtn: false,
  gridBtn: false,
  menuWidth: 300,
  addTitle: "登录账号",
  border: true,
  addBtnText: "登录账号",
  column: [
    {
      label: "A16",
      prop: "login",
      span: 24,
      type: "textarea",
      hide: true,
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
      span: 24,
      hide: true,
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
    },

    {
      label: "项目名称",
      display: false,
      minWidth: 80,
      prop: "name"
    },
    {
      label: "姓名",
      display: false,
      prop: "realName"
    },
    {
      label: "token",
      display: false,
      prop: "token",
      width: 150,
      overHidden: true
      // slot: true
    },
    {
      label: "idcard",
      display: false,
      prop: "idcard",
      minWidth: 200
    },
    {
      label: "phone",
      display: false,
      prop: "phone"
    },

    {
      label: "地址",
      display: false,
      prop: "completeAddr"
    }
  ]
};
data.value = [];
import NStorage from "@/utils/storage";
//获取this
// 过期
const store = new NStorage();
store.set("name", "小红", { expires: 20, unit: "s" });
let test = {
  phone: "13262282523",
  idcard: "532326200112251819",
  realName: "杨李云",
  gmtCreate: null,
  completeAddr: null,
  token:
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMTI1Njg5NTg5IiwiaXNzIjoiZ21hbGwtc3RhcnNreSIsImxvZ0lkIjoibnVsbCIsImV4cCI6MTcyNDk5MzY2MiwiaWF0IjoxNzE3MjE3NjYyfQ.C79q4-9Uftu8i9fspLBL5_hbZX7s2oq8pvNfEGY4i-w",
  name: "新联惠购",
  appid: "wxded2e7e6d60ac09d",
  wxid: "wxid_gfhj69ramsnb22"
};
// data.value.push(test);
// appid: "wxded2e7e6d60ac09d";
// completeAddr: null;
// gmtCreate: null;
// idcard: "532326200112251819";
// name: "新联惠购";
// phone: "13262282523";
// realName: "杨李云";
// token: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMTI1Njg5NTg5IiwiaXNzIjoiZ21hbGwtc3RhcnNreSIsImxvZ0lkIjoibnVsbCIsImV4cCI6MTcyNDg1NDM5MSwiaWF0IjoxNzE3MDc4MzkxfQ.sAAWJa39eqbCZuRhL_LY_RdcwOlZEab5MX42Ni9pbu0";
// wxid: "wxid_gfhj69ramsnb22";
function rowSave(row, done, loading) {
  setform.value = form.value;
  WxLogin(row)
    .then(r => {
      data.value = [];
      data.value.push(r.data);
      store.set(r.data.token, r.data.token, { expires: 20, unit: "m" });
      done();
    })
    .catch(() => {
      done();
    })
    .finally(() => {
      close();
    });
}

import { WxLogin, CheckOrder } from "@/api/modules/hlw";
import { done } from "nprogress";
import { overlayEmits } from "element-plus";

function fetchCheckOrder(row) {
  proxy
    .$confirm("请确认人脸识别已经通过?请勿截图，分享有关此订单的任何内容", "系统提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "danger"
    })
    .then(() => {
      CheckOrder({ appid: row.appid, wxid: row.wxid }).then(res => {
        link.value = res.data.link;
        dialogVisible.value = true;
        console.log(res);
      });
    });
}
function rowDel(form, index) {
  proxy
    .$confirm("即将删除, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    .then(() => {
      data.value.splice(index, 1);
    });
}
function copyText(text) {
  proxy
    .$Clipboard({
      text: text
    })
    .then(() => {
      proxy.$message.success("复制成功");
    })
    .catch(() => {
      proxy.$message.error("复制失败");
    });
}
function beforeOpen(done) {
  form.value = setform.value;
  done();
}
setInterval(() => {
  data.value.forEach((item, n) => {
    if (!store.hasKey(item.token)) {
      proxy.$message.error(item.token + "失效");
      data.value = [];
      // option.value.addBtnText = "重新登录";
      // option.value.addTitle = "重新登录";
    }
  });
}, 1000);
</script>
