package nl.songlibrary.app;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Het scherm: een WebView met de bibliotheek (assets/index.html), die liedjes kan openen in een instrument-app. */
public final class MainActivity extends Activity {
    private WebView web;

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#0f1014"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true); // taal, filter en sterren onthouden
        s.setMediaPlaybackRequiresUserGesture(false);
        web.addJavascriptInterface(this, "SongLibAndroid");
        web.setWebViewClient(new WebViewClient() {
            // Links naar buiten (zoals de koffielink) openen in de browser
            @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                String scheme = u.getScheme();
                if ("file".equals(scheme)) return false;
                if ("http".equals(scheme) || "https".equals(scheme)) startActivity(new Intent(Intent.ACTION_VIEW, u));
                return true;
            }
        });
        web.loadUrl("file:///android_asset/index.html");
        setContentView(web);
    }

    /** Opent een liedje in een instrument-app; false als die app niet op dit apparaat staat. */
    @JavascriptInterface public boolean open(String pkg, String song, String mode) {
        Intent i = getPackageManager().getLaunchIntentForPackage(pkg);
        if (i == null) return false;
        i.putExtra("song", song);
        i.putExtra("mode", mode);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(i);
        return true;
    }

    @Override public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        // Schermvullend: status- en navigatiebalk verdwijnen, een veeg vanaf de rand haalt ze terug
        if (hasFocus) web.setSystemUiVisibility(View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
    }

    @Override protected void onResume() { super.onResume(); web.onResume(); }
    @Override protected void onPause() { web.onPause(); super.onPause(); }
}
