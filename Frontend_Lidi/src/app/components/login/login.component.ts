import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { Login } from 'src/app/models/login';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private backend: BackendService, private router: Router) { }

  private session = Login

  ngOnInit() {
    if (localStorage.getItem(this.session.token)) {
      this.router.navigate(['home'])
    } else {
      this.router.navigate([''])
    }
  }

  @ViewChild('user', { static: true }) user;
  @ViewChild('password', { static: true }) password;

  login() {
    let data = {
      user: this.user.nativeElement.value,
      password: this.password.nativeElement.value
    }
    this.backend.login(data).subscribe(res => {
      if (data.user == this.session.userName && data.password == this.session.password) {
        const user = data.user
        localStorage.setItem(this.session.token, res['token'])
        this.router.navigate(['home'])
        Swal.fire({
          type: 'success',
          title: 'Sucesso!',
          text: 'Bem Vindo a Liga Admin!',
          timer: 1000,
          showConfirmButton: false
        })

      } else if (!data.user || !data.password) {
        Swal.fire({
          type: 'warning',
          title: 'Não foi Possível Entrar na Liga!',
          text: 'Preencha todos os Campos!',
          timer: 1000,
          showConfirmButton: false
        })
      }

      else {
        Swal.fire({
          type: 'warning',
          title: 'Não foi Possível Entrar na Liga!',
          text: 'Usuário ou Senha Inválidos!',
          timer: 1000,
          showConfirmButton: false
        })
      }
    })
  }

}
