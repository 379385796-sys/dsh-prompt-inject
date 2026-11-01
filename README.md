# 系统提示词模板 · DSH Prompt Inject

[English](README.en.md) · [下载 v0.1.1-rc.5（预发布）](https://github.com/379385796-sys/dsh-prompt-inject/releases/tag/v0.1.1-rc.5) · [兼容记录](docs/COMPATIBILITY.md)

维护多套命名 System Prompt 模板，为全局或指定工作区选择一套，在下一次模型请求组装时追加到系统提示词。

这是 [H1a3x/dsh-prompt-inject](https://github.com/H1a3x/dsh-prompt-inject) 的维护适配版，保留原作者版权与 MIT 许可，**不是上游官方发行**。来源与修改见 [UPSTREAM](docs/UPSTREAM.md)。

## 模板如何生效

- 添加、编辑、删除和预览命名模板。
- 选择全局模板，或选择“不注入”。创建模板本身不会自动选中它。
- 每个工作区可以跟随全局、不注入，或使用指定模板。
- 使用宿主原生配置表单保存；冲突时保留草稿，刷新后重新检查并保存。

| 全局选择 | 当前工作区选择 | 结果 |
| --- | --- | --- |
| 通用助手 | 跟随全局 | 使用“通用助手” |
| 通用助手 | 不注入 | 此工作区不追加模板 |
| 通用助手 | 代码审查 | 此工作区使用“代码审查” |
| 不注入 | 跟随全局 | 不追加模板 |

这些是选择规则示例，不是内置模板。宿主的 **complete persona** 可排除此插件的提示段；不能保证任意 Agent 预设都会注入。

## 安装

当前包 **0.1.1-rc.5** 在 GitHub 标记为预发布。Node 要求 **24+**，声明的 DSH 范围为 `0.2.0-rc.2 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5`。当前目标为 Windows Desktop RC5；`0.2.0-rc.2` 是保留声明，不是本轮新验证。其他平台未验证。

1. 从 [v0.1.1-rc.5](https://github.com/379385796-sys/dsh-prompt-inject/releases/tag/v0.1.1-rc.5) 下载 `dsh-prompt-inject-0.1.1-rc.5.tgz` 与同名 `.sha256`。
2. 用 `Get-FileHash -Algorithm SHA256 -LiteralPath '<tgz完整路径>'` 核对校验值。
3. 通过 DSH 插件管理器安装本地 tgz，或使用已配置的 CLI：

   ```text
   dsh plugin --profile <你的Profile> add <tgz完整路径>
   ```

4. 重启后核对包名 `dsh-prompt-inject`、配置入口 ID `prompt-inject`、版本 `0.1.1-rc.5`。

模板管理依赖宿主的 settings、systemPrompt、客户端设置表单、Cordis、Schemastery 和 React 接口；精确 peer 范围见 [package.json](package.json)。不依赖另外三款 DSH 插件，不应为绕过版本检查而手改宿主依赖。

## 第一次使用

1. 打开 **设置 → 插件 → 提示词注入模板**，展开模板卡片。
2. 点击“添加模板”，填写唯一名称与正文并保存。例如用“简洁回答”作为名称，正文写“回答时先给结论，再列必要依据。”
3. 在“全局生效模板”选择该模板；需要例外时，在“按工作区覆盖”中单独选择。
4. 发起下一次模型请求。是否进入最终提示词，应以最终组装或请求为准，面板预览不等于已经注入。

模板以明文保存在 Profile 配置中，会进入模型请求与会话历史，fork 和备份也可能包含。请勿存放 API Key、密码或其他凭据。切换模板不会撤回已接受的请求、已有历史或压缩前缀。

## 常见问题

**创建并保存了模板，为什么没生效？** 检查全局选择与工作区覆盖，确认没有选“不注入”。保存只影响下一次组装；complete persona 会按宿主规则排除此段。

**为什么相似的工作区路径没有共用覆盖？** 匹配会去掉末尾分隔符并保留根路径语义，但不统一路径大小写或内部斜杠形式。请以面板列出的工作区路径为准。这不是权限隔离机制。

**删除选中的模板会怎样？** 使用它的全局选择会清空，显式工作区选择会变为“不注入”，不会意外改为跟随全局。

**保存冲突怎么办？** 保留草稿，刷新配置，检查最新状态后再保存；不要用旧页面反复覆盖。

**如何卸载？** 先备份自己需要的模板，再用插件管理器或 `dsh plugin --profile <你的Profile> remove dsh-prompt-inject`。卸载不撤回模型已收到的内容，也不保证删除保留配置或历史。

## 开发与界面资料

仓库直接分发 `lib/` JavaScript；`build` 为语法检查，不需要编译 UI。配置临时目录和工具缓存后运行：

```text
npm run check
```

该命令执行语法检查与现有合成回归，不访问个人 Profile。历史宿主验收见[兼容记录](docs/COMPATIBILITY.md)，版本变化见 [CHANGELOG](CHANGELOG.md)。

已有管理器卡片来自隔离 RC2 宿主，仅用于安装识别：

![中文插件管理器卡片](assets/manager-zh.png)

建议后续补充使用示例模板的管理面板截图，不展示私人 Prompt 或工作区路径。

许可见 [MIT](LICENSE)，作者与依赖说明见[第三方声明](THIRD_PARTY_NOTICES.md)及[上游记录](docs/UPSTREAM.md)。
