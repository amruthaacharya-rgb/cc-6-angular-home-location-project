import { Component, inject } from '@angular/core';
import { LoaderService } from '../Services/loader-service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader {
loaderService= inject(LoaderService);

}
