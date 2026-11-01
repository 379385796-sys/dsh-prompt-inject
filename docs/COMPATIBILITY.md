# Compatibility / 兼容与验证

## 当前范围 / Current scope

- Package **0.1.1-rc.5** declares DSH `0.2.0-rc.2 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5`; Node **24+**.
- Current published target: Windows x64 DSH Desktop **0.2.1-rc.5**. See [v0.1.1-rc.5 Release](https://github.com/379385796-sys/dsh-prompt-inject/releases/tag/v0.1.1-rc.5). Source baseline: `ea9e49ce04fe9ce14ca52f877055529c95d3b827`.
- 声明接受范围不等于每个版本、平台及第三方组合都完成同等验收。下面的 RC2/RC3 测试数量与安装状态是对应日期的历史记录；本轮仅检查文档，没有重新运行功能或桌面验收。
- Declared ranges are not equal validation of every build/platform/combination. Historical RC2/RC3 records below retain their dates and scope; this documentation revision does not rerun functional or Desktop acceptance.
- Linux/macOS and arbitrary host builds remain untested.

## 历史验证记录 / Historical validation records


- Windows + DSH Desktop 0.2.1-rc.2: previously isolated and formally installed for exporter, comfort, and prompt-inject; bilingual metadata reader and Chinese light/dark GUI verified. Public packaging is verified separately in the private release report.
- Linux/macOS/other DSH builds: NOT TESTED.
- 模板以明文保存，并会传给模型；已接受请求、历史与摘要不会因切换模板撤回。工作区匹配保留路径大小写和分隔符差异，不是权限隔离。complete persona 会按宿主规则排除本插件的段。不能保证任意 Agent 预设均会注入。
- Templates are stored in plaintext and transmitted to the model. Switching templates does not retract accepted requests, history, or summaries. Workspace keys preserve case and separators and are not an access-control boundary. A complete persona can exclude the injected section under host rules.

No live credentials, real conversations, Profile snapshots, recovery backups, or test logs belong in this repository. Functional test counts are reported as historical evidence when not rerun; a successful build is not GUI acceptance.

## Public candidate checks, 2026-10-24

Clean official tgz install and cold Web host startup PASS. Actual English and Chinese plugin cards and loaded icons PASS. No duplicate client stylesheet and no browser page errors. Syntax checks and 3 portable synthetic behavior tests PASS; the earlier 34 host tests remain historical evidence. No real model requests were sent.

## 0.1.1-rc.4 — 2026-10-25

Installed target verified from immutable app.asar metadata: DSH and Shell 0.2.1-rc.3; Shell commit be72761ee1a6736ebcdf4f3739363b083ae53c98; Electron 44.7.0, Node 24.21.0, ABI 149.

Extend the explicit host and peer ranges to RC3. Retain ConfigForms revision fences, volatile configuration, template data format, injection order, H1a3x attribution and MIT license.

Three behavior tests and real ConfigForms saving, workspace overrides, draft refresh, cold restart and exactly-once main-request injection passed. All three maintained plugins coexist with Packer 0.4.2 in an isolated RC3 Profile; the final headless Web-host pass has no page, console or HTTP errors. The human user completed actual Desktop GUI checks. Headless and Desktop results are recorded separately. No compatibility exemption was used. Prior RC2 support remains; full RC2 Desktop retesting this maintenance is NOT TESTED. The legacy 0.2.0-rc.2 declaration is retained, not newly certified.

## 0.1.1-rc.5 — rc.5 maintenance (2026-10-30)

Target: DSH Desktop 0.2.1-rc.5, Windows x64, Electron 44.7.0 / Node 24.21.0 / ABI 149. Exact host range: `0.2.0-rc.2 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5`. Add RC5 to the three actually used host peer ranges. Preserve ConfigForms revision fences, volatile Profile settings, workspace selection, injection order and H1a3x MIT attribution. No functional code changes.

Core behavior is checked on an isolated rc.5 Host/browser with synthetic sessions and deterministic offline model output, followed by three-plugin coexistence and the unchanged Packer 0.4.3 candidate dependency precheck. Earlier RC2/RC3 evidence remains; those full Desktop GUI checks are not repeated here. No formal Profile or DSH core modification.
