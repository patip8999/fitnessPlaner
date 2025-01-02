import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { MealModalComponent } from './Components/meal-modal/meal-modal.component';
import { DayDetailsComponent } from './Components/day-details/day-details.component';
import { MonthlySummaryComponent } from './Components/monthly-summary/monthly-summary.component';
import { TrainingPlansComponent } from './Components/training-plans/training-plans.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent,  canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {  path: 'day-details/:day', component: DayDetailsComponent},
    { path: 'summary', component: MonthlySummaryComponent},
    { path: 'trainig-plans', component: TrainingPlansComponent}
   
];
