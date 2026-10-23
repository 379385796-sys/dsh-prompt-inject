# Compatibility / 兼容与验证

- Windows + DSH Desktop 0.2.1-rc.2: previously isolated and formally installed for exporter, comfort, and prompt-inject; bilingual metadata reader and Chinese light/dark GUI verified. Public packaging is verified separately in the private release report.
- Linux/macOS/other DSH builds: NOT TESTED.
- 模板以明文保存，并会传给模型；已接受请求、历史与摘要不会因切换模板撤回。工作区匹配保留路径大小写和分隔符差异，不是权限隔离。complete persona 会按宿主规则排除本插件的段。不能保证任意 Agent 预设均会注入。
- Templates are stored in plaintext and transmitted to the model. Switching templates does not retract accepted requests, history, or summaries. Workspace keys preserve case and separators and are not an access-control boundary. A complete persona can exclude the injected section under host rules.

No live credentials, real conversations, Profile snapshots, recovery backups, or test logs belong in this repository. Functional test counts are reported as historical evidence when not rerun; a successful build is not GUI acceptance.

## Public candidate checks, 2026-10-24

Clean official tgz install and cold Web host startup PASS. Actual English and Chinese plugin cards and loaded icons PASS. No duplicate client stylesheet and no browser page errors. Syntax checks and 3 portable synthetic behavior tests PASS; the earlier 34 host tests remain historical evidence. No real model requests were sent.
