# 1️⃣ DESIGN SYSTEM – Christmas Premium E-commerce

## 🎨 Color Tokens

### Primary Colors (Christmas nhưng cao cấp)

```txt
--color-primary: #8B1E2D        // Cranberry Red (chủ đạo)
--color-primary-hover: #A4283A
--color-primary-soft: #F6E9EC   // Red rất nhạt cho background

--color-secondary: #1F4D3A      // Pine Green
--color-secondary-soft: #E6F0EB
```

### Neutral Colors (ấm – không công nghiệp)

```txt
--color-bg-main: #FAF9F7        // Off-white
--color-bg-section: #F4F2EE    // Beige nhạt
--color-bg-card: #FFFFFF

--color-text-primary: #1E1E1E
--color-text-secondary: #6B6B6B
--color-text-muted: #9A9A9A
```

### Accent Colors

```txt
--color-gold-muted: #C9A24D     // Gold mờ, không shiny
--color-border-light: #E6E3DE
```

---

## ✍️ Typography System

```txt
Font Family:
- Primary: Inter / Manrope / SF Pro
- Heading Option: Playfair Display (rất nhẹ) hoặc Manrope SemiBold

Base Font Size: 16px
Line Height: 1.6
```

### Text Scale

```txt
H1: 40px – 48px / SemiBold
H2: 32px – 36px
H3: 24px – 28px
Body: 16px
Small text: 14px
Caption: 12px
```

✔️ Ít dùng bold, ưu tiên spacing & size
✔️ Giá tiền dùng SemiBold, không dùng ExtraBold

---

## 📐 Spacing System (8px system)

```txt
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-7: 48px
--space-8: 64px
```

✔️ Section lớn tối thiểu **48–64px padding top/bottom**
✔️ Card padding tối thiểu **16–24px**

---

## ⭕ Border Radius

```txt
--radius-xs: 6px
--radius-sm: 10px
--radius-md: 14px
--radius-lg: 18px
--radius-xl: 24px
```

**Áp dụng:**

* Button: 12–14px
* Card / Product card: 16–18px
* Modal / Dropdown: 20–24px

---

## 🌫️ Shadow System (mềm – premium)

```txt
--shadow-sm:
0 2px 8px rgba(0,0,0,0.04)

--shadow-md:
0 6px 20px rgba(0,0,0,0.08)

--shadow-lg:
0 12px 32px rgba(0,0,0,0.12)
```

❌ Không dùng border đậm
✅ Ưu tiên shadow + spacing

---

## 🔘 Button System

### Primary Button

```txt
Background: --color-primary
Text: White
Padding: 14px 24px
Radius: 14px
Hover: Slight lift + darker red
```

### Secondary Button

```txt
Background: --color-primary-soft
Text: --color-primary
Border: none
```

### Ghost Button

```txt
Background: transparent
Text: --color-text-secondary
Hover: background fade
```

✔️ Transition: 200–250ms ease
✔️ Hover có lift nhẹ (translateY -1px)

---

## 🧱 Card & Product Card

```txt
Background: White
Radius: 16px
Shadow: --shadow-sm
Hover: --shadow-md + slight lift
```

**Product Image**

* Bo góc giống card
* Không sát mép
* Có padding thở

**Badge (Sale / Nổi bật)**

* Nhỏ, pill-shaped
* Màu muted
* Không dùng đỏ chói

---

## 🧭 Layout Principles

* Grid 12 cột, max-width 1200–1280px
* Ít card trên 1 hàng hơn hiện tại
* Ưu tiên **vertical rhythm**
* Tránh cảm giác “catalog công nghiệp”





