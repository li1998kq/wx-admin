// 定义支持时间类型，依次：年、月、日、时、分、秒
type TUnitType = "Y" | "M" | "D" | "h" | "m" | "s";
// 定义可选参类型
interface IExtraOptions {
  expires?: number;
  unit?: TUnitType;
  reset?: boolean;
}
// const store = new NStorage()
// // 普通设置，不过期
// store.set('name', '小红')
// // 设置过期时间5秒
// store.set('name', '小红', { expires: 5 })
// // 设置过期时间5分钟，其他更换单位即可
// store.set('name', '小红', { expires: 5, unit: 'm' })
// // 重新计算有效时长（就相当于在设置的时刻起，再往后延长之前的设置时间）
// store.set('name', '小红', { reset: true })

// // 获取值
// store.get('name')

// // 删除值
// store.remove('name')

// // 删除所有值
// store.clear()

// // 当前存储值中是否存在
// store.hasKey('name')
// 设置默认初始值
const EXTRA_OPTIONS: IExtraOptions = {
  expires: 0, // 默认永久
  unit: "s", // 默认秒
  reset: false // 是否重置时间
};
// 根据单位和传入时间，计算出毫秒级时间
function calcTime(time: number, unit: TUnitType = "s") {
  let newTime = 0;
  switch (unit) {
    case "Y":
      newTime = time * 365 * 24 * 60 * 60 * 1000;
      break;
    case "M":
      // 月份这里偷懒，直接使用每月30天计算
      newTime = time * 30 * 24 * 60 * 60 * 1000;
      break;
    case "D":
      newTime = time * 24 * 60 * 60 * 1000;
      break;
    case "h":
      newTime = time * 60 * 60 * 1000;
      break;
    case "m":
      newTime = time * 60 * 1000;
      break;
    case "s":
      newTime = time * 1000;
      break;
    default:
      newTime = time;
      break;
  }
  return newTime;
}

class NStorage {
  storage: Storage;
  constructor(name?: string) {
    this.storage = window[name as keyof typeof window] || window.localStorage;
  }
  /**
   * @description 存储方法
   * @param {String} key 键名
   * @param {any} value 值
   * @param {number} [options] 可选
   * @param {Number} [options.expires] 默认0，永久
   * @param {String} [options.unit] 默认's'，秒
   * @param {Boolean} [options.reset] 默认false，不重置
   */
  set(key: string, value: any, options?: IExtraOptions) {
    const isExist = this.hasKey(key);
    const extra = Object.assign(EXTRA_OPTIONS, options);
    if (isExist) {
      // 如果存在，判断是否是需要重新设置值
      const sValue = this.get(key, true);
      sValue.value = value;
      sValue.__expires__ = calcTime(extra.expires || sValue.__expires__, extra.unit || sValue.__unit__);
      if (extra.reset) {
        // 存在且重新设置时间
        sValue.startTime = new Date().getTime();
        this._set(key, sValue);
      } else {
        // 如果已经存在，且不重新计算时间，则直接修改值后存储
        this._set(key, sValue);
      }
    } else {
      const storeValue = {
        value,
        startTime: new Date().getTime(),
        __expires__: calcTime(extra.expires as number, extra.unit),
        __unit__: extra.unit
      };
      this._set(key, storeValue);
    }
  }
  /**
   * @description set内部方法
   * @param {String} key 键名
   * @param {any} value 值
   */
  private _set(key: string, value: any) {
    this.storage.setItem(key, JSON.stringify(value));
  }
  /**
   * @description 获取方法
   * @param {String} key 键名
   * @param {Boolean} [isMerge] 可选，是否获取处理后的对象
   * @returns {any} 值
   */
  get(key: string, isMerge: boolean = false) {
    try {
      // 不存在直接返回 null
      if (!key) return null;
      const storeItem = this.storage.getItem(key) || "{}";
      const storeValue = JSON.parse(storeItem);
      const time = new Date().getTime();
      // 如果是永久，则直接返回
      if (storeValue?.__expires__ === 0) return isMerge ? storeValue : storeValue.value;
      // 判断当前时间是否过期，过期则删除当前存储值
      if (storeValue?.startTime && time - storeValue?.startTime >= storeValue?.__expires__) {
        this.remove(key);
        return null;
      }
      return isMerge ? storeValue : storeValue.value;
    } catch (error) {
      return null;
    }
  }
  /**
   * @description 删除方法
   * @param {String} key 删除键名
   */
  remove(key: string) {
    key && this.storage.removeItem(key);
  }
  /**
   * @description 清除所有本地存储
   */
  clear() {
    this.storage.clear();
  }
  /**
   * @description 是否存在
   * @param {String} key 键
   * @returns {Boolean} true｜false
   */
  hasKey(key: string) {
    if (!key) return false;
    const value = this.get(key);
    return value ? true : false;
  }
}
export default NStorage;
