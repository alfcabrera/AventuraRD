# AventuraRD — Setup Guide

## 1. Create new Expo project and copy files

```bash
npx create-expo-app@latest AventuraRD --template blank
cd AventuraRD
```

## 2. Install all dependencies

```bash
# Core navigation & expo
npx expo install expo-router expo-font expo-linear-gradient expo-splash-screen expo-status-bar

# Gesture & animation
npx expo install react-native-gesture-handler react-native-reanimated

# Navigation context
npx expo install react-native-screens react-native-safe-area-context

# Maps
npx expo install react-native-maps

# Storage
npx expo install @react-native-async-storage/async-storage

# NativeWind + Tailwind
npm install nativewind tailwindcss

# State management
npm install zustand

# Fonts (Poppins)
npx expo install @expo-google-fonts/poppins

# Icons (included with expo)
npx expo install @expo/vector-icons
```

## 3. Initialize Tailwind

```bash
npx tailwindcss init
```

## 4. Project structure

```
AventuraRD/
├── app/
│   ├── _layout.js           # Root layout with font loading
│   ├── index.js             # Entry redirect logic
│   ├── onboarding.js        # Onboarding flow (3 slides)
│   ├── (auth)/
│   │   ├── _layout.js
│   │   ├── login.js
│   │   └── register.js
│   ├── (tabs)/
│   │   ├── _layout.js       # Tab bar
│   │   ├── index.js         # Home
│   │   ├── explore.js       # Explore with search/filter
│   │   ├── map.js           # Map with markers
│   │   ├── favorites.js     # Saved destinations
│   │   └── profile.js       # User profile
│   └── destination/
│       └── [id].js          # Destination detail
├── components/
│   ├── PrimaryButton.js
│   ├── DestinationCard.js
│   ├── SearchBar.js
│   └── UI.js                # CategoryChip, RatingBadge, EmptyState, ScreenContainer
├── constants/
│   ├── colors.js
│   └── typography.js
├── data/
│   └── destinations.js      # 10 DR destinations + categories
├── store/
│   └── useAppStore.js       # Zustand store (auth, favorites, onboarding)
├── app.json
├── babel.config.js
├── metro.config.js
├── tailwind.config.js
└── global.css
```

## 5. Google Maps API key

For full map support on Android, replace the placeholder in `app.json`:
```json
"config": {
  "googleMaps": {
    "apiKey": "YOUR_ACTUAL_KEY_HERE"
  }
}
```

## 6. Run the app

```bash
npx expo start
```

## Design System

| Token | Value |
|---|---|
| Primary green | `#2F9E62` |
| Secondary blue | `#1A6B9A` |
| Accent orange | `#F4A024` |
| Background | `#F8FAF9` |
| Card | `#FFFFFF` |
| Font | Poppins (400/500/600/700) |

## Features

- **Onboarding**: 3-slide swipeable flow, persisted via AsyncStorage
- **Auth**: Login/Register with simulated API, Google OAuth button
- **Home**: Greeting, search bar, category filter, featured cards + horizontal destination list
- **Explore**: Full search + category filters + grid/list toggle
- **Map**: react-native-maps with colored category markers, tap-to-preview card
- **Favorites**: Persistent saved destinations with animated remove
- **Detail**: Hero image, floating back/fav/share, info chips, sticky reserve button
- **Profile**: Stats card, menu items, logout confirmation
- **State**: Zustand with AsyncStorage persistence for auth + favorites + onboarding
