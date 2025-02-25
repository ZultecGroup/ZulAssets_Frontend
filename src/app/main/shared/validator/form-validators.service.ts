// import { FormGroup, FormControl, ValidatorFn, FormArray, AbstractControl } from '@angular/forms';


// export function phoneNumberMasking(): any {
//   return ['+', "1", " ", "(", /(?!1)\d/, /\d/, /\d/, ")", " ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
// }
// export function paymentCardMasking(): any {
//   return [/\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/, " ", /\d/, /\d/, /\d/, /\d/];
// }
// export function stripeExpireDateMasking(): any {
//   return [/\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
// }
// export function stripeCvcMasking(): any {
//   return [/\d/, /\d/, /\d/, /\d/];
// }
// export function OntarioMasking(): any {
//   return [/\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /[a-zA-Z]/, /[a-zA-Z]/];
// }
// export function BCMasking(): any {
//   return [/\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
// }

// export function AlbertaMasking(): any {
//   return [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
// }

// export function OtherMasking(): any {
//   return false;
// }

// export function otpMasking(): any {
//   return [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
// }

// export function emailValidator(control: FormControl): { [key: string]: any } {
//   let emailRegexp = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
//   if (control.value && !emailRegexp.test(control.value)) {
//     return { invalidEmail: true };
//   }
// }

// export function phoneValidator(control: FormControl): { [key: string]: any } {
//   let { value } = control;
//   if (value) {
//     let newValue = value.replace(/_/g, "")
//     if (newValue.substring(8, 9) == " ") {
//       let val = newValue.split('');
//       val.splice(8, 1);
//       val = val.join().replace(/,/g, '');
//       newValue = val;
//     }
//     if (newValue.length != 16 && value.length > 0) {
//       return { invalidPhone: true };
//     }
//   }
// }

// export function regexForSecurity(control: FormControl): { [key: string]: any } {
//   return
// }

// export function numberValidator(control: FormControl): { [key: string]: any } {
//   let validNum = /^[0-9]*$/
//   if (control.value && !validNum.test(control.value)) {
//     return { numberValidator: true };
//   }
// }

// export function healthCardWithoutMasking(control: FormControl): { [key: string]: any } {
//   let security = /^[a-zA-Z0-9 -]*$/;
//   if (control.value && !security.test(control.value)) {
//     return { invalidString: true };
//   }
// }

// export function addressValidator(control: FormControl): { [key: string]: any } {
//   let nameRegexp = /^[a-zA-Z0-9 &',_-]*$/;
//   if (control.value && !nameRegexp.test(control.value)) {
//     return { addressValidator: true };
//   }
// }

// export function passwordValidator(control: FormControl): { [key: string]: any } {
//   let passwordRegexp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}$/
//   if (control.value && !passwordRegexp.test(control.value)) {
//     return { invalidPassword: true };
//   }
// }
// export function nameValidator(control: FormControl): { [key: string]: any } {
//   let nameRegexp = /^[a-zA-Z ]*$/;
//   if (control.value && !nameRegexp.test(control.value)) {
//     return { nameValidator: true };
//   }
// }
// export function spaceValidator(control: FormControl): { [key: string]: any } {
//   let nameRegexp = /^[^\s].*/;
//   if (control.value && !nameRegexp.test(control.value)) {
//     return { spaceValidator: true };
//   }
// }
// export function alphaNumeric(control: FormControl): { [key: string]: any } {
//   let nameRegexp = /^[a-zA-Z0-9 ]*$/;
//   if (control.value && !nameRegexp.test(control.value)) {
//     return { alphaNumeric: true };
//   }
// }
// export function termsConditionValidator(control: FormControl): { [key: string]: any } {
//   if (!control.value) {
//     return { termsConditionValidator: true };
//   }
// }
// export function canceltermsConditionValidator(control: FormControl): { [key: string]: any } {
//   if (!control.value) {
//     return { canceltermsConditionValidator: true };
//   }
// }

// export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
//   return (group: FormGroup) => {
//     let password = group.controls[passwordKey];
//     let passwordConfirmation = group.controls[passwordConfirmationKey];
//     if (password.value !== passwordConfirmation.value) {
//       return passwordConfirmation.setErrors({ mismatchedPasswords: true })
//     }
//   }
// }
// export function dateLessThan(from: string, to: string): { [key: string]: any } {
//   return (group: FormGroup) => {
//     let f = group.controls[from];
//     let fromDate = f.value;
//     let fromDateConverted = new Date(fromDate);

//     let t = group.controls[to];
//     let toDate = t.value;
//     let toDateConverted = new Date(toDate);
//     if (fromDateConverted > toDateConverted) {
//       return t.setErrors({ dateLessThan: true });
//     }
//     else if ((fromDateConverted < toDateConverted) || !(fromDate && toDate)) {
//       f.setErrors(null);
//       t.setErrors(null);
//     }
//     else {
//       return null;
//     }
//   }
// }
// export function dateLessThanWhenRequired(from: string, to: string): { [key: string]: any } {
//   return (group: FormGroup) => {
//     let f = group.controls[from];
//     let fromDate = f.value;
//     let fromDateConverted = new Date(fromDate);

//     let t = group.controls[to];
//     let toDate = t.value;
//     let toDateConverted = new Date(toDate);
//     if (fromDate && toDate) {
//       if (fromDateConverted > toDateConverted) {
//         return t.setErrors({ dateLessThan: true });
//       }
//       else if (fromDateConverted < toDateConverted) {
//         f.setErrors(null);
//         t.setErrors(null);
//       }
//       else {
//         return null;
//       }
//     }
//   }
// }
// export function timeLessThan(from: string, to: string): { [key: string]: any } {
//   return (group: FormGroup) => {
//     let f = group.controls[from];
//     let fromDate = f.value;
//     let fromDateConverted = new Date(fromDate);

//     let t = group.controls[to];
//     let toDate = t.value;
//     let toDateConverted = new Date(toDate);
//     if (fromDateConverted > toDateConverted) {
//       return t.setErrors({ timeLessThan: true });
//     }
//     else if (fromDateConverted < toDateConverted) {
//       f.setErrors(null);
//       t.setErrors(null);
//     }
//     else {
//       return null;
//     }
//   }
// }
// export function timeLessThanWhen(from: string, to: string): { [key: string]: any } {
//   return (group: FormGroup) => {
//     let f = group.controls[from];
//     let fromDate = f.value;
//     let fromDateConverted = new Date(fromDate);

//     let t = group.controls[to];
//     let toDate = t.value;
//     let toDateConverted = new Date(toDate);
//     if (toDate && fromDate) {
//       if (fromDateConverted > toDateConverted) {
//         return t.setErrors({ timeLessThan: true });
//       }
//       else if (fromDateConverted < toDateConverted) {
//         f.setErrors(null);
//         t.setErrors(null);
//       }
//       else {
//         return null;
//       }
//     }
//   }
// }
// export function fileSize(control: FormControl): { [key: string]: any } {
//   const file = control.value;
//   if (file > 2097152) {
//     return { fileSize: true };
//   }
//   return null;
// }
// export function arrayMinLength(min: number): ValidatorFn | any {
//   return (control: AbstractControl[]) => {
//     if (!(control instanceof FormArray)) return;
//     return control.length < min ? { minLength: true } : null;
//   }
// }

// export function arrayMaxLength(max: number): ValidatorFn | any {
//   return (control: AbstractControl[]) => {
//     if (!(control instanceof FormArray)) return;
//     return control.length > max ? { maxLength: true } : null;
//   }
// }
// export function dateGreaterThanCurrentDate(control: FormControl): { [key: string]: any } {
//   const value = control.value && new Date(control.value);
//   let date = new Date();
//   if (value) {
//     if (new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0) < new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)) {
//       return { dateGreaterThanCurrentDate: true };
//     }
//   }
//   return null;
// }

// export function timeGreaterThanCurrentTime(AC: FormGroup) {
//   let date = AC.value.date;
//   let time = AC.value.time;
//   let newDate = new Date();
//   if ((typeof date == 'object') && (time < new Date()) && (new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).toString() === new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0).toString())) {
//     return { "timeGreaterThanCurrentTime": true }
//   }
//   else {
//     return null;
//   }
// }
