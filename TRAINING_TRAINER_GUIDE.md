# Synergrowth Inspection App — Trainer Guide (Step-by-Step)

**For:** Trainer conducting the 2-day mobile app development workshop  
**Use:** Open this file during the session. Follow the steps in order. Each step tells you which file to open and what to cover.

---

## Pre-Training Checklist

- [ ] Git repo URL ready to share
- [ ] Render.com backend is live and responding
- [ ] Pre-built APK available as backup (optional)
- [ ] Wi-Fi with internet for all participants
- [ ] Verify `DEMO_MODE = true` in repo for Day 1

---

# DAY 1

---

## Session 1: Get Up and Running (9:00 AM – 10:15 AM)

| Step | Action | What to Cover |
|------|--------|---------------|
| 1.1 | Welcome, no file | Introductions. Explain: we'll clone the app, run it, then modify it screen by screen over 2 days. Backend is on Render.com — no local setup. |
| 1.2 | Whiteboard only | Draw: [Phone App] → [Render.com API] → [Response]. Mobile app sends images, gets PASS/FAIL. That's it. |
| 1.3 | — | Guide install: Node.js, Git, VS Code/Cursor, Expo Go on Android. |
| 1.4 | Terminal | `git clone <repo>`, `cd SynergrowthInspectionApp`, `npm install`, `npx expo start` |
| 1.5 | — | Scan QR with Expo Go. App runs on phone. |
| 1.6 | — | **Participants:** Run full flow: Welcome → tap Enter → Selection (pick product, line, etc.) → Product → Component (tap through) → Camera (capture) → Result (confirm). Use Demo Mode. |
| 1.7 | Open `app/_layout.tsx` | Map screens to files: each `Stack.Screen` name = a screen they saw. Point to `selection`, `product`, `component`, `camera`, `result`. |

---

## Break (10:15 – 10:30)

---

## Session 2: Project Structure & How Screens Connect (10:30 – 12:00)

| Step | Open File | What to Cover |
|------|-----------|---------------|
| 2.1 | Project root in VS Code | Tour: `app/` = screens, `components/` = reusable UI, `constants/` = data & config, `services/` = API & context, `assets/` = images. |
| 2.2 | `app.json` | Show: `name`, `slug`, `icon`, `splash`. Change `name` to something, save, reload — app title updates. |
| 2.3 | `app/_layout.tsx` | Expo Router: files in `app/` = routes. `_layout.tsx` = root navigator. `Stack.Screen` = each screen. |
| 2.4 | `app/_layout.tsx` | **Exercise:** Participants find each `Stack.Screen`, match to phone screens. |
| 2.5 | `app/selection.tsx`, `app/product.tsx`, `app/component.tsx`, `app/camera.tsx`, `app/result.tsx` | **Exercise:** Use Cmd/Ctrl+Click or search to find `router.push` and `router.replace`. Draw flow on paper. |
| 2.6 | `app/(tabs)/index.tsx` | Point out: `View` (container), `Text`, `Image`, `TouchableOpacity`, `StyleSheet`. What each does. |
| 2.7 | `app/(tabs)/index.tsx` | **Exercise:** Change title string, button text, button `backgroundColor`. Hot reload. |
| 2.8 | `app/(tabs)/index.tsx` | Flexbox: `flex`, `justifyContent`, `alignItems`, `flexDirection`. Change values, show layout shift. |
| 2.9 | `app/(tabs)/index.tsx` | **Exercise:** Move logo below title, change background, make button full width. |

---

## Lunch (12:00 – 1:00)

---

## Session 3: Selection Screen — Dropdowns, State & Data (1:00 – 2:30)

| Step | Open File | What to Cover |
|------|-----------|---------------|
| 3.1 | `app/selection.tsx` | Walk UI: picker for product, line, station, shift, operator. Where each goes in the flow. |
| 3.2 | `app/selection.tsx` | Find every `useState`. Explain: each dropdown value = one `useState`. |
| 3.3 | `constants/mock-data.ts` | Show: `PRODUCT_MODELS`, `PRODUCTION_LINES`, `STATIONS`, `SHIFTS`, `OPERATORS`. This is the dropdown source. |
| 3.4 | `constants/mock-data.ts` | **Exercise:** Add `LINE_D` to `PRODUCTION_LINES`, add new operator. Reload, verify in Selection screen. |
| 3.5 | `services/inspection-context.tsx` | React Context: `InspectionProvider`, state object (product, line, station, etc.), `setInspection`. How data crosses screens. |
| 3.6 | `services/inspection-context.tsx` then `app/selection.tsx` then `app/product.tsx` | Trace: Selection calls `setInspection({ ... })` on Next. Product reads `product`, `line`, etc. from `useInspection()`. |
| 3.7 | `services/inspection-context.tsx`, `app/selection.tsx` | **Exercise:** Add `batchNumber` to context type & initial state. Add `TextInput` for batch on Selection. Verify it appears in Product (or log it). |

---

## Break (2:30 – 2:45)

---

## Session 4: Product & Component Screens (2:45 – 4:15)

| Step | Open File | What to Cover |
|------|-----------|---------------|
| 4.1 | `app/product.tsx` | Reads `product` from context. Displays `product.image`, `product.name`. `router.push('component')` on Next. |
| 4.2 | `app/product.tsx` | **Exercise:** Add a line showing `{line} / {station}` below product name. |
| 4.3 | `app/component.tsx` | Component loop: `currentComponentIndex`, `components[currentComponentIndex]`, Next increments or goes to camera. |
| 4.4 | `app/component.tsx` + `constants/mock-data.ts` | Component has `coordinates: { x1, y1, x2, y2 }`. Red box overlay uses these. Show one product's components in mock-data. |
| 4.5 | `constants/mock-data.ts` | **Exercise:** Add `PRODUCT_ALPHA` with `id`, `name`, `image`, `components` (3 items with coordinates). Pick it in app, walk inspection. |
| 4.6 | `constants/config.ts` | `DEMO_MODE = true` → mocks API. `false` → real Render.com. |
| 4.7 | `app/component.tsx` | **Exercise:** Add text: "Inspecting component {currentComponentIndex + 1} of {components.length}". |

---

## Session 5: Day 1 Wrap-Up (4:15 – 4:30)

| Step | Action | What to Cover |
|------|--------|---------------|
| 5.1 | — | Recap: `_layout.tsx`, `index.tsx`, `selection.tsx`, `product.tsx`, `component.tsx`, `mock-data.ts`, `inspection-context.tsx`, `config.ts`. |
| 5.2 | — | Q&A. Tomorrow: camera, API, result screen, APK build. |

---

# DAY 2

---

## Session 6: Camera Screen — Capture & Crop (9:00 – 10:30)

| Step | Open File | What to Cover |
|------|-----------|---------------|
| 6.1 | `app/camera.tsx` | Walk entire file: imports, state, permissions, camera ref, guide box, capture flow, crop, API call. |
| 6.2 | `app/camera.tsx` | `CameraView`, `requestPermissionsAsync`, `cameraRef.current?.takePictureAsync()`. |
| 6.3 | `app/camera.tsx` | Guide box: `width: '70%'`, red border, absolutely positioned over camera. |
| 6.4 | `app/camera.tsx` | **Exercise:** Change guide to 50% width, blue border, add "Align component here" text above. |
| 6.5 | `app/camera.tsx` | `manipulateAsync` from `expo-image-manipulator`: crop to match guide box region. Why we crop before sending. |
| 6.6 | `app/camera.tsx` | **Exercise:** After capture, before API call, show small `Image` thumbnail of cropped URI. |
| 6.7 | `app/camera.tsx` or `services/api.ts` | `Device.modelName` from `expo-device` — used for device ID in final payload. |
| 6.8 | `app/camera.tsx` | "Analyzing..." = loading state. Retake = reset to capture mode, clear image. |

---

## Break (10:30 – 10:45)

---

## Session 7: API Integration — Predict & Submit (10:45 – 12:15)

| Step | Open File | What to Cover |
|------|-----------|---------------|
| 7.1 | `services/api.ts` | Base URLs point to Render.com. `predictImage`, `submitFinal` functions. |
| 7.2 | `services/api.ts` | `predictImage`: build `FormData` with image file, POST to `/predict`, parse `prediction`, `score`. |
| 7.3 | `constants/config.ts` + phone | **Exercise:** Set `DEMO_MODE = false`. Capture photo. Hit live API. Check console/network for response. |
| 7.4 | `services/api.ts` | `submitFinal`: FormData with image + metadata (product, line, station, shift, operator, component, device, machine result, human decision). |
| 7.5 | `constants/config.ts` + `services/api.ts` | When `DEMO_MODE`: `predictImage` returns mock alternating pass/fail. `submitFinal` is no-op or mock. Trace the `if (DEMO_MODE)` branches. |
| 7.6 | `services/api.ts` | `try/catch`, timeout, `fetch` error. What user sees when network fails. |
| 7.7 | `app/camera.tsx` | **Exercise:** On predict error, show "Retry" button. On tap, call `predictImage` again with same `croppedUri` without re-capturing. |

---

## Lunch (12:15 – 1:15)

---

## Session 8: Result Screen — Human-in-the-Loop (1:15 – 2:30)

| Step | Open File | What to Cover |
|------|-----------|---------------|
| 8.1 | `app/result.tsx` | Walk screen: image display, machine result (PASS/FAIL + %), 4 confirmation buttons. |
| 8.2 | `app/result.tsx` | `prediction`, `score` from navigation params. Display logic. |
| 8.3 | — | 4 buttons: YES PASS, YES FAIL, NO PASS, NO FAIL. Operator confirms or overrides. |
| 8.4 | `app/result.tsx` | **Exercise:** Add `View` with green bg if PASS, red if FAIL, wrap the machine result text. |
| 8.5 | `app/result.tsx` | Trace: `handleConfirm` builds payload, calls `submitFinal`. Show what goes in FormData. |
| 8.6 | `app/result.tsx` | After submit: if more components, `router.replace('component', { ... })` with next index. Else go back to start or product. |
| 8.7 | `app/result.tsx` | **Exercise:** When last component submitted, show Alert or modal: "All components inspected!" with button to `router.replace('/')` or home. |

---

## Break (2:30 – 2:45)

---

## Session 9: Theming & Branding (2:45 – 3:30)

| Step | Open File | What to Cover |
|------|-----------|---------------|
| 9.1 | `constants/theme.ts` | `Colors` object, `Fonts`. How screens use `useThemeColor`, `Colors.primary`, etc. |
| 9.2 | `components/themed-text.tsx`, `components/themed-view.tsx` | These use theme + color scheme. Light/dark. |
| 9.3 | `hooks/use-color-scheme.ts`, `hooks/use-theme-color.ts` | Quick look. How to get current color. |
| 9.4 | `constants/theme.ts`, `app.json`, `app/(tabs)/index.tsx` | **Exercise:** Change primary color, welcome title/tagline, splash background in `app.json`, icon if desired. Rebrand look. |

---

## Session 10: Building the APK (3:30 – 4:30)

| Step | Open File | What to Cover |
|------|-----------|---------------|
| 10.1 | — | Dev: Expo Go. Prod: standalone APK. What changes: `DEMO_MODE`, API URL (if on-prem later). |
| 10.2 | `services/api.ts` | Confirm `PREDICT_API_URL`, `FINAL_API_URL` point to Render.com for training. |
| 10.3 | Terminal | `npx eas build --platform android --profile preview` (or demo with pre-built). |
| 10.4 | — | **Exercise:** Trigger EAS build or install pre-built APK. Download, install on device. |
| 10.5 | — | Run full E2E inspection on APK with Render.com backend. |
| 10.6 | — | On-prem: only change API URL in `api.ts`. Backend trainer handles server. |
| 10.7 | — | Troubleshooting: camera permission, Expo Go vs APK behavior, network errors, EAS build failures. |

---

## Session 11: Wrap-Up (4:30 – 5:00)

| Step | Action | What to Cover |
|------|--------|---------------|
| 11.1 | — | Recap: every file we touched, one sentence each. |
| 11.2 | Share / print | "Where do I change X?" cheat sheet (see below). |
| 11.3 | — | New products → `mock-data.ts`. New metadata → `inspection-context.tsx` + Selection screen. |
| 11.4 | — | Links: Expo docs, React Native docs, Expo Router. |
| 11.5 | — | Q&A, feedback. |

---

## Cheat Sheet (Give to Participants)

| Want to change... | File to edit |
|-------------------|--------------|
| App name, icon, splash | `app.json` |
| Product models, lines, operators | `constants/mock-data.ts` |
| Colors, fonts | `constants/theme.ts` |
| Demo Mode on/off | `constants/config.ts` |
| API server URL | `services/api.ts` |
| Welcome screen | `app/(tabs)/index.tsx` |
| Selection screen | `app/selection.tsx` |
| Product screen | `app/product.tsx` |
| Component screen | `app/component.tsx` |
| Camera screen | `app/camera.tsx` |
| Result screen | `app/result.tsx` |
| Navigation / new screen | `app/_layout.tsx` + new file in `app/` |
| Global state (e.g. batch number) | `services/inspection-context.tsx` |

---

*Trainer guide — February 2026*
