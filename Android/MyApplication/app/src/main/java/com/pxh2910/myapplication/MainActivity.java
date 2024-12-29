package com.pxh2910.myapplication;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Display;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import java.io.IOException;
import java.io.InputStream;

import fi.iki.elonen.NanoHTTPD;

import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private MyLocalServer server;
    private final String FOLDER_HTML5 = "aaaa";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);

//        setupWebView();

        // Khởi động Local Server
        int port = 2910;
        server = new MyLocalServer(port);
        try {
            server.start();
            Log.d("PXH_2910", "Server started on port: " + port);
        } catch (IOException e) {
            Log.e("PXH_2910", "Could not start server", e);
        }

//        webView.loadUrl("http://localhost:" + port + "/" + FOLDER_HTML5 + "/index.html");
        webView.loadUrl("file:///android_asset/" + FOLDER_HTML5 + "/index.html");
    }

    private void setupWebView() {
        webView.getSettings().setJavaScriptEnabled(true); // Bật JavaScript
        webView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);
        webView.getSettings().setDomStorageEnabled(true); // Hỗ trợ DOM Storage
        webView.getSettings().setAllowUniversalAccessFromFileURLs(true); // Cho phép CORS từ file
        webView.getSettings().setAllowFileAccessFromFileURLs(true);
        webView.getSettings().setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW); // Cho phép HTTP/HTTPS

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                try {
                    URL url = new URL(request.getUrl().toString());
                    HttpURLConnection connection = (HttpURLConnection) url.openConnection();

                    // Cấu hình yêu cầu HTTP/HTTPS
                    connection.setRequestMethod("GET");
                    connection.setRequestProperty("User-Agent", "Android-WebView");
                    connection.setRequestProperty("Accept", "*/*");
                    connection.connect();

                    // Trả dữ liệu về WebView
                    InputStream inputStream = connection.getInputStream();
                    String contentType = connection.getContentType();
                    String encoding = connection.getContentEncoding() != null ? connection.getContentEncoding() : "UTF-8";

                    return new WebResourceResponse(contentType, encoding, inputStream);
                } catch (Exception e) {
                    e.printStackTrace();
                    return super.shouldInterceptRequest(view, request);
                }
            }
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (server != null) {
            server.stop();
        }
    }

    private class MyLocalServer extends NanoHTTPD {

        public MyLocalServer(int port) {
            super(port);
        }

        @Override
        public Response serve(IHTTPSession session) {
            // Lấy URI từ yêu cầu và xóa dấu / đầu nếu có
            String uri = session.getUri();
            if (uri.startsWith("/")) {
                uri = uri.substring(1);
            }

            // Nếu URI rỗng hoặc yêu cầu favicon, chỉ định index.html mặc định
            if (uri.isEmpty()) {
                uri = FOLDER_HTML5 + "/index.html";
            } else {
                // Nếu uri không chứa "DangerDash_1_2_1_Ads", thêm vào trước uri để đúng cấu trúc
                if (!uri.startsWith(FOLDER_HTML5 + "/")) {
                    uri = FOLDER_HTML5 + "/" + uri;
                }
            }

            InputStream inputStream;
            try {
                // Mở tài nguyên từ assets
                inputStream = getAssets().open(uri);
                String mimeType = getMimeType(uri);
                return newFixedLengthResponse(Response.Status.OK, mimeType, inputStream, inputStream.available());
            } catch (IOException e) {
                Log.e("MyLocalServer", "File not found: " + uri, e);
                return newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "File not found");
            }
        }

        private String getMimeType(String uri) {
            // Common web files
            if (uri.endsWith(".html")) return "text/html";
            if (uri.endsWith(".js")) return "application/javascript";
            if (uri.endsWith(".css")) return "text/css";

            // Images
            if (uri.endsWith(".png")) return "image/png";
            if (uri.endsWith(".jpg") || uri.endsWith(".jpeg")) return "image/jpeg";
            if (uri.endsWith(".gif")) return "image/gif";
            if (uri.endsWith(".svg")) return "image/svg+xml";
            if (uri.endsWith(".ico")) return "image/x-icon";

            // Audio files
            if (uri.endsWith(".m4a")) return "audio/mp4";
            if (uri.endsWith(".ogg")) return "audio/ogg";
            if (uri.endsWith(".mp3")) return "audio/mpeg";
            if (uri.endsWith(".wav")) return "audio/wav";

            // Video files
            if (uri.endsWith(".mp4")) return "video/mp4";
            if (uri.endsWith(".webm")) return "video/webm";

            // Documents
            if (uri.endsWith(".pdf")) return "application/pdf";
            if (uri.endsWith(".doc")) return "application/msword";
            if (uri.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            if (uri.endsWith(".xml")) return "application/xml";
            if (uri.endsWith(".json")) return "application/json";

            // Archive files
            if (uri.endsWith(".zip")) return "application/zip";
            if (uri.endsWith(".rar")) return "application/x-rar-compressed";

            // Text files
            if (uri.endsWith(".txt")) return "text/plain";
            if (uri.endsWith(".csv")) return "text/csv";

            // Font files
            if (uri.endsWith(".ttf")) return "font/ttf";
            if (uri.endsWith(".woff")) return "font/woff";
            if (uri.endsWith(".woff2")) return "font/woff2";

            // Special files from your directory
            if (uri.endsWith(".scml")) return "application/xml";
            if (uri.endsWith(".scon")) return "application/json";

            // Default binary file type
            return "application/octet-stream";
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {

        Log.d("PXH_2910", "========================= onKeyDown " + event.getDeviceId());
        Log.d("PXH_2910", "keyCode: " + keyCode);

        return true;
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {

        Log.d("PXH_2910", "========================= onKeyUp " + event.getDeviceId());
        Log.d("PXH_2910", "keyCode: " + keyCode);

        return true;
    }

//    @Override
//    public boolean dispatchKeyEvent(KeyEvent event) {
//
//        Log.d("PXH_2910", "========================= dispatchKeyEvent " + event.getDeviceId());
//        Log.d("PXH_2910", "keyCode: " + event.getKeyCode());
//
//        return false;
//    }
}
