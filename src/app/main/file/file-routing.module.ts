import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "import-file",
    loadChildren: () => import('src/app/main/file/import-file/import-file.module').then((m) => m.ImportFileModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileRoutingModule { }
