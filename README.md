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
