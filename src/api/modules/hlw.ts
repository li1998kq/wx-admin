import { Upload } from "@/api/interface/index";
import http from "@/api";

/**
 * @name 文件上传模块
 */
// 图片上传
export const WxLogin = (data: any) => {
  return http.post<Upload.ResFileUrl>(`/hlw/WxLogin`, data, { cancel: false });
};
/**
 * @name 支付界面
 */
// 图片上传
export const CheckOrder = (data: any) => {
  return http.post<Upload.ResFileUrl>(`/hlw/CheckOrder`, data, { cancel: false });
};
