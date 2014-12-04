package com.wantflying.air;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.widget.TextView;

public class StatusActivity extends Activity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_status);
		Intent intent = this.getIntent();
		Bundle bundle = intent.getExtras();
		String app_t = bundle.getString("app");
		String browser_t = bundle.getString("browser");
		String type_t = bundle.getString("type");
		TextView app = (TextView) findViewById(R.id.app_status);
		TextView total = (TextView) findViewById(R.id.total_status);
		TextView browser = (TextView) findViewById(R.id.browser_status);
		total.setText(type_t);
		browser.setText(browser_t);
		app.setText(app_t);
		
		TextView urlText = (TextView) findViewById(R.id.link_status);
		urlText.setText("Server IP://" + OpenNanoServerActivity.ip + "/\n\nhttp port : " + OpenNanoServerActivity.port + "\nWebSocket port : " + OpenNanoServerActivity.socketport);
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.status, menu);
		return true;
	}

}
