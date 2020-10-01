import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { BackendClientService } from 'src/app/services/backend-client.service';
import { Cidade } from 'src/app/models/cidade';
import { Login } from 'src/app/models/login';
import Swal from 'sweetalert2';
import cidades from '../../../assets/javascript/cidades'
import estados from '../../../assets/javascript/estados'
import { Atleta } from 'src/app/models/atleta';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(private router: Router, private backend: BackendService, private service: BackendClientService) { }

  public maskCPF = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskTel = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCel = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskRG = [/\d/, /\d/, '.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'-', /\d/];

  private session = Login

  files: Set<File>;
  cidades: Cidade[];

  atletas: Atleta[];
  atletaAtual: Atleta[];

  public cities = cidades
  public states = estados

  imgURL: any;
  public imagePath;
  public message: string;

  ngOnInit() {
    if (localStorage.getItem(this.session.token)) {
      this.router.navigate(['create'])
    } else {
      this.router.navigate([''])
    }
  }

  @ViewChild('nomeatleta', { static: true }) nome;
  @ViewChild('pictureatleta', { static: true }) picture;
  @ViewChild('rgatleta', { static: true }) rg;
  @ViewChild('data_nasc', { static: true }) data_nasc;
  @ViewChild('cpfatleta', { static: true }) cpf;
  @ViewChild('emailatleta', { static: true }) email;
  @ViewChild('telefoneatleta', { static: true }) telefone;
  @ViewChild('celularatleta', { static: true }) celular;
  @ViewChild('enderecoatleta', { static: true }) endereco;
  @ViewChild('cidadeatleta', { static: true }) cidade;
  @ViewChild('estadoatleta', { static: true }) estado;
  @ViewChild('nome_responsavel', { static: true }) nome_responsavel;
  @ViewChild('cpf_responsavel', { static: true }) cpf_responsavel;
  @ViewChild('telefone_responsavel', { static: true }) telefone_responsavel;
  @ViewChild('celular_responsavel', { static: true }) celular_responsavel;

  createAtleta() {
    let data = {
      nome: this.nome.nativeElement.value,
      rg: this.rg.nativeElement.value,
      data_nasc: this.data_nasc.nativeElement.value,
      foto: this.picture.nativeElement.value,
      cpf: this.cpf.nativeElement.value,
      email: this.email.nativeElement.value,
      telefone: this.telefone.nativeElement.value,
      celular: this.celular.nativeElement.value,
      endereco: this.endereco.nativeElement.value,
      cidade: this.cidade.nativeElement.value,
      estado: this.estado.nativeElement.value,
      nome_responsavel: this.nome_responsavel.nativeElement.value,
      cpf_responsavel: this.cpf_responsavel.nativeElement.value,
      telefone_responsavel: this.telefone_responsavel.nativeElement.value,
      celular_responsavel: this.celular_responsavel.nativeElement.value
    }
    let cpf = {
      cpf: this.cpf.nativeElement.value
    }
    if (data.nome != "" &&  data.rg != "" && data.foto != "" && data.data_nasc != "" && data.cpf != "" && data.email != "" && data.telefone != "" && data.celular != "" && data.endereco != "" && data.cidade != "0" && data.estado != "0") {
      this.backend.verificacpf(cpf).subscribe(res => {
        if (res["result"] == 1) {
          Swal.fire({
            type: "warning",
            title: "Erro!",
            text: "Esse CPF já foi Cadastrado!",
            timer: 1000,
            showConfirmButton: false,
          });
        } else {
          if (this.files && this.files.size > 0) {
            this.service.upload(this.files, data.cpf).subscribe((res) => {});
            this.backend.createatleta(data).subscribe((res) => {
              if (res["status"] == 200) {
                Swal.fire({
                  type: "success",
                  title: "Sucesso!",
                  text: "O Atleta foi Cadastrado!",
                  timer: 1000,
                  showConfirmButton: false,
                });
                this.router.navigate(["home"]);
              } else {
                Swal.fire({
                  type: "warning",
                  title: "Atenção!",
                  text: "Não foi Possível Realizar o Cadastro!",
                  timer: 1000,
                });
              }
            });
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

  onSelect(stateName) {
    this.cidades = this.cities.filter((item) => item.estado == stateName);
  }

  onChange(event) {
    const selectedFiles = <FileList>event.srcElement.files;
    const fileNames = [];
    this.files = new Set();
    for (let i = 0; i < selectedFiles.length; i++) {
      fileNames.push(selectedFiles[i].name);
      this.files.add(selectedFiles[i]);
    }
    const fileName = fileNames.join(', ');
    return document.getElementById('photo').innerHTML = fileName
  }

  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      const perfil = document.getElementById('perfil')
      perfil['src'] = this.imgURL
    }
  }

}
