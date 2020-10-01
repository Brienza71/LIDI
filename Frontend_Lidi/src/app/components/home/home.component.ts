import { Component, OnInit, ViewChildren } from '@angular/core'
import { Router } from '@angular/router'
import Swal from 'sweetalert2'
import { BackendService } from 'src/app/services/backend.service'
import { BackendClientService } from 'src/app/services/backend-client.service'
import cidades from '../../../assets/javascript/cidades'
import estados from '../../../assets/javascript/estados'
import { Login } from 'src/app/models/login'
import { Atleta } from 'src/app/models/atleta'
import { Cidade } from 'src/app/models/cidade';

@Component({
  selector: 'app-list',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private backend: BackendService, private service: BackendClientService) { }

  public maskCPF = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskTel = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskCel = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public maskRG = [/\d/, /\d/, '.', /\d/, /\d/, /\d/,'.', /\d/, /\d/, /\d/,'-', /\d/];

  private session = Login

  files: Set<File>;
  window: Window
  location: Location
  cidades: Cidade[]

  atletas: Atleta[]
  atletaAtual: Atleta[]

  public cities = cidades
  public states = estados

  imgURL: any;
  public imagePath;
  public message: string;

  profileIMG = ''

  ngOnInit() {
    if (localStorage.getItem(this.session.token)) {
      this.router.navigate(['home'])
    } else {
      this.router.navigate([''])
    }
    this.service.listarAtletas().subscribe(res => {
      this.atletas = res['atletas']
    })
  }

  @ViewChildren('nomeatleta') nome;
  @ViewChildren('pictureatleta') picture;
  @ViewChildren('data_nasc') data_nasc;
  @ViewChildren('cpfatleta') cpf;
  @ViewChildren('rgatleta') rg;
  @ViewChildren('emailatleta') email;
  @ViewChildren('telefoneatleta') telefone;
  @ViewChildren('celularatleta') celular;
  @ViewChildren('enderecoatleta') endereco;
  @ViewChildren('cidadeatleta') cidade;
  @ViewChildren('estadoatleta') estado;
  @ViewChildren('nome_responsavel') nome_responsavel;
  @ViewChildren('cpf_responsavel') cpf_responsavel;
  @ViewChildren('telefone_responsavel') telefone_responsavel;
  @ViewChildren('celular_responsavel') celular_responsavel;

  modal(atleta) {
    this.atletaAtual = []
    this.atletaAtual.push(atleta)
    atleta.data_nasc = atleta.data_nasc.split('/').reverse().join('-')
    this.backend.profilePic(atleta.cpf).subscribe(res => {
      this.profileIMG = res['url']
    })
  }

  onSelect(stateName) {
    this.cidades = this.cities.filter((item) => item.estado == stateName)
  }

  updateChange() {
    const opt = document.getElementById('default')
    opt.setAttribute('selected', 'selected');
  }

  updateatleta(atleta) {
    let data = {
      nome: this.nome.first.nativeElement.value,
      data_nasc: this.data_nasc.first.nativeElement.value,
      foto: this.picture.first.nativeElement.value,
      cpf: this.cpf.first.nativeElement.value,
      rg: this.rg.first.nativeElement.value,
      email: this.email.first.nativeElement.value,
      telefone: this.telefone.first.nativeElement.value,
      celular: this.celular.first.nativeElement.value,
      endereco: this.endereco.first.nativeElement.value,
      cidade: this.cidade.first.nativeElement.value,
      estado: this.estado.first.nativeElement.value,
      nome_responsavel: this.nome_responsavel.first.nativeElement.value,
      cpf_responsavel: this.cpf_responsavel.first.nativeElement.value,
      telefone_responsavel: this.telefone_responsavel.first.nativeElement.value,
      celular_responsavel: this.celular_responsavel.first.nativeElement.value
    }
    this.atletaAtual = [];
    this.atletaAtual.push(atleta);
    if (data.foto == '') {
      data.foto = atleta.foto
    }
    if (data.cidade == '0') {
      Swal.fire({
        type: "warning",
        title: 'Atenção!',
        text: 'Preencha todos os Campos para Atualizar o Registro!',
        timer: 1000,
        showConfirmButton: false
      })
    } else {
      this.backend.updateatleta(data, atleta.id).subscribe(res => {
        if (res["status"] == 200) {
          Swal.fire({
            title: "Sucesso!",
            text: "O Atleta foi Editado!",
            type: "success",
            showConfirmButton: false,
          });
          if (this.files && this.files.size > 0) {
            this.service.upload(this.files, data.cpf).subscribe((res) => {});
          }
          setTimeout(function () {
            window.location.reload();
          }, 800);
        }
      })
    }
  }

  deleteatleta(atleta) {
    Swal.fire({
      title: 'Atenção!',
      text: "Esta ação não poderá ser Desfeita!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      confirmButtonColor: 'rgba(67, 117, 255, 0.95)',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.atletaAtual = []
        this.atletaAtual.push(atleta)
        this.backend.deleteatleta(atleta.id).subscribe(res => {
          if (res['status'] == 200) {
            Swal.fire({
              title: 'Sucesso!',
              text: 'O Atleta foi Excluido!',
              type: 'success',
              showConfirmButton: false,
            })
            setTimeout(function () { window.location.reload() }, 800)
          }
        })
      }
    })
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




