# 污水处理厂三维可视化

基于 Vue 3、Vite、Three.js 和 Ant Design Vue 开发的污水处理厂三维可视化项目。项目围绕厂区三维模型、工艺辅助面板、历史数据、巡检人员、植被、水面材质和标签信息展示，提供一个面向智慧水务场景的前端展示界面。

## 功能特点

- 三维污水处理厂场景加载与展示
- 厂区模型、人员模型、植被模型和环境贴图资源管理
- 水面材质、围栏、标签、进度条和速度控制等 Three.js 交互模块
- 首页数据看板、工艺辅助、历史数据等业务视图
- 基于 Vite 的前端构建与 Netlify 部署配置

## 技术栈

- Vue 3
- Vite
- Three.js
- Ant Design Vue
- ECharts
- Less

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建产物会输出到 `dist/` 目录。

## 部署

项目已包含 `netlify.toml`：

```toml
[build]
  command = "VITE_MODE=netlify npm run build"
  publish = "dist"
```

可以通过 Netlify 连接 GitHub 仓库自动构建，也可以本地构建后手动部署 `dist/`。

## 资源说明

项目包含较大的三维模型和 HDR 环境贴图资源。`public/sewageModel.glb` 超过 GitHub 普通仓库 100MB 单文件限制，未纳入普通 Git 提交。需要完整运行三维场景时，请将该文件放回 `public/sewageModel.glb`，或启用 Git LFS 后再提交。

## Fork 增强 / Fork enhancements

此 fork 增加了界面国际化，支持 **Tiếng Việt / English / 中文**，默认使用越南语，并将用户选择保存在浏览器 `localStorage` 中。Ant Design Vue、Day.js、ECharts 标题、工艺辅助面板与巡检数据均跟随所选语言。

This fork adds a **Vietnamese / English / Chinese** UI, with Vietnamese as the default. The selected locale is persisted in `localStorage`, while internal Three.js model/object names remain unchanged to preserve scene behavior.

CI 使用 GitHub Actions + Node.js 22，执行：

```bash
npm ci --no-audit --no-fund
npm test
npm run build
```

## Upstream 与许可说明

本仓库 fork 自 `cfy1126/sewage-treatment-plant`，并保留 upstream 关系，便于后续同步原项目更新。

截至本 fork 创建时，upstream 仓库未提供明确的 `LICENSE` 文件。本 fork 不擅自添加或变更原项目许可；如用于商业分发或二次授权，请先向原作者确认许可范围。

## 3D 模型资源

`public/sewageModel.glb` 大于 GitHub 普通 Git 单文件限制，因此 upstream 未提交该文件。此 fork 使用 GitHub Release `model-assets` 作为大模型资源通道；Pages workflow 会在 release 中存在名为 `sewageModel.glb` 的 asset 时自动下载到 `public/`、校验二进制 glTF magic `glTF`，然后构建部署。

Upstream source 在 `src/view/threejs/addSewageModel/index.js` 中保留了作者原始地址 `http://211.143.122.110:18062/model/sewage.glb`。2026-09-12 已分别从本地 Windows 与 GitHub Actions Ubuntu runner 进行 HTTP/HTTPS、Range 及多个路径变体探测；目标 `211.143.122.110:18062` 均在 TCP connect 阶段超时，因此当前无法从该链接恢复模型字节。

当原始模型不可用时，本 fork 可使用 **AL AMERAT STP 03FEB2018** 作为 fallback replacement。该模型由 `moh.mag.omar` 发布，采用 **CC BY 4.0**；来源与完整 attribution 记录在 `public/AL_AMERAT_STP_ATTRIBUTION.txt`。它不是 upstream 原始模型，因此运行时会自动关闭依赖原始中文节点名称的水面、围栏、植被、工艺动画和巡检功能，只保留安全的基础 3D 渲染。后续若获得原始 `sewageModel.glb`，重新上传同名 release asset 后即可自动恢复 semantic/full-feature mode。

若获得合法的原始模型，可上传并重新部署：

```bash
gh release upload model-assets sewageModel.glb --clobber --repo trinhtanphat/sewage-treatment-plant
gh workflow run pages.yml --repo trinhtanphat/sewage-treatment-plant
```
