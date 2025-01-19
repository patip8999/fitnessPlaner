import { Routes } from '@angular/router';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { DayDetailsComponent } from './Components/day-details/day-details.component';
import { MonthlySummaryComponent } from './Components/monthly-summary/monthly-summary.component';
import { TrainingPlansComponent } from './Components/training-plans/training-plans.component';
import { TrainingPlansSelectComponent } from './Components/training-plans-select/training-plans-select.component';
import { TrainingPlanDetailComponent } from './Components/training-plan-detail/training-plan-detail.component';
import { WelcomeComponent } from './Components/welcome/welcome.component';
import { UserComponent } from './Components/user/user.component';
import { WeightControlComponent } from './Components/weight-control/weight-control.component';
import { CalorieCalculatorComponent } from './Components/calorie-calculator/calorie-calculator.component';

export const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'home', component: CalendarComponent,  canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {  path: 'day-details/:day', component: DayDetailsComponent,  canActivate: [authGuard]},
    { path: 'summary', component: MonthlySummaryComponent,   canActivate: [authGuard]},
    { path: 'trainig-plans', component: TrainingPlansComponent,  canActivate: [authGuard]},
    { path: 'select-plan', component: TrainingPlansSelectComponent,  canActivate: [authGuard]},
    {  path: 'plan/:id', component: TrainingPlanDetailComponent,  canActivate: [authGuard]},
    { path: 'user', component: UserComponent,  canActivate: [authGuard]},
    { path: 'weight', component: WeightControlComponent,canActivate: [authGuard] },
    { path: 'calories-calculator', component: CalorieCalculatorComponent,canActivate: [authGuard] }
];
