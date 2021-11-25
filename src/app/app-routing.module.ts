import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'cury', loadChildren: () => import('./cury/cury.module').then(m => m.CuryPageModule) },
  { path: 'homy', loadChildren: () => import('./homy/homy.module').then(m => m.HomyPageModule) },
//  { path: 'picy', loadChildren: () => import('./picy/picy.module').then(m => m.PicyPageModule) },
  { path: 'details', loadChildren: () => import('./cury/details/details.module').then(m => m.DetailsPageModule) },
  { path: 'feedback', loadChildren: () => import('./cury/feedback/feedback.module').then(m => m.FeedbackPageModule) },
//  { path: 'nfc-pick-page', loadChildren: './picy/nfc-pick-page/nfc-pick-page.module#NfcPickPagePageModule' },
  { path: 'categories', loadChildren: () => import('./homy/categories/categories.module').then(m => m.CategoriesPageModule) },
  { path: 'question/:id', loadChildren: () => import('./homy/question/question.module').then(m => m.QuestionPageModule) },
  { path: 'milestone/:id', loadChildren: () => import('./homy/milestone/milestone.module').then(m => m.MilestonePageModule) },
  { path: 'covers', loadChildren: () => import('./picy/covers/covers.module').then(m => m.CoversPageModule) },
  { path: 'feedback', loadChildren: () => import('./modals/feedback/feedback.module').then(m => m.FeedbackPageModule) },
  { path: 'gallery', loadChildren: () => import('./picy/gallery/gallery.module').then(m => m.GalleryPageModule) },
  { path: 'map', loadChildren: () => import('./picy/map/map.module').then(m => m.MapPageModule) },
  { path: 'nfc', loadChildren: () => import('./picy/nfc/nfc.module').then(m => m.NfcPageModule) },
  { path: 'cury', loadChildren: () => import('./cury/cury/cury.module').then(m => m.CuryPageModule) },
  { path: 'carousel', loadChildren: () => import('./cury/carousel/carousel.module').then(m => m.CarouselPageModule) },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
