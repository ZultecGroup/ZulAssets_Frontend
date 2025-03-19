import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from "@progress/kendo-angular-notification";
import { AuthService } from '../../shared/service/auth.service';
import { toastService } from '../../shared/toaster/toast.service';
import { TokenStorageService } from '../../shared/service/token-storage.service';
import { finalize } from 'rxjs';
import { noWhitespaceValidator, validateAllFormFields } from '../../shared/helper/functions.component';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import { GeneralService } from '../../shared/service/general.service';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @ViewChild('Password') public Password: TextBoxComponent;
  signUpForm!: FormGroup;
  sendingRequest: boolean = false;
  private rtl = false;
  selectedLanguage: string;

  constructor(
    private fb: FormBuilder,
    public notificationService: NotificationService,
    private toast: toastService,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenStorageService,
    private translateService : TranslateService,
    private messages: MessageService,
    public generalService : GeneralService

  ) { }

  ngOnInit(): void {
    this.initializeForm()
    const lang = localStorage.getItem('lang');
    if(lang){
      this.changeLangage(lang);
    }
  }
  public ngAfterViewInit(): void {
    this.Password.input.nativeElement.type = 'password';
  }
  initializeForm() {
    this.signUpForm = this.fb.group({
      loginName: new FormControl('', Validators.compose([Validators.required, noWhitespaceValidator()])),
      password: new FormControl('', Validators.compose([Validators.required, noWhitespaceValidator()])),
    });
  }

  changeLangage(lang: string) {
    // if (lang == 'ar') {
    //   this.selectedLanguage = 'ar';
    // } else {
    //   this.selectedLanguage = 'en'
    // }

    // this.rtl = !this.rtl;
    // this.messages.notify(this.rtl);

    // localStorage.setItem('lang', lang);

    if(lang == 'ar'){
      this.rtl = false;
      const body = document.querySelector('body[dir]') as HTMLBodyElement;
        body.dir = body.dir === 'rtl' ? 'rtl' : 'rtl';
        this.rtl = !this.rtl;
       this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
        localStorage.setItem('lang', lang);
    }else {
      this.rtl = true;
      const body = document.querySelector('body[dir]') as HTMLBodyElement;
        body.dir = body.dir === 'ltr' ? 'ltr' : 'ltr';
        this.rtl = !this.rtl;
        this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
        localStorage.setItem('lang', lang);
    }
 }

  signIn() {
    if (this.signUpForm.value.loginName.toLowerCase() == "admin") {
      this.authService.checkAdminUser('').subscribe(data=>{this.SingInAgain()},erro=>{console.log(erro)})
    }else{
      this.SingInAgain();
    }
    // this.generalService.afterLoginLTR.next('this.selectedLanguage')
  }
  public toggleConfirmVisibility(): void {
    const inputEl = this.Password.input.nativeElement;

    if (inputEl.type === 'password') {
      inputEl.type = 'text';
    } else {
      inputEl.type = 'password';
    }
  }
  SingInAgain(){
    if (this.signUpForm.valid) {
      this.sendingRequest = true
      this.authService.login(this.signUpForm.value).pipe(finalize(() => this.sendingRequest = false)).subscribe((res: any) => {
        console.log(res);
        if (res.status == '200') {
          this.tokenService.saveToken(res.token)
          this.tokenService.saveUserObj(res)
          this.generalService.getRoleRightsByID();
          this.router.navigate(['/main/dashboard']);
          this.toast.show(res.message, 'success')
        }
        else {
          this.toast.show(res.message, 'error')
        }
      },
        err => {
          this.toast.show(err.message, 'error')
        }
      )
    } else {
      validateAllFormFields(this.signUpForm)
    }
  }




}
