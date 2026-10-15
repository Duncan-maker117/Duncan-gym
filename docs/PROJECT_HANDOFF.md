# Duncan gym 项目交接说明

更新日期：2026-10-16（Asia/Shanghai）

## 项目定位

- 上游仓库：[DuarteSantos8/openGym](https://github.com/DuarteSantos8/openGym)
- 本地基线：`main`，克隆时 HEAD 为 `e348fc17c42c7e9a211c5972e573ad3698190ee2`（2026-10-13）。上游会继续更新；开发前确认是否需要有计划地同步，不要把线上仓库主页的最新信息误认为本地提交。
- 产品名称已定为 **Duncan gym**；先准备 Web/PWA 版本与公开的浏览器演示。业务模式、面向人群、数据托管方案和小程序范围尚未确定。
- 用户告知已取得原作者对二创及不展示作者署名的许可。该许可是用户提供的信息；本地尚无书面授权文件可供审阅。

## 项目怎么用

### 普通用户试用

浏览器演示地址：[https://duncan-maker117.github.io/Duncan-gym/](https://duncan-maker117.github.io/Duncan-gym/)。首次访问会载入示例训练记录；演示数据只保存在当前浏览器，不能作为真实训练数据的唯一副本。

### 本地运行（推荐 Docker Compose）

仓库根目录已有 `.env.example` 和 `docker-compose.yml`。README 的基础流程是：

```sh
cp .env.example .env
docker compose up --build -d
```

浏览器访问 `http://localhost:8080`，创建 profile。停止服务使用 `docker compose down`；训练和账户数据放在项目根目录 `data/`，这是运行数据，必须保留。首次公开部署前设置 HTTPS、域名对应的 `RP_ID` 和 `ORIGIN`，阅读 [`部署说明`](DEPLOYMENT.md)；本地 `localhost` 可用于开发体验，但手机 passkey 需要 HTTPS 域名。

如要本地开发：前端依赖安装后执行 `npm run dev`；API 目录运行 `npm start`。前后端地址和代理设置应结合 `frontend/vite.config.*`、API 代码与 compose 配置再配置。本交接文档没有在此环境启动容器或验证登录流程。

### 主要目录

| 路径 | 用途 |
| --- | --- |
| `frontend/` | React 19 + Vite 应用；训练计算和状态管理主要在 `frontend/src/lib/` |
| `api/` | Node HTTP API、身份认证、同步和 JSON 文件存储 |
| `api/openapi.yaml` | HTTP API 的 OpenAPI 3.1 规范 |
| `catalogue/` | 动作文字目录、翻译和媒体 |
| `docs/` | 自托管、移动端、API 和训练数据设计说明 |
| `data/` | 运行时用户数据，已加入 `.gitignore`，不可提交或覆盖 |

## 可直接复用的 Schema / 契约

1. **服务端 API：** [`api/openapi.yaml`](../api/openapi.yaml) 是最完整的接口契约，包含认证、请求/响应及 `State` 等结构。可用 Swagger UI 浏览上游在线文档，也可从此文件生成 API 客户端。路由变化必须同步维护规范。
2. **AI Coach：** `api/coach/core/schemas.js` 提供 create/refine/review/debrief 的 JSON Schema；`api/coach/core/validate.js` 再做内容和业务安全校验。两者都要遵守，不能只通过 schema 就执行模型输出。
3. **训练动作目录：** [`catalogue/exercises/0001.json`](../catalogue/exercises/0001.json) 展示动作记录字段，如 `id`、`name`、`bodyPart`、`equipment`、`target`、`secondaryMuscles`、`instructions`、`textSource`。中文等语言目录另在 `catalogue/i18n/`。
4. **训练状态：** OpenAPI 的 `State` 可用于理解服务端合同，但完整实际含义还分布在前端状态逻辑、默认值、同步和迁移代码。它不是一个已与实现完全解耦的稳定标准。任何自有扩展都应定义独立命名空间与 `schemaVersion`/迁移策略，避免破坏上游字段。

如果要对接自有小程序或新后端，建议将 `api/openapi.yaml` 作为接口起点，并先做“只读查看训练历史”的垂直切片；不要一开始就复制全部状态同步、passkey、离线合并和管理后台。

## 二创的关键授权事实

- 仓库的代码许可证为 **AGPL-3.0-or-later**，见 [`LICENSE`](../LICENSE)。如果对公众提供修改版网络服务，AGPL 要求向该服务的用户提供对应版本源代码。单独的作者许可不当然替换这项义务；需要另行取得适用的商业/闭源许可，才可改变这一分发约束。
- 用户希望不展示原作者署名。作者的直接许可可能解决其署名偏好，但仓库已有版权/许可证文本仍需按许可证保留。品牌 UI 不必把作者包装成产品品牌，不过仓库中的法律声明和第三方 NOTICE 不应删除。
- 动作图片和动画有独立的 Gym visual 授权说明，**不属于 openGym 的 AGPL 代码许可证**；`catalogue/media/NOTICE.md` 明确要求将这些素材用于独立应用/网站前向权利方取得许可。因此即便有作者授权，也不要直接把这些媒体用于自己的网页或小程序。动作文本的来源及第三方图形等素材也应逐项按 `NOTICE.md` 核实。
- 以上为基于当前仓库许可证/NOTICE 文本的工程边界总结，不替代法律意见。商业发布前整理代码、动作文本、图片/动画、图标、字体、翻译和商标的素材清单及授权凭证。

## 建议的推进顺序

1. 先在本地运行上游应用，熟悉训练记录、计划、统计、导入导出和账号同步流程。
2. 明确目标用户和产品承诺，再选首发形态。Web/PWA 能最大程度复用现有前端；微信小程序通常需要适配 UI、登录、存储、文件、分享和审核能力，不是直接打包现有 React 应用。
3. 先做自有品牌主题配置和一个用户可见的最小差异点；保留上游数据结构与导入导出兼容。
4. 在临时目录和模拟数据上完成构建、数据往返、离线/同步边界验证，再接触任何真实用户数据。
5. 发布前完成许可证/素材授权审查、隐私说明、备份恢复、账号安全和源代码提供方案。

