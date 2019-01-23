(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{174:function(t,e,a){"use strict";a.r(e);var s=a(0),r=Object(s.a)({},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content"},[t._m(0),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),a("p",[t._v("全部接口均支持HTTPS证书，所使用的证书来自于Let’s Encrypt。由于证书来源问题，JDK 8u101之前的版本调用公信宝接口时可能出现SSLHandshakeException：sun.security.validator.ValidatorException: PKIX path building failed:\nsun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target。以下两种方式都可以获取有效的访问证书，并不会对商户其他的访问业务产生影响。")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("解决方案1：对证书没有特殊需求的商户可直接使用"),a("a",{attrs:{href:"http://gxb-doc.oss-cn-hangzhou.aliyuncs.com/dcdoc/cacerts",target:"_blank",rel:"noopener noreferrer"}},[t._v("JDK 8u101的默认可信证书"),a("OutboundLink")],1),t._v("，无需升级java版本。")])]),t._v(" "),a("li",[a("p",[t._v("解决方案2：对当前版本的jdk证书，进行合并。教程："),a("a",{attrs:{href:"https://gist.github.com/hedefalk/9442c224e7de4739e8cee6b7e88c4d7f",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://gist.github.com/hedefalk/9442c224e7de4739e8cee6b7e88c4d7f"),a("OutboundLink")],1),t._v(" （需翻墙）把获得的有效证书更新让jvm能获取到，即可解决这个问题")])]),t._v(" "),t._m(3)]),t._v(" "),a("blockquote",[a("p",[a("font",{attrs:{size:"2"}},[t._v('System.setProperty("javax.net.ssl.trustStore", new File("cacerts").getAbsolutePath());')])],1)]),t._v(" "),t._m(4)])},[function(){var t=this.$createElement,e=this._self._c||t;return e("h1",{attrs:{id:"faq"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#faq","aria-hidden":"true"}},[this._v("#")]),this._v(" FAQ")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"证书相关"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#证书相关","aria-hidden":"true"}},[this._v("#")]),this._v(" 证书相关")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h4",{attrs:{id:"q1：javax-net-ssl-sslhandshakeexception"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#q1：javax-net-ssl-sslhandshakeexception","aria-hidden":"true"}},[this._v("#")]),this._v(" Q1：javax.net.ssl.SSLHandshakeException")])},function(){var t=this.$createElement,e=this._self._c||t;return e("li",[e("p",[this._v("证书更新方案1：显示设置可信证书")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("证书更新方案2：把证书直接覆盖系统证书，路径： $JAVA_HOME/jre/lib/security/cacerts")])])}],!1,null,null,null);r.options.__file="README.md";e.default=r.exports}}]);