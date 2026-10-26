# HS-OS Project Rules

## 🎨 UI/UX Rules (DO NOT BREAK)
- **Colors:** ONLY use the existing CSS variables (`--accent`, `#0B0F19` background, white text). DO NOT invent new colors or gradients.
- **Cards:** All new UI elements must use the existing `.glass-card` class.
- **Transitions:** Any new interactive element must use `transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);`.
- **Layout:** Do not change the navbar, footer, or the overall page structure.

## 🛠️ Technical Rules
- **Stack:** Pure Vanilla JS, HTML, and CSS. DO NOT introduce React, Tailwind, or build steps.
- **Fixes Only:** When fixing bugs, do not rewrite unrelated code. Only change what is necessary.