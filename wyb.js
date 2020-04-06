// @ts-ignore
window.setInterval = global.setInterval;
// @ts-ignore
window.setTimeout = global.setTimeout;
// @ts-ignore
window.clearInterval = global.clearInterval;
// @ts-ignore
window.clearTimeout = global.clearTimeout;

// @ts-ignore
class wyb {
  /**将远程文件下载下来并保存在当前店铺的产品文件夹中
   * @param {string|string[]} content html描述或url数组
   * @param {string} proId
   * @returns {Promise<string|string[]>} 返回下载后的html描述或path数组
   */
  static async download(content, proId) {
    return "";
  }

  /**开启代理
   * @param {string} domain 指定域名登录环境，默认不需要
   */
  static startProxy(domain = "") {
    //将域名发给背景页的代理
    // chrome.proxy.settings.set({
    //   value: {
    //     mode: "pac_script",
    //     pacScript: {
    //       data: `function FindProxyForURL(url, host){if (url.includes("wubifa.com")) return "DIRECT";else return "PROXY localhost:8003";}`
    //     }
    //   },
    //   scope: "regular"
    // });
  }

  /**结束代理 */
  static endProxy() {
    // chrome.proxy.settings.set({
    //   value: {
    //     mode: "direct"
    //   },
    //   scope: "regular"
    // });
  }

  /**创建并返回iframe，用完一定要调用ifr.remove()删除 */
  static createIframe(url = "", isShow = false, isMobile = false, tip = "请登录") {
    var pe = document.getElementById("ifrpe");
    if (pe) pe.remove();
    var div = document.createElement("div");
    div.id = "ifrpe";
    div.style.visibility = isShow ? "visible" : "hidden";
    div.style.position = "absolute";
    div.style.backgroundColor = "#ffffff";
    div.style.zIndex = "10000";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.textAlign = "center";
    var ifr = document.createElement("iframe");
    ifr.setAttribute("nwfaketop", "nwfaketop");
    ifr.setAttribute("nwdisable", "nwdisable");
    ifr.setAttribute(
      "nwUserAgent",
      isMobile
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
        : ""
    );
    ifr.setAttribute("frameBorder", "0");
    ifr.setAttribute("style", isMobile ? "border: 1px solid #dcdfe6;width:414px;height:calc(100% - 6px);" : "width:100%;height:calc(100% - 4px);");
    ifr.mytip = document.title;
    if (isShow && tip) document.title = tip;
    ifr.src = url;
    div.append(ifr);
    document.body.append(div);
    return ifr;
  }

  /**
   * 向元素输入一段文本
   * @param {any} ele 要操作的元素
   * @param {string|number} str 文本或数字
   */
  static type(ele, str) {
    if (!str || !ele) return;
    str = str.toString();
    ele.dispatchEvent(
      new Event("focus", {
        bubbles: true
      })
    );
    ele.value = str;
    ele.dispatchEvent(
      new Event("keydown", {
        bubbles: true
      })
    );
    ele.dispatchEvent(
      new Event("keyup", {
        bubbles: true
      })
    );
    ele.dispatchEvent(
      new Event("keypress", {
        bubbles: true
      })
    );
    ele.dispatchEvent(
      new Event("change", {
        bubbles: true
      })
    );
    ele.dispatchEvent(
      new window.InputEvent("input", {
        data: str,
        inputType: "insertText",
        bubbles: true,
        composed: true
      })
    );
    ele.dispatchEvent(
      new Event("blur", {
        bubbles: true
      })
    );
  }

  /**
   * 等待直到元素出现，返回元素或null，默认10秒超时
   * @param {HTMLIFrameElement} ifr iframe元素
   * @param {string} sel 等待的元素的css选择符
   * @param {number} [timeout=10] 超时时间，单位秒
   * @returns {Promise<HTMLElement>} 等到的元素或null
   */
  static async waitEle(ifr, sel, timeout = 10) {
    var i = 0;
    while (!(ifr.contentDocument && ifr.contentDocument.querySelector(sel)) && i < timeout * 10) {
      await this.waitTimeMS(100);
      i = i + 1;
    }
    // @ts-ignore
    return ifr.contentDocument && ifr.contentDocument.querySelector(sel);
  }

  /**
   * 等待直到全屏滚动完毕，注意：对于滚动刷新则循环用var length=$2("网址元素的css选择符").length;if(await this.waitFun(()=>{await this.waitTime(1);window.scrollTo(0, document.body.scrollHeight-Math.random()*1000);return $2("网址元素的css选择符").length> length}))则继续循环，循环结束后再一次性取值。
   * @param {HTMLIFrameElement} ifr iframe元素
   */
  static async winScroll(ifr) {
    for (let i = 500; i < ifr.contentDocument.body.scrollHeight; i = i + 500) {
      ifr.contentWindow.scrollTo(0, i);
      await this.waitTimeMS(100);
    }
  }

  /**
   * 包装一个对象指定的函数，使其遇到指定的错误时重试几次, 会将指定函数异步
   * @param {Object} obj 对象或原型
   * @param {string} funName 要包装的函数名
   * @param {number} num 要重试的次数，默认3次
   */
  static wrapOnErrReTry(obj, funName, num = 3) {
    if (!obj[funName + "_ori"]) {
      obj[funName + "_ori"] = obj[funName];
      if (obj.interceptors) {
        obj.interceptors.request.use(config => {
          // console.error("wrapOnErrReTry__0", config);
          config.timeout = 70 * 1000;
          if (config.url || config.baseURL) {
            //由于插件内部可能存在获取网址为undefined
            if (config.url && (config.url.startsWith("http://127.0.0.1") || config.url.startsWith("http://www3.data1818.com"))) {
              config.timeout = 600 * 1000;
            } else if (config.baseURL && config.baseURL.startsWith("http://www3.data1818.com")) {
              config.timeout = 300 * 1000;
            }
            if (config.url && config.url.includes(":8004/")) config.timeout = 65 * 1000;
          }
          return config;
        });
      }
    }
    obj[funName] = async function() {
      for (let index = 1; index <= num; index++) {
        try {
          var re = await this[funName + "_ori"](...arguments);
          return re;
        } catch (error) {
          // console.log("wrapOnErrReTry", index, wyb.getErrObj(error));
          var isNetErr = true;
          if (error.response && error.response.status < 500) isNetErr = false;
          if (index == num || !isNetErr) {
            if (index == num && wyb.stringify(wyb.getErrObj(error)).includes("googleTrans Network Error")) {
              // console.log("wrapOnErrReTry____googleTrans");
            } else if (wyb.stringify(wyb.getErrObj(error)).includes("at dispatchHttpRequest")) {
              // console.log("wrapOnErrReTry____dispatchHttpRequest");
            } else throw error;
          }
          await wyb.waitTimeMS(1000);
        }
      }
    };
  }

  /**
   * 等待几毫秒后执行
   * @param {number} ms 等待时间，单位毫秒
   */
  static async waitTimeMS(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  /**
   * 等待几秒后执行
   * @param {number} s 等待时间，单位秒
   */
  static async waitTime(s) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve();
      }, 1000 * s);
    });
  }

  /**
   * 只要函数条件不满足就一直等待，返回函数结果，默认10秒超时
   * @param {()=>any} fun fun要运行的函数，可以是异步函数
   * @param {number} [timeout=3] 超时时间，单位秒
   * @returns  函数计算结果
   */
  static async waitFun(fun, timeout = 10) {
    var i = 0;
    var f = async () => {
      try {
        return await fun();
      } catch (error) {
        return false;
      }
    };
    var r = await f();
    while (!r && i < timeout) {
      await this.waitTime(1);
      r = await f();
      i = i + 1;
    }
    return r;
  }

  /**等待指定请求并取消，返回requestBody
   * @param {String} url url匹配规则，三部分必须有，参考https://developer.chrome.com/extensions/match_patterns
   * @param {Number} timeout 超时时间，单位秒，默认3秒
   */
  static async waitRequest(url, timeout = 3) {
    if (!url) return;
    return await new Promise(async (resolve, reject) => {
      var fun = function(details) {
        setTimeout(() => {
          chrome.webRequest.onBeforeRequest.removeListener(fun);
          resolve(details);
        }, 100);
        return { cancel: true };
      };
      chrome.webRequest.onBeforeRequest.addListener(fun, { urls: [url] }, ["blocking", "requestBody"]);
      setTimeout(() => {
        chrome.webRequest.onBeforeRequest.removeListener(fun);
        resolve();
      }, 1000 * timeout);
    });
  }

  /**在默认浏览器中打开网址 */
  static openUrl(url) {
    if (url) nw.Shell.openExternal(url);
  }

  /**
   * 在资源管理器中打开文件或文件夹
   * @param {string} file 程序根目录里的文件或文件夹
   */
  static openFile(file) {
    if (file) nw.Shell.openItem(path.join(process.cwd(), file));
  }

  /**序列化对象，可以序列化日期，正则，函数等 */
  static stringify(obj) {
    var res;
    res = JSON.stringify(obj, function(k, v) {
      if (v === undefined) {
        return undefined;
      }
      if (v === null) {
        return null;
      }
      if (typeof this[k].getTime === "function") {
        return { $$date: this[k].getTime() };
      }
      if (typeof this[k].test === "function") {
        return { $$regex: this[k].toString() };
      }
      if (typeof v === "function") {
        return { $$function: v.toString() };
      }
      return v;
    });
    return res;
  }

  /**反序列化 */
  static parse(rawData) {
    var deserializeRegex = function(r) {
      var spl = r.split("/");
      var flags = spl.pop();
      var regex = spl.slice(1).join("/");
      return new RegExp(regex, flags);
    };
    return JSON.parse(rawData, function(k, v) {
      if (k === "$$date") {
        return new Date(v);
      }
      if (typeof v === "string" || typeof v === "number" || typeof v === "boolean" || v === null) {
        return v;
      }
      if (v && v.$$date) {
        return v.$$date;
      }
      if (v && v.$$regex) {
        return deserializeRegex(v.$$regex);
      }
      if (v && v.$$function) {
        return eval("(" + v.$$function + ")");
      }
      return v;
    });
  }

  /**
   * 将日期时间对象转成格式为"2019-01-20 12:20:01"的字符串，默认获取当前时间
   * @param {Date} date 默认当前时间
   */
  static getTime(date = undefined) {
    if (!date) date = new Date();
    if (typeof date == "string") date = new Date(date);
    var bu0to2 = str => {
      str = str.toString();
      if (str.length == 1) str = "0" + str;
      return str;
    };
    return (
      date.getFullYear() +
      "-" +
      bu0to2(date.getMonth() + 1) +
      "-" +
      bu0to2(date.getDate()) +
      " " +
      bu0to2(date.getHours()) +
      ":" +
      bu0to2(date.getMinutes()) +
      ":" +
      bu0to2(date.getSeconds())
    );
  }

  /**html实体编码 */
  static htmlEncode(s) {
    if (!s) return "";
    var div = document.createElement("div");
    div.innerText = s;
    return div.innerHTML;
  }

  /**html实体解码 */
  static htmlDecode(s) {
    if (!s) return "";
    s = _.toString(s);
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    var div = document.createElement("div");
    div.innerHTML = s;
    return div.innerText;
  }

  /**获取过滤掉html标记的纯文本 */
  static getInnerText(s) {
    if (!_.isString(s)) return "";
    let $ = ch.load(s);
    return $("body").text();
  }

  /**md5加密 */
  static md5(text) {
    return crypto2
      .createHash("md5")
      .update(text)
      .digest("hex");
  }

  /**
   * 获取所有正则匹配项的所有括号里的内容
   * @param {string} str 文本
   * @param {RegExp} reg 正则表达式，里面含有至少一个括号
   * @returns {Array<Array>} 捕获内容，二维数组
   */
  static getAllMatch(str, reg) {
    var re = [];
    var m;
    do {
      m = reg.exec(str);
      if (m != null) {
        m.shift();
        var mm = [];
        m.forEach(function(e) {
          mm.push(e);
        });
        re.push(mm);
      }
    } while (reg.global && m != null);
    return re;
  }

  /**
   * 获取所有正则匹配项的第一个括号里的内容
   * @param {string} str 文本
   * @param {RegExp} reg 正则表达式，里面含有一个有括号
   * @returns {array} 捕获内容，一维数组
   */
  static getAllMatch2(str, reg) {
    var arr = this.getAllMatch(str, reg);
    arr.forEach(function(e, i) {
      arr[i] = e[0];
    });
    return arr;
  }

  /**
   * 获取第一个正则匹配项的第一个括号里的内容
   * @param {string} str 文本
   * @param {RegExp} reg 正则表达式，里面含有一个括号
   * @returns {string} 捕获内容
   */
  static getMatch(str, reg) {
    var arr = this.getAllMatch2(str, reg);
    if (arr[0]) {
      return arr[0];
    } else {
      return "";
    }
  }

  /**
   * 删除str中的所有白字符，并替换多个空格为一个空格
   * @param {string} str 要处理的文本
   * @returns {string} 处理后的文本
   */
  static handleStr(str) {
    if (!str) return "";
    // @ts-ignore
    if (typeof str != "string") str = str.toString();
    str = str.replace(/[\f\n\r\t\v]/g, "");
    str = str.replace(/ {2,}/g, " ");
    return str.trim();
  }

  /**删除指定的html标记，如["a","iframe"]，要删除里面的内容 */
  static delHtmlMark(html, arr = ["a", "iframe", "frame", "script", "object", "style", "map", "area"]) {
    html = html.replace(/<!--.*?-->/gi, "");
    html = html.replace(/<script[ >].*?<\/script>/gi, "");
    html = html.replace(/<noscript[ >].*?<\/noscript>/gi, "");
    html = html.replace(/<iframe[ >].*?<\/iframe>/gi, "");
    html = html.replace(/<frame[ >].*?<\/frame>/gi, "");
    html = html.replace(/<object[ >].*?<\/object>/gi, "");
    html = html.replace(/<style[ >].*?<\/style>/gi, "");
    html = html.replace(/<link[^>].*?>/gi, "");
    arr.forEach(m => {
      var reg = new RegExp("(<" + m + " [^>]*>|</" + m + ">|<" + m + ">)", "gi");
      html = html.replace(reg, "");
    });
    return html;
  }

  /**删除所有外部网址，不含src，href等 */
  static delOuterUrl(html) {
    html = html.replace(/(>[^<]*?)(http:\/\/|ftp:\/\/|https:\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi, "$1");
    return html;
  }

  /**将字符串转成正则表达式 */
  static transReg(str) {
    return new RegExp(_.escapeRegExp(str), "gi");
  }

  /**转为数字*/
  static toNumber(s) {
    if (!_.isNumber(s)) s = parseFloat(s);
    return isNaN(s) ? 0 : s;
  }

  /**转为整数*/
  static toInteger(s) {
    if (_.isInteger(s)) return s;
    return _.round(this.toNumber(s), 0);
  }

  /**转为布尔值*/
  static toBoolean(s) {
    if (_.isBoolean(s)) return s;
    if (_.isString(s) && s.toLowerCase() == "false") return false;
    return s ? true : false;
  }

  /**计算文本长度*/
  static textLength(str, isD2 = false) {
    if (isD2) return str.length + this.getAllMatch2(str, /([^\x00-\xff])/gi).length;
    else return str.length;
  }

  /**从str左边开始取多少字符
   * @param {string} str
   */
  static textSubstr(str, num, isD2 = false) {
    if (_.isNumber(str)) str = _.toString(str);
    if (!_.isString(str)) str = "";
    if (!isD2) return str.substr(0, num);
    var strarr = str.split("");
    var i = 0;
    var str2 = [];
    strarr.forEach(s => {
      var n = /[^\x00-\xff]/.test(s) ? 2 : 1;
      if (i + n <= num) {
        str2.push(s);
        i = i + n;
      }
    });
    return str2.join("");
  }

  /**读取文件为 Blob 对象
   * @param {string} path 本地文件路径
   */
  static readBlob(path) {
    if (!fs.existsSync(path)) var re = Buffer.from([]);
    else var re = fs.readFileSync(path);
    return new Blob([re], { type: mime.getType(path) || "" });
  }

  /**
   * 将node的专有的2进制buffer流数组转为浏览器可识别的8进制arraybuffer数组
   * @param {Buffer} buffer
   * @returns {arrayBuffer} arrayBuffer
   */
  static bufferToArrayBuffer(buffer) {
    let arrayBuffer = new ArrayBuffer(buffer.length);
    let view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }
    return arrayBuffer;
  }

  /**
   * 浏览器可识别的8进制arraybuffer数组转为node专有的2进制buffer流数组
   * @param {ArrayBuffer} ab
   * @returns {Buffer} buffer
   */
  static arrayBuffertoBuffer(ab) {
    var buffer = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  }

  /**
   * axios请求 将json格式的data数据转为formData, form类型
   * @param {Object} obj json格式的data数据
   * @param {string} type json格式转换的类型  form类型=>'URLSearchParams', formData类型=>'FormData'
   * @returns {Object} URLSearchParams {} 返回formData格式的data数据
   */
  static transToFormorFormData(obj, type = "URLSearchParams") {
    let params = null;
    if (type == "URLSearchParams") {
      params = new URLSearchParams();
    } else if (type == "FormData") {
      params = new FormData();
    }
    Object.entries(obj).map(item => {
      if (!_.isArray(item[1])) {
        params.append(item[0], item[1]);
      } else {
        if (item[1][0] == "isImg" && item[1][1] && !_.isString(item[1][1])) {
          //用于图片处理
          params.append(item[0], item[1][1], item[1][2] || "");
        } else {
          item[1].forEach(v => {
            params.append(item[0], v);
          });
        }
      }
    });
    return params;
  }

  /**将Json对象数据转为url编码字符串 如：categoryId=537070985&tags=22216&tags=22220&tags=27014&freight_template=
   * @param {{}} obj
   * @returns {string}
   */
  static transObjTOUrlstr(obj) {
    let newobj = _.cloneDeep(obj);
    let strarr = [];
    let arr1 = Object.keys(newobj);
    let arr2 = Object.values(newobj);
    arr1.forEach((a, i) => {
      let aval = arr2[i];
      if (Array.isArray(aval)) {
        aval.forEach(val => {
          var str = encodeURIComponent(a) + "=" + encodeURIComponent(val);
          strarr.push(str);
        });
      } else {
        var str = encodeURIComponent(a) + "=" + encodeURIComponent(aval); //encodeURIComponent编码方式,会对特殊符号编码
        strarr.push(str);
      }
    });
    return strarr.filter(v => v).join("&");
  }

  /**
   * 将html的纯value(包含#x编码字符)进行解码
   * @param {string} value
   * @returns {string} 返回处理后的值
   */
  static getNewHtmlValue(value) {
    let desstr = value.replace(/(&#x[^;]+;)/gi, (str, p1) => {
      str = wyb.htmlDecode(str);
      return str;
    });
    return desstr;
  }

  /**
   * 将typ=html的属性的值中的src值替换为上传后图片url,并删除src2 然后返回处理后的整个值
   * @param {string} htmlstr
   * @param {{url:string,path:string,url2:string}[]} pics 存放的图片数组
   */
  static getNewHtml(htmlstr, pics) {
    let arr = [];
    return htmlstr.replace(/<img[^>]* src ?=[ '"]?([^'">]*)[ '"]?[^>]*>/gi, (str, p1) => {
      let file = pics.filter(a => a.path == p1)[0];
      let i = 0;
      while (file && file.url2 && arr.includes(file.url2)) {
        i++;
        file = pics.filter(a => a.path == p1)[i];
      }
      if (file && file.url2) {
        str = str.replace(p1, file.url2);
        str = str.replace(/src2 ?=[ '"]?[^'">]*[ '"]?/gi, "");
        arr.push(file.url2);
      } else str = "";
      return str;
    });
  }

  /**
   * 将typ=html的属性的值中的src的值替换为src2的值,并删除src2 然后返回处理后的整个值
   * @param {string} htmlstr
   * @param {boolean} isUrlDecode 决定是否将src的值url解码
   * @param {boolean} isUrlEnCode 决定是否将src的值url编码
   * @param {boolean} isReplace 决定是否将src的值替换为src2的值
   */
  static getHtmlreplacePic(htmlstr, isUrlDecode = false, isUrlEnCode = false, isReplace = false) {
    if (_.isNil(htmlstr)) return "";
    let $$ = ch.load(htmlstr);
    $$("img").each((i, v) => {
      if (isReplace) {
        let str = $$(v).attr("src2");
        if (path.isAbsolute(str) && !_.startsWith(str, "//")) $$(v).remove();
        else {
          $$(v).attr("src", str);
          $$(v)
            .removeAttr("src2")
            .html();
        }
      } else
        $$(v)
          .removeAttr("src2")
          .html();
      if (isUrlDecode) {
        let str = decodeURIComponent($$(v).attr("src"));
        $$(v).attr("src", str);
        // $$(v).removeAttr("alt")
        // .html();
      }
      if (isUrlEnCode) {
        let str = encodeURIComponent($$(v).attr("src"));
        $$(v).attr("src", str);
      }
    });
    htmlstr = $$("body").html();
    $$ = undefined;
    return htmlstr;
  }

  /**
   * 将typ=html的属性的值去文本
   * @param {string} htmlstr
   */
  static getHtmlDelText(htmlstr) {
    if (_.isNil(htmlstr)) return;
    let htmlarr = htmlstr.replace(/(<img[^>]*>)/gi, "{wyb}$1{wyb}").split("{wyb}");
    for (let i = 0; i < htmlarr.length; i++) {
      let e = htmlarr[i];
      if (!e.startsWith("<img")) {
        htmlarr[i] = "";
      } else htmlarr[i] = "<p>" + e + "</p>";
    }
    if (htmlarr.length) return htmlarr.join("");
    else return "";
  }

  /**返回错误对象*/
  static getErrObj(error) {
    if (error.response) {
      return { status: error.response.status, url: error.response.config.url, res: error.response.data, req: error.response.config.data };
    } else {
      return { stack: error.stack };
    }
  }

  /** 计算2个字符串的相关度，完全相等为1，完全不等为0
   * @param {string} str1
   * @param {string} str2
   * @param {string} lang
   */
  static getXgd(str1, str2, lang) {
    // console.log(11+ str1, 22+ str2)
    str1 = _.toString(str1).toLowerCase();
    str2 = _.toString(str2).toLowerCase();
    if (str1 == str2) return 1;
    if (!lang.includes("zh-")) {
      return 1 - levenshtein.get(str1, str2) / Math.max(str1.length, str2.length);
    } else {
      let strArr1 = str1.split("");
      let strArr2 = str2.split("");
      let arr = strArr2.filter(str => strArr1.includes(str));
      return [...new Set(arr)].length / [...new Set([...strArr1, ...strArr2])].length;
    }
  }

  /**获取最相关的对应词及其相关度
   * @param {{text:string,midText?:string,lang?:string}} obj 要对应的对象
   * @param {{text:string,midText?:string,lang?:string}[]} arr 待选择数组
   * @param {string} mapLang 转换中间语言
   * @returns {{text:string,xgd:number}}
   */
  static getMap(obj, arr, mapLang) {
    /**是否相等 */
    let result = _.find(arr, valObj => {
      if (_.toString(obj.text).toLowerCase() == _.toString(valObj.text).toLowerCase()) {
        return true;
      } else if (obj.midText && valObj.midText && _.toString(obj.midText).toLowerCase() == _.toString(valObj.midText).toLowerCase()) {
        return true;
      }
    });
    if (result) {
      return { text: result.text, xgd: 1 };
    }

    /**按相关度 */
    let text = "";
    let xgd = -1;
    _.forEach(arr, valObj => {
      let gd = 0;
      // if (obj.softLang == valObj.lang) {
      //   gd = this.getXgd(obj.text, valObj.text, obj.lang);
      // } else
      if (obj.midText && valObj.midText) gd = this.getXgd(obj.midText, valObj.midText, mapLang);
      else gd = this.getXgd(obj.text, valObj.text, mapLang);
      if (obj.text.includes("销售价") && valObj.text.includes("销售价")) gd = gd >= 0.5 ? 1 : gd + 0.5;
      if (obj.text.includes("市场价") && valObj.text.includes("市场价")) gd = gd >= 0.5 ? 1 : gd + 0.5;
      if (obj.text.includes("库存") && valObj.text.includes("库存")) gd = gd >= 0.5 ? 1 : gd + 0.5;
      if (obj.text.includes("编码") && valObj.text.includes("编码")) gd = gd >= 0.5 ? 1 : gd + 0.5;
      if (gd > xgd) {
        text = valObj.text;
        xgd = gd;
      }
    });
    return { text, xgd };
  }

  /**异步删除文件夹 */

  static deleteDir(path, fpath = "") {
    fs.readdir(path, (err, files) => {
      if (!err) {
        var len = files.length;
        files.forEach((file, i) => {
          var curPath = path + "/" + file;
          fs.stat(curPath, (err, stats) => {
            if (!err) {
              if (stats.isDirectory()) {
                this.deleteDir(curPath, path); //递归删除子文件夹
              } else {
                fs.unlink(curPath, err => {
                  fs.rmdir(path, err => {
                    if (fpath) fs.rmdir(fpath, err => {}); //尝试删上级文件夹
                  });
                });
              }
            }
          });
        });
        if (!len) fs.rmdir(path, err => {}); //删除空文件夹
      }
    });
  }

  /**同步复制文件夹 */
  static copyDir(src, dist) {
    var files = [];
    if (fs.existsSync(src)) {
      fs.mkdirSync(dist); //创建文件夹
      files = fs.readdirSync(src);
      files.forEach((file, index) => {
        var curPath = src + "/" + file;
        var distPath = dist + "/" + file;
        if (fs.statSync(curPath).isDirectory()) {
          this.copyDir(curPath, distPath); //递归复制子文件夹
        } else {
          fs.copyFileSync(curPath, distPath); //复制文件
        }
      });
    }
  }

  /**oss图片加文字水印 返回新的url
   * @param {string} pic     oss图片完整链接
   * @param {string} text    文字水印
   * @param {string} color   文字颜色
   * @param {Number} size    文字大小
   * @param {string} g       文字位置 值为 [nw,north,ne,west,center,east,sw,south,se] 分别指: 【左上、中上、右上、左中、中部、右中、左下、中下、右下】
   * @param {Number} voffset 中线垂直偏移   g值为【左中、中部、右中】有效  取值范围：[-1000， 1000]
   * @param {Number} x       水平边距  g值为【左上、中上、右上、左下、中下、右下】有效  取值范围：[0，4096]
   * @param {Number} y       垂直边距  g值为【左上、中上、右上、左下、中下、右下】有效  取值范围：[0，4096]
   * @param {Number} t       透明度  取值范围：[0，100]  默认值：100， 表示 100%（不透明）
   */
  static async getWaterPicBuffer(pic, text, color = "#000000", size = 40, g = "se", voffset = 0, x = 10, y = 10, t = 100) {
    return (await ax.post("http://www3.data1818.com:88/getWaterPicBuffer", { pic, text, color, size, g, voffset, x, y, t })).data;
  }

  /**通过oss内部透明图 需要改变透明度的图片为水印图 来改变图片透明度
   * @param {string} pic     oss图片完整链接
   * @param {Number} t       水印透明度  取值范围：[0，100]  默认值：100， 表示 100%（不透明）
   */
  static async picOpacity(pic, t = 100) {
    return (await ax.post("http://www3.data1818.com:88/picOpacity", { pic, t })).data;
  }

  /**根据约束处理图片 并通过阿里云API去图片背景  返回新的url
   * @param {string} pic   oss图片完整链接
   * @param {{}} attr      wybPic组件
   */
  static async picDelBackground(pic, attr = undefined) {
    return (await ax.post("http://www3.data1818.com:88/picDelBackground", { pic, attr })).data;
  }

  //↑↑↑在此处上面增加新函数，函数间空一行
}

window.wyb = wyb;
