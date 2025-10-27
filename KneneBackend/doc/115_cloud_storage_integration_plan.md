# 115网盘云存储自动集成方案

本项目推荐使用 [Luffyz618/115uploader](https://github.com/Luffyz618/115uploader) 实现纯命令行无人值守的自动上传。

## 方案简介

- 基于Docker的115网盘自动上传工具
- 支持目标目录监控（如 BT/PT 下载目录），新文件自动上传
- 支持递归上传、上传完成后可选删除本地文件
- 纯命令行环境，无需图形界面，适合服务器无人值守
- 持续维护，日志清晰，操作简明

## 快速部署（推荐 docker-compose）

1. **拉取项目或直接参考官方镜像**
2. 在你的服务器目录新建 `docker-compose.yml`

```yaml
version: '3'
services:
  115uploader:
    image: luffy168/115uploader:latest
    container_name: 115uploader
    environment:
      - COOKIE_115=你的115cookie      # 必填，从115网页版获取
      - CID=你的CID                  # 必填，上传目标目录ID
      - AUTO_DELETE=false            # 可选，上传后是否删除本地文件
    volumes:
      - ./config:/config             # 存放配置和日志
      - ./upload:/data               # 待上传文件（只要往此目录丢文件即可自动上传）
    restart: unless-stopped
```

3. **准备目录**（与compose文件同级）
   - `config/` 存放日志、cookie配置
   - `upload/` 你的PT/BT自动下载到此目录即可

4. **启动服务**
```bash
docker-compose up -d
```

5. 上传记录和错误日志可在`config/upload.log`追踪。

## 关键参数说明
- **COOKIE_115**：你的115网盘cookie（建议用Chrome开发者工具获取，登录网页版115后在请求头中找，复制 `Cookie` 全内容）
- **CID**：网盘目标目录ID（115网盘网页端新建一个文件夹，F12抓包或地址栏可见 `cid=` 数字）
- **AUTO_DELETE**：上传成功后是否删除本地文件，非必填，建议默认false测试无误后再开启true。

## 常见问题与补充
1. **如何获取COOKIE？**
   - 登录网页版115，按F12打开开发者工具，刷新页面，检查请求头中的`Cookie`字段，复制全部内容到 `COOKIE_115`。
2. **如何获取CID？**
   - 在网页版网盘文件夹页面，地址栏如 `cid=12345678`，其中数字即为CID。
3. **上传后不清楚是否成功？**
   - 可通过 `config/upload.log` 或 `docker logs 115uploader` 查看实时日志和上传状态。
4. **TOKEN/Cookie失效怎么办？**
   - 重新登录115网页版，抓取新cookie即可，容器无需重建。
5. **无人值守异常重启？**
   - docker-compose 已配置 `restart: unless-stopped`，自动恢复。

---

项目地址与文档：[https://github.com/Luffyz618/115uploader](https://github.com/Luffyz618/115uploader)

如有更多集成和调用自动化脚本需求，可结合自己的PT自动下载、API推送等直接打通业务流程。