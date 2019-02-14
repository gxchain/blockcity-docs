# 开放能力

## GID授权

### 功能介绍

开发者可以通过国际标准的OAuth2.0授权机制，在用户授权的情况下，得到用于换取用户信息的令牌。在拿到用户的授权令牌后，获取用户允许授权访问的数据内容。目前暂时只开放布洛克城用户基本信息接口，之后将会集成开发链上GID数据的本地DataKey解密并授权。

#### 1.1 应用场景
BlockPay支付
#### 获取基本信息

开发者除了可以拿到布洛克用户唯一编号（uuid）进行免登处理，还能获取更多的信息，包括昵称，居民号、是否是创世居民、注册时间、是否通过二要素实名认证、是否通过KYC实名认证、布洛克城头像。
此种场景，用户在操作过程中，会出现弹框界面（如下图）让用户确认是否授权。

![img](/blockcity/img/d-5-1.png)

#### 1.2 准入条件

小应用开发者均可使用。

#### 1.3 计费模式

暂不收费

### 接入指引

#### 2.1 开发准备

#### 获取小应用APPID

登录布洛克城开放平台，进入小应用列表，点击详情分别获取获取沙箱环境和正式环境的AppID和AppSecret。

![img](/blockcity/img/d-3-3.png)

#### 2.2 技术接入

#### 2.2.1 Oauth2.0授权流程图

![img](/blockcity/img/d-5-2.png)

#### 2.2.2 主流程说明

**第一步：登录状态检测**

对于需要用户授权的小应用，每当用户进入小应用时，需要先判断当前用户的登录状态，决定是否需要对当前用户进行GID授权。

**第二步：获取授权code**

**小应用授权:**
当**小应用**需要授权时，小应用client控制页面访问布洛克城授权页面：

```
沙箱环境地址：https://sandbox.blockcity.gxb.io/#/oauth/authorize?response_type=code&client_id=&redirect_uri=https%3A%2F%2Fxxx&state=

正式环境地址：https://blockcity.gxb.io/#/oauth/authorize?response_type=code&client_id=&redirect_uri=https%3A%2F%2Fxxx&state=
```

**原生应用授权:**

同时，布洛克城也支持对**原生应用**进行授权，其行为类似微信授权登录，通过构造下面的链接，让应用去唤起布洛克城，布洛克城完成授权后会根据传入的`redirect_uri`跳转回来

```
blockcity://auth?response_type=code&client_id=&redirect_uri=SCHEME%3A%2F%2Fxxx&state=
```

参数说明：

| 字段 | 是否必选 | 描述 |
| :--- | :--- | :--- |
| response\_type | 是 | 授权类型 ，值为code |
| client\_id | 是 | 等同于appid，创建应用时获得 |
| redirect\_uri | 是 | 回调地址，在用户授权后应用会跳转至redirect\_uri，**务必对地址进行urlencode。**, 如果为原生的应用，则redirect_uri为应用的URL_SCHEME, 如微信的URL_SCHEME为: weixin:// |
| state | 否 | 维持应用的状态，传入值与返回值保持一致 |

获取授权code：

当用户点击确认授权后，网页会重定向到回调地址，应用从回调地址中获取code。回调请求如下：

```
小应用：https://xxx?code=124124&state=
原生应用：SCHEME://xxx?code=124124&state=
```

**第三步：小应用服务端获取access\_token**

* 开发者可通过获取到的授权code换取access\_token，授权code作为换取access\_token的票据，每次用户授权完成，回调地址中的授权code将不一样，授权code只能使用一次，一天未被使用自动过期。具体可参见文档[获取令牌API](api.html#获取令牌api)。

* 每个access\_token目前有效期为30天，可调用refresh接口刷新时长，再次刷新有效期为30天，只能刷新一次。具体可参见文档[刷新令牌API](api.html#刷新令牌api)。

**第四步：小应用服务端签名获取GID信息**

* 获取access\_token后为了防止API调用过程中被黑客恶意篡改，调用任何一个API都需要携带签名，服务端会根据请求参数，对签名进行验证，签名不合法的请求将会被拒绝。根据实际授权范围，选择对应的数据API进行访问获取GID相关信息，比如[用户基本信息API](api.html#user-baseinfo（用户基本信息api）)。

**第五步：小应用客户端保存登录信息**

* <font color=#DC143C size=3 >用户授权完成后，需要在小应用客户端维护这个用户的登录状态,可以存localstorage能保持更长的登录状态，不要存cookie，容易丢失，当登录状态失效时需触发重新授权。</font>
* <font color=#DC143C size=3 >access_token的有效期为30天，刷新再延长30天，当access_token失效时，请重新授权。</font>
* <font color=#DC143C size=3 >另外当用户登出布洛克城时，布洛克城会失效用户对应用的授权access_token，所以判断localstorage的登录信息的同时，查询用户基本信息接口验证access_token有效性。避免用户登出后换个手机号登录，应用内的登录状态还是之前一个账号的情况。</font>


### 数据API列表

| 接口名称 | 描述 |
| :--- | :--- |
| [用户基本信息API](api.html#user-baseinfo（用户基本信息api）) | 小应用服务端获取用户基本信息 |

> <font size="2">_其他数据接口将陆续开放。_</font>

### 补充说明

* 涉及到敏感信息如真实姓名、手机号、证件号等，这些敏感信息不会返回。
* 上链数据授权会陆续开放，同样遵循GID授权流程。
* [令牌签名](api.html#获取令牌api)

## BlockPay支付

### 功能介绍

BlockPay支付是一个基于布洛克城账户，资金，支付体系，支持包括GXS，BTC，ETH等主流虚拟货币的全币种支付手段。能帮助小应用开发者完成支付，转账，退款，对账等一列表操作。

支付收款的商户账号为开发者中心绑定的布洛克账号，另外支付方跟收款方不能为同一个账号，测试时注意账号选择。

#### 1.1 功能流程

步骤1：用户在小应用中选择商品下单、确认购买，进入支付环节，用户点击确认支付；

![img](/blockcity/img/d-5-3.png)   ![img](/blockcity/img/d-5-4.png)

步骤2：进入到布洛克城页面，调起BlockPay支付，出现确认支付界面；

![img](/blockcity/img/d-5-5.png)

步骤3：用户确认收款方和金额，点击立即支付后出现输入密码界面；

![img](/blockcity/img/d-5-6.png)   ![img](/blockcity/img/d-5-7.png)

步骤4：输入正确密码后，BlockPay端显示支付结果；

![img](/blockcity/img/d-5-8.png)

步骤5：自动回跳到小应用中。

#### 1.2 准入条件

该产品使用者需要实名开发者，且个人开发者有日收款限额。

#### 1.3 计费模式

暂不收费

### 接入指引

#### 2.1 开发准备

#### 2.1.1 获取小应用APPID

登录布洛克城开放平台，进入小应用列表，点击详情分别获取获取沙箱环境和正式环境的AppID和AppSecret。

![img](/blockcity/img/d-3-3.png)

#### 2.1.2 上传应用公钥

开发者需创建一对RSA公私钥，公钥上传给布洛克城开放平台，在小应用服务端用私钥加密签名生成sign，作为支付接口必要请求参数。生成公私钥对可使用[RSA生成工具](http://web.chacuo.net/netrsakeypair)，设置密钥位数为2048位，秘钥格式为PKCS#8,证书密码不用设置

![img](/blockcity/img/d-3-5.png)

上传公钥格式，不要带上“-----BEGIN PUBLIC KEY-----”和“-----END PUBLIC KEY-----”

``` java
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm8MBCBTrNJWGyyA9W7aW
juY6j/APar4ZCkGkuJCU6TdRiYgeE4X1pU+V8KV1j2xDmO3aaUSx8Qwrofmue3QK
Cx8PD3e6Bgw/IjDBIgfOXp1wygTzfFLWu+l2jXs1JBV6jvekCjT7luZQrB9hSTgg
1tZ44+ZQFkilRdwdsL1t9ajeAYa61YoYyCe/nitLJqAXfwlvKrVyaot8q8cd/f0X
26SxWtro3hLHvuyTmsu+ihmbotWw64bBI9dmklGziHJXThNr+pyjzKgSz4fzMdyl
uATOTMpL2j0U6sFlI1hfhvNMKuHOaIYniP4zFEPs/5tw5fZrHMVnGn6V8LFj5kDP
BQIDAQAB
```

#### 2.1.3 引入Blockcity JS-SDK

> blockcity-js-sdk供布洛克城内的小应用使用，原生app支付接入可以跳过2.1.3这个步骤

#### CDN引入

通过 [unpkg.com/blockcity-js-sdk](https://unpkg.com/blockcity-js-sdk/) 可以看到 Blockcity JS-SDK 最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 文件即可开始使用：

``` javascript
<script src="//unpkg.com/blockcity-js-sdk/dist/blockcity-js-sdk.min.js"></script>
```

#### NPM安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用。

``` bash
npm install blockcity-js-sdk -save
```

npm使用

``` javascript
import BlockCity from 'blockcity-js-sdk';
```

#### 2.2 接入BlockPay支付

#### BlockPay支付调用流程图

![img](/blockcity/img/d-5-9.jpg)

#### 主要步骤

**第一步：发起支付**

用户在小应用客户端触发支付流程。

**第二步：预创建支付**

在小应用服务端把生成相关的支付信息，调用[预创建支付接口 ](api.html#blockpay-trade-app-pay（预创建支付api）), 获取trade\_no。

**第三步：唤起收银台**

**小应用唤起：**

小应用使用trade\_no，唤起布洛克城BlockPay收银台。用户输入密码进行支付，支持成功，失败，取消都会有对应的js回调，小应用客户端可以分别对这些操作做出响应。在支付完成（成功或取消）后，收银台会隐藏页面并返回之前唤起收银台的页面。

``` javascript
BlockCity.choosePay({
    tradeNo: '',
    success: function() {
        console.log('支付成功');
    },
    fail: function(error) {
        console.log('支付失败：' + JSON.stringify(error));
    },
    cancel: function() {
        console.log('取消支付');
    }
})
```

> <font size="2">小应用需要先引入Blockcity JS-SDK</font>

**原生应用唤起：**

第三方应用可以通过布洛克城的支付协议唤起app进行支付，类似支付宝支付和微信支付，通过构造下面的链接，让应用去唤起布洛克城，布洛克城完成支付后会根据传入的`callbackUrl`跳转回来

```
blockcity://pay?tradeNo=xxx&callbackUrl=SCHEME%3A%2F%2Fxxx
```


**第四步：支付回调**

用户支付成功后，小应用服务端会收到来自布洛克城的支付结果回调，回调地址为调用[预创建支付接口](api.html#blockpay-trade-app-pay（预创建支付api）) 时，指定的notify\_url，回调接口请求方式为 JSON POST BODY。

* 返回参数：

| 参数 | 类型 | 是否必须 | 描述 |
| :--- | :--- | :--- | :--- |
| appId | string | 是 | 应用id |
| tradeNo | string | 是 | 支付订单号 |
| outTradeNo | string | 是 | 商户唯一订单号 |
| paySuccess | boolean | 是 | 是否支付成功 |
| callbackParams | string | 否 | 预创建时商户传入的参数 |
| sign | string | 是 | 回调签名，签名方式：RSA("appId=&outTradeNo=&paySuccess=&tradeNo=","公钥") |

* 校验签名示例

java代码：

```java
        PayCallBackParam param = new PayCallBackParam();
        param.setAppId("appId");
        param.setOutTradeNo("outTradeNo");
        param.setPaySuccess(true);
        param.setTradeNo("tradeNo");
        param.setSign("回调签名");
        //组装签名体
        StringBuilder builder = new StringBuilder();
        builder.append("appId=").append(param.getAppId())
                .append("&outTradeNo=").append(param.getOutTradeNo())
                .append("&paySuccess=").append(param.isPaySuccess())
                .append("&tradeNo=").append(param.getTradeNo());
        if(RsaSignature.rsaDecrypt(param.getSign(),"私钥").equals(builder.toString())){
            //签名通过
        }
```

php代码：

```php
private function decrypt($content)
{
    $priKey = $this->rsa_private_key;
    $res = openssl_get_privatekey($priKey);
    $result  = ‘’;
    $content = base64_decode($content);
    for ($i = 0; $i < strlen($content) / 256; $i++) {
        $data = substr($content, $i * 256, 256);
        openssl_private_decrypt($data, $decrypt, $res);
        $result .= $decrypt;
    }
    openssl_free_key($res);
    return $result;
}

```

* 代码下载

[JAVA代码示例下载](http://gxb-doc.oss-cn-hangzhou.aliyuncs.com/blockpay/paydemo.zip)


* 验证数据的正确性

在签名校验成功后，请严格校验：1.appId是否为改商户本身，2.outTradeNo为商户系统中创建的订单号，3.tradeNo能与outTradeNo对应。上述有任何一个验证不通过，则表明本次通知是异常通知

* 回调JSON请求示例：

``` json
{
    "appId":"应用id"
    "tradeNo": "支付订单号"
    "outTradeNo":"商户唯一订单号",
    "paySuccess":true,
    "callbackParams":"根据预创建时传入的值一模一样返回",
    "sign":"返回签名"
}
```

* 回调接口返回要求：

``` json
{
    "success": true
}
```

#### API列表

| 接口名称 | 描述 |
| :--- | :--- |
| [预创建支付API](api.html#预创建支付) | 预先创建支付订单接口 |
| [查询交易API](api.html#查询交易) | 交易状态主动查询接口 |
| [退款接口API](api.html#退款接口) | 发起交易退款接口 |
| [查询退款API](api.html#查询退款) | 交易退款状态查询接口 |
| [关闭交易API](api.html#关闭交易) | 关闭指定的支付订单接口 |
| [支持支付币种API](api.html#支持支付币种) | 拉取支持的所有支付币种接口 |
| [转账API](api.html#转账ap) | 商户对用户进行直接转账的接口 |

#### 补充说明

* [支付接口签名](api.html#支付签名)

## 小应用关闭

### 功能介绍

为开发者提供一键关闭本小应用的能力。

#### 1.1 功能流程

引入JS-SDK，直接调用即可

#### 1.2 准入条件

无

### 接入指引

#### 2.1 开发准备

#### CDN引入

通过 [unpkg.com/blockcity-js-sdk](https://unpkg.com/blockcity-js-sdk/) 可以看到 Blockcity JS-SDK 最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 文件即可开始使用：

``` javascript
<script src="//unpkg.com/blockcity-js-sdk/dist/blockcity-js-sdk.min.js"></script>
```

#### NPM安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用。

``` bash
npm install blockcity-js-sdk -save
```

npm使用

``` javascript
import BlockCity from 'blockcity-js-sdk';
```


#### 2.2 功能接入

为开发者提供一键关闭本小应用的能力。

``` javascript
BlockCity.closeWindow();
```

> <font size="2">小应用需要先引入Blockcity JS-SDK</font>

## 扫一扫

### 功能介绍

为开发者提供原生二维码识别能力。

#### 1.1 功能流程

引入JS-SDK，直接调用即可

#### 1.2 准入条件

无

### 接入指引

#### 2.1 开发准备

#### CDN引入

通过 [unpkg.com/blockcity-js-sdk](https://unpkg.com/blockcity-js-sdk/) 可以看到 Blockcity JS-SDK 最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 文件即可开始使用：

``` javascript
<script src="//unpkg.com/blockcity-js-sdk/dist/blockcity-js-sdk.min.js"></script>
```

#### NPM安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用。

``` bash
npm install blockcity-js-sdk -save
```

npm使用

``` javascript
import BlockCity from 'blockcity-js-sdk';
```

#### 2.2 功能接入

唤起二维码扫一扫。

``` javascript
BlockCity.qrScan(function (result) {
    console.log(result)
})
```

> <font size="2">小应用需要先引入Blockcity JS-SDK</font>

## 自定义分享

### 功能介绍

为开发者提供自定义内容分享的能力。

#### 1.1 功能流程

引入JS-SDK，直接调用即可

#### 1.2 准入条件

无

### 接入指引

#### 2.1 开发准备

#### CDN引入

通过 [unpkg.com/blockcity-js-sdk](https://unpkg.com/blockcity-js-sdk/) 可以看到 Blockcity JS-SDK 最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 文件即可开始使用：

``` javascript
<script src="//unpkg.com/blockcity-js-sdk/dist/blockcity-js-sdk.min.js"></script>
```

#### NPM安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用。

``` bash
npm install blockcity-js-sdk -save
```

npm使用

``` javascript
import BlockCity from 'blockcity-js-sdk';
```

#### 2.2 功能接入

配置分享标题、描述、缩略图、URL，参数必填不能为空。

``` javascript
BlockCity.shareConfig({
    title: '',
    shareDes: '',
    url: '',
    thumbUrl: '',
    success: function() {
        console.log('配置成功');
    },
    fail: function(error) {
        console.log('配置失败：' + JSON.stringify(error));
    }
})
```

> <font size="2">小应用需要先引入Blockcity JS-SDK</font>

## 旋转屏幕

### 功能介绍

为开发者提供旋转屏幕显示方向的能力。

#### 1.1 功能流程

引入JS-SDK，直接调用即可

#### 1.2 准入条件

无

#### 1.3 版本支持

Blockcity JS-SDK Version >= 1.1.6

布洛克城沙箱 Version >= 2.0.3

布洛克城 Version >= 2.0.3（即将上线）

布洛克城国际版 Version >= 2.0.0（即将上线）

### 接入指引

#### 2.1 开发准备

#### CDN引入

通过 [unpkg.com/blockcity-js-sdk](https://unpkg.com/blockcity-js-sdk/) 可以看到 Blockcity JS-SDK 最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 文件即可开始使用：

``` javascript
<script src="//unpkg.com/blockcity-js-sdk/dist/blockcity-js-sdk.min.js"></script>
```

#### NPM安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用。

``` bash
npm install blockcity-js-sdk -save
```

npm使用

``` javascript
import BlockCity from 'blockcity-js-sdk';
```

#### 2.2 功能接入

为开发者提供旋转屏幕显示方向的能力。

``` javascript
BlockCity.rotate({
    hiddenNav: 1, // hiddenNav(隐藏导航栏): 1代表隐藏导航栏，0不隐藏导航栏;
    direction: 0  // direction(旋转方向): 0代表横屏，1代表竖屏
});
```

> <font size="2">小应用需要先引入Blockcity JS-SDK</font>

## 获取设备信息

### 功能介绍

为开发者提供获取设备信息的能力。

#### 1.1 功能流程

引入JS-SDK，直接调用即可

#### 1.2 准入条件

无

#### 1.3 版本支持

Blockcity JS-SDK Version >= 1.1.6

布洛克城沙箱 Version >= 2.0.3

布洛克城 Version >= 2.0.3（即将上线）

布洛克城国际版 Version >= 2.0.0（即将上线）

### 接入指引

#### 2.1 开发准备

#### CDN引入

通过 [unpkg.com/blockcity-js-sdk](https://unpkg.com/blockcity-js-sdk/) 可以看到 Blockcity JS-SDK 最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 文件即可开始使用：

``` javascript
<script src="//unpkg.com/blockcity-js-sdk/dist/blockcity-js-sdk.min.js"></script>
```

#### NPM安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用。

``` bash
npm install blockcity-js-sdk -save
```

npm使用

``` javascript
import BlockCity from 'blockcity-js-sdk';
```

#### 2.2 功能接入

为开发者提供获取设备信息的能力，其中appLanguage可供开发者判断用户当前使用的App语言。

``` javascript
BlockCity.getDeviceInfo(function (result) {
    alert(result);
});
```

> <font size="2">小应用需要先引入Blockcity JS-SDK</font>

## 获取系统语言

### 功能介绍

为开发者提供获取手机系统语言的能力。

#### 1.1 功能流程

引入JS-SDK，直接调用即可

#### 1.2 准入条件

无

#### 1.3 版本支持

Blockcity JS-SDK Version >= 1.1.6

布洛克城沙箱 Version >= 2.0.3

布洛克城 Version >= 2.0.3（即将上线）

布洛克城国际版 Version >= 2.0.0（即将上线）

### 接入指引

#### 2.1 开发准备

#### CDN引入

通过 [unpkg.com/blockcity-js-sdk](https://unpkg.com/blockcity-js-sdk/) 可以看到 Blockcity JS-SDK 最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 文件即可开始使用：

``` javascript
<script src="//unpkg.com/blockcity-js-sdk/dist/blockcity-js-sdk.min.js"></script>
```

#### NPM安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用。

``` bash
npm install blockcity-js-sdk -save
```

npm使用

``` javascript
import BlockCity from 'blockcity-js-sdk';
```

#### 2.2 功能接入

为开发者提供获取手机系统语言的能力。

``` javascript
BlockCity.getSysLanguage(function (result) {
    alert(result);
});
```

> <font size="2">小应用需要先引入Blockcity JS-SDK</font>

## 分享到微信

### 功能介绍

为开发者提供分享文本、图片、网页到微信好友或朋友圈的能力。

#### 1.1 功能流程

引入JS-SDK，直接调用即可

#### 1.2 准入条件

无

#### 1.3 版本支持

Blockcity JS-SDK Version >= 1.1.6

布洛克城沙箱 Version >= 2.0.3

布洛克城 Version >= 2.0.3（即将上线）

布洛克城国际版 Version >= 2.0.0（即将上线）

### 接入指引

#### 2.1 开发准备

#### CDN引入

通过 [unpkg.com/blockcity-js-sdk](https://unpkg.com/blockcity-js-sdk/) 可以看到 Blockcity JS-SDK 最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 文件即可开始使用：

``` javascript
<script src="//unpkg.com/blockcity-js-sdk/dist/blockcity-js-sdk.min.js"></script>
```

#### NPM安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用。

``` bash
npm install blockcity-js-sdk -save
```

npm使用

``` javascript
import BlockCity from 'blockcity-js-sdk';
```

#### 2.2 功能接入

为开发者提供分享文本、图片、网页到微信好友或朋友圈的能力，参数必填不能为空。

``` javascript
BlockCity.callShare({
    contentType: 0,     // contentType: 0分享文字，1分享图片，2分享网页;
    sceneType: 0,       // sceneType:0 代表分享到微信好友，1代表微信朋友圈;
    title: '',          // 分享标题
    shareDes: '',       // 分享描述
    url: '',            // 分享URL
    thumbUrl: '',       // 分享缩略图
    success: function () {
        alert('分享成功');
    },
    fail: function (error) {
        alert('分享失败: ' + JSON.stringify(error));
    }
});
```

> <font size="2">小应用需要先引入Blockcity JS-SDK</font>

## 获取用户公信链钱包账户名

### 功能介绍

为开发者提供授权获取用户公信链钱包账户名的能力。

#### 1.1 功能流程

引入JS-SDK，直接调用即可

#### 1.2 准入条件

无

#### 1.3 版本支持

Blockcity JS-SDK Version >= 1.2.0

布洛克城沙箱 Version >= 2.0.0

布洛克城 Version >= 2.0.0

布洛克城国际版 Version >= 2.0.0

### 接入指引

#### 2.1 开发准备

#### CDN引入

通过 [unpkg.com/blockcity-js-sdk](https://unpkg.com/blockcity-js-sdk/) 可以看到 Blockcity JS-SDK 最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 文件即可开始使用：

``` javascript
<script src="//unpkg.com/blockcity-js-sdk/dist/blockcity-js-sdk.min.js"></script>
```

#### NPM安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用。

``` bash
npm install blockcity-js-sdk -save
```

npm使用

``` javascript
import BlockCity from 'blockcity-js-sdk';
```

#### 2.2 功能接入

为开发者提供授权获取用户公信链钱包账户名的能力，参数必填不能为空。

``` javascript
BlockCity.callAuth({
    authItem: 'account',
    success: function (res) {
        alert('成功回调' + res);
    },
    fail: function (res) {
        alert('分享失败' + res);
    },
    cancel: function (res) {
        alert('用户取消' + res);
    }
});
```

> <font size="2">小应用需要先引入Blockcity JS-SDK</font>

## 调用执行公信链智能合约

### 功能介绍

为开发者提供调用执行公信链智能合约的能力。

#### 1.1 功能流程

引入JS-SDK，直接调用即可

#### 1.2 准入条件

无

#### 1.3 版本支持

Blockcity JS-SDK Version >= 1.2.0

布洛克城沙箱 Version >= 2.0.0

布洛克城 Version >= 2.0.0

布洛克城国际版 Version >= 2.0.0

### 接入指引

#### 2.1 开发准备

#### CDN引入

通过 [unpkg.com/blockcity-js-sdk](https://unpkg.com/blockcity-js-sdk/) 可以看到 Blockcity JS-SDK 最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 文件即可开始使用：

``` javascript
<script src="//unpkg.com/blockcity-js-sdk/dist/blockcity-js-sdk.min.js"></script>
```

#### NPM安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用。

``` bash
npm install blockcity-js-sdk -save
```

npm使用

``` javascript
import BlockCity from 'blockcity-js-sdk';
```

#### 2.2 功能接入

为开发者提供调用执行公信链智能合约的能力，参数必填不能为空。

智能合约开发文档请移步：[https://docs.gxchain.org/zh/contract/](https://docs.gxchain.org/zh/contract/)

><font size="2">提示: <br></font>
><font size="2">资产对象amount，其中amount表示资产数量，在链上使用大数存储，举例来说，GXC资产精度为5，1 GXC实际需要表示为1 * 100000 = 100000， 即amount为100000。<br></font>
><font size="2">发送资产对象asset_id表示资产id(比如GXC的资产id为1.3.1)。<br></font>
><font size="2">methodParams中的资产对象asset_id表示资产的instance id(比如资产id为1.3.1， 则其instance id最后的1)。</font>

``` javascript
// Demo: bank合约 - 存款
BlockCity.callContract({
    contractName: 'bank',       // 智能合约账户名
    amount: {                   // 发送资产对象 (Optional，需发送资产，则传入资产对象)
        asset_id: '1.3.1',      // 资产ID
        amount: 100000          // 资产数量（需保留精度，如发送1GXC,则传入100000）
    },
    methodName: 'deposit',      // 智能合约函数名
    methodParams: {},           // 智能合约函数传参
    success: function (result) {
        alert('成功：' + result);
    },
    fail: function (result) {
        alert('失败：' + result);
    },
    cancel: function (result) {
        alert('取消：' + result);
    }
});
// Demo: bank合约 - 提现
BlockCity.callContract({
    contractName: 'bank',       // 智能合约账户名
    amount: 0,                  // 发送资产对象 (Optional，无需发送资产，则传入0)
    methodName: 'withdraw',     // 智能合约函数名
    methodParams: {             // 智能合约函数传参
        to_account: 'nathan',
        amount: {
            asset_id: 1,
            amount: 100000
        }
    },
    success: function (result) {
        alert('成功：' + result);
    },
    fail: function (result) {
        alert('失败：' + result);
    },
    cancel: function (result) {
        alert('取消：' + result);
    }
});
```

> <font size="2">小应用需要先引入Blockcity JS-SDK</font>



## 是否支持指定接口

### 功能介绍

判断当前客户端版本是否支持指定接口

#### 1.1 功能流程

引入JS-SDK，直接调用即可

#### 1.2 准入条件

无

#### 1.3 版本支持

Blockcity JS-SDK Version >= 1.3.2



### 接入指引

#### 2.1 开发准备

#### CDN引入

通过 [unpkg.com/blockcity-js-sdk](https://unpkg.com/blockcity-js-sdk/) 可以看到 Blockcity JS-SDK 最新版本的资源，也可以切换版本选择需要的资源，在页面上引入 js 文件即可开始使用：

```javascript
<script src="//unpkg.com/blockcity-js-sdk/dist/blockcity-js-sdk.min.js"></script>
```

#### NPM安装

推荐使用 npm 来安装，享受生态圈和工具带来的便利，更好地和 webpack 配合使用。

```bash
npm install blockcity-js-sdk -save
```

npm使用

```javascript
import BlockCity from 'blockcity-js-sdk';
```

#### 2.2 功能接入
如果支持的话，在success的返回结构，可以通过`res[apiName]`取到是否支持的情况，返回`true`或者`false`。

```javascript
BlockCity.checkJsApi({
    jsApiList: [
        'shareConfig',
        'choosePay',
        'rotate'
    ],
    success: function (res) {
        console.log(res.shareConfig)
    },
    fail: function (err) {
        console.error(err)
    }
})
```

> <font size="2">小应用需要先引入Blockcity JS-SDK</font>