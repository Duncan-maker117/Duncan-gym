# Duncan gym

Duncan gym 是一个可自行部署的训练计划、训练记录与进度查看工具。当前公开版本优先提供 Web/PWA 使用方式；手机浏览器也能打开。

> **[打开在线演示 →](https://duncan-maker117.github.io/Duncan-gym/)**（首次进入会显示示例记录；数据只保存在当前浏览器。）

## 在线演示与真实使用

GitHub Pages 工作流构建的是[浏览器演示版](https://duncan-maker117.github.io/Duncan-gym/)。它会预置示例训练记录，所有更改留在当前浏览器；没有账号登录或跨设备同步。这个演示不能用作真实训练数据的唯一备份。

如需自己的账号和多设备同步，应运行下面的完整服务端版本，并为手机登录配置 HTTPS 域名。不要把 GitHub Pages 演示误认为已经提供在线账号服务。

## 本地启动完整版本

需要 Docker 和 Docker Compose。在项目根目录：

```powershell
Copy-Item .env.example .env
docker compose up --build -d
```

然后打开 `http://localhost:8080`。服务端数据存放于项目根目录 `data/`，该目录不会被 Git 提交；部署和升级前请自行备份。停止服务用 `docker compose down`。在手机上用 passkey 登录时，需配置 HTTPS 域名，并设置 `.env` 中匹配的 `RP_ID`、`ORIGIN`。

`docker-compose.yml` 使用本仓库源码构建的 `duncan-gym-api:local` 与 `duncan-gym-web:local` 镜像；不会拉取其他项目的预构建镜像。部署参数与公开演示说明见 [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)。

## 本地前端开发

```powershell
cd frontend
npm ci
npm run dev
```

前端开发服务器若要调用本地 API，还需按 `frontend/vite.config.js` 和 `.env` 配置 API 地址。项目主要目录：`frontend/` 是 React/Vite 应用，`api/` 是 Node 服务，`catalogue/` 是动作文字目录，`api/openapi.yaml` 是 HTTP 接口规范。

## 当前公开版的媒体与授权边界

内置动作图片和动画的权利不随应用代码的许可证转移。**Duncan gym 公开版不包含这些动作图片和动画**；动作列表会使用文字及占位图标。自定义动作的用户自有媒体功能仍由应用处理。将来取得独立授权后，才可接入相应素材。

应用代码按 [`LICENSE`](LICENSE) 中的 AGPL-3.0-or-later 条款提供。版权、第三方组件和素材说明见 [`NOTICE.md`](NOTICE.md) 及 `catalogue/media/NOTICE.md`。公开提供修改版网络服务时，请向服务用户提供对应源码。

## 开发协作

项目总规则见 [`AGENTS.md`](AGENTS.md)，当前状态与架构说明见 [`docs/PROJECT_HANDOFF.md`](docs/PROJECT_HANDOFF.md)。
