import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  
})
export class SignUpComponent implements AfterViewInit {

  
  email:string = "";
  selectedUserType:string = "";
  userRoleId:string = "";
  response:any = "";

  showForm: boolean = true;
  showOtp: boolean = false;

  generatedOTP:number = 0;
  otpStr: string = "";
  otpNumber: number = 0;

  showGraduateDetails:boolean = false;
  showPersonalDetails:boolean = false;
  showCollegeDetails:boolean = false;
  showEmployerDetails:boolean = false;

  userData:any = {};

  // user form details
  @ViewChild('fullName') fullName: ElementRef | undefined;
  @ViewChild('emailId') emailId: ElementRef | undefined;
  @ViewChild('userType') userType:ElementRef | undefined;
  @ViewChild('nationality') nationality:ElementRef | undefined;
  @ViewChild('phoneNo') phoneNo: ElementRef | undefined;
  @ViewChild('password') password: ElementRef | undefined;
  
  
  // graduate form details
  @ViewChild('collegeName') collegeName: ElementRef | undefined;
  @ViewChild('collegeAddress') collegeAddress: ElementRef | undefined;
  @ViewChild('male') male:ElementRef | undefined;
  @ViewChild('female') female:ElementRef | undefined;
  @ViewChild('skills') skills: ElementRef | undefined;
  @ViewChild('project') project: ElementRef | undefined;
  @ViewChild('dob') dob: ElementRef | undefined;
  @ViewChild('address') address: ElementRef | undefined;

  // employer details
  @ViewChild('companyName') companyName:ElementRef | undefined;
  @ViewChild('companyAddress') companyAddress: ElementRef | undefined;
  @ViewChild('sector') sector: ElementRef | undefined;
  @ViewChild('companySize') companySize: ElementRef | undefined;
  @ViewChild('empAddress') empAddress: ElementRef | undefined;

  gender:string = "";
  gskills:string = "";
  gproject:string = "";
  gdob:string = "";
  gaddress:string = "";


  constructor(private fb: FormBuilder,private http:HttpClient,private router:Router) {}

  /* OTP SENDING AND ACCESSING FORM ELEMENTS */
  form: FormGroup = this.fb.group({
    from_name: "",
    code: '',
    reply_to: this.email
  });

  generateOTP() {
    this.generatedOTP = Math.floor(1000 + Math.random() * 9000);
  }

  send(){
    console.log("hello");
  }


  async sendOTPMail() {

    this.userData = {
      userName: this.fullName?.nativeElement.value,
      userEmail: this.emailId?.nativeElement.value,
      typeOfUser: this.userType?.nativeElement.value,
      nationality: this.nationality?.nativeElement.value,
      phoneNo: this.phoneNo?.nativeElement.value,
      password: this.password?.nativeElement.value
    };

    console.log(this.userData);

    console.log("hello");

    console.log(this.emailId?.nativeElement.value);
    this.email = this.emailId?.nativeElement.value;
    this.selectedUserType = this.userType?.nativeElement.value;
    this.generateOTP();

    this.showForm = false;
    this.showOtp = true;
    console.log("Sending email...");

    emailjs.init('rgF8rIDak98oh2JI8');

    try {
      let response = await emailjs.send("service_va9sfgr","template_zfz37gm", {
        from_name: "aman",
        code: this.generatedOTP, 
        reply_to: this.emailId?.nativeElement.value,
      });

      console.log("Email sent:", response);
      
      alert("Email sent");
    } catch (error) {
      console.error("Email sending failed:", error);
      alert("Failed to send email. Please try again.");
    }
    
  }

  resendOTPMail(){
    this.sendOTPMail();
  }

  async sendRoleIdMail(roleId:any){
    emailjs.init('rgF8rIDak98oh2JI8');
      

      try {
        let response = await emailjs.send("service_va9sfgr","template_v7sz2el", {
          from_name: "aman",
          roleId: roleId, 
          reply_to: this.email,
        });

        console.log("Email sent:", response);
        alert("Email sent");
      } catch (error) {
        console.error("Email sending failed:", error);
        alert("Failed to send email. Please try again.");
      }
  }

  /* OTP verificaation */

  inputsContainer: HTMLElement | undefined;
  @ViewChild('inputsContainer') set inputsContainerRef(elementRef: ElementRef) {
    if (elementRef) {
      this.inputsContainer = elementRef.nativeElement;
      this.ngAfterViewInit();
    }
  }
  ngAfterViewInit() {
    if (this.showOtp && this.inputsContainer) {
      const inputs: NodeListOf<HTMLInputElement> = this.inputsContainer.querySelectorAll("input");

      if (inputs && inputs.length > 0) {
        for (let i = 0; i < inputs.length ; i++) { 
          // Iterate until the second last input field
          const input: HTMLInputElement = inputs[i];

          input.addEventListener("input", (event: Event) => {
            const currentInput: HTMLInputElement = event.target as HTMLInputElement,
                  nextInput: HTMLInputElement | null = inputs[i + 1];
                   // Get the next input field

            // Enable the next input field when a digit is typed in the current input field
            if (currentInput.value && nextInput) {
              nextInput.disabled = false;
              nextInput.focus();
            }

            // Update the otpStr for all input fields
            this.otpStr = "";
            for (let j = 0; j <= i; j++) {
              this.otpStr += inputs[j].value;
              console.log(this.otpStr);
            }

            // Convert otpStr to number only if it has 4 digits
            if (this.otpStr.length === 4) {
              this.otpNumber = parseInt(this.otpStr);
            }
          });
        }

        // Focus on the first input field
        inputs[0].focus();
      } else {
        console.error("No input fields found.");
      }
    } else {
      console.log("Otp container not displayed or inputsContainer is undefined.");
    }
  }

  async verifyOtp() {
    console.log(this.otpNumber);
    if( this.otpNumber == this.generatedOTP){
      
      if(this.selectedUserType === "graduate"){
        this.showOtp = false;
        this.showGraduateDetails = true;
        this.showPersonalDetails = true;
      }
      else{
        this.showOtp = false;
        this.showEmployerDetails = true;
      }

    }
  }

  storePersonalDetails(){
    this.gender =  this.male?.nativeElement.checked ? 'Male' : 'Female',
    this.gskills =  this.skills?.nativeElement.value,
    this.gproject =  this.project?.nativeElement.value,
    this.gdob =  this.dob?.nativeElement.value,
    this.gaddress =  this.address?.nativeElement.value

    this.showPersonalDetails = false;
    this.showCollegeDetails = true;

  }

  storeGraduateDetails(){

    console.log(this.selectedUserType);

    console.log(this.userData);
  
    this.http.post<any>("http://localhost:8080/addUser" , this.userData).subscribe(
      response => {
        this.response = response;
        this.userRoleId = response.role.roleId;
        console.log('Response from backend:', response);

        this.sendRoleIdMail(this.userRoleId);
        

        const GraduateData = {
          collegeName: this.collegeName?.nativeElement.value,
          collegeAddress: this.collegeAddress?.nativeElement.value,
          gender: this.gender,
          skills: this.gskills,
          project: this.gproject,
          dateOfBirth: this.gdob,
          address: this.gaddress,
          role:{
            roleId:this.userRoleId,
            roleTitle:'graduate',
            roleDesc:'jobSeeker'
          }
        };
    
        console.log(GraduateData);
    
        this.http.post<any>("http://localhost:8080/addGraduate" , GraduateData).subscribe(
          response => {
            console.log('Response from backend:', response);
            this.router.navigateByUrl("/login");
            // Handle response as needed
          },
          error => {
            console.error('Error sending data to backend:', error);
            // Handle error as needed
          }
        );
        

      },
      error => {
        console.error('Error sending data to backend:', error);
        // Handle error as needed
      }
    );

    
    
  }
  

  storeEmployeeDetails(){
    
    this.http.post<any>("http://localhost:8080/addUser" , this.userData).subscribe(
      response => {
        this.response = response;
        this.userRoleId = response.role.roleId;
        console.log('Response from backend:', response);

        this.sendRoleIdMail(this.userRoleId);
        

        const EmployerData = {
          company:this.companyName?.nativeElement.value,
          companyAddress:this.companyAddress?.nativeElement.value,
          sector:this.sector?.nativeElement.value,
          companySize:this.companySize?.nativeElement.value,
          address: this.empAddress?.nativeElement.value,
          role:{
            roleId:this.userRoleId,
            roleTitle:'graduate',
            roleDesc:'jobSeeker'
          }
        };
    
        console.log(EmployerData);
    
        this.http.post<any>("http://localhost:8080/addEmployer" , EmployerData).subscribe(
          response => {
            console.log('Response from backend:', response);
            this.router.navigateByUrl("/login");
            // Handle response as needed
          },
          error => {
            console.error('Error sending data to backend:', error);
            // Handle error as needed
          }
        );

      },
      error => {
        console.error('Error sending data to backend:', error);
        // Handle error as needed
      }
    );

  }
}
