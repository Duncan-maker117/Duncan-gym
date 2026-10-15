# Duncan gym 部署说明

## GitHub Pages：公开浏览器演示

仓库的 `.github/workflows/pages.yml` 在 `main` 更新时构建 `VITE_DEMO=1` 前端，并发布到 GitHub Pages。演示版只在访客自己的浏览器中运行，首次进入会载入示例训练历史；没有服务端账号、跨设备同步或真实用户数据库。预置记录不是其他用户的数据。

Pages 工作流不复制第三方动作图片和动画，内置动作显示文字和占位图标。用户自己上传的自定义动作媒体仍属于各自浏览器中的数据。

## Docker Compose：带账号的完整版本

需要 Docker Compose。复制 `.env.example` 为 `.env`，然后在仓库根目录执行：

```powershell
Copy-Item .env.example .env
docker compose up --build -d
```

打开 `http://localhost:8080`。`docker-compose.yml` 的 `image:` 是本地镜像标签，必须保留 `--build`，避免从注册表拉取同名的其他构建。

手机通过 passkey 登录时，需要 HTTPS 域名，并在 `.env` 中设置同一域名的 `RP_ID`、完整站点地址 `ORIGIN`，以及需要时调整 `WEB_PORT`。公网部署还需设置反向代理、备份 `data/`，并保证提供给服务用户的源码与运行版本一致。

训练数据位于根目录 `data/`，包括账号、passkey 公钥、会话密钥和每个用户的状态文件。不要提交该目录。升级前备份，恢复时以整个目录为单位处理。

## 当前范围

- Web/PWA 页面名称：Duncan gym。
- 原有训练数据字段、文件标识和部分内部缓存键保留，以保障兼容；不要按品牌名批量改写这些键。
- 内置动作媒体未授权用于独立品牌版本，因此公开仓库和构建产物均不打包；获取独立授权后再接入。
- Android/iOS 打包标识仍沿用原有内部包名。当前发布只验证 Web 演示；原生包发布前须单独处理包标识、签名、商店要求和完整回归验证。
