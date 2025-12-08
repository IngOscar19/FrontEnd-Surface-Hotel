import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  
  
  isLoading = signal(false);
  errorMessage = signal('');
  hidePassword = signal(true); 
  
  private returnUrl: string = '/admin/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
  }

  
  togglePasswordVisibility() {
    this.hidePassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.isLoading.set(false);
          
          const msg = error.error?.message || error.message || 'Email o contraseña incorrectos';
          this.errorMessage.set(msg);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      
      this.loginForm.markAllAsTouched(); 
    }
  }
}