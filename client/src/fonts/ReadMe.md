# How to install fonts

Attribution to this [discussion](https://github.com/chakra-ui/chakra-ui/discussions/3457#discussioncomment-1608021).

You can host the fonts locally after downloading it from [Google Fonts](https://fonts.google.com/), or use [fontFace](https://fontsource.org/fonts) from vercal to get the desired fonts.

## Install it locally

1. Replace the [roboto-mono](./roboto-mono/) folder with your desired font family.
2. Visit the [styles.css](../pages/styles.css) file, and change the imports accordingly.

```css
@font-face {
  font-family: 'DesiredFont';
  src: url('../fonts/desired-font/DesiredFont-Regular.woff')
      format('woff');
}
```

3. Visit [themes.ts](../styles/themes.ts) file and change the font family in `chapterStyleVaribles` object.

```ts
const chapterStyleVaribles = {
  fonts: {
    heading: `DesiredFont`,
    body: `DesiredFont`,
  },
};
```


## install it through fontFace
 
 1. Installing the desired font from [fontsource](https://fontsource.org/fonts)
 2. Adding the required font-styles to the file with `ChakraProvider`, eg:
 
 ```ts
 import "@fontsource/baloo-thambi-2/500.css";
 import "@fontsource/baloo-thambi-2";
 ```
 
 3. This step is different from the guide in docs. In `_app.tsx` file we create a component-wrapper for the whole app (`<AppContainer`) with `styled` from `@emotion/react` and set font-style inside it:
 
 ```ts
 //_app.tsx
 
 import styled from "@emotion/styled";
 
 const AppContainer = styled.div`
   font-family: "Baloo Thambi 2";
 `;
 
 function MyApp({ Component, pageProps }: AppProps) {
   return (
     <Chakra cookies={pageProps.cookies}>
       <AppContainer>
         <Component {...pageProps} />
       </AppContainer>
     </Chakra>
   );
 }
 ```
 
 Global css-variables for fonts(`--chakra-fonts-...`) are still there but they are overwritten now by this wrapper component.
