# Synergrowth Inspection App — Participant Workshop Guide

> **2-Day Hands-On Workshop**
> This guide is your single source of truth. Follow it screen-by-screen, lab-by-lab.
> Every lab is a small, safe change — nothing will break your app.

---

## Table of Contents

- [Introduction: Native vs Hybrid Mobile Apps](#introduction-native-vs-hybrid-mobile-apps)
- [Prerequisites & Installation](#prerequisites--installation)
- [Day 1 — Session 1: Setup & Your First App Launch](#day-1--session-1-setup--your-first-app-launch)
- [Day 1 — Session 2: Project Structure & Welcome Screen Labs](#day-1--session-2-project-structure--welcome-screen-labs)
- [Day 2 — Session 1: Selection Screen & Mock Data Labs](#day-2--session-1-selection-screen--mock-data-labs)
- [Day 2 — Session 2: Product, Component, Camera & Result Screen Labs](#day-2--session-2-product-component-camera--result-screen-labs)
- [Day 2 — Session 3: New Features, Logo & Saving Your Work](#day-2--session-3-new-features-logo--saving-your-work)
- [Quick Reference Cheat Sheet](#quick-reference-cheat-sheet)

---

## Introduction: Native vs Hybrid Mobile Apps

Before we dive into code, let's understand the landscape of mobile app development.

### Native Mobile Apps

A **native app** is built using the platform's own language and tools:

| Platform | Language | IDE |
|----------|----------|-----|
| Android | Kotlin / Java | Android Studio |
| iOS | Swift / Objective-C | Xcode |

**Pros:** Best performance, full access to device hardware, platform-specific UI.
**Cons:** You must write and maintain **two completely separate codebases** — one for Android, one for iOS.

### Hybrid / Cross-Platform Mobile Apps

A **hybrid (cross-platform) app** lets you write **one codebase** that runs on both Android and iOS.

Popular frameworks include:

| Framework | Language | Official Site |
|-----------|----------|---------------|
| React Native | JavaScript / TypeScript | [reactnative.dev](https://reactnative.dev/) |
| Flutter | Dart | [flutter.dev](https://flutter.dev/) |
| .NET MAUI | C# | [learn.microsoft.com/dotnet/maui](https://learn.microsoft.com/en-us/dotnet/maui/) |

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
  Synergrowth{'\n'}Automated{'\n'}Inspection{'\n'}System
</Text>
```

3. Change it to:

```tsx
<Text style={styles.title}>
  My Factory{'\n'}Inspector
</Text>
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
  <Stack.Screen name="selection" options={{ title: 'Select Details' }} />
  <Stack.Screen name="product" options={{ title: 'Product View' }} />
  <Stack.Screen name="component" options={{ title: 'Component Inspection' }} />
  <Stack.Screen name="camera" options={{ title: 'Camera', headerShown: false }} />
  <Stack.Screen name="result" options={{ title: 'Inspection Result' }} />
</Stack>
```

Each `Stack.Screen` name corresponds to a file. For example, `name="selection"` maps to `app/selection.tsx`.

Screens navigate using `router.push()` and `router.replace()`:

```tsx
router.push('/selection');   // Go to selection screen (can go back)
router.replace('/');         // Go to home screen (replaces history)
```

Learn more: [Expo Router — Navigating between pages](https://docs.expo.dev/router/navigating-pages/)

### Core React Native Components

These are the building blocks used across every screen:

| Component | What it does | Learn more |
|-----------|-------------|------------|
| `View` | Container (like a `<div>`) | [View docs](https://reactnative.dev/docs/view) |
| `Text` | Displays text | [Text docs](https://reactnative.dev/docs/text) |
| `Image` | Displays images | [Image docs](https://reactnative.dev/docs/image) |
| `TouchableOpacity` | Pressable button with fade effect | [TouchableOpacity docs](https://reactnative.dev/docs/touchableopacity) |
| `ScrollView` | Scrollable container | [ScrollView docs](https://reactnative.dev/docs/scrollview) |
| `StyleSheet` | Defines styles (like CSS) | [StyleSheet docs](https://reactnative.dev/docs/stylesheet) |
| `TextInput` | Text input field | [TextInput docs](https://reactnative.dev/docs/textinput) |

### Styling in React Native

React Native uses `StyleSheet.create()` instead of CSS files. The syntax is similar to CSS but uses camelCase:

| CSS | React Native |
|-----|-------------|
| `background-color: red;` | `backgroundColor: 'red'` |
| `font-size: 16px;` | `fontSize: 16` |
| `font-weight: bold;` | `fontWeight: 'bold'` |
| `text-align: center;` | `textAlign: 'center'` |
| `border-radius: 8px;` | `borderRadius: 8` |
| `padding: 20px;` | `padding: 20` |
| `margin-bottom: 10px;` | `marginBottom: 10` |

Learn more: [React Native — Style](https://reactnative.dev/docs/style)

### Flexbox Layout

React Native uses **Flexbox** for layout. Key properties:

| Property | What it does |
|----------|-------------|
| `flex: 1` | Take up all available space |
| `flexDirection: 'column'` | Stack children vertically (default) |
| `flexDirection: 'row'` | Stack children horizontally |
| `justifyContent: 'center'` | Center children along main axis |
| `alignItems: 'center'` | Center children along cross axis |

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
<Text style={styles.title}>
  My Factory{'\n'}Inspector
</Text>
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
<Stack.Screen name="selection" options={{ title: 'Select Details' }} />
```

3. Change the title:

```tsx
<Stack.Screen name="selection" options={{ title: 'Station Setup' }} />
```

4. **Save** and navigate to the Selection screen on your phone — the header bar now says "Station Setup".

---

### Lab 15: Change Another Header Title

**File:** `app/_layout.tsx`

1. Find this line:

```tsx
<Stack.Screen name="product" options={{ title: 'Product View' }} />
```

2. Change it to:

```tsx
<Stack.Screen name="product" options={{ title: 'Inspect This Product' }} />
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
export const PRODUCT_MODELS = [
  'PRODUCT_X',
  'PRODUCT_Y',
  'PRODUCT_Z',
];

export const PRODUCTION_LINES = [
  'LINE_A',
  'LINE_B',
  'LINE_C',
];

export const STATION_NUMBERS = [
  'STATION_1',
  'STATION_2',
  'STATION_3',
];

export const PRODUCTION_SHIFTS = [
  'SHIFT_A',
  'SHIFT_B',
  'SHIFT_C',
];

export const OPERATORS = [
  'OPERATOR_1',
  'OPERATOR_2',
  'OPERATOR_3',
];
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
export const PRODUCTION_LINES = [
  'LINE_A',
  'LINE_B',
  'LINE_C',
];
```

3. Add `'LINE_D'` at the end (don't forget the comma after `'LINE_C'`):

```tsx
export const PRODUCTION_LINES = [
  'LINE_A',
  'LINE_B',
  'LINE_C',
  'LINE_D',
];
```

4. **Save** and open the Selection screen on your phone.
5. Tap the **Production Line** dropdown — you should now see `LINE_D` as an option!

---

### Lab 17: Add Two New Operators

**File:** `constants/mock-data.ts`

1. Find the `OPERATORS` array:

```tsx
export const OPERATORS = [
  'OPERATOR_1',
  'OPERATOR_2',
  'OPERATOR_3',
];
```

2. Add your name and a colleague's name:

```tsx
export const OPERATORS = [
  'OPERATOR_1',
  'OPERATOR_2',
  'OPERATOR_3',
  'ALI',
  'SITI',
];
```

3. **Save** and check the Operator dropdown on the Selection screen.

---

### Lab 18: Remove a Station

**File:** `constants/mock-data.ts`

1. Find the `STATION_NUMBERS` array:

```tsx
export const STATION_NUMBERS = [
  'STATION_1',
  'STATION_2',
  'STATION_3',
];
```

2. Remove `'STATION_3'`:

```tsx
export const STATION_NUMBERS = [
  'STATION_1',
  'STATION_2',
];
```

3. **Save** and check the Station Number dropdown — only 2 options remain.

---

### Lab 19: Rename All Product Models

**File:** `constants/mock-data.ts`

1. Find the `PRODUCT_MODELS` array:

```tsx
export const PRODUCT_MODELS = [
  'PRODUCT_X',
  'PRODUCT_Y',
  'PRODUCT_Z',
];
```

2. Replace with your own product names:

```tsx
export const PRODUCT_MODELS = [
  'WIDGET_PRO',
  'WIDGET_LITE',
  'WIDGET_MAX',
  'WIDGET_MINI',
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
    id: 'COMPONENT_1',
    name: 'Component 1',
    coordinates: { x1: 100, y1: 50, x2: 200, y2: 150 },
  },
  {
    id: 'COMPONENT_2',
    name: 'Component 2',
    coordinates: { x1: 250, y1: 50, x2: 350, y2: 150 },
  },
];
```

2. Change the `name` values to something descriptive:

```tsx
export const MOCK_COMPONENTS: Component[] = [
  {
    id: 'COMPONENT_1',
    name: 'Front Panel',
    coordinates: { x1: 100, y1: 50, x2: 200, y2: 150 },
  },
  {
    id: 'COMPONENT_2',
    name: 'Side Connector',
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
    id: 'COMPONENT_1',
    name: 'Front Panel',
    coordinates: { x1: 100, y1: 50, x2: 200, y2: 150 },
  },
  {
    id: 'COMPONENT_2',
    name: 'Side Connector',
    coordinates: { x1: 250, y1: 50, x2: 350, y2: 150 },
  },
  {
    id: 'COMPONENT_3',
    name: 'Back Cover',
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
export const PRODUCTION_SHIFTS = [
  'SHIFT_A',
  'SHIFT_B',
  'SHIFT_C',
];
```

2. Add a night shift:

```tsx
export const PRODUCTION_SHIFTS = [
  'SHIFT_A',
  'SHIFT_B',
  'SHIFT_C',
  'NIGHT_SHIFT',
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
<Text style={styles.hint}>
  Fill up all to proceed
</Text>
```

2. Change it to:

```tsx
<Text style={styles.hint}>
  Please select all fields before proceeding
</Text>
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
const tintColorLight = '#1565C0';
```

4. **Save** — any screen that uses theme colors will now use blue instead of teal.

---

### Where Are the APIs Configured?

> **Note:** Connecting to the live server and testing the full API flow will be covered in the **next workshop session**. For now, here is a brief overview of where the APIs are set up.

Open `services/api.ts`. At the top of the file, you'll see:

```tsx
const API_BASE_URL = 'https://synergrowth-python-api.onrender.com';
const PREDICT_API_URL = 'https://deep-learning-celestica-senai.onrender.com/predict';
const FINAL_API_URL = 'https://deep-learning-celestica-senai.onrender.com/final';
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
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
```

2. Add `Image` to the list:

```tsx
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About This App</Text>

      <Text style={styles.description}>
        This is an automated inspection system{'\n'}
        built with React Native and Expo.
      </Text>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1565C0',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666',
    lineHeight: 24,
  },
  version: {
    fontSize: 14,
    color: '#999999',
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
<Stack.Screen name="result" options={{ title: 'Inspection Result' }} />
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
  router.push('/selection');
};
```

2. Add a new handler function right below it:

```tsx
const handleEnter = () => {
  router.push('/selection');
};

const handleAbout = () => {
  router.push('/about');
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

> **Tip:** Write messages that describe *what* you did. Good: `"Add about page with navigation"`. Bad: `"Changed some files"`.

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

| Command | What It Does |
|---------|-------------|
| `git status` | See which files have changed |
| `git add .` | Stage all changes for commit |
| `git add <file>` | Stage a specific file |
| `git commit -m "message"` | Save staged changes with a description |
| `git push` | Upload commits to GitHub |
| `git pull` | Download latest changes from GitHub |
| `git log --oneline` | View your commit history |

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

| I want to change... | Open this file |
|---------------------|----------------|
| App name, icon, splash screen | `app.json` |
| Product models, lines, operators, shifts, stations | `constants/mock-data.ts` |
| Component names and coordinates | `constants/mock-data.ts` |
| Theme colors and fonts | `constants/theme.ts` |
| Demo Mode on/off | `constants/config.ts` |
| API server URLs | `services/api.ts` |
| Welcome screen (home page) | `app/(tabs)/index.tsx` |
| Selection screen (dropdowns) | `app/selection.tsx` |
| Product screen | `app/product.tsx` |
| Component inspection screen | `app/component.tsx` |
| Camera screen | `app/camera.tsx` |
| Result screen (PASS/FAIL) | `app/result.tsx` |
| Screen titles in header bar | `app/_layout.tsx` |
| About screen | `app/about.tsx` |
| Navigation flow / add new screen | `app/_layout.tsx` + new file in `app/` |
| Global state (shared data) | `services/inspection-context.tsx` |

---

## Useful Links

| Resource | URL |
|----------|-----|
| React Native — Official Docs | [reactnative.dev/docs](https://reactnative.dev/docs/getting-started) |
| Expo — Official Docs | [docs.expo.dev](https://docs.expo.dev/) |
| Expo Router — Navigation | [docs.expo.dev/router](https://docs.expo.dev/router/introduction/) |
| TypeScript — Official Docs | [typescriptlang.org/docs](https://www.typescriptlang.org/docs/) |
| React — Official Docs | [react.dev](https://react.dev/) |
| Node.js — Download | [nodejs.org](https://nodejs.org/) |
| Git — Download | [git-scm.com](https://git-scm.com/) |
| GitHub — Create Account | [github.com](https://github.com/) |
| VS Code — Download | [code.visualstudio.com](https://code.visualstudio.com/) |
| Cursor — Download | [cursor.com](https://www.cursor.com/) |
| Expo Go — Android | [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) |
| Expo Go — iOS | [Apple App Store](https://apps.apple.com/app/expo-go/id982107779) |
| HTML Color Codes | [htmlcolorcodes.com](https://htmlcolorcodes.com/) |

---

## Lab Summary by Session

### Day 1 — Session 1 (Labs 1–7)
| Lab | What You Changed | File |
|-----|-----------------|------|
| 1 | Welcome screen title text | `app/(tabs)/index.tsx` |
| 2 | Title font size | `app/(tabs)/index.tsx` |
| 3 | Title color | `app/(tabs)/index.tsx` |
| 4 | Button background color | `app/(tabs)/index.tsx` |
| 5 | Button text | `app/(tabs)/index.tsx` |
| 6 | Button text size and font weight | `app/(tabs)/index.tsx` |
| 7 | Screen background color | `app/(tabs)/index.tsx` |

### Day 1 — Session 2 (Labs 8–15)
| Lab | What You Changed | File |
|-----|-----------------|------|
| 8 | Button full width | `app/(tabs)/index.tsx` |
| 9 | Button rounded corners | `app/(tabs)/index.tsx` |
| 10 | Added tagline text element | `app/(tabs)/index.tsx` |
| 11 | Button border | `app/(tabs)/index.tsx` |
| 12 | App display name | `app.json` |
| 13 | Splash screen background color | `app.json` |
| 14 | Selection screen header title | `app/_layout.tsx` |
| 15 | Product screen header title | `app/_layout.tsx` |

### Day 2 — Session 1 (Labs 16–26)
| Lab | What You Changed | File |
|-----|-----------------|------|
| 16 | Added new production line | `constants/mock-data.ts` |
| 17 | Added new operators | `constants/mock-data.ts` |
| 18 | Removed a station | `constants/mock-data.ts` |
| 19 | Renamed product models | `constants/mock-data.ts` |
| 20 | Renamed components | `constants/mock-data.ts` |
| 21 | Added a third component | `constants/mock-data.ts` |
| 22 | Added a new shift | `constants/mock-data.ts` |
| 23 | Dropdown background color | `app/selection.tsx` |
| 24 | Dropdown label font size | `app/selection.tsx` |
| 25 | Selection button color | `app/selection.tsx` |
| 26 | Hint text wording | `app/selection.tsx` |

### Day 2 — Session 2 (Labs 27–41)
| Lab | What You Changed | File |
|-----|-----------------|------|
| 27 | Product label text | `app/product.tsx` |
| 28 | Product label font size and color | `app/product.tsx` |
| 29 | Product button color | `app/product.tsx` |
| 30 | Product image size | `app/product.tsx` |
| 31 | Component label style | `app/component.tsx` |
| 32 | Component button color | `app/component.tsx` |
| 33 | Camera guide box color | `app/camera.tsx` |
| 34 | Camera guide box thickness | `app/camera.tsx` |
| 35 | Camera capture button text | `app/camera.tsx` |
| 36 | Camera loading text | `app/camera.tsx` |
| 37 | Result text size | `app/result.tsx` |
| 38 | Confidence text color and size | `app/result.tsx` |
| 39 | Result image border color | `app/result.tsx` |
| 40 | Feedback button colors (green/red) | `app/result.tsx` |
| 41 | Theme tint color | `constants/theme.ts` |

### Day 2 — Session 3 (Labs 42–45 + Git)
| Lab | What You Changed | File |
|-----|-----------------|------|
| 42 | Added logo image to Welcome screen | `app/(tabs)/index.tsx` |
| 43 | Added a second "About" button | `app/(tabs)/index.tsx` |
| 44 | Created a new About screen + registered in navigation | `app/about.tsx`, `app/_layout.tsx` |
| 45 | Wired button to navigate to the About screen | `app/(tabs)/index.tsx` |
| — | Saved work to GitHub (git add, commit, push) | Terminal |

---

> **Congratulations!** You have successfully explored, modified, and customized a React Native (Expo) mobile application across 45 hands-on labs. You created new UI elements, built a brand-new screen with navigation, and learned to save your code to GitHub. You now have practical experience with the codebase and can confidently make UI, data, and structural changes on your own.
