# 问 AI 功能说明

- 页面右下角只有一个悬浮图标按钮。
- 点击后，网页右侧弹出聊天抽屉。
- 系统会优先检索本站文档，再给出回答。

## 可选大模型接口配置

编辑 `/docs/public/ask-ai-config.json`：

```json
{
  "endpoint": "",
  "apiKey": "",
  "timeoutMs": 20000
}
```

- `endpoint` 为空：仅使用站内检索 + 本地回答
- `endpoint` 有值：会把检索上下文发送到你的模型接口
