# 系统提示词注入（dsh-prompt-inject）

## 0.1.1-rc.4 兼容性维护（2026-10-25）

宿主范围：`0.2.0-rc.2 || 0.2.1-rc.2 || 0.2.1-rc.3`。本次以 Windows Desktop 0.2.1-rc.3 / Electron 44.7.0 / Node 24.21.0 实测。修复加载前版本拒绝，不新增功能。

隔离真实宿主、三插件与 Packer 0.4.2 共存、启停、设置与重启回归已验证；用户完成真实 Desktop GUI 验收。3 项行为测试及真实 ConfigForms 保存、Workspace 覆盖、草稿刷新、冷重启与主请求单次注入检查通过。保留原 RC2 支持及自动测试；本轮完整 RC2 Desktop 复测为 NOT TESTED。具体边界见 [兼容性记录](docs/COMPATIBILITY.md)。


[English](README.en.md)

维护命名 System Prompt 模板，支持全局默认与工作区覆盖。

本项目是 [H1a3x/dsh-prompt-inject](https://github.com/H1a3x/dsh-prompt-inject) 的本地维护适配版，保留 H1a3x 版权与 MIT 许可。不是原作者的官方发行，也不将上游代码声明为原创。参见 [来源与修改](docs/UPSTREAM.md)。

## 兼容性与状态

版本 **0.1.1-rc.4**。当前实测：Windows、DSH Desktop **0.2.1-rc.3**；保留此前 RC2 支持和自动回归，本轮 RC2 Desktop 全量复测为 NOT TESTED。其他平台未测试。

模板以明文保存，并会传给模型；已接受请求、历史与摘要不会因切换模板撤回。工作区匹配保留路径大小写和分隔符差异，不是权限隔离。complete persona 会按宿主规则排除本插件的段。不能保证任意 Agent 预设均会注入。

## 安装与卸载

在 Releases 下载与本版本对应的预构建 tgz，先核对 SHA-256，再通过 DSH 官方插件界面选择该包，或执行：

```text
dsh plugin --profile <你的Profile> add <安装包完整路径>
```

重启 DSH 后，在插件管理器核对名称、ID 和版本。更新前备份自己的配置；不要手动修改 node_modules 或 app.asar。卸载使用插件管理器的卸载入口，或 `dsh plugin --profile <你的Profile> remove dsh-prompt-inject`。卸载不保证删除已导出的文件、历史或保留偏好。

## 使用

打开插件的模板管理面板，添加命名模板、选择全局默认，并为工作区选择继承、禁用或指定模板。保存从下一次系统提示组装生效。

## 构建、测试与排错

此插件直接分发 JavaScript；`npm run build` 进行语法检查，`npm test` 运行不访问个人 Profile 的合成回归。

预构建 lib 已随源码保留，因此 GitHub 源码安装不需要运行安装期构建脚本。安装失败先检查 DSH 版本、Profile、包校验值和模块加载错误。不要通过关闭安全策略或覆盖宿主文件排错。完整范围见 [兼容与验证](docs/COMPATIBILITY.md)。

## 许可

见 [LICENSE](LICENSE)；第三方声明见对应许可文件。

## Plugin manager / 插件管理器

Actual isolated DSH 0.2.1-rc.2 interface, with no personal account, Profile path, or conversation content in the captured cards.

![中文](assets/manager-zh.png)

![English](assets/manager-en.png)
