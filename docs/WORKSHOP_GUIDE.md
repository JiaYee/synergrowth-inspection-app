# Synergrowth Inspection App — Participant Workshop Guide

> **6-Day Hands-On Workshop**
> This guide is your single source of truth. Follow it screen-by-screen, lab-by-lab.
> Every lab is a small, safe change — nothing will break your app.

---

## TLDR

### Install

1. **Node** — Engine that runs JavaScript
2. **Git** — Push/Pull your code
3. **VSCode** — Code editor
4. **Expo Go** — Mobile preview on your phone
5. `cd synergrowth-inspection-app`
6. `npm install`
7. `npx expo start`

### App Structure

1. **App >>> Screens** — Each file in `app/` is a screen
2. **App >>> Layout** — `app/_layout.tsx` registers all screens
3. **Assets >>> Images** — `assets/images/` holds all images

### Screen Structure

1. **Imports** — What you need (`Text`, `Image`, `View`, etc.)
2. **Components** — What you see (`<Text>`, `<Image>`, `<TextInput>`)
3. **Styles** — How it looks (color, size, spacing)

### Data Structure

1. **Export** — Make data available (`export const OPERATORS = [...]`)
2. **Import** — Bring data in (`import { OPERATORS } from ...`)
3. **Use** — Display or reference it in your screen

### Add Image

1. Put image in `assets/images/` (e.g. `icon.png`)
2. Use it: `<Image source={require('@/assets/images/icon.png')} />`

### AI Framework

1. **Requirement** — What do I want?
   > _"Add a new text field for batch number"_
2. **Context** — What do I have?
   > _Select all, copy, paste into AI_

### Server + AI Connection (Day 5–6)

1. **Product Catalog** — `app/products.tsx` + `services/product-catalog.ts`
2. **Manage Passcode** — product management prompts for numeric passcode `1234`
3. **Reference Photos** — each inspection point stores one approved photo
4. **Mobile Config** — `constants/config.ts` → `DEMO_MODE = false`, `API_BASE_URL`
5. **Backend API** — `synergrowth-python-api/api/index.py` → `POST /analyze`
6. **OpenRouter Key** — store in backend `.env` locally and Vercel Environment Variables in production
7. **Important** — never put `OPENROUTER_API_KEY` inside the mobile app

---

## Table of Contents

- [Introduction: Native vs Hybrid Mobile Apps](#introduction-native-vs-hybrid-mobile-apps)
- [Prerequisites & Installation](#prerequisites--installation)
- [Day 1 — Session 1: Setup & Your First App Launch](#day-1--session-1-setup--your-first-app-launch)
- [Day 1 — Session 2: Project Structure & Welcome Screen Labs](#day-1--session-2-project-structure--welcome-screen-labs)
- [Day 2 — Session 1: Selection Screen & Mock Data Labs](#day-2--session-1-selection-screen--mock-data-labs)
- [Day 2 — Session 2: Product, Component, Camera & Result Screen Labs](#day-2--session-2-product-component-camera--result-screen-labs)
- [Day 2 — Session 3: New Features, Logo & Saving Your Work](#day-2--session-3-new-features-logo--saving-your-work)
- [Day 3 — Session 1: Server Setup & Connecting Mobile to Laptop](#day-3--session-1-server-setup--connecting-mobile-to-laptop)
- [Day 3 — Session 2: Customizing Red Boxes & Inspection Points](#day-3--session-2-customizing-red-boxes--inspection-points)
- [Day 4 — Session 1: Server Files & Report Endpoint](#day-4--session-1-server-files--report-endpoint)
- [Day 4 — Session 2: Inspection Summary & End-to-End Flow](#day-4--session-2-inspection-summary--end-to-end-flow)
- [Day 5 — Session 1: Product Catalog CRUD](#day-5--session-1-product-catalog-crud)
- [Day 5 — Session 2: Inspection Point CRUD & Reference Photos](#day-5--session-2-inspection-point-crud--reference-photos)
- [Day 6 — Session 1: OpenRouter Backend & Key Storage](#day-6--session-1-openrouter-backend--key-storage)
- [Day 6 — Session 2: Connect Mobile App to API & Verify](#day-6--session-2-connect-mobile-app-to-api--verify)
- [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)

---

## Introduction: Native vs Hybrid Mobile Apps

Before we dive into code, let's understand the landscape of mobile app development.

### Native Mobile Apps

A **native app** is built using the platform's own language and tools:

| Platform | Language            | IDE            |
| -------- | ------------------- | -------------- |
| Android  | Kotlin / Java       | Android Studio |
| iOS      | Swift / Objective-C | Xcode          |

**Pros:** Best performance, full access to device hardware, platform-specific UI.
**Cons:** You must write and maintain **two completely separate codebases** — one for Android, one for iOS.

### Hybrid / Cross-Platform Mobile Apps

A **hybrid (cross-platform) app** lets you write **one codebase** that runs on both Android and iOS.

Popular frameworks include:

| Framework    | Language                | Official Site                                                                     |
| ------------ | ----------------------- | --------------------------------------------------------------------------------- |
| React Native | JavaScript / TypeScript | [reactnative.dev](https://reactnative.dev/)                                       |
| Flutter      | Dart                    | [flutter.dev](https://flutter.dev/)                                               |
| .NET MAUI    | C#                      | [learn.microsoft.com/dotnet/maui](https://learn.microsoft.com/en-us/dotnet/maui/) |

**Pros:** One codebase for both platforms, faster development, shared team skills.
**Cons:** Slight performance trade-off compared to fully native, occasional platform-specific quirks.

### Where Does React Native + Expo Sit?

**React Native** is a cross-platform framework created by Meta (Facebook). You write your app in JavaScript or TypeScript using React components, and it renders **real native UI** (not a web view).

- Official site: [reactnative.dev](https://reactnative.dev/)
- Documentation: [reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)

**Expo** is a platform built on top of React Native that makes development significantly easier. It handles the hard parts — camera access, file system, build tooling, over-the-air updates — so you can focus on your app logic.

- Official site: [expo.dev](https://expo.dev/)
- Documentation: [docs.expo.dev](https://docs.expo.dev/)
- Expo Router (file-based navigation): [docs.expo.dev/router/introduction](https://docs.expo.dev/router/introduction/)

**Our app** is built with **React Native + Expo + TypeScript**, using **Expo Router** for navigation.

```
┌──────────────────────────────────┐
│         Your App Code            │  ← TypeScript / React components
├──────────────────────────────────┤
│       Expo SDK & Router          │  ← Camera, navigation, build tools
├──────────────────────────────────┤
│         React Native             │  ← Bridges JS to native UI
├──────────────────────────────────┤
│    Android (Kotlin/Java)         │
│    iOS (Swift/Obj-C)             │  ← Real native platform code
└──────────────────────────────────┘
```

### What is TypeScript?

TypeScript is JavaScript with **type safety**. If you know JavaScript, you already know TypeScript — it just adds type annotations (`: string`, `: number`, etc.) to catch errors early.

- Official site: [typescriptlang.org](https://www.typescriptlang.org/)

---

## Prerequisites & Installation

Before the workshop, please install the following on your laptop:

### 1. Node.js (LTS version)

Node.js runs JavaScript outside the browser. We need it to run the Expo development server.

- **Download:** [nodejs.org](https://nodejs.org/)
- Choose the **LTS** (Long Term Support) version
- After install, verify in your terminal:

```bash
node --version
npm --version
```

### 2. Git

Git is version control software. We use it to clone (download) the project.

- **Download:** [git-scm.com/downloads](https://git-scm.com/downloads)
- After install, verify:

```bash
git --version
```

### 3. Code Editor — VS Code or Cursor

You need a code editor to view and modify files.

- **VS Code:** [code.visualstudio.com](https://code.visualstudio.com/)
- **Cursor** (AI-powered, built on VS Code): [cursor.com](https://www.cursor.com/)

### 4. Expo Go (on your phone)

Expo Go lets you run the app on your physical phone during development — no emulator needed.

- **Android:** [Google Play Store — Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS:** [Apple App Store — Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### Installation Checklist

- [ ] Node.js installed — `node --version` works
- [ ] Git installed — `git --version` works
- [ ] VS Code or Cursor installed
- [ ] Expo Go installed on your Android or iOS phone
- [ ] Phone and laptop connected to the same Wi-Fi network

---

# Day 1 — Session 1: Setup & Your First App Launch

> **Goal:** Clone the project, install dependencies, run the app on your phone, and understand the app flow.

---

### Step 1: Clone the Project

Open your terminal (Command Prompt, PowerShell, or Terminal) and run:

```bash
git clone https://github.com/JiaYee/synergrowth-inspection-app.git
```

Then navigate into the project folder:

```bash
cd synergrowth-inspection-app
```

> **Backup:** If Git clone is not working, you can also access the project online via StackBlitz:
> [stackblitz.com/~/github.com/JiaYee/synergrowth-inspection-app](https://stackblitz.com/~/github.com/JiaYee/synergrowth-inspection-app)

### Step 2: Install Dependencies

Run this command to download all the libraries the app needs:

```bash
npm install
```

This reads the `package.json` file and downloads everything listed under `dependencies`.

### Step 3: Start the Development Server

```bash
npx expo start
```

You will see a **QR code** in your terminal.

### Step 4: Run on Your Phone

1. Open the **Expo Go** app on your phone.
2. Scan the QR code displayed in your terminal.
3. Wait for the app to bundle and load (first time may take 30–60 seconds).

> **Tip:** Your phone and laptop must be on the **same Wi-Fi network**.

### Step 5: Walk Through the App

Tap through every screen to understand the full flow:

```
Welcome → Enter → Selection (pick options) → Product → Component → Camera → Result
```

> The app is currently running in **Demo Mode** — it does not connect to any real server.
> All predictions are simulated locally.

### Understanding Hot Reload

From now on, every time you **save a file**, the app on your phone will **update instantly**. This is called **Hot Reload** — you don't need to restart anything.

---

### Lab 1: Change the Welcome Screen Title

**File:** `app/(tabs)/index.tsx`

1. Open the file `app/(tabs)/index.tsx` in your editor.
2. Find this code:

```tsx
<Text style={styles.title}>
  Synergrowth{"\n"}Automated{"\n"}Inspection{"\n"}System
</Text>
```

3. Change it to:

```tsx
<Text style={styles.title}>My Factory{"\n"}Inspector</Text>
```

4. **Save the file** (Ctrl+S / Cmd+S).
5. Look at your phone — the title has changed instantly!

---

### Lab 2: Change the Title Font Size

**File:** `app/(tabs)/index.tsx`

1. In the same file, scroll down to the `styles` section at the bottom.
2. Find the `title` style:

```tsx
title: {
  textAlign: 'center',
  marginBottom: 60,
  color: '#000000',
  fontSize: 32,
  fontWeight: 'bold',
  lineHeight: 32,
},
```

3. Change `fontSize: 32` to `fontSize: 48`:

```tsx
title: {
  textAlign: 'center',
  marginBottom: 60,
  color: '#000000',
  fontSize: 48,
  fontWeight: 'bold',
  lineHeight: 52,
},
```

> We also bumped `lineHeight` to `52` so the larger text doesn't overlap between lines.

4. **Save** and check your phone — the title is now bigger!

---

### Lab 3: Change the Title Color

**File:** `app/(tabs)/index.tsx`

1. In the `title` style, find `color: '#000000'`.
2. Change it to a dark blue:

```tsx
color: '#1a237e',
```

3. **Save** and check your phone.

> **Color reference:** `#000000` = black, `#FFFFFF` = white, `#1a237e` = dark blue, `#FF0000` = red, `#4CAF50` = green.
> Browse more colors at [htmlcolorcodes.com](https://htmlcolorcodes.com/).

---

### Lab 4: Change the Button Background Color

**File:** `app/(tabs)/index.tsx`

1. In the `styles` section, find the `button` style:

```tsx
button: {
  backgroundColor: '#000000',
  paddingHorizontal: 60,
  paddingVertical: 16,
  borderRadius: 8,
  minWidth: 200,
  alignItems: 'center',
},
```

2. Change `backgroundColor: '#000000'` to a blue:

```tsx
backgroundColor: '#1565C0',
```

3. **Save** and check your phone — the button is now blue!

---

### Lab 5: Change the Button Text

**File:** `app/(tabs)/index.tsx`

1. Find this line:

```tsx
<Text style={styles.buttonText}>Enter</Text>
```

2. Change `Enter` to `Start Inspection`:

```tsx
<Text style={styles.buttonText}>Start Inspection</Text>
```

3. **Save** and check your phone.

---

### Lab 6: Change the Button Text Size and Font Weight

**File:** `app/(tabs)/index.tsx`

1. In the `styles` section, find `buttonText`:

```tsx
buttonText: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '600',
},
```

2. Change it to:

```tsx
buttonText: {
  color: '#FFFFFF',
  fontSize: 22,
  fontWeight: 'bold',
},
```

3. **Save** and check your phone — the button text is now larger and bolder.

> **fontWeight values:** `'normal'`, `'bold'`, `'100'` through `'900'` (where `'400'` = normal, `'700'` = bold).

---

### Lab 7: Change the Screen Background Color

**File:** `app/(tabs)/index.tsx`

1. In the `styles` section, find the `container` style:

```tsx
container: {
  flex: 1,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
},
```

2. Change `backgroundColor: '#FFFFFF'` to a light gray:

```tsx
backgroundColor: '#F5F5F5',
```

3. **Save** and check your phone.

---

### Day 1 — Session 1 Recap

You have:

- Cloned and installed the project
- Run the app on your phone using Expo Go
- Changed text content, font size, colors, and background
- Experienced Hot Reload — save and see changes instantly

---

# Day 1 — Session 2: Project Structure & Welcome Screen Labs

> **Goal:** Understand how the project is organized, how screens connect, and make more UI customizations.

---

### Project Structure Tour

Open the project folder in your editor. Here is what each folder does:

```
synergrowth-inspection-app/
├── app/                    ← App screens (each file = one screen)
│   ├── (tabs)/
│   │   └── index.tsx       ← Welcome screen (home)
│   ├── _layout.tsx         ← Root navigation layout
│   ├── selection.tsx       ← Selection screen (dropdowns)
│   ├── product.tsx         ← Product view screen
│   ├── component.tsx       ← Component inspection screen
│   ├── camera.tsx          ← Camera capture screen
│   └── result.tsx          ← Inspection result screen
├── components/             ← Reusable UI building blocks
├── constants/              ← Configuration, mock data, theme
│   ├── config.ts           ← Demo mode toggle
│   ├── mock-data.ts        ← Dropdown options, component data
│   └── theme.ts            ← Colors and fonts
├── services/               ← API calls and global state
│   ├── api.ts              ← Server communication functions
│   └── inspection-context.tsx  ← Global state (React Context)
├── assets/                 ← Images and icons
├── app.json                ← App name, icon, splash screen config
└── package.json            ← Project dependencies
```

### How Screens Connect — Expo Router

**Expo Router** uses **file-based routing**. Every `.tsx` file inside the `app/` folder automatically becomes a screen.

Open `app/_layout.tsx` — this is the navigation hub:

```tsx
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="selection" options={{ title: "Select Details" }} />
  <Stack.Screen name="product" options={{ title: "Product View" }} />
  <Stack.Screen name="component" options={{ title: "Component Inspection" }} />
  <Stack.Screen
    name="camera"
    options={{ title: "Camera", headerShown: false }}
  />
  <Stack.Screen name="result" options={{ title: "Inspection Result" }} />
</Stack>
```

Each `Stack.Screen` name corresponds to a file. For example, `name="selection"` maps to `app/selection.tsx`.

Screens navigate using `router.push()` and `router.replace()`:

```tsx
router.push("/selection"); // Go to selection screen (can go back)
router.replace("/"); // Go to home screen (replaces history)
```

Learn more: [Expo Router — Navigating between pages](https://docs.expo.dev/router/navigating-pages/)

### Core React Native Components

These are the building blocks used across every screen:

| Component          | What it does                      | Learn more                                                             |
| ------------------ | --------------------------------- | ---------------------------------------------------------------------- |
| `View`             | Container (like a `<div>`)        | [View docs](https://reactnative.dev/docs/view)                         |
| `Text`             | Displays text                     | [Text docs](https://reactnative.dev/docs/text)                         |
| `Image`            | Displays images                   | [Image docs](https://reactnative.dev/docs/image)                       |
| `TouchableOpacity` | Pressable button with fade effect | [TouchableOpacity docs](https://reactnative.dev/docs/touchableopacity) |
| `ScrollView`       | Scrollable container              | [ScrollView docs](https://reactnative.dev/docs/scrollview)             |
| `StyleSheet`       | Defines styles (like CSS)         | [StyleSheet docs](https://reactnative.dev/docs/stylesheet)             |
| `TextInput`        | Text input field                  | [TextInput docs](https://reactnative.dev/docs/textinput)               |

### Styling in React Native

React Native uses `StyleSheet.create()` instead of CSS files. The syntax is similar to CSS but uses camelCase:

| CSS                      | React Native             |
| ------------------------ | ------------------------ |
| `background-color: red;` | `backgroundColor: 'red'` |
| `font-size: 16px;`       | `fontSize: 16`           |
| `font-weight: bold;`     | `fontWeight: 'bold'`     |
| `text-align: center;`    | `textAlign: 'center'`    |
| `border-radius: 8px;`    | `borderRadius: 8`        |
| `padding: 20px;`         | `padding: 20`            |
| `margin-bottom: 10px;`   | `marginBottom: 10`       |

Learn more: [React Native — Style](https://reactnative.dev/docs/style)

### Flexbox Layout

React Native uses **Flexbox** for layout. Key properties:

| Property                   | What it does                        |
| -------------------------- | ----------------------------------- |
| `flex: 1`                  | Take up all available space         |
| `flexDirection: 'column'`  | Stack children vertically (default) |
| `flexDirection: 'row'`     | Stack children horizontally         |
| `justifyContent: 'center'` | Center children along main axis     |
| `alignItems: 'center'`     | Center children along cross axis    |

Learn more: [React Native — Flexbox](https://reactnative.dev/docs/flexbox)

---

### Lab 8: Make the Button Full Width

**File:** `app/(tabs)/index.tsx`

1. Find the `button` style:

```tsx
button: {
  backgroundColor: '#1565C0',
  paddingHorizontal: 60,
  paddingVertical: 16,
  borderRadius: 8,
  minWidth: 200,
  alignItems: 'center',
},
```

2. Replace `minWidth: 200` with `width: '90%'` and remove `paddingHorizontal`:

```tsx
button: {
  backgroundColor: '#1565C0',
  paddingVertical: 16,
  borderRadius: 8,
  width: '90%',
  alignItems: 'center',
},
```

3. **Save** and check your phone — the button now stretches across the screen.

---

### Lab 9: Make the Button Rounded

**File:** `app/(tabs)/index.tsx`

1. In the `button` style, change `borderRadius: 8` to a large value:

```tsx
borderRadius: 30,
```

2. **Save** and check your phone — the button now has fully rounded corners!

---

### Lab 10: Add a Tagline Below the Title

**File:** `app/(tabs)/index.tsx`

1. Find the title `<Text>` element:

```tsx
<Text style={styles.title}>My Factory{"\n"}Inspector</Text>
```

2. Add a new `<Text>` element right below it:

```tsx
<Text style={styles.title}>
  My Factory{'\n'}Inspector
</Text>

<Text style={styles.tagline}>
  Quality inspection made simple
</Text>
```

3. Now add the `tagline` style. In the `StyleSheet.create({...})` section, add this after the `title` style (add a comma after the closing `}` of `title`):

```tsx
tagline: {
  textAlign: 'center',
  marginBottom: 40,
  color: '#666666',
  fontSize: 16,
  fontStyle: 'italic',
},
```

4. **Save** and check your phone — you now have a subtitle!

---

### Lab 11: Add a Border to the Button

**File:** `app/(tabs)/index.tsx`

1. In the `button` style, add `borderWidth` and `borderColor`:

```tsx
button: {
  backgroundColor: '#1565C0',
  paddingVertical: 16,
  borderRadius: 30,
  width: '90%',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#0D47A1',
},
```

2. **Save** and check your phone.

---

### Lab 12: Change the App Display Name

**File:** `app.json`

1. Open `app.json` in the root of the project.
2. Find the `"name"` field:

```json
"name": "SynergrowthInspectionApp",
```

3. Change it to:

```json
"name": "Factory Inspector",
```

4. **Save** the file.

> Note: You may need to restart the Expo server (`Ctrl+C` then `npx expo start` again) for `app.json` changes to take effect.

---

### Lab 13: Change the Splash Screen Background Color

**File:** `app.json`

1. In `app.json`, find the splash screen configuration:

```json
"expo-splash-screen",
{
  "image": "./assets/images/splash-icon.png",
  "imageWidth": 200,
  "resizeMode": "contain",
  "backgroundColor": "#ffffff",
```

2. Change `"backgroundColor": "#ffffff"` to:

```json
"backgroundColor": "#1565C0",
```

3. **Save** and restart the Expo server to see the change.

---

### Lab 14: Change the Header Title of a Screen

**File:** `app/_layout.tsx`

1. Open `app/_layout.tsx`.
2. Find this line:

```tsx
<Stack.Screen name="selection" options={{ title: "Select Details" }} />
```

3. Change the title:

```tsx
<Stack.Screen name="selection" options={{ title: "Station Setup" }} />
```

4. **Save** and navigate to the Selection screen on your phone — the header bar now says "Station Setup".

---

### Lab 15: Change Another Header Title

**File:** `app/_layout.tsx`

1. Find this line:

```tsx
<Stack.Screen name="product" options={{ title: "Product View" }} />
```

2. Change it to:

```tsx
<Stack.Screen name="product" options={{ title: "Inspect This Product" }} />
```

3. **Save** and check.

---

### Day 1 — Session 2 Recap

You now understand:

- The project folder structure
- How Expo Router maps files to screens
- Core React Native components (`View`, `Text`, `Image`, `TouchableOpacity`)
- How `StyleSheet` works (fontSize, color, backgroundColor, borderRadius, etc.)
- How to add new UI elements and styles
- How `app.json` configures the app name and splash screen

---

# Day 2 — Session 1: Selection Screen & Mock Data Labs

> **Goal:** Understand where app data lives, how dropdowns get their options, and how to add/edit/remove mock data safely.

---

### How Dropdowns Get Their Data

Open `constants/mock-data.ts`. This file contains all the dropdown options used in the Selection screen:

```tsx
export const PRODUCT_MODELS = ["PRODUCT_X", "PRODUCT_Y", "PRODUCT_Z"];

export const PRODUCTION_LINES = ["LINE_A", "LINE_B", "LINE_C"];

export const STATION_NUMBERS = ["STATION_1", "STATION_2", "STATION_3"];

export const PRODUCTION_SHIFTS = ["SHIFT_A", "SHIFT_B", "SHIFT_C"];

export const OPERATORS = ["OPERATOR_1", "OPERATOR_2", "OPERATOR_3"];
```

The Selection screen (`app/selection.tsx`) imports these arrays and renders them as dropdown options. When you change the arrays, the dropdowns update automatically.

### How Global State Works — React Context

The app uses **React Context** to share data between screens. Think of it as a "shared notebook" that any screen can read from or write to.

Open `services/inspection-context.tsx`:

- `InspectionProvider` wraps the entire app (in `app/_layout.tsx`)
- `setInspectionData()` saves the selected station info
- `useInspection()` lets any screen read the current data

This is how the Selection screen's choices flow through to Product, Component, Camera, and Result.

Learn more: [React Context](https://react.dev/learn/passing-data-deeply-with-context)

---

### Lab 16: Add a New Production Line

**File:** `constants/mock-data.ts`

1. Open `constants/mock-data.ts`.
2. Find the `PRODUCTION_LINES` array:

```tsx
export const PRODUCTION_LINES = ["LINE_A", "LINE_B", "LINE_C"];
```

3. Add `'LINE_D'` at the end (don't forget the comma after `'LINE_C'`):

```tsx
export const PRODUCTION_LINES = ["LINE_A", "LINE_B", "LINE_C", "LINE_D"];
```

4. **Save** and open the Selection screen on your phone.
5. Tap the **Production Line** dropdown — you should now see `LINE_D` as an option!

---

### Lab 17: Add Two New Operators

**File:** `constants/mock-data.ts`

1. Find the `OPERATORS` array:

```tsx
export const OPERATORS = ["OPERATOR_1", "OPERATOR_2", "OPERATOR_3"];
```

2. Add your name and a colleague's name:

```tsx
export const OPERATORS = [
  "OPERATOR_1",
  "OPERATOR_2",
  "OPERATOR_3",
  "ALI",
  "SITI",
];
```

3. **Save** and check the Operator dropdown on the Selection screen.

---

### Lab 18: Remove a Station

**File:** `constants/mock-data.ts`

1. Find the `STATION_NUMBERS` array:

```tsx
export const STATION_NUMBERS = ["STATION_1", "STATION_2", "STATION_3"];
```

2. Remove `'STATION_3'`:

```tsx
export const STATION_NUMBERS = ["STATION_1", "STATION_2"];
```

3. **Save** and check the Station Number dropdown — only 2 options remain.

---

### Lab 19: Rename All Product Models

**File:** `constants/mock-data.ts`

1. Find the `PRODUCT_MODELS` array:

```tsx
export const PRODUCT_MODELS = ["PRODUCT_X", "PRODUCT_Y", "PRODUCT_Z"];
```

2. Replace with your own product names:

```tsx
export const PRODUCT_MODELS = [
  "WIDGET_PRO",
  "WIDGET_LITE",
  "WIDGET_MAX",
  "WIDGET_MINI",
];
```

3. **Save** and check the Product Model dropdown on the Selection screen.

---

### Lab 20: Rename a Component

**File:** `constants/mock-data.ts`

1. Find the `MOCK_COMPONENTS` array:

```tsx
export const MOCK_COMPONENTS: Component[] = [
  {
    id: "COMPONENT_1",
    name: "Component 1",
    coordinates: { x1: 100, y1: 50, x2: 200, y2: 150 },
  },
  {
    id: "COMPONENT_2",
    name: "Component 2",
    coordinates: { x1: 250, y1: 50, x2: 350, y2: 150 },
  },
];
```

2. Change the `name` values to something descriptive:

```tsx
export const MOCK_COMPONENTS: Component[] = [
  {
    id: "COMPONENT_1",
    name: "Front Panel",
    coordinates: { x1: 100, y1: 50, x2: 200, y2: 150 },
  },
  {
    id: "COMPONENT_2",
    name: "Side Connector",
    coordinates: { x1: 250, y1: 50, x2: 350, y2: 150 },
  },
];
```

3. **Save** and navigate through the app to the Component screen — you'll see your new names.

---

### Lab 21: Add a Third Component

**File:** `constants/mock-data.ts`

1. In the `MOCK_COMPONENTS` array, add a new component after the second one (don't forget the comma after the second item's `}`):

```tsx
export const MOCK_COMPONENTS: Component[] = [
  {
    id: "COMPONENT_1",
    name: "Front Panel",
    coordinates: { x1: 100, y1: 50, x2: 200, y2: 150 },
  },
  {
    id: "COMPONENT_2",
    name: "Side Connector",
    coordinates: { x1: 250, y1: 50, x2: 350, y2: 150 },
  },
  {
    id: "COMPONENT_3",
    name: "Back Cover",
    coordinates: { x1: 100, y1: 200, x2: 200, y2: 300 },
  },
];
```

2. **Save** and navigate to the Component screen — you'll now need to inspect 3 components instead of 2.

---

### Lab 22: Add a New Shift

**File:** `constants/mock-data.ts`

1. Find the `PRODUCTION_SHIFTS` array:

```tsx
export const PRODUCTION_SHIFTS = ["SHIFT_A", "SHIFT_B", "SHIFT_C"];
```

2. Add a night shift:

```tsx
export const PRODUCTION_SHIFTS = [
  "SHIFT_A",
  "SHIFT_B",
  "SHIFT_C",
  "NIGHT_SHIFT",
];
```

3. **Save** and verify in the Production Shift dropdown.

---

### Lab 23: Change the Selection Screen Dropdown Colors

**File:** `app/selection.tsx`

1. Open `app/selection.tsx`.
2. In the `styles` section at the bottom, find the `dropdown` style:

```tsx
dropdown: {
  backgroundColor: '#000000',
  padding: 16,
  borderRadius: 8,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
```

3. Change the `backgroundColor` to a dark blue:

```tsx
dropdown: {
  backgroundColor: '#1565C0',
  padding: 16,
  borderRadius: 8,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
```

4. **Save** and check the Selection screen — all dropdowns are now blue.

---

### Lab 24: Change the Selection Screen Label Font Size

**File:** `app/selection.tsx`

1. Find the `label` style:

```tsx
label: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 8,
  color: '#000000',
},
```

2. Change it to:

```tsx
label: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#333333',
},
```

3. **Save** and check — the dropdown labels are now larger and bolder.

---

### Lab 25: Change the Selection Screen Button Color

**File:** `app/selection.tsx`

1. Find the `button` style:

```tsx
button: {
  backgroundColor: '#000000',
  padding: 16,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 20,
},
```

2. Change the `backgroundColor` to match our blue theme:

```tsx
button: {
  backgroundColor: '#1565C0',
  padding: 16,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 20,
},
```

3. **Save** and check.

---

### Lab 26: Change the Hint Text

**File:** `app/selection.tsx`

1. Find this text element:

```tsx
<Text style={styles.hint}>Fill up all to proceed</Text>
```

2. Change it to:

```tsx
<Text style={styles.hint}>Please select all fields before proceeding</Text>
```

3. **Save** and check.

---

### Day 2 — Session 1 Recap

You now understand:

- Where dropdown data comes from (`constants/mock-data.ts`)
- How to **add**, **edit**, and **remove** items in arrays
- How React Context shares data between screens
- How to customize the Selection screen styling

---

# Day 2 — Session 2: Product, Component, Camera & Result Screen Labs

> **Goal:** Customize the remaining screens, understand the camera and result flow, and learn where APIs are configured.

---

### Product Screen Overview

Open `app/product.tsx`. This screen:

- Reads the selected product from context (`useInspection()`)
- Displays the product image and a label
- Has a "Next" button that goes to the Component screen

### Component Screen Overview

Open `app/component.tsx`. This screen:

- Loops through components one at a time using `currentComponentIndex`
- Shows the product image with a red box highlighting the component to inspect
- Has a "Next" button that goes to the Camera screen

### Camera Screen Overview

Open `app/camera.tsx`. This screen:

- Requests camera permission from the user
- Shows a live camera preview with a **red guide box** overlay
- Captures a photo, crops it to the guide box area, and sends it for analysis
- Shows the captured image with "Analyzing..." while waiting for a result

### Result Screen Overview

Open `app/result.tsx`. This screen:

- Displays the captured component image
- Shows the machine prediction (PASS or FAIL) with confidence percentage
- Shows feedback buttons so the operator can confirm or override the AI result

---

### Lab 27: Change the Product Label Text

**File:** `app/product.tsx`

1. Open `app/product.tsx`.
2. Find this line:

```tsx
<Text style={styles.label}>Product to Inspect</Text>
```

3. Change it to:

```tsx
<Text style={styles.label}>Please Verify This Product</Text>
```

4. **Save** and navigate to the Product screen on your phone.

---

### Lab 28: Change the Product Label Font Size and Color

**File:** `app/product.tsx`

1. In the `styles` section, find the `label` style:

```tsx
label: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 30,
  color: '#000000',
  textAlign: 'center',
},
```

2. Change it to:

```tsx
label: {
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 30,
  color: '#1565C0',
  textAlign: 'center',
},
```

3. **Save** and check.

---

### Lab 29: Change the Product Screen Button Color

**File:** `app/product.tsx`

1. Find the `button` style:

```tsx
button: {
  backgroundColor: '#000000',
  paddingHorizontal: 60,
  paddingVertical: 16,
  borderRadius: 8,
  minWidth: 200,
  alignItems: 'center',
},
```

2. Change `backgroundColor`:

```tsx
button: {
  backgroundColor: '#1565C0',
  paddingHorizontal: 60,
  paddingVertical: 16,
  borderRadius: 8,
  minWidth: 200,
  alignItems: 'center',
},
```

3. **Save** and check.

---

### Lab 30: Change the Product Image Size

**File:** `app/product.tsx`

1. Find the `productImage` style:

```tsx
productImage: {
  width: '90%',
  height: 400,
  marginBottom: 20,
  borderRadius: 8,
},
```

2. Change the height and border radius:

```tsx
productImage: {
  width: '90%',
  height: 300,
  marginBottom: 20,
  borderRadius: 16,
},
```

3. **Save** and check — the image is now shorter with more rounded corners.

---

### Lab 31: Change the Component Label Style

**File:** `app/component.tsx`

1. Open `app/component.tsx`.
2. Find the `label` style:

```tsx
label: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 30,
  color: '#000000',
  textAlign: 'center',
},
```

3. Change it to:

```tsx
label: {
  fontSize: 22,
  fontWeight: 'bold',
  marginBottom: 30,
  color: '#1565C0',
  textAlign: 'center',
},
```

4. **Save** and check.

---

### Lab 32: Change the Component Screen Button Color

**File:** `app/component.tsx`

1. Find the `button` style and change `backgroundColor`:

```tsx
button: {
  backgroundColor: '#1565C0',
  paddingHorizontal: 60,
  paddingVertical: 16,
  borderRadius: 8,
  minWidth: 200,
  alignItems: 'center',
},
```

2. **Save** and check.

---

### Lab 33: Change the Camera Guide Box Color

**File:** `app/camera.tsx`

1. Open `app/camera.tsx`.
2. In the `styles` section, find the `guideBox` style:

```tsx
guideBox: {
  width: '70%',
  aspectRatio: 1,
  borderWidth: 3,
  borderColor: '#FF0000',
  backgroundColor: 'transparent',
},
```

3. Change the `borderColor` from red to blue:

```tsx
guideBox: {
  width: '70%',
  aspectRatio: 1,
  borderWidth: 3,
  borderColor: '#2196F3',
  backgroundColor: 'transparent',
},
```

4. **Save** and navigate to the Camera screen — the guide box is now blue.

---

### Lab 34: Make the Camera Guide Box Thicker

**File:** `app/camera.tsx`

1. In the same `guideBox` style, change `borderWidth: 3` to `borderWidth: 5`:

```tsx
guideBox: {
  width: '70%',
  aspectRatio: 1,
  borderWidth: 5,
  borderColor: '#2196F3',
  backgroundColor: 'transparent',
},
```

2. **Save** and check — the guide box outline is now thicker and more visible.

---

### Lab 35: Change the Camera Capture Button Text

**File:** `app/camera.tsx`

1. Find this line:

```tsx
<Text style={styles.captureButtonText}>Take Picture</Text>
```

2. Change it to:

```tsx
<Text style={styles.captureButtonText}>Capture Image</Text>
```

3. **Save** and check.

---

### Lab 36: Change the "Analyzing..." Loading Text

**File:** `app/camera.tsx`

1. Find this line:

```tsx
<Text style={styles.loadingText}>Analyzing...</Text>
```

2. Change it to:

```tsx
<Text style={styles.loadingText}>Processing Image...</Text>
```

3. **Save** and check — after capturing a photo, the loading text now says "Processing Image..."

---

### Lab 37: Change the Result Screen Text Sizes

**File:** `app/result.tsx`

1. Open `app/result.tsx`.
2. Find the `resultText` style:

```tsx
resultText: {
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#000000',
},
```

3. Make it larger:

```tsx
resultText: {
  fontSize: 36,
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#000000',
},
```

4. **Save** and check — the PASS/FAIL result text is now bigger.

---

### Lab 38: Change the Confidence Text Color

**File:** `app/result.tsx`

1. Find the `confidenceText` style:

```tsx
confidenceText: {
  fontSize: 16,
  marginBottom: 30,
  color: '#666666',
},
```

2. Change it to:

```tsx
confidenceText: {
  fontSize: 18,
  marginBottom: 30,
  color: '#1565C0',
},
```

3. **Save** and check.

---

### Lab 39: Change the Result Image Border Color

**File:** `app/result.tsx`

1. Find the `imageBorder` style:

```tsx
imageBorder: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderWidth: 3,
  borderColor: '#FF0000',
  borderRadius: 8,
},
```

2. Change the border color to blue:

```tsx
imageBorder: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderWidth: 3,
  borderColor: '#1565C0',
  borderRadius: 8,
},
```

3. **Save** and check.

---

### Lab 40: Change the Result Feedback Button Colors

**File:** `app/result.tsx`

1. Find the `agreeButton` and `disagreeButton` styles:

```tsx
agreeButton: {
  backgroundColor: '#000000',
},
disagreeButton: {
  backgroundColor: '#000000',
},
```

2. Change them to visually distinct colors:

```tsx
agreeButton: {
  backgroundColor: '#4CAF50',
},
disagreeButton: {
  backgroundColor: '#F44336',
},
```

3. **Save** and check — the "YES" button is now green and the "NO" button is red, making the operator's choice much clearer!

---

### Lab 41: Change the Theme Colors

**File:** `constants/theme.ts`

1. Open `constants/theme.ts`.
2. Find the light theme colors:

```tsx
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
```

3. Change the `tintColorLight` variable at the top of the file:

```tsx
const tintColorLight = "#1565C0";
```

4. **Save** — any screen that uses theme colors will now use blue instead of teal.

---

### Where Are the APIs Configured?

> **Note:** Connecting to the live server and testing the full API flow will be covered in the **next workshop session**. For now, here is a brief overview of where the APIs are set up.

Open `services/api.ts`. At the top of the file, you'll see:

```tsx
const API_BASE_URL = "https://synergrowth-python-api.onrender.com";
const PREDICT_API_URL =
  "https://deep-learning-celestica-senai.onrender.com/predict";
const FINAL_API_URL =
  "https://deep-learning-celestica-senai.onrender.com/final";
```

These are the backend server URLs hosted on [Render.com](https://render.com/).

The app has two main API functions:

- `predictImage()` — sends a photo to the AI model, gets back PASS/FAIL with a confidence score
- `submitInspectionResult()` — sends the final inspection data (image + operator decision) to the server

Open `constants/config.ts`:

```tsx
export const DEMO_MODE = true;
```

When `DEMO_MODE` is `true` (as it is during this workshop), all API calls are **mocked locally** — no real server requests are made. This is why the app works without internet connectivity to the backend.

> **Next workshop:** We will set `DEMO_MODE = false`, connect to the live backend, and test real AI predictions.

---

### Day 2 — Session 2 Recap

You now understand:

- How each screen (Product, Component, Camera, Result) is structured
- How the camera guide box and capture flow work
- How to customize every screen's text, colors, and styles
- Where the API URLs are configured (`services/api.ts`)
- What Demo Mode does (`constants/config.ts`)
- That live API integration will be covered in the next workshop

---

# Day 2 — Session 3: New Features, Logo & Saving Your Work

> **Goal:** Add a logo to the Welcome screen, create a brand-new screen, add a button that navigates to it, and learn how to save your work with Git & GitHub.

---

### Lab 42: Add a Logo to the Welcome Screen

**File:** `app/(tabs)/index.tsx`

The `Image` component works just like `Text` or `View` — it's a building block that displays a picture. Let's add the app icon as a logo on the Welcome screen.

1. First, add `Image` to the import line at the top of the file. Find:

```tsx
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
```

2. Add `Image` to the list:

```tsx
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
```

3. Now add the logo image above the title. Find the `<Text style={styles.title}>` line and add an `Image` element above it:

```tsx
<Image
  source={require('@/assets/images/icon.png')}
  style={styles.logo}
/>

<Text style={styles.title}>
  My Factory{'\n'}Inspector
</Text>
```

> `require()` tells React Native to load a local image file. The `@/` prefix means "start from the project root."

4. Add the `logo` style in the `StyleSheet.create({...})` section (add it before the `title` style):

```tsx
logo: {
  width: 120,
  height: 120,
  marginBottom: 30,
  resizeMode: 'contain',
},
```

> `resizeMode: 'contain'` makes the image fit inside the given width and height without cropping or stretching.

5. **Save** and check your phone — you now have a logo above the title!

> **Try it:** Change `width` and `height` to `160` to make the logo bigger. Or try `borderRadius: 60` to make it circular!

Learn more: [Image docs](https://reactnative.dev/docs/image)

---

### Lab 43: Add a New Button to the Welcome Screen

**File:** `app/(tabs)/index.tsx`

Let's add a second button below the existing one. This new button will have an **outline style** (transparent background with a border) to look different from the primary button.

1. Find the existing button:

```tsx
<TouchableOpacity style={styles.button} onPress={handleEnter}>
  <Text style={styles.buttonText}>Start Inspection</Text>
</TouchableOpacity>
```

2. Add a second button right below it:

```tsx
<TouchableOpacity style={styles.button} onPress={handleEnter}>
  <Text style={styles.buttonText}>Start Inspection</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.secondaryButton}>
  <Text style={styles.secondaryButtonText}>About</Text>
</TouchableOpacity>
```

3. Add the new styles in the `StyleSheet.create({...})` section:

```tsx
secondaryButton: {
  marginTop: 16,
  paddingVertical: 16,
  borderRadius: 30,
  width: '90%',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#1565C0',
  backgroundColor: 'transparent',
},
secondaryButtonText: {
  color: '#1565C0',
  fontSize: 18,
  fontWeight: '600',
},
```

4. **Save** and check your phone — you now have a second "About" button with an outline style!

> Notice the new button doesn't do anything yet when you tap it. We'll fix that in Lab 45 after creating the page it should go to.

---

### Lab 44: Create a New Screen (About Page)

In Expo Router, **every file in the `app/` folder automatically becomes a screen**. So creating a new screen is as simple as creating a new file!

**Step A — Create the file**

1. Right-click the `app/` folder in your editor and choose **New File**.
2. Name it exactly: `about.tsx`
3. Paste the following code into the new file:

```tsx
import { StyleSheet, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About This App</Text>

      <Text style={styles.description}>
        This is an automated inspection system{"\n"}
        built with React Native and Expo.
      </Text>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1565C0",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666666",
    lineHeight: 24,
  },
  version: {
    fontSize: 14,
    color: "#999999",
  },
});
```

4. **Save** the file.

**Step B — Register the screen in the navigation**

**File:** `app/_layout.tsx`

Every new screen must also be registered in the navigation layout so the app knows it exists.

1. Open `app/_layout.tsx`.
2. Find the last `Stack.Screen` entry:

```tsx
<Stack.Screen name="result" options={{ title: "Inspection Result" }} />
```

3. Add a new line right below it for the About screen:

```tsx
<Stack.Screen name="result" options={{ title: 'Inspection Result' }} />
<Stack.Screen name="about" options={{ title: 'About' }} />
```

4. **Save** the file.

> You've created a brand-new screen and registered it in the app's navigation! The screen exists but nothing links to it yet — that's what Lab 45 is for.

---

### Lab 45: Connect the Button to Navigate to the New Page

**File:** `app/(tabs)/index.tsx`

Now let's wire up the "About" button from Lab 43 so it navigates to the About screen from Lab 44.

1. Find the `handleEnter` function near the top of the file:

```tsx
const handleEnter = () => {
  router.push("/selection");
};
```

2. Add a new handler function right below it:

```tsx
const handleEnter = () => {
  router.push("/selection");
};

const handleAbout = () => {
  router.push("/about");
};
```

> `router.push('/about')` tells Expo Router to navigate to `app/about.tsx`. The `/about` path matches the file name — this is how file-based routing works.

3. Now find the "About" button you added in Lab 43 and connect the handler using `onPress`:

```tsx
<TouchableOpacity style={styles.secondaryButton} onPress={handleAbout}>
  <Text style={styles.secondaryButtonText}>About</Text>
</TouchableOpacity>
```

4. **Save** and test on your phone:
   - Tap the **About** button on the Welcome screen
   - You should see the About screen with the title, description, and version number
   - Tap the **back arrow** in the header bar to return to the Welcome screen

> **You just built a complete feature from scratch:** a new button, a new page, and the navigation between them. This is the same pattern used to build every screen in the app!

---

### Saving Your Work with Git & GitHub

So far you've made many changes to the app, but they only exist on your computer. Let's learn how to **save your code online** so you never lose it and can share it with others.

#### What Are Git and GitHub?

- **Git** is a tool that tracks changes in your code (like "save points" in a video game). It runs locally on your computer.
- **GitHub** is a website that stores your Git repositories online. Think of it as Google Drive — but for code.

```
Your Computer (Git)  ──push──▶  GitHub.com (online backup)
                     ◀──pull──
```

#### Step 1: Create a GitHub Account

If you don't already have one:

1. Go to [github.com](https://github.com/) and click **Sign up**.
2. Enter your email address, create a password, and choose a username.
3. Complete the email verification step.
4. You now have a GitHub account!

> **Already have an account?** Skip to Step 2.

#### Step 2: Create a New Repository on GitHub

A "repository" (or "repo") is a project folder on GitHub.

1. Log in to [github.com](https://github.com/).
2. Click the **+** button in the top-right corner → **New repository**.
3. Fill in:
   - **Repository name:** `my-inspection-app` (or any name you like)
   - **Description:** (optional) `My factory inspection app`
   - Choose **Public** or **Private**
   - **Do NOT** check "Add a README file" (we already have code to push)
4. Click **Create repository**.
5. You will see a setup page with commands — **keep this page open**, we'll need the URL.

#### Step 3: Check What You've Changed

In your terminal (make sure you are inside the project folder), run:

```bash
git status
```

This shows all the files you have modified or created. Modified files appear in **red**.

#### Step 4: Stage Your Changes

"Staging" means telling Git which changes you want to include in your next save point. To stage **all** changes:

```bash
git add .
```

> The `.` means "everything in the current folder." You can also stage a single file: `git add app/about.tsx`

Run `git status` again — staged files now appear in **green**.

#### Step 5: Commit Your Changes

A "commit" is a save point. Each commit needs a short message describing what you changed:

```bash
git commit -m "Add logo, about page, and custom styles"
```

> **Tip:** Write messages that describe _what_ you did. Good: `"Add about page with navigation"`. Bad: `"Changed some files"`.

#### Step 6: Connect to Your GitHub Repository

Copy the repository URL from the GitHub page you kept open (it looks like `https://github.com/YOUR_USERNAME/my-inspection-app.git`).

Run this command, replacing `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/my-inspection-app.git
```

> This tells Git where to upload your code. We use `set-url` because the project already has a remote from cloning.

#### Step 7: Push Your Code to GitHub

```bash
git branch -M main
git push -u origin main
```

> The first time you push, GitHub may ask you to log in. A browser window will open — follow the prompts to authenticate.

After the push completes, **refresh your GitHub repository page** — you should see all your code online!

#### Git Commands Cheat Sheet

| Command                   | What It Does                           |
| ------------------------- | -------------------------------------- |
| `git status`              | See which files have changed           |
| `git add .`               | Stage all changes for commit           |
| `git add <file>`          | Stage a specific file                  |
| `git commit -m "message"` | Save staged changes with a description |
| `git push`                | Upload commits to GitHub               |
| `git pull`                | Download latest changes from GitHub    |
| `git log --oneline`       | View your commit history               |

#### Making More Changes Later

Every time you finish a batch of changes and want to save, repeat these three commands:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

That's it — three commands to save your work forever!

---

### Day 2 — Session 3 Recap

You now know how to:

- Add an **image/logo** to any screen using the `Image` component
- **Create a brand-new screen** by adding a file in the `app/` folder
- **Register a new screen** in `app/_layout.tsx`
- **Add a button** and wire it to **navigate** to another screen with `router.push()`
- **Save your code** to GitHub using `git add`, `git commit`, and `git push`
- Create a **GitHub account** and repository

---

## Quick Reference Cheat Sheet

Use this table whenever you need to find where to change something:

| I want to change...                                | Open this file                                 |
| -------------------------------------------------- | ---------------------------------------------- |
| App name, icon, splash screen                      | `app.json`                                     |
| Product models, lines, operators, shifts, stations | `constants/mock-data.ts`                       |
| Component names and coordinates                    | `constants/mock-data.ts`                       |
| Theme colors and fonts                             | `constants/theme.ts`                           |
| Demo Mode on/off                                   | `constants/config.ts`                          |
| API server URLs                                    | `constants/config.ts`                          |
| Welcome screen (home page)                         | `app/(tabs)/index.tsx`                         |
| Selection screen (dropdowns)                       | `app/selection.tsx`                            |
| Product catalog list                               | `app/products.tsx`                             |
| Product create/edit form                           | `app/product-form.tsx`                         |
| Inspection point list                              | `app/points-list.tsx`                          |
| Inspection point form + reference photo            | `app/point-form.tsx`                           |
| Local product catalog persistence                  | `services/product-catalog.ts`                  |
| Product screen                                     | `app/product.tsx`                              |
| Component inspection screen                        | `app/component.tsx`                            |
| Camera screen                                      | `app/camera.tsx`                               |
| Result screen (PASS/FAIL)                          | `app/result.tsx`                               |
| Screen titles in header bar                        | `app/_layout.tsx`                              |
| About screen                                       | `app/about.tsx`                                |
| Navigation flow / add new screen                   | `app/_layout.tsx` + new file in `app/`         |
| Global state (shared data)                         | `services/inspection-context.tsx`              |
| Inspection point coordinates & count               | `utils/inspection-points.ts`                   |
| Camera guide box size                              | `app/camera.tsx` (`GUIDE_BOX_WIDTH_RATIO`)     |
| Summary screen (results list)                      | `app/summary.tsx`                              |
| Server startup                                     | `prediction_app_in_laptop_using_vscode.py`     |
| Server Python dependencies                         | `requirements.txt` (flask, tensorflow, pandas) |
| AI model file                                      | `ANDELI_DZ47_63_S02_C02.keras`                 |
| Saved inspection images                            | `uploads/` folder on the laptop                |
| Inspection report (pass/fail counts)               | `GET /report` on the server                    |
| OpenRouter backend route                           | `synergrowth-python-api/api/index.py`          |
| OpenRouter local key                               | `synergrowth-python-api/.env`                  |
| OpenRouter production key                          | Vercel -> Settings -> Environment Variables    |
| Mobile to OpenRouter analysis call                 | `services/api.ts` -> `POST /analyze`           |

---

## Useful Links

| Resource                     | URL                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| React Native — Official Docs | [reactnative.dev/docs](https://reactnative.dev/docs/getting-started)                 |
| Expo — Official Docs         | [docs.expo.dev](https://docs.expo.dev/)                                              |
| Expo Router — Navigation     | [docs.expo.dev/router](https://docs.expo.dev/router/introduction/)                   |
| TypeScript — Official Docs   | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)                      |
| React — Official Docs        | [react.dev](https://react.dev/)                                                      |
| Node.js — Download           | [nodejs.org](https://nodejs.org/)                                                    |
| Git — Download               | [git-scm.com](https://git-scm.com/)                                                  |
| GitHub — Create Account      | [github.com](https://github.com/)                                                    |
| VS Code — Download           | [code.visualstudio.com](https://code.visualstudio.com/)                              |
| Cursor — Download            | [cursor.com](https://www.cursor.com/)                                                |
| Expo Go — Android            | [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) |
| Expo Go — iOS                | [Apple App Store](https://apps.apple.com/app/expo-go/id982107779)                    |
| HTML Color Codes             | [htmlcolorcodes.com](https://htmlcolorcodes.com/)                                    |
| Python — Download            | [python.org/downloads](https://www.python.org/downloads/)                            |
| Flask — Official Docs        | [flask.palletsprojects.com](https://flask.palletsprojects.com/)                      |
| TensorFlow — Official Docs   | [tensorflow.org](https://www.tensorflow.org/)                                        |
| FastAPI — Official Docs      | [fastapi.tiangolo.com](https://fastapi.tiangolo.com/)                                |
| OpenRouter — API Keys        | [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys)                   |
| Vercel — Environment Vars    | [vercel.com/docs/projects/environment-variables](https://vercel.com/docs/projects/environment-variables) |

---

## Lab Summary by Session

### Day 1 — Session 1 (Labs 1–7)

| Lab | What You Changed                 | File                   |
| --- | -------------------------------- | ---------------------- |
| 1   | Welcome screen title text        | `app/(tabs)/index.tsx` |
| 2   | Title font size                  | `app/(tabs)/index.tsx` |
| 3   | Title color                      | `app/(tabs)/index.tsx` |
| 4   | Button background color          | `app/(tabs)/index.tsx` |
| 5   | Button text                      | `app/(tabs)/index.tsx` |
| 6   | Button text size and font weight | `app/(tabs)/index.tsx` |
| 7   | Screen background color          | `app/(tabs)/index.tsx` |

### Day 1 — Session 2 (Labs 8–15)

| Lab | What You Changed               | File                   |
| --- | ------------------------------ | ---------------------- |
| 8   | Button full width              | `app/(tabs)/index.tsx` |
| 9   | Button rounded corners         | `app/(tabs)/index.tsx` |
| 10  | Added tagline text element     | `app/(tabs)/index.tsx` |
| 11  | Button border                  | `app/(tabs)/index.tsx` |
| 12  | App display name               | `app.json`             |
| 13  | Splash screen background color | `app.json`             |
| 14  | Selection screen header title  | `app/_layout.tsx`      |
| 15  | Product screen header title    | `app/_layout.tsx`      |

### Day 2 — Session 1 (Labs 16–26)

| Lab | What You Changed          | File                     |
| --- | ------------------------- | ------------------------ |
| 16  | Added new production line | `constants/mock-data.ts` |
| 17  | Added new operators       | `constants/mock-data.ts` |
| 18  | Removed a station         | `constants/mock-data.ts` |
| 19  | Renamed product models    | `constants/mock-data.ts` |
| 20  | Renamed components        | `constants/mock-data.ts` |
| 21  | Added a third component   | `constants/mock-data.ts` |
| 22  | Added a new shift         | `constants/mock-data.ts` |
| 23  | Dropdown background color | `app/selection.tsx`      |
| 24  | Dropdown label font size  | `app/selection.tsx`      |
| 25  | Selection button color    | `app/selection.tsx`      |
| 26  | Hint text wording         | `app/selection.tsx`      |

### Day 2 — Session 2 (Labs 27–41)

| Lab | What You Changed                   | File                 |
| --- | ---------------------------------- | -------------------- |
| 27  | Product label text                 | `app/product.tsx`    |
| 28  | Product label font size and color  | `app/product.tsx`    |
| 29  | Product button color               | `app/product.tsx`    |
| 30  | Product image size                 | `app/product.tsx`    |
| 31  | Component label style              | `app/component.tsx`  |
| 32  | Component button color             | `app/component.tsx`  |
| 33  | Camera guide box color             | `app/camera.tsx`     |
| 34  | Camera guide box thickness         | `app/camera.tsx`     |
| 35  | Camera capture button text         | `app/camera.tsx`     |
| 36  | Camera loading text                | `app/camera.tsx`     |
| 37  | Result text size                   | `app/result.tsx`     |
| 38  | Confidence text color and size     | `app/result.tsx`     |
| 39  | Result image border color          | `app/result.tsx`     |
| 40  | Feedback button colors (green/red) | `app/result.tsx`     |
| 41  | Theme tint color                   | `constants/theme.ts` |

### Day 2 — Session 3 (Labs 42–45 + Git)

| Lab | What You Changed                                      | File                               |
| --- | ----------------------------------------------------- | ---------------------------------- |
| 42  | Added logo image to Welcome screen                    | `app/(tabs)/index.tsx`             |
| 43  | Added a second "About" button                         | `app/(tabs)/index.tsx`             |
| 44  | Created a new About screen + registered in navigation | `app/about.tsx`, `app/_layout.tsx` |
| 45  | Wired button to navigate to the About screen          | `app/(tabs)/index.tsx`             |
| —   | Saved work to GitHub (git add, commit, push)          | Terminal                           |

### Day 3 — Session 1 (Labs 46–51)

| Lab | What You Did                                 | File / Tool                                |
| --- | -------------------------------------------- | ------------------------------------------ |
| 46  | Installed Python on the laptop               | Terminal                                   |
| 47  | First-time server setup (venv, pip install)  | Terminal                                   |
| 48  | Started the Flask prediction server          | `prediction_app_in_laptop_using_vscode.py` |
| 49  | Found laptop IP address, verified from phone | Terminal / Phone browser                   |
| 50  | Set `DEMO_MODE = false` and `API_BASE_URL`   | `constants/config.ts`                      |
| 51  | Tested full phone-to-server connection       | End-to-end test                            |

### Day 3 — Session 2 (Labs 52–58)

| Lab | What You Changed                                     | File                         |
| --- | ---------------------------------------------------- | ---------------------------- |
| 52  | Product screen red box coordinates                   | `utils/inspection-points.ts` |
| 53  | Camera guide box size                                | `app/camera.tsx`             |
| 54  | Camera guide box aspect ratio (square → rectangle)   | `app/camera.tsx`             |
| 55  | Walkthrough of InspectionPoint data structure        | `utils/inspection-points.ts` |
| 56  | Added a third inspection point                       | `utils/inspection-points.ts` |
| 57  | Reduced to a single inspection point                 | `utils/inspection-points.ts` |
| 58  | Added five inspection points with custom coordinates | `utils/inspection-points.ts` |

### Day 4 — Session 1 (Labs 59–65)

| Lab | What You Did                             | File / Tool                                |
| --- | ---------------------------------------- | ------------------------------------------ |
| 59  | Inspected the uploads/ folder            | Terminal / File Explorer                   |
| 60  | Decoded filename metadata structure      | `prediction_app_in_laptop_using_vscode.py` |
| 61  | Walkthrough of /report endpoint          | Browser (`GET /report`)                    |
| 62  | Tested /report endpoint with curl        | Terminal                                   |
| 63  | Tested /predict endpoint with curl       | Terminal                                   |
| 64  | Analyzed inspection data using filenames | Terminal (PowerShell / bash)               |
| 65  | Used AI to analyze inspection data       | ChatGPT / Claude prompt                    |

### Day 4 — Session 2 (Labs 66–72)

| Lab | What You Changed                  | File              |
| --- | --------------------------------- | ----------------- |
| 66  | Summary screen title text         | `app/summary.tsx` |
| 67  | Summary title style (size, color) | `app/summary.tsx` |
| 68  | Done button color                 | `app/summary.tsx` |
| 69  | Completion modal message          | `app/summary.tsx` |
| 70  | Return button text                | `app/summary.tsx` |
| 71  | Result card PASS/FAIL colors      | `app/summary.tsx` |
| 72  | Full end-to-end integration test  | All files         |

### Day 5 — Session 1 (Labs 73–80)

| Lab | What You Changed / Learned                       | File / Screen                      |
| --- | ------------------------------------------------ | ---------------------------------- |
| 73  | Opened the passcode-protected product management flow | `app/(tabs)/index.tsx`             |
| 74  | Created a new product record                     | `app/product-form.tsx`             |
| 75  | Read how passcode unlock and product refresh work | `app/products.tsx`                 |
| 76  | Edited an existing product                       | `app/product-form.tsx`             |
| 77  | Deleted a product and its point photos           | `services/product-catalog.ts`      |
| 78  | Traced local storage with AsyncStorage           | `services/product-catalog.ts`      |
| 79  | Changed product catalog labels/styles            | `app/products.tsx`                 |
| 80  | Tested create, edit, delete, restart persistence | Phone / Expo Go                    |

### Day 5 — Session 2 (Labs 81–88)

| Lab | What You Changed / Learned                      | File / Screen                      |
| --- | ----------------------------------------------- | ---------------------------------- |
| 81  | Opened the inspection point list                | `app/points-list.tsx`              |
| 82  | Added a point name and expected specs           | `app/point-form.tsx`               |
| 83  | Added a required reference photo                | `app/point-form.tsx`               |
| 84  | Learned how photos are copied into app storage  | `services/product-catalog.ts`      |
| 85  | Edited an inspection point and replaced a photo | `app/point-form.tsx`               |
| 86  | Deleted a point and cleaned up its image file   | `app/points-list.tsx`              |
| 87  | Started an inspection from dynamic products     | `app/selection.tsx`                |
| 88  | Verified reference photo appears during capture | `app/product.tsx`, `app/camera.tsx` |

### Day 6 — Session 1 (Labs 89–96)

| Lab | What You Did / Learned                         | File / Tool                         |
| --- | ---------------------------------------------- | ----------------------------------- |
| 89  | Opened the FastAPI backend project             | `synergrowth-python-api/`           |
| 90  | Created a local `.env` from `.env.example`     | `.env`, `.env.example`              |
| 91  | Stored `OPENROUTER_API_KEY` on the backend     | `.env`                              |
| 92  | Selected an OpenRouter vision model            | `OPENROUTER_MODEL`                  |
| 93  | Walked through the `/analyze` route            | `api/index.py`                      |
| 94  | Understood reference vs captured image payload | `api/index.py`                      |
| 95  | Tested the backend health endpoint             | Browser / curl                      |
| 96  | Tested `/analyze` with two images              | curl / Postman                      |

### Day 6 — Session 2 (Labs 97–104)

| Lab | What You Changed / Learned                          | File / Tool                         |
| --- | --------------------------------------------------- | ----------------------------------- |
| 97  | Set the mobile app to real API mode                 | `constants/config.ts`               |
| 98  | Pointed `API_BASE_URL` at the FastAPI/Vercel server | `constants/config.ts`               |
| 99  | Traced the mobile multipart request                 | `services/api.ts`                   |
| 100 | Connected captured photo + reference photo          | `app/camera.tsx`                    |
| 101 | Verified metadata fields sent to the API            | `services/api.ts`                   |
| 102 | Stored production keys in Vercel                    | Vercel Environment Variables        |
| 103 | Ran a full OpenRouter-powered inspection            | Phone / Expo Go                     |
| 104 | Troubleshot common API and key errors               | Backend logs / mobile alerts        |

---

> **End of Day 1–2.** You have completed 45 hands-on labs covering UI customization, data changes, new screens, and Git.

---

# Day 3 — Session 1: Server Setup & Connecting Mobile to Laptop

> **Goal:** Set up the Python prediction server on the laptop, find your IP address, configure the mobile app to talk to the laptop, and verify end-to-end communication.

---

### What Are We Doing Differently Now?

In Day 1–2, the app ran in **Demo Mode** — all predictions were faked locally. Starting today, we connect the mobile app to a **real AI server** running on a laptop. The server receives photos, runs them through a TensorFlow deep learning model, and returns a real PASS or FAIL prediction.

```
┌──────────────┐       Wi-Fi (same network)       ┌──────────────────┐
│  Mobile App  │  ──── POST /predict (image) ────▶ │  Laptop Server   │
│  (Expo Go)   │  ◀─── { prediction, confidence }─ │  (Flask + TF)    │
└──────────────┘                                   └──────────────────┘
```

### Server Project Structure

The server lives in the `deep_learning_celestica_senai_laptop` folder:

```
deep_learning_celestica_senai_laptop/
├── prediction_app_in_laptop_using_vscode.py   ← Main Flask server
├── requirements.txt                           ← Python dependencies
├── ANDELI_DZ47_63_S02_C02.keras               ← TensorFlow model file
├── uploads/                                   ← Created at runtime (saved images)
└── .venv/                                     ← Python virtual environment
```

| File                                       | Purpose                                                         |
| ------------------------------------------ | --------------------------------------------------------------- |
| `prediction_app_in_laptop_using_vscode.py` | Flask app — receives images, runs AI model, returns predictions |
| `requirements.txt`                         | Lists Python packages: `flask`, `tensorflow`, `pandas`          |
| `ANDELI_DZ47_63_S02_C02.keras`             | The trained deep learning model (must be in the same folder)    |
| `uploads/`                                 | Where the server saves every image it receives (auto-created)   |

### Clone the server repository (GitHub)

The workshop server code, model file, and sample images live in this public repository:

**[github.com/JiaYee/deep_learning_celestica_senai_laptop](https://github.com/JiaYee/deep_learning_celestica_senai_laptop)**

On the laptop, clone it once (for example into your usual projects folder):

```bash
git clone https://github.com/JiaYee/deep_learning_celestica_senai_laptop.git
cd deep_learning_celestica_senai_laptop
```

Use the `develop` branch if your instructor asks for it: after cloning, run `git checkout develop`.

---

### Lab 46: Install Python on the Laptop

> **Skip this lab if Python is already installed.**

1. Download Python from [python.org/downloads](https://www.python.org/downloads/).
2. **Important:** During installation, check the box **"Add Python to PATH"**.
3. After install, open a terminal and verify:

```bash
python --version
```

You should see something like `Python 3.10.x` or later.

4. Also verify `pip` (Python's package manager):

```bash
pip --version
```

---

### Lab 47: First-Time Server Setup

Open a terminal on the **laptop** (not the phone) and run these commands:

**Step A — Get the server folder:**

If you do not have the project yet, clone it from GitHub:

```bash
git clone https://github.com/JiaYee/deep_learning_celestica_senai_laptop.git
cd deep_learning_celestica_senai_laptop
```

If you already cloned or copied the folder, open a terminal and `cd` into `deep_learning_celestica_senai_laptop` (use your actual path).

**Step B — Create a virtual environment:**

A virtual environment keeps the server's Python packages isolated from your system.

```bash
python -m venv .venv
```

**Step C — Activate the virtual environment:**

On **Windows**:

```bash
.venv\Scripts\activate.bat
```

On **macOS/Linux**:

```bash
source .venv/bin/activate
```

You should see `(.venv)` appear at the beginning of your terminal prompt.

**Step D — Install dependencies:**

```bash
pip install -r requirements.txt
```

This installs Flask (web server), TensorFlow (AI model), and pandas.

> **Note:** TensorFlow is a large package (~500 MB). The first install may take several minutes.

**Step E — Verify the model file exists:**

Make sure `ANDELI_DZ47_63_S02_C02.keras` is in the project folder. This is the trained AI model. Without it, the server will not start.

---

### Lab 48: Start the Server

With the virtual environment activated, run:

```bash
python prediction_app_in_laptop_using_vscode.py
```

You should see output like:

```
INFO:root:Loading TensorFlow model into memory...
INFO:root:Model loaded successfully.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://192.168.x.x:5000
```

The server is now listening on **port 5000**.

> **Keep this terminal open!** The server stops if you close it. To stop manually, press `Ctrl+C`.

**Quick health check** — open a browser on the laptop and go to:

```
http://127.0.0.1:5000
```

You should see: **"Server is up! Model is pre-loaded."**

---

### Lab 49: Find Your Laptop's IP Address

The mobile app needs to know the laptop's IP address on the Wi-Fi network.

**On Windows:**

```bash
ipconfig
```

Look for **Wireless LAN adapter Wi-Fi** → **IPv4 Address**. It looks like `192.168.x.x`.

**On macOS:**

```bash
ifconfig | grep "inet "
```

**On Linux:**

```bash
hostname -I
```

Write down this IP address — you will need it in the next lab.

> **Example:** If your IP is `192.168.0.105`, the server URL is `http://192.168.0.105:5000`.

#### Verification: Can You Reach the Server from Your Phone?

1. Make sure your **phone and laptop are on the same Wi-Fi network**.
2. Open a browser **on your phone**.
3. Type: `http://192.168.x.x:5000` (use your actual IP).
4. You should see: **"Server is up! Model is pre-loaded."**

If you **cannot** reach the server:

- Double-check both devices are on the same Wi-Fi.
- Check if the laptop's firewall is blocking port 5000.
- On Windows, you may need to allow Python through the firewall when prompted.

---

### Lab 50: Turn Off Demo Mode & Set the Base URL

**File:** `constants/config.ts` (in the mobile app project)

This is the most important configuration step. We are switching from fake local predictions to real server predictions.

1. Open `constants/config.ts`:

```tsx
export const DEMO_MODE = false;

/** API base URL: local Flask server (replace with your laptop IP on same network) */
export const API_BASE_URL = "http://192.168.0.3:5000";
```

2. Change the `API_BASE_URL` to use **your laptop's IP address** (from Lab 49):

```tsx
export const DEMO_MODE = false;

/** API base URL: local Flask server (replace with your laptop IP on same network) */
export const API_BASE_URL = "http://192.168.x.x:5000";
```

> Replace `192.168.x.x` with your actual IP address. Keep the `http://` prefix and `:5000` port.

3. Make sure `DEMO_MODE` is set to `false`. If it is `true`, change it to `false`:

```tsx
export const DEMO_MODE = false;
```

4. **Save** the file.

#### How the Data Flows

Here is what happens when you tap "Take Picture" in the app:

```
1. Camera captures photo
2. Photo is cropped to the red guide box area
3. Photo is compressed (resized to max 800px, JPEG quality 0.7)
4. App sends POST request to http://192.168.x.x:5000/predict
   - Body: FormData with the image file + metadata
   - Metadata: product_model, station_number, production_line, etc.
5. Server receives the image
6. Server resizes image to 288×288 and runs AI model
7. Server saves image to uploads/ folder with metadata filename
8. Server returns JSON: { "prediction": "pass"|"fail", "confidence": 0.95 }
9. App displays the result (PASS/FAIL with confidence %)
```

Open `services/api.ts` to see this in code:

```tsx
const PREDICT_API_URL = `${API_BASE_URL}/predict`;
```

The `predictImage()` function builds a `FormData` object with the image and metadata, sends it via `fetch()`, and parses the JSON response.

---

### Lab 51: Test the Full Connection

1. Make sure the **server is running** on the laptop (Lab 48).
2. Make sure `DEMO_MODE = false` and the **IP address is correct** (Lab 50).
3. Make sure your **phone and laptop are on the same Wi-Fi**.
4. Open the app on your phone via Expo Go.
5. Go through the flow: **Welcome → Selection → Product → Camera**.
6. Take a picture — the app should show "Analyzing..." then display a real **PASS** or **FAIL** result from the server.
7. Check the server terminal — you should see a log line like:

```
INFO:__main__:Saved: 20260316_143022_WIDGET_PRO_STATION_1_LINE_A_SHIFT_A_ALI_unknown_pass_0.95.jpg -> ...
```

> **Troubleshooting:**
>
> - "Network request failed" → Check IP address, same Wi-Fi, and firewall.
> - "Prediction failed: 400" → The server did not receive the image file correctly.
> - App still shows mock results → Make sure `DEMO_MODE = false` and you saved the file.

---

### Day 3 — Session 1 Recap

You now understand:

- How to set up the Python server (virtual environment, dependencies, model file)
- How to start and stop the server
- How to find your laptop's IP address
- How to configure the mobile app's `API_BASE_URL` in `constants/config.ts`
- The full data flow: phone captures image → POST to server → AI prediction → response displayed
- How to troubleshoot connection issues

---

# Day 3 — Session 2: Customizing Red Boxes & Inspection Points

> **Goal:** Understand how red box coordinates work on the product overlay and camera overlay, change them, and learn how to add or remove inspection points.

---

### How Red Boxes Work — Two Different Systems

The app has red boxes in **two places**, and they work differently:

| Location       | Purpose                                         | Coordinate System                                | File                         |
| -------------- | ----------------------------------------------- | ------------------------------------------------ | ---------------------------- |
| Product screen | Highlights area to inspect on the product photo | **Normalized (0–1)** — relative to image size    | `utils/inspection-points.ts` |
| Camera screen  | Guide box for the operator to align the camera  | **Percentage of screen** — fixed centered square | `app/camera.tsx`             |

#### Product Screen Red Box (Normalized Coordinates)

On the Product screen, red boxes use **normalized coordinates** (values between 0 and 1). This means the box position scales automatically regardless of screen size.

```
(0,0) ─────────────── (1,0)
  │                      │
  │    ┌──────┐          │
  │    │ Red  │          │
  │    │ Box  │          │
  │    └──────┘          │
  │                      │
(0,1) ─────────────── (1,1)
```

- `x: 0.15` means the box starts at 15% from the left edge
- `y: 0.2` means the box starts at 20% from the top edge
- `width: 0.3` means the box is 30% of the image width
- `height: 0.3` means the box is 30% of the image height

#### Camera Screen Red Box (Guide Box)

On the Camera screen, the red box is a **fixed centered square** that takes up 70% of the preview width. It tells the operator where to aim the camera. The captured photo is then **cropped to this box area**.

---

### Lab 52: Change Product Screen Red Box Coordinates

**File:** `utils/inspection-points.ts`

1. Open `utils/inspection-points.ts`:

```tsx
/** Hardcoded to 2 inspection points per product */
export function generateInspectionPoints(): InspectionPoint[] {
  return [
    { id: "point-1", x: 0.15, y: 0.2, width: 0.3, height: 0.3 },
    { id: "point-2", x: 0.55, y: 0.5, width: 0.3, height: 0.3 },
  ];
}
```

2. Let's move the first red box to the **top-right** corner and make it smaller:

```tsx
export function generateInspectionPoints(): InspectionPoint[] {
  return [
    { id: "point-1", x: 0.6, y: 0.1, width: 0.25, height: 0.25 },
    { id: "point-2", x: 0.55, y: 0.5, width: 0.3, height: 0.3 },
  ];
}
```

3. **Save** and navigate to the Product screen — the first red box is now in the top-right area and smaller.

> **Experiment:** Try different values between 0 and 1. Remember:
>
> - `x` and `y` are the **top-left corner** of the box
> - `width` and `height` are the **size** of the box
> - Make sure `x + width ≤ 1` and `y + height ≤ 1`, or the box will overflow off the image

---

### Lab 53: Change Camera Guide Box Size

**File:** `app/camera.tsx`

The camera guide box size is controlled by a constant at the top of the file.

1. Open `app/camera.tsx` and find:

```tsx
const GUIDE_BOX_WIDTH_RATIO = 0.7; // 70% of preview width
```

2. Change it to a smaller box (50% of preview width):

```tsx
const GUIDE_BOX_WIDTH_RATIO = 0.5; // 50% of preview width
```

3. **Save** and go to the Camera screen — the guide box is now smaller, requiring the operator to get closer to the component.

> **Tip:** A smaller guide box means the operator must be more precise when framing the shot. A larger guide box is more forgiving. Common values: `0.5` (tight) to `0.8` (loose).

---

### Lab 54: Change Camera Guide Box to a Rectangle (Custom Aspect Ratio)

**File:** `app/camera.tsx`

Currently the guide box is a perfect square (`aspectRatio: 1`). Let's make it a rectangle.

1. Find the `guideBox` style:

```tsx
guideBox: {
  width: "70%",
  aspectRatio: 1,
  borderWidth: 3,
  borderColor: "#FF0000",
  backgroundColor: "transparent",
},
```

2. Change `aspectRatio` to make it wider than tall (landscape rectangle):

```tsx
guideBox: {
  width: "70%",
  aspectRatio: 1.5,
  borderWidth: 3,
  borderColor: "#FF0000",
  backgroundColor: "transparent",
},
```

3. **Save** and check the Camera screen — the guide box is now a horizontal rectangle.

> `aspectRatio: 1` = square, `aspectRatio: 1.5` = landscape, `aspectRatio: 0.75` = portrait. Match this to the shape of the component you are inspecting.

---

### Lab 55: Understand the InspectionPoint Data Structure

**File:** `utils/inspection-points.ts`

Before we add or remove inspection points, let's understand the data structure:

```tsx
export interface InspectionPoint {
  id: string; // Unique identifier (e.g. 'point-1')
  x: number; // Left edge position (0 to 1)
  y: number; // Top edge position (0 to 1)
  width: number; // Box width (0 to 1)
  height: number; // Box height (0 to 1)
}
```

Each inspection point represents **one area** on the product that needs to be inspected. The app loops through all points — for each point:

1. The Product screen shows the product image with the red box highlighting that point
2. The operator taps "Next" → Camera screen opens
3. The operator takes a photo of that area
4. The photo is sent to the AI server for prediction
5. The result is saved
6. If there are more points, the app goes back to the Product screen for the next point
7. When all points are done, the app goes to the Summary screen

The number of inspection points is simply **the length of the array** returned by `generateInspectionPoints()`.

---

### Lab 56: Add a Third Inspection Point

**File:** `utils/inspection-points.ts`

1. Open `utils/inspection-points.ts`.
2. Add a third inspection point to the array:

```tsx
export function generateInspectionPoints(): InspectionPoint[] {
  return [
    { id: "point-1", x: 0.6, y: 0.1, width: 0.25, height: 0.25 },
    { id: "point-2", x: 0.55, y: 0.5, width: 0.3, height: 0.3 },
    { id: "point-3", x: 0.1, y: 0.6, width: 0.35, height: 0.25 },
  ];
}
```

3. **Save** and navigate through the app — the Product screen will now show **"Inspection Point 1 of 3"**, and you will need to capture 3 photos before reaching the Summary.

---

### Lab 57: Reduce to a Single Inspection Point

**File:** `utils/inspection-points.ts`

1. Remove all but the first point:

```tsx
export function generateInspectionPoints(): InspectionPoint[] {
  return [{ id: "point-1", x: 0.15, y: 0.2, width: 0.3, height: 0.3 }];
}
```

2. **Save** and test — the app now only requires **one** photo before going to the Summary.

> **Key insight:** The number of inspection points is controlled entirely by this array. Need 5 points? Add 5 objects. Need 1? Keep just 1. The rest of the app (Product screen, Camera screen, Summary screen) adapts automatically because it loops through the array.

---

### Lab 58: Add Five Inspection Points with Custom Coordinates

**File:** `utils/inspection-points.ts`

This is a challenge lab — place 5 red boxes across different areas of the product image:

```tsx
export function generateInspectionPoints(): InspectionPoint[] {
  return [
    { id: "point-1", x: 0.05, y: 0.05, width: 0.2, height: 0.2 },
    { id: "point-2", x: 0.75, y: 0.05, width: 0.2, height: 0.2 },
    { id: "point-3", x: 0.35, y: 0.35, width: 0.3, height: 0.3 },
    { id: "point-4", x: 0.05, y: 0.7, width: 0.2, height: 0.25 },
    { id: "point-5", x: 0.7, y: 0.7, width: 0.25, height: 0.25 },
  ];
}
```

**Save** and test the full flow — you should need to capture 5 photos, one for each inspection point. The Product screen will show each red box in sequence.

> **Visual map of the 5 points:**
>
> ```
> ┌──────────────────────────┐
> │ [1]              [2]     │
> │                          │
> │       [3]                │
> │                          │
> │ [4]              [5]     │
> └──────────────────────────┘
> ```

---

### Day 3 — Session 2 Recap

You now understand:

- The **two red box systems**: normalized coordinates on the Product screen, percentage-based guide box on the Camera screen
- How to change red box **position** (x, y) and **size** (width, height) using values between 0 and 1
- How to change the **camera guide box** size and aspect ratio
- How to **add** or **remove** inspection points by modifying the array in `utils/inspection-points.ts`
- That the number of inspection points = the number of items in the array — the rest of the app adapts automatically

---

# Day 4 — Session 1: Server Files & Report Endpoint

> **Goal:** Understand how images are saved on the laptop server, how the filename contains rich metadata, and how to use the /report endpoint to extract insights from inspection data.

### Suggested pacing (~4 hours)

Use this as a flexible agenda. Adjust depth if your group moves faster or needs more debugging time.

| Block | Time | Focus |
| ----- | ---- | ----- |
| Opening & goals | 15 min | Why filenames-as-data matters; preview the JSON from `/report` |
| Server file tour | 45–60 min | Walk `prediction_app_in_laptop_using_vscode.py` top-to-bottom (sections below) |
| Hands-on: uploads & decode | 45 min | Labs 59–60: open `uploads/`, parse a filename together |
| `/report` & curl | 45 min | Lab 61–62: browser + terminal; discuss edge cases (empty folder, bad names) |
| Mobile ↔ server trace | 45–60 min | Trace `POST /predict` from `app/camera.tsx` → `services/api.ts` → Flask (section below) |
| Labs 63–65 & extensions | 45–60 min | `curl` predict, PowerShell/grep, AI prompt; optional mini-challenge (below) |
| Breaks & buffer | 30 min | Built into the day |

**Instructor tip:** Live-code in the IDE: set a breakpoint or add a temporary `print(meta)` in `predict()` so learners see exactly what arrives from the phone.

---

### Code walkthrough: `prediction_app_in_laptop_using_vscode.py`

The server is a single Flask file. Understanding its **order of execution** and **three routes** is enough to own the backend for the workshop.

#### 1. Imports, TensorFlow threading, and Flask app

At the top, TensorFlow is configured to use **one thread** for inter-op and intra-op work. On a laptop this avoids the model accidentally grabbing every CPU core and makes behavior more predictable during demos:

```python
tf.config.threading.set_inter_op_parallelism_threads(1)
tf.config.threading.set_intra_op_parallelism_threads(1)
app = Flask(__name__)
```

#### 2. Model load at startup (not per request)

The `.keras` model path is resolved **next to the script file** (`Path(__file__).resolve().parent`). The model loads **once** when the process starts:

```python
model_path = current_directory / 'ANDELI_DZ47_63_S02_C02.keras'
model = tf.keras.models.load_model(model_path)
```

**Why it matters:** First prediction after boot may still “feel” heavy while TF warms up; after that, each `/predict` only runs forward inference on one image.

#### 3. `UPLOAD_DIR` and `_sanitize`

```python
UPLOAD_DIR = current_directory / 'uploads'
```

`_sanitize` strips characters that would break filenames (spaces, slashes, etc.) and caps length so operator names and IDs cannot create absurd paths:

```python
def _sanitize(s: str) -> str:
    return re.sub(r'[^\w\-.]', '_', str(s or ''))[:50] or 'unknown'
```

**Workshop discussion:** If `product_model` were `WIDGET PRO` (with a space), the filename becomes `WIDGET_PRO`. That is why the reporting code uses **`parts[-2]`** for pass/fail — not “the 8th field” — because some meta fields can collapse to multiple underscores when sanitized.

#### 4. `GET /` — health check

Returns plain text so you can verify the process is alive without hitting the model:

```python
@app.route('/')
def health():
    return "Server is up! Model is pre-loaded.", 200
```

#### 5. `GET /report` — aggregate pass/fail from disk

The handler:

1. If `uploads/` does not exist → return zeros.
2. Glob every `*.jpg`.
3. Split the stem on `_`; treat **second-to-last** segment as the label (`pass` or `fail`).
4. Return JSON `{ total, pass, fail }`.

This design assumes every saved file follows the same naming convention as `POST /predict` (see below).

#### 6. `POST /predict` — decode, infer, save, respond

**Step A — Read the file**

```python
file = request.files['file']
img_bytes = file.read()
```

The same bytes are later written to disk, so the saved file matches what was uploaded (before any tensor resize the model uses internally).

**Step B — Preprocess for the model**

```python
image = tf.image.decode_image(img_bytes, channels=3, expand_animations=False)
image = tf.image.resize(image, (288, 288))
image = tf.cast(image, tf.float32)
image = tf.expand_dims(image, axis=0)
```

The network expects a fixed input size (288×288) and a batch dimension.

**Step C — Inference and label**

```python
raw_prediction = model(image, training=False).numpy()[0][0]
label = "fail" if raw_prediction >= 0.5 else "pass"
confidence = float(1 - raw_prediction) if label == "pass" else float(raw_prediction)
```

Walk through this slowly with the class:

- The model outputs a **single scalar** `raw_prediction` (sigmoid-style: higher → more “fail-like” in this project).
- Threshold **0.5** decides pass vs fail.
- **Confidence** is defined as the model’s strength for the **chosen** label (pass → \(1 - \text{raw}\), fail → raw).

**Step D — Save with metadata**

Form fields from the client (`product_model`, `station_number`, etc.) are read with `request.form.get(k)`, sanitized, and concatenated with timestamp, label, and confidence into one underscore-separated filename, then `img_bytes` is written.

**Step E — JSON response**

```python
return jsonify({"prediction": label, "confidence": confidence})
```

The mobile app maps this into its own types (including multiplying confidence by 100 for display in some screens — see Session 2 trace).

#### 7. `if __name__ == '__main__'` — bind to all interfaces

```python
app.run(host='0.0.0.0', port=5000, debug=False)
```

`0.0.0.0` is what allows a phone on the same Wi‑Fi to use `http://<laptop-ip>:5000`.

---

### Code walkthrough: Phone → `POST /predict`

Tracing the path once as a group fills most of an hour and connects Days 3–4.

#### 1. Where is the server URL?

**File:** `constants/config.ts`

- `API_BASE_URL` — must be the laptop’s IP and port (e.g. `http://192.168.1.50:5000`).
- `DEMO_MODE` — when `true`, `predictImage` never calls the network (useful for UI-only practice; no files in `uploads/`).

#### 2. Building the multipart request

**File:** `services/api.ts` — function `predictImage`

- Creates a `FormData` and appends **`file`** with the **captured** (cropped, compressed) inspection image URI.
- For each metadata field, appends the same **keys** the server expects: `product_model`, `station_number`, `production_line`, `production_shift`, `operator`, `device_id`.

**Align with Python:** Those keys match `meta_keys` in `predict()` when building the filename.

#### 3. When is `predictImage` called?

**File:** `app/camera.tsx` — inside `handleTakePicture`

After `takePictureAsync`, the photo may be cropped to match the on-screen guide (`cropToGuideBox`), then compressed. The call passes `inspectionData` fields into `predictImage` as metadata so every save in `uploads/` carries station, line, shift, and operator.

#### 4. Mapping the JSON response for the UI

Still in `services/api.ts`, the real server returns `prediction` and `confidence` (0–1). The client normalizes to what screens expect:

- `confidence` is scaled: `(raw.confidence ?? raw.score) * 100` for display as a percentage in several places.
- `justification` is **filled in on the client** from short template strings when using the real API (the Flask handler does not return a justification field today).

**Advanced note:** `predictImage` accepts a first argument for the reference product image URI; the current Flask endpoint only consumes **`file`** (the capture). The reference image is part of the app’s API shape for flexibility / demos. The model in this workshop is trained on the capture alone.

---

### Optional mini-challenge (Session 1 extension)

If you finish early, try one of these as a pair exercise:

1. **Extend `/report`** — Return pass/fail counts **per operator** by parsing each filename (hint: operator is the segment before `device_id` in the current naming scheme — draw the index map on a whiteboard).
2. **Safety guard** — What should `/report` do if someone drops a random `.jpg` in `uploads/` that does not end with `_pass_0.xx` or `_fail_0.xx`? Sketch improved parsing or filtering.

---

### Where Are the Images Saved?

Every time the mobile app sends a photo to `POST /predict`, the server does two things:

1. Runs the AI model to get a PASS/FAIL prediction
2. **Saves the original image** to the `uploads/` folder with metadata baked into the filename

The `uploads/` folder is automatically created the first time an image is received. It lives inside the server project:

```
deep_learning_celestica_senai_laptop/
├── prediction_app_in_laptop_using_vscode.py
├── uploads/                              ← Images saved here
│   ├── 20260316_143022_WIDGET_PRO_STATION_1_LINE_A_SHIFT_A_ALI_unknown_pass_0.95.jpg
│   ├── 20260316_143045_WIDGET_PRO_STATION_1_LINE_A_SHIFT_A_ALI_unknown_fail_0.62.jpg
│   └── ...
```

---

### Lab 59: Inspect the Uploads Folder

1. Make sure the server is running and you have completed at least one full inspection from the mobile app.
2. Open the `uploads/` folder on the laptop (using File Explorer or terminal):

```bash
cd deep_learning_celestica_senai_laptop/uploads
dir
```

> On macOS/Linux use `ls` instead of `dir`.

3. You should see `.jpg` files with long, descriptive filenames.

---

### Lab 60: Decode the Filename Metadata

Every saved image has a structured filename. Let's break it down:

**Example filename:**

```
20260316_143022_WIDGET_PRO_STATION_1_LINE_A_SHIFT_A_ALI_unknown_pass_0.95.jpg
```

The filename is built from parts separated by underscores. The **last two parts** (before `.jpg`) are always the **prediction label** and **confidence**:

| Part             | Meaning                     | Example                                    |
| ---------------- | --------------------------- | ------------------------------------------ |
| Timestamp        | When the photo was taken    | `20260316_143022` (2026-03-16 at 14:30:22) |
| Product Model    | Which product was inspected | `WIDGET_PRO`                               |
| Station Number   | Which station               | `STATION_1`                                |
| Production Line  | Which line                  | `LINE_A`                                   |
| Production Shift | Which shift                 | `SHIFT_A`                                  |
| Operator         | Who did the inspection      | `ALI`                                      |
| Device ID        | Which phone/device          | `unknown`                                  |
| **Prediction**   | AI result                   | `pass` or `fail`                           |
| **Confidence**   | How sure the AI is          | `0.95` (95%)                               |

Here is the code from `prediction_app_in_laptop_using_vscode.py` that builds the filename:

```python
ts = datetime.now().strftime('%Y%m%d_%H%M%S')
meta_keys = ['product_model', 'station_number', 'production_line',
             'production_shift', 'operator', 'device_id']
meta = {k: _sanitize(request.form.get(k)) for k in meta_keys}
parts = [
    ts,
    meta['product_model'],
    meta['station_number'],
    meta['production_line'],
    meta['production_shift'],
    meta['operator'],
    meta['device_id'],
    label,
    f"{confidence:.2f}",
]
filename = '_'.join(parts) + '.jpg'
```

> **Key insight:** Every image is self-documenting. You don't need a database — the filename **is** the database record. You can sort, filter, and analyze images just by reading filenames.

---

### Lab 61: Understand the /report Endpoint

The server has a `GET /report` endpoint that reads the `uploads/` folder and counts how many images passed vs. failed.

1. With the server running, open a browser and go to:

```
http://192.168.x.x:5000/report
```

(Use your actual laptop IP address.)

2. You will see a JSON response like:

```json
{
  "total": 5,
  "pass": 3,
  "fail": 2
}
```

Here is the server code that powers this:

```python
@app.route('/report', methods=['GET'])
def report():
    """Return prediction counts from saved photos in uploads/."""
    if not UPLOAD_DIR.exists():
        return jsonify({"total": 0, "pass": 0, "fail": 0})
    pass_count = 0
    fail_count = 0
    for f in UPLOAD_DIR.glob("*.jpg"):
        parts = f.stem.split("_")
        if len(parts) >= 2:
            label = parts[-2].lower()
            if label == "pass":
                pass_count += 1
            elif label == "fail":
                fail_count += 1
    return jsonify({
        "total": pass_count + fail_count,
        "pass": pass_count,
        "fail": fail_count
    })
```

The logic:

1. List all `.jpg` files in `uploads/`
2. Split each filename by `_`
3. The **second-to-last** part is always the label (`pass` or `fail`)
4. Count totals and return JSON

---

### Lab 62: Test the Report Endpoint with curl

You can also call the report endpoint from the terminal:

```bash
curl http://192.168.x.x:5000/report
```

Or from the laptop itself:

```bash
curl http://127.0.0.1:5000/report
```

This returns the same JSON. Useful for automation or scripting.

---

### Lab 63: Test the Predict Endpoint with curl

You can simulate the mobile app by sending an image from the terminal:

```bash
curl -X POST -F "file=@path/to/test_image.jpg" -F "product_model=TEST_PRODUCT" -F "station_number=STATION_1" -F "operator=ALI" http://127.0.0.1:5000/predict
```

The response will look like:

```json
{
  "prediction": "pass",
  "confidence": 0.92
}
```

And a new file will appear in `uploads/` with all the metadata in the filename.

---

### Lab 64: Analyze Inspection Data Using Filenames

Since all metadata is encoded in the filename, you can extract insights by parsing filenames. Here are useful analyses:

**Count failures by operator (using terminal):**

On **Windows PowerShell**:

```powershell
Get-ChildItem uploads/*.jpg | Where-Object { $_.Name -match '_fail_' } | ForEach-Object { $_.Name }
```

On **macOS/Linux**:

```bash
ls uploads/ | grep '_fail_'
```

**Count inspections per shift:**

On **Windows PowerShell**:

```powershell
Get-ChildItem uploads/*.jpg | ForEach-Object { $_.Name } | Select-String -Pattern 'SHIFT_[ABC]' -AllMatches | ForEach-Object { $_.Matches.Value } | Group-Object | Select-Object Name, Count
```

---

### Lab 65: Use AI to Analyze Inspection Data

Here is a sample prompt you can use with ChatGPT, Claude, or any AI assistant to gain insights from your inspection data:

> **Copy and paste this prompt, then paste your filenames after it:**

```
I have a folder of factory inspection images. Each filename contains metadata in this format:
{timestamp}_{product_model}_{station_number}_{production_line}_{production_shift}_{operator}_{device_id}_{pass|fail}_{confidence}.jpg

Here are my filenames:
[paste your filenames here]

Please analyze this data and tell me:
1. Overall pass/fail rate
2. Which operator has the highest failure rate?
3. Which station has the most failures?
4. Which shift has the most failures?
5. Are there any patterns in the timestamps (e.g., failures clustering at certain times)?
6. What is the average confidence score for pass vs. fail predictions?
7. Any recommendations for improving quality?
```

To get the list of filenames:

On **Windows**:

```bash
dir uploads /b
```

On **macOS/Linux**:

```bash
ls uploads/
```

Copy the output and paste it into the AI prompt.

> **This is powerful.** Without building any dashboard or database, you can get actionable insights just from filenames + an AI assistant. This is a practical technique for small-scale factory inspection systems.

---

### Day 4 — Session 1 Recap

You now understand:

- The **pacing** options for a full-day server deep dive (model load, routes, inference, save, report)
- How **`prediction_app_in_laptop_using_vscode.py`** is structured: threading config, model path, `_sanitize`, `/`, `/report`, `/predict`, and `0.0.0.0` binding
- Why **label and confidence** in the filename are always the **last two** segments before `.jpg`
- How the **mobile app** builds `FormData` (`services/api.ts`) and how **`app/camera.tsx`** supplies metadata that becomes part of the filename
- The `uploads/` folder stores every image the server receives
- Each filename is a self-documenting record with timestamp, product, station, line, shift, operator, device, prediction, and confidence
- The `GET /report` endpoint counts pass/fail totals by parsing filenames
- How to test the server endpoints using curl
- How to extract insights from filenames using terminal commands or AI prompts
- That no separate database is needed — the filesystem **is** the data store

---

# Day 4 — Session 2: Inspection Summary & End-to-End Flow

> **Goal:** Understand the final Summary screen, walk through the complete inspection cycle, customize the summary, and test the full end-to-end flow from Welcome to Done.

### Suggested pacing (~4 hours)

| Block | Time | Focus |
| ----- | ---- | ----- |
| Navigation & provider | 30–40 min | `app/_layout.tsx` stack + `InspectionProvider` — where global state lives |
| Context deep dive | 45–60 min | `services/inspection-context.tsx`: types, `advanceToNextPoint`, `reset` |
| Camera → Summary trace | 45–60 min | `app/camera.tsx` `handleNext` line-by-line; relation to `app/product.tsx` |
| Summary screen | 45 min | `app/summary.tsx` structure, guard `useEffect`, modal, styles |
| Labs 66–72 | 60–90 min | UI tweaks + full E2E test; compare phone results with `/report` |
| Buffer / demos / Q&A | 30–45 min | DEMO_MODE, `result.tsx` route, troubleshooting |

---

### Code walkthrough: Navigation stack (`app/_layout.tsx`)

The workshop flow uses **Expo Router** with a **Stack** above the tabbed welcome area.

```tsx
<InspectionProvider>
  <ThemeProvider value={DefaultTheme}>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="selection" options={{ title: 'Select Details' }} />
      <Stack.Screen name="product" options={{ title: 'Product View' }} />
      <Stack.Screen name="camera" options={{ title: 'Camera', headerShown: false }} />
      <Stack.Screen name="result" options={{ title: 'Inspection Result' }} />
      <Stack.Screen name="summary" options={{ title: 'Inspection Summary' }} />
      ...
    </Stack>
  </ThemeProvider>
</InspectionProvider>
```

**Teaching points:**

1. **`InspectionProvider` wraps the entire tree** — any screen can call `useInspection()` because it is above the `Stack`.
2. **Order of screens** is not “wizard order”; it is just registration. Actual navigation is driven by `router.push`, `router.replace`, etc., from each screen.
3. **`(tabs)`** is the Welcome / entry tab group (Session 1–2 of the workshop). `router.replace('/(tabs)')` is used after **Done** on Summary to return to a clean entry.

---

### Code walkthrough: Global inspection state (`services/inspection-context.tsx`)

This file is the **single source of truth** for the multi-point inspection.

#### Types

- **`InspectionData`** — One object per “job”: product model, image id, line, station, shift, operator, device id. Set on the Selection screen.
- **`InspectionResult`** — One object per **completed capture**: local `imageUri`, `PASS`/`FAIL`, `confidence`, `justification`.

#### State variables

| State | Role |
| ----- | ---- |
| `inspectionData` | Who/what is being inspected (metadata for the server filename) |
| `inspectionPoints` | List of normalized rectangles for red boxes (from `generateInspectionPoints`) |
| `inspectionResults` | Append-only list of each point’s AI outcome |
| `currentPointIndex` | Which point the operator is on (0-based) |

#### Key functions

- **`addInspectionResult`** — `setInspectionResults((prev) => [...prev, result])` — preserves order: result index matches point order when you always advance sequentially.
- **`advanceToNextPoint`** — Increments `currentPointIndex` and returns **`true`** if there is another point (`nextIndex < inspectionPoints.length`), else **`false`**.
- **`reset`** — Clears data, points, results, and index — used when the operator finishes the job and returns to Welcome.

**Whiteboard exercise:** Draw `currentPointIndex` as a cursor moving along `inspectionPoints`. When it reaches the end, the next “Next” after a capture should go to **Summary**, not Product.

---

### Code walkthrough: Camera handoff (`app/camera.tsx` → Summary)

Focus on **`handleNext`** (called after a successful capture and analysis when the user taps **Next**).

1. **Guard** — Requires `capturedPhotoUri` and `analysisResult`.
2. **`addInspectionResult({ ... })`** — Pushes the current photo and model outcome into context.
3. **`const hasMorePoints = advanceToNextPoint()`** — Moves the cursor; capture the boolean.
4. **Clear local camera state** — `setCapturedPhotoUri(null)`, `setAnalysisResult(null)`.
5. **Navigate:**
   - If `hasMorePoints` → `router.replace('/product')` so the operator sees the **next** red box.
   - Else → `router.replace('/summary')` to review **all** results.

**Connection to Product screen:** `app/product.tsx` reads `currentPointIndex` and `inspectionPoints[currentPointIndex]` to position the red overlay. It does not increment the index — the Camera screen does when moving forward.

---

### Code walkthrough: Summary screen structure (`app/summary.tsx`)

Read the file in four layers:

1. **Hooks** — `useInspection()` for `inspectionResults` and `reset`. Local `useState` for `showCompleteModal`.
2. **Guard effect** — `useEffect` with `[inspectionResults.length]`: if the array is empty, `router.replace('/(tabs)')`. That avoids showing an empty summary if someone deep-links or state was cleared.
3. **Main UI** — `ScrollView` maps `inspectionResults` to cards (thumbnail + point label + PASS/FAIL + confidence + optional justification). **Done** sets the modal visible.
4. **Modal** — **Return** calls `handleReturn`: hide modal, `reset()`, `router.replace('/(tabs)')`.

**Display detail:** PASS/FAIL styling uses conditional styles (`passText` / `failText`). Confidence uses `toFixed(2)` after a floor trick to avoid floating noise in the UI.

**Note on `app/result.tsx`:** The stack also registers a **Result** screen used in some flows (params via URL). The main workshop path uses **in-camera** result state then **Summary** for multiple points. Mention `result.tsx` if learners browse the repo so they are not confused by two “result-like” UIs.

---

### The Complete Inspection Flow

Let's map out the entire flow from start to finish:

```
Welcome Screen
  │
  ▼  Tap "Enter"
Selection Screen
  │  (pick product, line, station, shift, operator)
  ▼  Tap "Enter"
Product Screen ◄────────────────────┐
  │  (shows product image + red box │
  │   for current inspection point) │
  ▼  Tap "Next"                     │
Camera Screen                       │
  │  (live camera + guide box)      │
  │  Tap "Take Picture"             │
  │  → Photo cropped + compressed   │
  │  → Sent to server /predict      │
  │  → Result shown (PASS/FAIL)     │
  ▼  Tap "Next"                     │
  │                                 │
  ├── More points? ─── YES ─────────┘
  │
  ▼  NO (all points inspected)
Summary Screen
  │  (list of all inspection results)
  ▼  Tap "Done"
Completion Modal
  │  ("All inspections completed")
  ▼  Tap "Return"
Welcome Screen (everything reset)
```

---

### Summary Screen Walkthrough

**File:** `app/summary.tsx`

The Summary screen displays all inspection results in a scrollable list. Each result shows:

1. **Thumbnail** — the cropped photo that was captured
2. **Point label** — "Point 1", "Point 2", etc.
3. **Result** — PASS (green) or FAIL (red)
4. **Confidence** — how confident the AI is (e.g., 95.00%)
5. **Justification** — a short text explanation

#### How data gets here (data flow recap)

Nothing on the Summary screen calls the server. It only **reads** `inspectionResults` from context. Each entry was appended in **`app/camera.tsx`** when the operator tapped **Next** after a successful prediction. That design keeps the Summary simple and fast (offline-capable UI except during capture).

#### List rendering and keys

The list is a `.map` over `inspectionResults`. The workshop code uses `key={index}` because results are appended in order and not reordered. If you later add “delete row” or drag-sort, you would switch to a stable id per result.

#### Confidence display

The template uses `(Math.floor(item.confidence * 100) / 100).toFixed(2)` so the UI shows two decimal places without long floating-point tails. Remember: after `predictImage` in `services/api.ts`, confidence is already on a **0–100** scale for the real API path; `DEMO_MODE` also returns values in that range.

Here is the key rendering code (as in the repo):

```tsx
{
  inspectionResults.map((item, index) => (
    <View key={index} style={styles.resultCard}>
      <Image
        source={{ uri: item.imageUri }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
      <View style={styles.resultInfo}>
        <Text style={styles.pointLabel}>Point {index + 1}</Text>
        <Text
          style={[
            styles.resultText,
            item.result === 'PASS' ? styles.passText : styles.failText,
          ]}
        >
          {item.result}
        </Text>
        <Text style={styles.confidenceText}>
          Confidence: {(Math.floor(item.confidence * 100) / 100).toFixed(2)}%
        </Text>
        {item.justification ? (
          <Text style={styles.justificationText} numberOfLines={2}>
            {item.justification}
          </Text>
        ) : null}
      </View>
    </View>
  ))
}
```

The `inspectionResults` array comes from the global state (`inspection-context.tsx`). Each time the Camera screen gets a result from the server, it adds an entry:

```tsx
addInspectionResult({
  imageUri: capturedPhotoUri,
  result: analysisResult.result, // 'PASS' or 'FAIL'
  confidence: analysisResult.confidence,
  justification: analysisResult.justification,
});
```

#### Styles worth pointing out in class

Open `StyleSheet.create` at the bottom of `summary.tsx`:

- **`resultCard`** — `flexDirection: 'row'` lays thumbnail left, text right; `'#F5F5F5'` separates cards from the white page.
- **`thumbnail`** — fixed 80×80; `resizeMode="cover"` crops to fill the square (consistent grid look).
- **`modalOverlay`** — semi-transparent black; **`modalContent`** — 80% width card for the completion message.

Learners doing Labs 66–71 are editing these same objects — encourage them to predict the visual change before saving (e.g. “if we only change `passText`, what stays the same?”).

---

### The "Done" Button Flow

When the operator taps **Done**:

1. **Local modal state** — `setShowCompleteModal(true)` runs first; the screen does not navigate yet, so the list is still visible behind the dimmer.
2. A modal appears with the message: _"All inspections have been completed. Test completed. Data saved."_
3. The operator taps **Return**.
4. **`handleReturn`** runs: hide modal, then **`reset()`** on context, then **`router.replace('/(tabs)')`**.

`reset()` clears all inspection-related state:

```tsx
const reset = () => {
  setInspectionData(null); // Clears selected product/station/etc.
  setInspectionPoints([]); // Clears the inspection points
  setInspectionResults([]); // Clears all results
  setCurrentPointIndex(0); // Resets the point counter
};
```

5. The Welcome / tabs screen appears; the next operator can start a brand-new inspection cycle.

**Compare:** `result.tsx` also has a Done / modal / `reset` pattern for alternate flows — useful to contrast in Q&A (same outcome: context cleared + `replace('/(tabs)')`).

---

### Trace-along exercise (~25 minutes)

In pairs, with one phone or simulator and the IDE open:

1. Set a **breakpoint** or add a **temporary** `console.log` in `addInspectionResult` (context) and in `handleNext` (camera).
2. Run one **two-point** inspection.
3. Confirm the **order** of logs: first capture → first `addInspectionResult` → navigate to Product → second capture → second `addInspectionResult` → navigate to Summary.
4. On the laptop, open **`uploads/`** and confirm **two** new files whose timestamps match the session.

This ties Session 2 UI state to Session 1 server artifacts.

---

### Lab 66: Change the Summary Screen Title

**File:** `app/summary.tsx`

1. Find:

```tsx
<Text style={styles.title}>Inspection Summary</Text>
```

2. Change it to:

```tsx
<Text style={styles.title}>Quality Report</Text>
```

3. **Save** and check.

---

### Lab 67: Change the Summary Title Style

**File:** `app/summary.tsx`

1. Find the `title` style:

```tsx
title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 24,
  color: '#000000',
  textAlign: 'center',
},
```

2. Change it to:

```tsx
title: {
  fontSize: 28,
  fontWeight: 'bold',
  marginBottom: 24,
  color: '#1565C0',
  textAlign: 'center',
},
```

3. **Save** and check — the title is now blue and larger.

---

### Lab 68: Change the Done Button Color

**File:** `app/summary.tsx`

1. Find the `doneButton` style:

```tsx
doneButton: {
  backgroundColor: '#000000',
  padding: 16,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 20,
},
```

2. Change it to:

```tsx
doneButton: {
  backgroundColor: '#4CAF50',
  padding: 16,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 20,
},
```

3. **Save** and check — the Done button is now green.

---

### Lab 69: Change the Completion Modal Message

**File:** `app/summary.tsx`

1. Find the modal text:

```tsx
<Text style={styles.modalTitle}>Complete</Text>
<Text style={styles.modalMessage}>
  All inspections have been completed. Test completed. Data saved.
</Text>
```

2. Change it to your own message:

```tsx
<Text style={styles.modalTitle}>Inspection Complete!</Text>
<Text style={styles.modalMessage}>
  All inspection points have been checked. Results have been recorded on the server.
</Text>
```

3. **Save** and test by completing a full inspection cycle to see the modal.

---

### Lab 70: Change the Return Button Text

**File:** `app/summary.tsx`

1. Find:

```tsx
<TouchableOpacity style={styles.returnButton} onPress={handleReturn}>
  <Text style={styles.returnButtonText}>Return</Text>
</TouchableOpacity>
```

2. Change the text:

```tsx
<TouchableOpacity style={styles.returnButton} onPress={handleReturn}>
  <Text style={styles.returnButtonText}>Start New Inspection</Text>
</TouchableOpacity>
```

3. **Save** and check — the modal button now says "Start New Inspection" instead of "Return".

---

### Lab 71: Change the Result Card Colors

**File:** `app/summary.tsx`

1. Find the pass and fail text colors:

```tsx
passText: {
  color: '#228B22',
},
failText: {
  color: '#DC143C',
},
```

2. Change them to more vivid colors:

```tsx
passText: {
  color: '#00C853',
},
failText: {
  color: '#FF1744',
},
```

3. **Save** and check — PASS and FAIL results are now brighter.

---

### Lab 72: Full End-to-End Test

This is the final integration test. Complete the entire flow:

1. **Welcome Screen** → Tap **Enter**
2. **Selection Screen** → Pick a product, line, station, shift, operator → Tap **Enter**
3. **Product Screen** → See the red box on inspection point 1 → Tap **Next**
4. **Camera Screen** → Align the component inside the guide box → Tap **Take Picture**
5. Wait for the AI prediction → See PASS or FAIL with confidence → Tap **Next**
6. **Product Screen** → See the red box on inspection point 2 → Tap **Next**
7. **Camera Screen** → Take another picture → Get result → Tap **Next**
8. _(Repeat for all remaining inspection points)_
9. **Summary Screen** → Review all results with thumbnails, PASS/FAIL, confidence
10. Tap **Done** → See the completion modal
11. Tap **Return** (or **Start New Inspection** if you completed Lab 70) → Back to Welcome screen, ready for next product

**Meanwhile, on the laptop:**

- Check the server terminal for log entries
- Open the `uploads/` folder — you should see new `.jpg` files
- Visit `http://192.168.x.x:5000/report` in a browser — totals should match

> **Congratulations!** You have just completed a full AI-powered factory inspection from your phone, with real-time predictions from a deep learning model running on a laptop.

---

### Day 4 — Session 2 Recap

You now understand:

- **Suggested pacing** for a 4-hour session mixing lecture, trace-alongs, and labs
- How **`app/_layout.tsx`** registers the stack and wraps the app in **`InspectionProvider`**
- **`inspection-context.tsx`**: `InspectionData`, `InspectionResult`, `addInspectionResult`, `advanceToNextPoint`, and `reset`
- How **`app/camera.tsx` `handleNext`** decides between **Product** (more points) and **Summary** (done)
- How **`app/summary.tsx`** guards empty results, renders the list, and completes with modal + `reset` + `replace('/(tabs)')`
- The complete inspection flow from Welcome to Done and back
- How the Summary screen renders all inspection results from the shared state (no extra fetch)
- How the "Done" → modal → "Return" flow works, including state reset
- How to customize the Summary screen (title, colors, button text, modal message)
- How to run a **trace-along** exercise tying context logs to new files in `uploads/`
- How to verify the full pipeline end-to-end: mobile app → server → uploads → report

---

> **Checkpoint:** You have completed the original 4-day, 72-lab workshop. Days 5–6 extend the app into a configurable product catalog and an OpenRouter-powered reference-photo inspection API.

---

# Day 5 — Session 1: Product Catalog CRUD

> **Goal:** Replace hardcoded product choices with a local product catalog that operators can create, edit, delete, and reuse across app launches.

### Suggested pacing (~4 hours)

| Block | Time | Focus |
| ----- | ---- | ----- |
| Feature overview | 20 min | Why product CRUD matters for real factories |
| Screen tour | 35–45 min | `products`, `product-form`, `selection` |
| Data model walkthrough | 45 min | `ProductRecord`, `InspectionPointRecord`, IDs, timestamps |
| Labs 73–77 | 75–90 min | Create, edit, delete products |
| Persistence deep dive | 35–45 min | AsyncStorage and app document files |
| Labs 78–80 | 45–60 min | Restart test, style changes, QA checklist |
| Buffer / Q&A | 20–30 min | Common mistakes and recovery |

---

### Why Product CRUD?

Earlier workshop days used fixed product names from `constants/mock-data.ts`. That is good for learning UI, but a real inspection app needs operators or supervisors to manage the product catalog without changing source code.

Day 5 introduces **CRUD**:

| Letter | Meaning | In this app |
| ------ | ------- | ----------- |
| C | Create | Add a new product |
| R | Read | Load and display saved products |
| U | Update | Rename an existing product |
| D | Delete | Remove a product and its inspection points |

The product catalog is stored locally on the phone using AsyncStorage. Reference photos are stored as files in the app's document directory.

---

### Product Catalog Screen Map

```
Welcome Screen
  |
  | Tap "Manage products"
  v
Passcode Prompt
  |-- Cancel -> Welcome Screen
  |
  | Enter 1234
  v
Products Screen
  |-- Add product -> Product Form
  |-- Tap product -> Product Form (edit)
  |-- Points -> Inspection Points List
  |-- Delete -> Confirmation -> Remove product
```

Key files:

| File | Purpose |
| ---- | ------- |
| `app/products.tsx` | Prompts for the manage passcode, lists saved products, refreshes on focus, deletes products |
| `app/product-form.tsx` | Creates or edits one product |
| `app/selection.tsx` | Uses saved products in the operator workflow |
| `services/product-catalog.ts` | Loads, saves, updates, deletes product records |

---

### Data Model Walkthrough

**File:** `services/product-catalog.ts`

The product catalog has two main types:

```tsx
export interface InspectionPointRecord {
  id: string;
  name: string;
  referenceImageUri: string;
  specNotes?: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  inspectionPoints: InspectionPointRecord[];
  createdAt: string;
  updatedAt: string;
}
```

Important ideas:

1. A **product** can have many inspection points.
2. Each **inspection point** has its own reference image.
3. Product IDs and point IDs are generated in code.
4. `createdAt` and `updatedAt` help track when a product was made or changed.
5. The whole product array is saved under one AsyncStorage key: `@synergrowth_products_v1`.

---

### Lab 73: Open the Product Management Flow

1. Start the app:

```bash
npx expo start
```

2. Open the app in Expo Go.
3. On the Welcome screen, tap **Manage products**.
4. When prompted, enter the numeric passcode:

```text
1234
```

5. You should see the Products screen.

You can also reach the same protected screen from the Selection screen by tapping **Manage products & reference photos**.

If you tap **Cancel** on the passcode prompt, the app returns to the Welcome screen.

If there are no products yet, the empty message appears:

```tsx
No products yet. Tap Add product.
```

**File to inspect:** `app/products.tsx`

Find:

```tsx
ListEmptyComponent={
  <Text style={styles.empty}>No products yet. Tap Add product.</Text>
}
```

---

### Lab 74: Create a New Product

1. On the Products screen, tap **Add product**.
2. Enter a product name, for example:

```text
Breaker Panel SKU-123
```

3. Tap **Create & add points**.
4. The app should take you to the Inspection Points screen for that product.

**Code walkthrough:** `app/product-form.tsx`

When creating a product, the app builds a new record:

```tsx
record = {
  id: createProductId(),
  name: trimmed,
  inspectionPoints: [],
  createdAt: now,
  updatedAt: now,
};
```

Then it saves:

```tsx
await upsertProduct(record);
```

---

### Lab 75: Read How Products Load and Refresh

**File:** `app/products.tsx`

After the passcode is accepted, the screen loads products every time it becomes active:

```tsx
useFocusEffect(
  useCallback(() => {
    if (!isUnlocked) return;
    void refresh();
  }, [isUnlocked, refresh])
);
```

That is important because the screen waits until the passcode is correct, then refreshes when you leave the screen, create or edit something, and come back to see the latest data.

The `refresh` function calls:

```tsx
setProducts(await loadProducts());
```

And `loadProducts()` reads from AsyncStorage:

```tsx
const raw = await AsyncStorage.getItem(STORAGE_KEY);
```

---

### Lab 76: Edit an Existing Product

1. Go back to the Products screen.
2. Tap the product card, not the **Points** button.
3. Change the product name.
4. Tap **Save & manage points**.
5. Return to Products and confirm the card title changed.

**Code walkthrough:** `app/product-form.tsx`

Edit mode is detected from the URL parameter:

```tsx
const { id } = useLocalSearchParams<{ id?: string }>();
const isEdit = Boolean(id);
```

If editing, the app preserves existing inspection points:

```tsx
record = {
  ...existing,
  name: trimmed,
  updatedAt: now,
};
```

---

### Lab 77: Delete a Product

1. On the Products screen, tap **Delete** on a product card.
2. Confirm the alert.
3. The product disappears from the list.

Deleting a product also deletes the reference photo files for all its inspection points.

**File:** `services/product-catalog.ts`

```tsx
export async function deleteProduct(id: string): Promise<void> {
  const product = await getProduct(id);
  if (!product) return;
  for (const pt of product.inspectionPoints) {
    await deleteFileIfInCatalog(pt.referenceImageUri);
  }
  const products = (await loadProducts()).filter((p) => p.id !== id);
  await saveProducts(products);
}
```

This avoids leaving unused image files in app storage after a product is removed.

---

### Lab 78: Understand Local Storage

**File:** `services/product-catalog.ts`

Products are saved as JSON:

```tsx
export async function saveProducts(products: ProductRecord[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}
```

When the app reloads, JSON is parsed back into an array:

```tsx
const parsed = JSON.parse(raw) as ProductRecord[];
return Array.isArray(parsed) ? parsed : [];
```

**Key insight:** This is local storage on the phone. It is not shared across phones. If two phones need the same catalog, a future version would sync products to a backend database.

---

### Lab 79: Change Product Catalog Labels or Styles

**File:** `app/products.tsx`

Try one small UI customization.

Change:

```tsx
<Text style={styles.title}>Products</Text>
```

To:

```tsx
<Text style={styles.title}>Product Catalog</Text>
```

Or change the card background:

```tsx
card: {
  backgroundColor: '#F5F5F5',
  borderRadius: 8,
  marginBottom: 12,
  overflow: 'hidden',
},
```

To:

```tsx
card: {
  backgroundColor: '#EEF5FF',
  borderRadius: 8,
  marginBottom: 12,
  overflow: 'hidden',
},
```

---

### Lab 80: Test Product Persistence

This lab verifies CRUD works after reload.

1. Create two products.
2. Edit one product name.
3. Delete the other product.
4. Close Expo Go completely.
5. Reopen the app.
6. Go to **Manage products** and enter passcode `1234`.

Expected result:

- The edited product is still there.
- The deleted product is gone.
- The product count and names match your last changes.

---

### Day 5 — Session 1 Recap

You now understand:

- What CRUD means in a mobile app
- How the Products screen lists local product records
- How the manage products screen is protected by a simple numeric passcode
- How `product-form.tsx` creates and edits products
- How `services/product-catalog.ts` stores product data with AsyncStorage
- Why deleting a product also cleans up its reference image files
- How the Selection screen can use dynamic products instead of hardcoded names

---

# Day 5 — Session 2: Inspection Point CRUD & Reference Photos

> **Goal:** Add, edit, delete inspection points for each product, attach required reference photos, and use those reference photos during inspection capture.

### Suggested pacing (~4 hours)

| Block | Time | Focus |
| ----- | ---- | ----- |
| Inspection point concept | 20 min | Product -> many points -> one reference photo each |
| Point list tour | 35 min | `points-list.tsx` |
| Point form tour | 45–60 min | Name, expected specs, reference photo |
| Labs 81–86 | 90 min | Add, edit, replace photo, delete point |
| Capture flow trace | 45 min | `selection` -> `product` -> `camera` |
| Labs 87–88 | 45–60 min | Start session and verify reference photo appears |
| Buffer / Q&A | 20–30 min | Photo permissions and validation |

---

### Inspection Point Data Flow

```
Product
  |
  | has many
  v
Inspection Points
  |
  | each has
  v
Reference Photo + Expected Specs
  |
  | used during
  v
Camera Capture and API Analysis
```

An inspection point answers:

1. **What area should the operator inspect?**
2. **What reference photo should the captured photo match?**
3. **What specs or markings should the AI pay attention to?**

---

### Lab 81: Open the Inspection Point List

1. Go to **Manage products** and enter passcode `1234`.
2. Create or select a product.
3. Tap **Points**.

You should see the Inspection Points screen.

**File:** `app/points-list.tsx`

The list shows the point name and whether a reference photo exists:

```tsx
{item.referenceImageUri ? 'Reference photo set' : 'No reference photo'}
```

---

### Lab 82: Add a Point Name and Expected Specs

1. Tap **Add inspection point**.
2. Enter a point name:

```text
Main rating label
```

3. Enter expected specs:

```text
Must show 40A, 230V, CE mark, and matching part number.
```

The expected specs are optional, but they are useful because they are sent to the AI during Day 6.

**File:** `app/point-form.tsx`

```tsx
<TextInput
  style={[styles.input, styles.multiline]}
  value={specNotes}
  onChangeText={setSpecNotes}
  placeholder="Free text for expected markings..."
  multiline
/>
```

---

### Lab 83: Add a Required Reference Photo

1. On the point form, tap **Add reference photo**.
2. Choose camera or photo library.
3. Select a clear approved reference image.
4. Confirm that a preview appears.
5. Tap **Save**.

The app requires a reference photo before saving:

```tsx
if (!referenceImageUri) {
  Alert.alert('Validation', 'Pick a reference photo for this point.');
  return;
}
```

---

### Lab 84: Understand Reference Photo Storage

When you pick a photo, the original URI may point to a temporary location. The app copies it into persistent app storage:

```tsx
const uri = await copyImageToPersistent(picked);
```

**File:** `services/product-catalog.ts`

```tsx
export async function copyImageToPersistent(sourceUri: string): Promise<string> {
  await ensureImagesDir();
  const catalogDir = getCatalogImagesDir();
  const base = sourceUri.split('/').pop() ?? 'img.jpg';
  const ext =
    base.includes('.') ? base.split('.').pop()?.split('?')[0] ?? 'jpg' : 'jpg';
  const dest = `${catalogDir}${generateId()}.${ext}`;
  await FileSystem.copyAsync({ from: sourceUri, to: dest });
  return dest;
}
```

**Key insight:** The app saves the reference photo URI, not the image bytes inside AsyncStorage. AsyncStorage stores metadata; the file system stores image files.

---

### Lab 85: Edit a Point and Replace Its Photo

1. Open an existing point.
2. Change the point name or expected specs.
3. Tap **Change reference photo**.
4. Pick a new image.
5. Tap **Save**.

When replacing the photo, the old catalog image is deleted:

```tsx
if (referenceImageUri) {
  await deleteFileIfInCatalog(referenceImageUri);
}
setReferenceImageUri(uri);
```

This keeps local storage clean.

---

### Lab 86: Delete an Inspection Point

1. Return to the Inspection Points list.
2. Tap **Delete** on a point.
3. Confirm the alert.

The app removes the point from the product:

```tsx
inspectionPoints: p.inspectionPoints.filter((x) => x.id !== pointId),
```

If the point had a reference image, it is also deleted:

```tsx
if (removed?.referenceImageUri) {
  await deleteFileIfInCatalog(removed.referenceImageUri);
}
```

---

### Lab 87: Start Inspection from Dynamic Products

1. Return to the main inspection flow.
2. Open the Selection screen.
3. Tap the Product dropdown.
4. Choose the product you created.

**File:** `app/selection.tsx`

The selection screen loads products from the catalog:

```tsx
const list = await loadProducts();
setProducts(list);
```

Before starting, it validates:

1. A product is selected.
2. The product still exists.
3. The product has at least one inspection point.
4. Every inspection point has a reference photo.

This prevents the operator from starting an incomplete inspection.

---

### Lab 88: Verify Reference Photo in Product and Camera Screens

Run one inspection after adding a product and point.

On the Product screen, you should see:

- The current inspection point number
- The point name
- The expected specs, if provided
- The reference photo

On the Camera screen, you should see a small reference panel above the live camera.

**File:** `app/camera.tsx`

The reference panel uses the active point:

```tsx
<ReferenceCaptureBar point={point} variant="live" />
```

When the operator captures a photo, the app sends both:

1. The compressed reference image
2. The compressed captured image

That is what Day 6's OpenRouter backend compares.

---

### Day 5 — Session 2 Recap

You now understand:

- How inspection points belong to products
- Why every inspection point needs a reference photo
- How expected specs help guide both operators and AI
- How reference photos are copied into app storage
- How point deletion and photo replacement clean up old image files
- How the Selection, Product, and Camera screens use dynamic catalog data

---

# Day 6 — Session 1: OpenRouter Backend & Key Storage

> **Goal:** Set up the FastAPI backend that compares reference photos against captured photos using OpenRouter vision models, and store API keys safely on the backend.

### Suggested pacing (~4 hours)

| Block | Time | Focus |
| ----- | ---- | ----- |
| Architecture overview | 25 min | Mobile app -> FastAPI -> OpenRouter |
| Backend project tour | 35–45 min | `synergrowth-python-api/` structure |
| Key storage | 45 min | `.env`, `.env.example`, Vercel env vars |
| OpenRouter route walkthrough | 60 min | `/health`, `/analyze`, image payloads |
| Labs 89–96 | 90 min | Local run, health check, curl test |
| Buffer / Q&A | 20–30 min | Model choice, threshold, common errors |

---

### Architecture

```
Mobile App
  |
  | POST /analyze
  | product_image + captured_photo + metadata
  v
FastAPI Backend
  |
  | OpenAI-compatible request
  | with OpenRouter key from environment
  v
OpenRouter Vision Model
  |
  | JSON: matching_rate, confidence, explanation
  v
FastAPI Backend
  |
  | JSON: pass/fail response
  v
Mobile App
```

The mobile app does **not** talk to OpenRouter directly. It talks to your backend. The backend owns the secret key.

---

### Important: Where to Store the OpenRouter Key

Never store `OPENROUTER_API_KEY` in the React Native mobile app.

Why?

- Mobile app code can be extracted from the app bundle.
- Anyone with the key could spend your OpenRouter credits.
- A leaked key must be revoked and replaced.

Correct places:

| Environment | Store key here |
| ----------- | -------------- |
| Local backend dev | `synergrowth-python-api/.env` |
| Vercel production | Vercel -> Project -> Settings -> Environment Variables |

Wrong places:

- `constants/config.ts`
- `services/api.ts`
- Any file inside the mobile app repo
- Screenshots or workshop slides that will be shared publicly

---

### Backend Project Structure

The OpenRouter backend lives in a separate repo:

```text
synergrowth-python-api/
├── api/
│   └── index.py          # FastAPI app and routes
├── main.py               # Re-exports app for local uvicorn
├── requirements.txt      # Python dependencies
├── .env.example          # Template for local environment variables
├── vercel.json           # Vercel routing config
└── README.md
```

Key files:

| File | Purpose |
| ---- | ------- |
| `api/index.py` | Main FastAPI app, `/health`, `/analyze`, OpenRouter call |
| `.env.example` | Shows required environment variable names |
| `.env` | Your real local secret values; do not commit |
| `requirements.txt` | FastAPI, OpenAI client, dotenv, multipart support |
| `vercel.json` | Sends Vercel traffic to the API handler |

---

### Lab 89: Open the Backend Project

Open a terminal in the backend folder:

```bash
cd synergrowth-python-api
```

Install dependencies:

```bash
pip install -r requirements.txt
```

If your instructor uses a virtual environment, create and activate it first:

```bash
python -m venv .venv
```

On Windows:

```bash
.venv\Scripts\activate.bat
```

On macOS/Linux:

```bash
source .venv/bin/activate
```

---

### Lab 90: Create Local `.env`

Copy the example file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Open `.env`. It should look like:

```env
OPENROUTER_API_KEY=your-openrouter-key-here
OPENROUTER_MODEL=openai/gpt-4o-mini
MATCHING_THRESHOLD=90
```

---

### Lab 91: Store `OPENROUTER_API_KEY`

1. Go to [OpenRouter API Keys](https://openrouter.ai/settings/keys).
2. Create or copy an API key.
3. Paste it into `.env`:

```env
OPENROUTER_API_KEY=sk-or-v1-...
```

4. Save the file.

**Security checklist:**

- Do not paste the real key into chat.
- Do not commit `.env`.
- Do not put the key in the mobile app.
- If a key leaks, revoke it in OpenRouter and create a new one.

---

### Lab 92: Choose the OpenRouter Model

The default model is:

```env
OPENROUTER_MODEL=openai/gpt-4o-mini
```

For workshop testing, use a vision-capable model. Your instructor may provide a model ID.

The backend reads it here:

```python
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini")
```

---

### Lab 93: Walk Through `/analyze`

**File:** `api/index.py`

The route accepts two required image files:

```python
@app.post("/analyze")
async def analyze(
    product_image: UploadFile = File(...),
    captured_photo: UploadFile = File(...),
    product_model: str | None = Form(None),
    inspection_point: str | None = Form(None),
    expected_specs: str | None = Form(None),
    ...
):
```

Names matter:

| Form field | Meaning |
| ---------- | ------- |
| `product_image` | Approved reference photo |
| `captured_photo` | New photo captured by the operator |
| `product_model` | Product name |
| `inspection_point` | Point name, e.g. "Main rating label" |
| `expected_specs` | Text notes from the point form |

The mobile app must send these exact field names.

---

### Lab 94: Understand Reference vs Captured Photo

The backend converts each uploaded image into a data URL:

```python
ref_url = _data_url(ref_bytes, product_image)
cap_url = _data_url(cap_bytes, captured_photo)
```

Then it sends both images to OpenRouter:

```python
{"type": "image_url", "image_url": {"url": ref_url}},
{"type": "image_url", "image_url": {"url": cap_url}},
```

The prompt tells the model:

```text
Image 1 = REFERENCE (gold standard). Image 2 = CAPTURED (candidate).
```

That order is important.

---

### Lab 95: Run the Backend and Test Health

Start local FastAPI:

```bash
uvicorn main:app --reload
```

The API runs at:

```text
http://127.0.0.1:8000
```

Open:

```text
http://127.0.0.1:8000/health
```

Expected response:

```json
{
  "status": "healthy"
}
```

---

### Lab 96: Test `/analyze` with Two Images

Use two image files: one approved reference and one captured test photo.

```bash
curl -s -X POST "http://127.0.0.1:8000/analyze" \
  -F "product_image=@/path/to/reference.jpg" \
  -F "captured_photo=@/path/to/captured.jpg" \
  -F "product_model=Breaker Panel SKU-123" \
  -F "inspection_point=Main rating label" \
  -F "expected_specs=Must show 40A, 230V, CE mark"
```

Expected response shape:

```json
{
  "prediction": "pass",
  "confidence": 94,
  "matching_rate": 96,
  "explanation": "All critical rating text matches.",
  "justification": "All critical rating text matches.",
  "score": 0.96
}
```

The backend decides pass/fail using:

```python
prediction = "pass" if matching_rate >= MATCHING_THRESHOLD else "fail"
```

With `MATCHING_THRESHOLD=90`, anything below 90 becomes `fail`.

---

### Day 6 — Session 1 Recap

You now understand:

- Why OpenRouter is called from the backend, not directly from the app
- How to store `OPENROUTER_API_KEY` in `.env` locally
- How to store production keys in Vercel Environment Variables
- How `/analyze` receives `product_image`, `captured_photo`, and metadata
- How expected specs influence the AI comparison
- How `matching_rate` and `MATCHING_THRESHOLD` become pass/fail

---

# Day 6 — Session 2: Connect Mobile App to API & Verify

> **Goal:** Point the mobile app at the OpenRouter FastAPI backend, confirm `services/api.ts` sends the right multipart payload, and run a full reference-photo inspection.

### Suggested pacing (~4 hours)

| Block | Time | Focus |
| ----- | ---- | ----- |
| Mobile config | 30 min | `DEMO_MODE`, `API_BASE_URL` |
| API service walkthrough | 45–60 min | `compressImage`, `predictImage`, `FormData` |
| Camera integration | 45 min | Reference photo + captured photo + metadata |
| Labs 97–101 | 75–90 min | Configure and trace the request |
| Production key storage | 35–45 min | Vercel env vars |
| Labs 102–104 | 45–60 min | End-to-end test and troubleshooting |
| Buffer / Q&A | 20–30 min | Network and model issues |

---

### Mobile-to-API Flow

```
Selection Screen
  | selects product and metadata
  v
Product Screen
  | shows reference photo and expected specs
  v
Camera Screen
  | captures operator photo
  | compresses reference + captured photo
  v
services/api.ts
  | POST /analyze
  v
FastAPI + OpenRouter
  | returns pass/fail + explanation
  v
Camera Preview and Summary
```

---

### Lab 97: Turn Off Demo Mode

**File:** `constants/config.ts`

Set:

```tsx
export const DEMO_MODE = false;
```

When `DEMO_MODE` is `true`, the app fakes a prediction locally and never calls the backend. For Day 6 testing, it must be `false`.

---

### Lab 98: Set `API_BASE_URL`

For the deployed Vercel API:

```tsx
export const API_BASE_URL = "https://synergrowth-python-api.vercel.app";
```

For local backend testing from a phone, do not use `localhost`. Your phone's `localhost` is the phone, not your laptop.

Use your laptop IP and start uvicorn on all interfaces:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Then set:

```tsx
export const API_BASE_URL = "http://192.168.x.x:8000";
```

Replace `192.168.x.x` with your laptop's Wi-Fi IP.

---

### Lab 99: Trace the Multipart Request

**File:** `services/api.ts`

The app builds:

```tsx
const ANALYZE_API_URL = `${API_BASE_URL}/analyze`;
```

Then it appends both images:

```tsx
formData.append('product_image', {
  uri: referenceImageUri,
  type: 'image/jpeg',
  name: 'reference.jpg',
} as any);

formData.append('captured_photo', {
  uri: capturedImageUri,
  type: 'image/jpeg',
  name: 'captured.jpg',
} as any);
```

These names match the FastAPI route from Day 6 Session 1:

- `product_image`
- `captured_photo`

---

### Lab 100: Connect Reference Photo + Captured Photo

**File:** `app/camera.tsx`

After capture, the app compresses both images:

```tsx
const compressedReference = await compressImage(activePoint.referenceImageUri);
const compressedCaptured = await compressImage(croppedUri);
```

Then it calls:

```tsx
const response = await predictImage(
  compressedReference,
  compressedCaptured,
  {
    product_model: inspectionData.product_model,
    production_line: inspectionData.production_line,
    station_number: inspectionData.station_number,
    production_shift: inspectionData.production_shift,
    operator: inspectionData.operator,
    device_id: inspectionData.device_id,
    inspection_point: activePoint.name,
    expected_specs: activePoint.specNotes,
  },
);
```

This is the bridge between Day 5 catalog data and Day 6 AI analysis.

---

### Lab 101: Verify Metadata Sent to the API

**File:** `services/api.ts`

Metadata is optional, but very useful:

```tsx
if (metadata.inspection_point)
  formData.append('inspection_point', metadata.inspection_point);
if (metadata.expected_specs)
  formData.append('expected_specs', metadata.expected_specs);
```

The backend includes those fields in the model prompt:

```python
f"inspection_point={inspection_point}" if inspection_point else None,
f"expected_specs={expected_specs}" if expected_specs else None,
```

This helps the AI focus on the exact label, screw, marking, or area being inspected.

---

### Lab 102: Store Production Keys in Vercel

If using the Vercel deployment:

1. Open the Vercel dashboard.
2. Select the `synergrowth-python-api` project.
3. Go to **Settings -> Environment Variables**.
4. Add:

```text
OPENROUTER_API_KEY
OPENROUTER_MODEL
MATCHING_THRESHOLD
```

5. Redeploy the project.

Important:

- Vercel environment variable changes do not affect an already deployed serverless function until redeploy.
- Keep `.env` for local development only.
- Keep production secrets in the deployment platform.

---

### Lab 103: Run a Full OpenRouter-Powered Inspection

1. Confirm backend health:

```text
https://synergrowth-python-api.vercel.app/health
```

2. Confirm mobile config:

```tsx
export const DEMO_MODE = false;
export const API_BASE_URL = "https://synergrowth-python-api.vercel.app";
```

3. In the app, create a product.
4. Add at least one inspection point with:
   - Point name
   - Expected specs
   - Reference photo
5. Start an inspection from the Selection screen.
6. Capture a photo.
7. Wait for analysis.

Expected result:

- The Camera preview shows PASS or FAIL.
- Confidence is shown as a percentage.
- The explanation mentions matched specs or concrete differences.
- The Summary screen includes the result after tapping **Next**.

---

### Lab 104: Troubleshoot Common Errors

| Symptom | Likely cause | Fix |
| ------- | ------------ | --- |
| App still returns fake results | `DEMO_MODE` is `true` | Set `DEMO_MODE = false` |
| `Network request failed` | Wrong `API_BASE_URL`, phone not on same network, backend stopped | Check URL, Wi-Fi, server logs |
| Backend says `OPENROUTER_API_KEY is not configured` | Missing backend environment variable | Add key to `.env` or Vercel env vars, restart/redeploy |
| HTTP 422 from `/analyze` | Missing required form field | Verify `product_image` and `captured_photo` names |
| HTTP 500 `Image analysis failed` | OpenRouter key/model/quota issue | Check backend logs and OpenRouter dashboard |
| Result seems too strict or too lenient | Threshold/model prompt needs tuning | Adjust `MATCHING_THRESHOLD` or model choice |

---

### Day 6 — Session 2 Recap

You now understand:

- How to connect the mobile app to the deployed or local FastAPI backend
- Why `DEMO_MODE = false` is required for real API calls
- Why a phone cannot use `localhost` to reach a laptop server
- How `services/api.ts` sends both reference and captured images to `/analyze`
- How `app/camera.tsx` passes product, inspection point, and expected specs metadata
- How to store production OpenRouter keys in Vercel
- How to run and troubleshoot a full OpenRouter-powered inspection

---

> **Congratulations!** You have completed a 6-day, 104-lab hands-on workshop. You built, customized, and connected a full AI-powered factory inspection system: a React Native mobile app, dynamic product and inspection point CRUD, persistent reference photos, a FastAPI backend, secure OpenRouter key storage, and a reference-vs-captured-photo AI analysis flow.
