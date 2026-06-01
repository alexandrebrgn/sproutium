# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

### 1. Prerequisites

   - Install 'Expo Go' on your mobile device
   - Create a Pl@ntNet API key :
      - Go on [Pl@ntNet API](https://my.plantnet.org/settings/profile)
      - Get the API key
      - Keep it for later

### 2. Install dependencies

   ```bash
   npm install
   ```

### 3. Put your Pl@ntNet API key in your app

   - Copy and move .env.example to .env
   - Put your API key in .env.

   ```typescript
   EXPO_PUBLIC_PLANTNET_API_KEY=your_plantnet_api_key_here
   ```

### 4. Start the app

   ```bash
   npx expo start
   ```

   Be sur your mobile device is on the same network as your local server

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Developers

This project has been developed by a group of 3 students of the formation Bachelor CDA 2025-2026 :

- Lylian **Ball**
- Océane **Guiochet**
- Alexandre **Bourguignon**

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
