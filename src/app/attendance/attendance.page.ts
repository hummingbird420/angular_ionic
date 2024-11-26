import { ChangeDetectorRef, Component, NgZone, OnInit, Pipe } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { AttendanceService } from '../services/attendance.service';
import { Select, Selector, Store } from '@ngxs/store';
import { UpdateHeader } from '../states/user-state';
import { Platform, ViewDidEnter } from '@ionic/angular';
import { AttendenceState } from '../states/attendance-state';
import { BehaviorSubject, Observable, of } from 'rxjs';
const options = {
  enableHighAccuracy: true,
  timeout: 5000, // 5 seconds
  maximumAge: 0, // Force the device to get a new location
};

@Component({
  selector: 'app-attendance',
  templateUrl: 'attendance.page.html',
  styleUrls: ['attendance.page.scss']
})
export class AttendancePage implements ViewDidEnter {
  @Select(AttendenceState.getGEOLocation)
  GEOLocation$!: Observable<any>;
  attendanceToday: any;
  isCheckIn: boolean = true;
  locations: Position[] = [];
  targetLat: number = 0;
  targetLon: number = 0;

  currentLat: number = 0;
  currentLon: number = 0;
  radius: number = 0; //  meters
  isWithinArea: boolean = false;
  distance: number = 0;

  isToastOpen = false;
  errMessage: string = '';
  watchId: any;
  constructor(private cdRef: ChangeDetectorRef, private attService: AttendanceService, private store: Store, private ngZone: NgZone, private platform: Platform) { }
  ionViewDidEnter() {
    this.store.dispatch([new UpdateHeader(' Attendance', false, '')]);
    this.GEOLocation$.subscribe((geolocation: any) => {
      if (geolocation) {
        if (this.isCheckIn) {
          this.targetLat = geolocation.Latitude_check_in;
          this.targetLon = geolocation.Longitude_check_in;
          this.radius = geolocation.Radius_check_in;
        }
        else {
          this.targetLat = geolocation.Latitude_check_out;
          this.targetLon = geolocation.Longitude_check_out;
          this.radius = geolocation.Radius_check_out;
        }
      }
    });
    this.onInit();
    this.startLocationUpdates();
  }
  async onInit() {

    this.attService.getTodayStatusInfoForApp().subscribe((data: any) => {
      if (data && data.length) {
        this.isCheckIn = data[0].in_date_time ? false : true;
        this.attendanceToday = data;
        //this.cdRef.detectChanges();
      }
      else {
        this.isCheckIn = true;
      }
    });
  }

  async startLocationUpdates() {
    const options = {
      maximumAge: 0,
      timeout: 5000,
      enableHighAccuracy: true,
    };

    this.watchId = await Geolocation.watchPosition(options, (position: Position | null, err: any) => {
      if (err) {
        console.log('Location watch error');
        this.ngZone.run(() => {
          this.isWithinArea = false;
          this.cdRef.detectChanges();
          this.restartLocationUpdates();
        });

      } else {
        const latitude = position?.coords.latitude;
        const longitude = position?.coords.longitude;

        console.log(`New location: ${latitude}, ${longitude}`);
        if (position) {
          this.currentLat = position.coords.latitude;
          this.currentLon = position.coords.longitude;
          this.locations.push(position);
          let isLocation: boolean = this.isInTargetArea(this.currentLat, this.currentLon, this.targetLat, this.targetLon, this.radius);
          console.log(isLocation);
          this.ngZone.run(() => {
            this.isWithinArea = isLocation;
            this.cdRef.detectChanges();
          });

        }
        else {
          this.ngZone.run(() => {
            this.isWithinArea = false;
            this.cdRef.detectChanges();
            this.restartLocationUpdates();
          });
        }
      }
    });
  }


  degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance;
  }

  isInTargetArea(currentLat: number, currentLon: number, targetLat: number, targetLon: number, radius: number) {
    const distance = Math.round(((this.calculateHaversine(currentLat, currentLon, targetLat, targetLon) * 100) / 100) * 1000);
    console.log(distance);
    this.distance = distance;
    return distance <= radius;
  }
  doRefresh(event: any) {
    this.startLocationUpdates();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
  async addAttendance() {

    const hasPermission = await this.checkLocationPermission();
    if (hasPermission) {
      if (this.isWithinArea) {
        this.attService.addAttendance().subscribe(() => {
          this.onInit();
          this.errMessage = "Checked successfully";
          this.setOpen(true);
        });
      }
      else {
        this.errMessage = "You are not in the area or your location is off!";
        this.setOpen(true);
      }
    }
  }
  async checkLocationPermission(): Promise<boolean> {
    try {
      const data = await Geolocation.checkPermissions();
      return data?.location === 'granted';
    } catch (err) {
      this.errMessage = "Your location is off, Please open and try again!";
      this.setOpen(true);
      return false;
    }
  }
  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  stopLocationUpdates() {
    if (this.watchId !== undefined) {
      Geolocation.clearWatch(this.watchId);
    }
  }
  restartLocationUpdates() {
    setTimeout(() => {
      this.stopLocationUpdates();
      this.startLocationUpdates();
    }, 10000);

  }
}
