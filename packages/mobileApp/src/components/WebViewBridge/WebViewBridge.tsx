import React, { useRef, useEffect } from "react";
import { WebView } from "react-native-webview";
import { View } from "react-native";
import { useStateContext } from "@mobileApp/state/store";
import { CoreActionType } from "@mobileApp/interfaces/state/IcoreReducer";
import { parse } from "flatted";

interface WebViewBridgeProps {
  sourceUrl?: string;
}

const WebViewBridge: React.FC<WebViewBridgeProps> = (props: WebViewBridgeProps) => {
  // NOTE: if we dont want to host a the mobile-integration (http://localhost:8091) we can embed the js bundle of the package in a script tag in an html string and give it as source prop to the webView
  const { sourceUrl = "http://localhost:8091" } = props;
  const { dispatch } = useStateContext();
  const webViewRef = useRef<any>();

  useEffect(() => {
    dispatch({ type: CoreActionType.LOADING, payload: true });

    return () => {
      dispatch({ type: CoreActionType.DESTROY_CORE });
    };
  }, []);

  return (
    <View style={{ width: 0, height: 0 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: sourceUrl }}
        javaScriptEnabledAndroid={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
        onMessage={(event) => {
          const parsedData = parse(event.nativeEvent.data);
          dispatch({ type: CoreActionType.INITIATE_CORE, payload: parsedData });
          dispatch({ type: CoreActionType.LOADING, payload: false });
        }}
      />
    </View>
  );
};

export default WebViewBridge;
