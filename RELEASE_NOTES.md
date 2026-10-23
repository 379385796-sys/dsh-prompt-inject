# dsh-prompt-inject v0.1.1-rc.3.0

Manage named System Prompt templates with a global default and workspace overrides.

- Tested environment: Windows / DSH Desktop 0.2.1-rc.2. Other platforms are not verified.
- Prebuilt tgz, SHA-256 checksum, localized display metadata, and retained licenses.
- Templates are stored in plaintext and transmitted to the model. Switching templates does not retract accepted requests, history, or summaries. Workspace keys preserve case and separators and are not an access-control boundary. A complete persona can exclude the injected section under host rules.

维护命名 System Prompt 模板，支持全局默认与工作区覆盖。

- 实测环境：Windows / DSH Desktop 0.2.1-rc.2；不扩大兼容承诺。
- 预构建 tgz、SHA-256、中文展示资源及原有许可。
- 模板以明文保存，并会传给模型；已接受请求、历史与摘要不会因切换模板撤回。工作区匹配保留路径大小写和分隔符差异，不是权限隔离。complete persona 会按宿主规则排除本插件的段。不能保证任意 Agent 预设均会注入。

