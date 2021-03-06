import { Component, OnInit, Inject, Input, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { UserService } from '../services/user.service';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  private _user: User;
  public isConnected = false;
  private userSubscription: Subscription = new Subscription();

  constructor(
    public anAuth: AngularFireAuth,
    public dialog: MatDialog,
    private userService: UserService) {
  }

  ngOnInit() {
    this.userSubscription = this.userService.userSubject.subscribe(
      (user) => {
        if (user) {
          this._user = user;
          this.isConnected = true;
        }
      }
    );
    this.userService.emmitUser();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  auth() {
    const dialogRef = this.dialog.open(AuthDialogComponent);
    /* dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.signinVia(result).then(() => {
          console.log('Sign up succes', this.isConnected);
        }).catch(error => this.handleError(error));
      }
    });*/
  }

  logout() {
    this.userService.signOut();
    this._user = undefined;
    this.isConnected = false;
  }

  private handleError(error: Error) {
    console.error(error);
    console.log(error.message, 'error');
  }
}
