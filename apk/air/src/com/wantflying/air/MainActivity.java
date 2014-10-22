package com.wantflying.air;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    public boolean open_nano_server(View view){
    	Intent intent = new Intent(this,OpenNanoServerActivity.class);
    	intent.putExtra("after","10");
    	startActivity(intent);
    	return true;
    }
    public boolean open_camera(View view){
    	Intent intent = new Intent(this,CameraActivity.class);
    	startActivity(intent);
    	return true;
    }
    
}