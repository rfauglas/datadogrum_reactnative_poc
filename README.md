This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.
## Step 0: check you configuration.
 Ensure you have those environment variables set
 ```shell
 # React native
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export JAVA_HOME=/usr/lib/jvm/default-java
export PATH=$PATH:$JAVA_HOME/bin
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/10.0/bin
 ```
You could add those to your favorite shell configuration (like ~/.zshrc or ~/.bashrc).
You should also create a .env file:
```.env
DATADOG_CLIENT_TOKEN=<DATADOG_CLIENT_TOKEN>
DATADOG_ENVIRONMENT=<DATADOG_CLIENT_TOKEN>
DATADOG_APPLICATION_ID=<DATADOG_CLIENT_TOKEN>
DATADOG_TRACK_USER_INTERACTIONS=true
DATADOG_TRACK_XHR_RESOURCES=true
DATADOG_TRACK_ERRORS=true
DATADOG_PROXY_HOST=<proxy host or IP>
DATADOG_PROXY_PORT=8080
DATADOG_PROXY_TYPE=http
```
Proxy configuration entries are optional: they should  be removed if not used.
DATADOG_PROXY_TYPE can be https, http or socks as documented.
To test chained proxy, get the host IP address that can be used from virtual device and docker container:
```shell
hostname -I | awk '{print $1}'
```
 
This IP has to be set Android  WIFI proxy settings, on port 3128.
It has to be set also in .env for DATADOG_PROXY_HOST

Docker build commands:

TODO Fix following.
Build and run the web-proxy and forward-proxy:
```shell
docker build -t traefik-forward-proxy --build-arg CONFIG_FILE=traefik.yml ./traefik
docker run --rm -p 8080:80 traefik-forward-proxy

docker build -t traefik-web-proxy --build-arg CONFIG_FILE=web_proxy.yml ./traefik
docker run --rm -p 3128:80 traefik-web-proxy

```




## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

Whenever your environment is changed you should perform those commands to ensure it is taken into account:
```shell
cd android
./gradlew clean
cd ..
npm run android
```

## Configure endpoint
- Create a root CA:
```shell
cd dd_gateway
openssl req -x509 -sha256 -days 1825 -newkey rsa:2048 -keyout rootCA.key -out rootCA.crt --conf rootCA.conf
 ```

- Create a combined CA certificate for Android:
```shell
 openssl pkcs12 -export -in rootCA.crt -inkey rootCA.key -out rootCA-combined.p12
```

- Create a server certificate
```shell
openssl req -newkey rsa:2048 -nodes -keyout server.key -out server.csr --config server.conf 
```

- Sign certificate with root CA
```shell
openssl x509 -req -in server.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out server.crt -days 365 -sha256 -extfile server.conf -extensions v3_req
```

- Copy certificate for later embedding (TODO repeat for debug env...):
```shell
cp server.crt ../android/app/src/main/res/raw/server.crt
cp rootCA.crt ../android/app/src/main/res/raw/server.crt
```

### Check server certificate
```shell
openssl x509 -in rootCA.crt -text
```

### Deploy a built application (proxy enabled)

Currently debug doesn't work when proxy is enabled.


```
cd android
./gradlew clean assemble
adb install -r app/build/outputs/apk/release/app-release.apk
```



## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).


# Troubleshooting


If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
