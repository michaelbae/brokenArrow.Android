/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.parkinglotgames.ddmg;

import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;
import com.google.ads.*;
import android.os.Bundle;
import android.widget.LinearLayout;

public class ddmg_android extends DroidGap
{
	private static final String AdMob_Ad_Unit = "a1520341bd40b9d";
	private AdView adView;
	@Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl());
        //super.loadUrl("file:///android_asset/www/index.html")
        adView = new AdView(this, AdSize.BANNER, AdMob_Ad_Unit); 
        LinearLayout layout = super.root;
        layout.addView(adView); 
        AdRequest request = new AdRequest();
        request.setTesting(true);
        adView.loadAd(request);
    }
}

