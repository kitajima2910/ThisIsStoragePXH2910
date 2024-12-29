package com.pxh2910.myapplication;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.WebView;

public class CustomWebView extends WebView {

    public CustomWebView(Context context) {
        super(context);
    }

    public CustomWebView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        Log.d("PXH_2910", "CustomWebView - onKeyDown: " + keyCode);
        return true; // Chuyển tiếp sự kiện lên WebView hoặc Activity
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        Log.d("PXH_2910", "CustomWebView - onKeyUp: " + keyCode);
        return true; // Chuyển tiếp sự kiện lên WebView hoặc Activity
    }

}
