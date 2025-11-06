import {
  Component, inject, signal, DestroyRef,
  ElementRef, AfterViewInit, ViewChild,
  computed
} from "@angular/core";
import { CardWrapper } from "../card-wrapper/card-wrapper";
import { HousingLocation } from "../housing-location/housing-location";
import { RouterOutlet } from "@angular/router";
import { HousingService } from "../Services/housing-service";
import { fromEvent, of, throwError } from "rxjs";
import {
  debounceTime, map, switchMap, tap, catchError,
  distinctUntilChanged, finalize, mergeMap
} from "rxjs/operators";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Loader } from "../loader/loader";
import { LoaderService } from "../Services/loader-service";
import { FormsModule } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CardWrapper, HousingLocation, RouterOutlet, FormsModule, Loader],
  templateUrl: "./home.html",
  styleUrl: "./home.css",
})
export class Home implements AfterViewInit {

  private housingService = inject(HousingService);
  private toaster = inject(ToastrService);
  private loader = inject(LoaderService);
  private destroyRef = inject(DestroyRef);

  private searchQuery = signal<string>('');    

  filteredLocationList = signal(this.housingService.housingLocations());

  readonly displayedList = computed(() => {
    const query = this.searchQuery().trim();
    if (!query) {
      return this.housingService.housingLocations();
    }
    return this.filteredLocationList();
  });

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    fromEvent<InputEvent>(this.searchInput.nativeElement, 'input')
      .pipe(
        map(e => (e.target as HTMLInputElement).value.trim()),
        debounceTime(400),
        distinctUntilChanged(),
        tap(query => {
          this.searchQuery.set(query);
          this.loader.show();
        }),
        switchMap(query => {
          if (!query) {
            return of(this.housingService.housingLocations()).pipe(
              finalize(() => this.loader.hide())
            );
          }
          return this.housingService.setHousingLocations$(query).pipe(
            switchMap(results => {
              if (Math.random() < 0.3) {
                return throwError(() => new Error("Simulated random network error"));
              }
              return of(results);
            }),
            catchError(err => {
              console.error("Search error:", err);
              this.toaster.error("Failed to fetch housing locations. Please try again.");
              return of([]);
            }),
            finalize(() => this.loader.hide())
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(results => {
        this.filteredLocationList.set(results);
      });
  }
}
