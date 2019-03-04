import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'visionary', loadChildren: './legacy/visionary/visionary.module#VisionaryPageModule' },
  { path: 'cury', loadChildren: './cury/cury.module#CuryPageModule' },
  { path: 'homy', loadChildren: './homy/homy.module#HomyPageModule' },
  { path: 'picy', loadChildren: './picy/picy.module#PicyPageModule' },
  { path: 'details', loadChildren: './cury/details/details.module#DetailsPageModule' },
  { path: 'feedback', loadChildren: './cury/feedback/feedback.module#FeedbackPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
