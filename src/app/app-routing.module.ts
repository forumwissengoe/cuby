import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'cury', loadChildren: './cury/cury.module#CuryPageModule' },
  { path: 'homy', loadChildren: './homy/homy.module#HomyPageModule' },
  { path: 'picy', loadChildren: './picy/picy.module#PicyPageModule' },
  { path: 'details', loadChildren: './cury/details/details.module#DetailsPageModule' },
  { path: 'feedback', loadChildren: './cury/feedback/feedback.module#FeedbackPageModule' },
  { path: 'nfc-pick-page', loadChildren: './picy/nfc-pick-page/nfc-pick-page.module#NfcPickPagePageModule' },
  { path: 'categories', loadChildren: './homy/categories/categories.module#CategoriesPageModule' },
  { path: 'question/:id', loadChildren: './homy/question/question.module#QuestionPageModule' },
  { path: 'milestone/:id', loadChildren: './homy/milestone/milestone.module#MilestonePageModule' },
  { path: 'covers', loadChildren: './picy/covers/covers.module#CoversPageModule' },
  { path: 'feedback', loadChildren: './modals/feedback/feedback.module#FeedbackPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
