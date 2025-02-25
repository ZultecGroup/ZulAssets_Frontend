import { Component, OnInit } from '@angular/core';
import { finalize, first } from 'rxjs';
import { HttpService } from '../shared/service/http.service';
import { toastService } from '../shared/toaster/toast.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  fetchingData: boolean = false
  dashboardData: any;
displayGoogleLookout: boolean = true;
  constructor(private http: HttpService, private toast: toastService) { }

  ngOnInit(): void {
    this.getDashboardData()
  }

  getDashboardData() {
    this.fetchingData = true
    this.http.get('Dashboard/GetAllDashboardCounts')
      .pipe(first(), finalize(() => this.fetchingData = false))
      .subscribe({
        next: (res) => {
          if (res) {
            this.dashboardData = res[0]
          } else {
            this.toast.show(res.message, 'error')
          }
        },
        error: (err) => this.toast.show(err ?? 'Something went wrong!', 'error')
      })
  }

}
