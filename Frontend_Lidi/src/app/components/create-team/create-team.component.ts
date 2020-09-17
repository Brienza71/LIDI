import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { BackendClientService } from 'src/app/services/backend-client.service';
import { Equipe } from 'src/app/models/equipe';
import { Login } from 'src/app/models/login';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.css']
})
export class CreateTeamComponent implements OnInit {
  constructor(private router: Router, private backend: BackendService, private service: BackendClientService) { }

  public maskCNPJ = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskCel = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  private session = Login

  files: Set<File>;

  equipes: Equipe[];
  equipeAtual: Equipe[];

  imgURL: any;
  public imagePath;
  public message: string;

  ngOnInit() {
    if (localStorage.getItem(this.session.token)) {
      this.router.navigate(['createTeam'])
    } else {
      this.router.navigate([''])
    }
  }
  
  @ViewChild("nomeequipe", { static: true }) nome;
  @ViewChild("cnpjequipe", { static: true }) cnpj1;
  @ViewChild("empresaequipe", { static: true }) empresa;
  @ViewChild("logotipoequipe", { static: true }) logotipo;
  @ViewChild("responsavelequipe", { static: true }) responsavel;
  @ViewChild("telefoneequipe", { static: true }) telefone_responsavel;
  @ViewChild("emailequipe", { static: true }) email_responsavel;
  @ViewChild("tecnicoequipe", { static: true }) tecnico;
  @ViewChild("auxTecnicoequipe", { static: true }) auxTecnico;
  @ViewChild("massagistaequipe", { static: true }) massagista;

  createEquipe() {
    const cnpj2 = this.cnpj1.nativeElement.value;
    const cnpj3 = cnpj2.replace('.', '')
    const cnpj4 = cnpj3.replace('.', '')
    const cnpj5 = cnpj4.replace('-', '')
    const cnpj6 = cnpj5.replace('/', '')
    let data = {
      nome: this.nome.nativeElement.value,
      cnpj: cnpj6,
      empresa: this.empresa.nativeElement.value,
      logotipo: this.logotipo.nativeElement.value,
      responsavel: this.responsavel.nativeElement.value,
      telefone_responsavel: this.telefone_responsavel.nativeElement.value,
      email_responsavel: this.email_responsavel.nativeElement.value,
      tecnico: this.tecnico.nativeElement.value,
      auxTecnico: this.auxTecnico.nativeElement.value,
      massagista: this.massagista.nativeElement.value
    }
    let cnpj = {
      cnpj: cnpj6
    }
    if (data.nome != "" && data.logotipo != "" && data.cnpj != "" && data.empresa != "" && data.responsavel != "" && data.telefone_responsavel != "" && data.email_responsavel != "" && data.tecnico != "" && data.auxTecnico != "" && data.massagista != "") {
      this.backend.verificacnpj(cnpj).subscribe(res => {
        if (res.json().result == 1) {
          Swal.fire({
            type: 'warning',
            title: 'Erro!',
            text: 'Esse CNPJ já foi Cadastrado!',
            timer: 1000,
            showConfirmButton: false
          })
        } else {
          if (this.files && this.files.size > 0) {
            this.service.uploadEquipe(this.files, data.cnpj).subscribe(res => { });
            this.backend.createequipe(data).subscribe(res => {
              if (res.status == 200) {
                Swal.fire({
                  type: 'success',
                  title: 'Sucesso!',
                  text: 'A Equipe foi Cadastrada!',
                  timer: 1000,
                  showConfirmButton: false
                });
                this.router.navigate(['homeTeam']);
              } else {
                Swal.fire({
                  type: 'warning',
                  title: 'Atenção!',
                  text: 'Não foi Possível Realizar o Cadastro!',
                  timer: 1000,
                })
              }
            })
          }
        }
      })
    } else {
      Swal.fire({
        type: "warning",
        title: 'Atenção!',
        text: 'Preencha todos os Campos para Realizar o Cadastro!',
        timer: 1000,
        showConfirmButton: false
      })
    }
  }

  onChange(event) {
    const selectedFiles = <FileList>event.srcElement.files;
    const fileNames = [];
    this.files = new Set();
    for (let i = 0; i < selectedFiles.length; i++) {
      fileNames.push(selectedFiles[i].name);
      this.files.add(selectedFiles[i]);
    }
    const fileName = fileNames.join(", ");
    return (document.getElementById("logotipo").innerHTML = fileName);
  }

  preview(files) {
    if (files.length === 0) return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = _event => {
      this.imgURL = reader.result;
      const perfil = document.getElementById("perfil");
      perfil["src"] = this.imgURL;
    };
  }

}
