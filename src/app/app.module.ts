import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import {QRScanner} from '@ionic-native/qr-scanner/ngx';
import {FeedbackPageModule} from './modals/feedback/feedback.module';
import {DisplayPageModule} from './picy/display/display.module';
import {MapPageModule} from './picy/map/map.module';
import {CuryPageModule} from './cury/cury/cury.module';

@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		IonicStorageModule.forRoot(),
		AppRoutingModule,
		FeedbackPageModule,
		DisplayPageModule,
		MapPageModule,
		CuryPageModule
	],
	providers: [
		StatusBar,
		SplashScreen,
		File,
		WebView,
		QRScanner,
		{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
	],
	exports: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
