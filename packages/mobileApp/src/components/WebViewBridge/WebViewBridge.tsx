import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

import { CoreActionType, ECoreViewDataKeys, TCoreViewData } from "@mobileApp/interfaces/state/IcoreReducer";
import { useStateContext } from "@mobileApp/state/store";

interface WebViewBridgeProps {
  sourceUrl?: string;
}

interface IParsedData {
  keyName: ECoreViewDataKeys;
  keyValue: TCoreViewData;
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
    <View style={{ height: 0, width: 0 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: sourceUrl /*  headers: { myheader: "testing" } */ }}
        javaScriptEnabledAndroid={true}
        javaScriptEnabled={true}
        allowsBackForwardNavigationGestures={true}
        originWhitelist={["*"]}
        mixedContentMode="always"
        domStorageEnabled={true}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        onMessage={(event) => {
          const parsedData = JSON.parse(event.nativeEvent.data) as IParsedData;
          switch (parsedData.keyName) {
            case ECoreViewDataKeys.accounts:
              dispatch({ type: CoreActionType.SET_ACCOUNTS, payload: parsedData.keyValue });
              break;
            case ECoreViewDataKeys.balances:
              dispatch({ type: CoreActionType.SET_BALANCES, payload: parsedData.keyValue });
              break;
            case ECoreViewDataKeys.links:
              dispatch({ type: CoreActionType.SET_LINKS, payload: parsedData.keyValue });
              break;
            case ECoreViewDataKeys.activeLinks:
              dispatch({ type: CoreActionType.SET_ACTIVE_LINKS, payload: parsedData.keyValue });
              break;
            case ECoreViewDataKeys.authorizedMerchants:
              dispatch({ type: CoreActionType.SET_AUTHERIZED_MERCHANTS, payload: parsedData.keyValue });
              break;
            default:
              dispatch({ type: CoreActionType.ERROR_OCCURRED, payload: "Method not implemented" });
          }
          dispatch({ type: CoreActionType.LOADING, payload: false });
        }}
      />
    </View>
  );
};

export default WebViewBridge;
