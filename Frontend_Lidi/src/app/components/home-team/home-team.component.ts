import { Component, OnInit, ViewChildren } from "@angular/core";
import { Router } from "@angular/router";
import { BackendService } from "src/app/services/backend.service";
import { BackendClientService } from "src/app/services/backend-client.service";
import { Login } from "src/app/models/login";
import { Equipe } from "src/app/models/equipe";
import Swal from "sweetalert2";

@Component({
  selector: "app-home-team",
  templateUrl: "./home-team.component.html",
  styleUrls: ["./home-team.component.css"]
})
export class HomeTeamComponent implements OnInit {
  constructor(
    private router: Router,
    private backend: BackendService,
    private service: BackendClientService
  ) {}

  public maskCNPJ = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskCel = ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  private session = Login;

  files: Set<File>;
  window: Window;
  location: Location;

  equipes: Equipe[];
  equipeAtual: Equipe[];

  imgURL: any;
  public imagePath;
  public message: string;

  profileIMG = "";

  ngOnInit() {
    if (localStorage.getItem(this.session.token)) {
      this.router.navigate(["homeTeam"]);
    } else {
      this.router.navigate([""]);
    }
    this.service.listarEquipes().subscribe(res => {
      this.equipes = res["equipes"];
      console.log(res['equipes'])

      for(let i=0; i<res["equipes"].length; i++){
        res["equipes"][i]["cnpj"] = res["equipes"][i]["cnpj"].replace(/(\d{2})?(\d{3})?(\d{3})?(\d{4})?(\d{2})/, "$1.$2.$3/$4-$5")
      }
    });
  }

  @ViewChildren("nomeequipe") nome;
  @ViewChildren("cnpjequipe") cnpj1;
  @ViewChildren("empresaequipe") empresa;
  @ViewChildren("url_logotipoequipe") url_logotipo;
  @ViewChildren("responsavelequipe") responsavel;
  @ViewChildren("telefoneequipe") telefone;
  @ViewChildren("emailequipe") email;
  @ViewChildren("tecnicoequipe") tecnico;
  @ViewChildren("auxTecnicoequipe") auxTecnico;
  @ViewChildren("massagistaequipe") massagista;

  modal(equipe) {
    this.equipeAtual = [];
    this.equipeAtual.push(equipe);
    const cnpj1 = equipe.cnpj
    const cnpj2 = cnpj1.replace('.', '')
    const cnpj3 = cnpj2.replace('.', '')
    const cnpj4 = cnpj3.replace('-', '')
    const cnpj5 = cnpj4.replace('/', '')
    this.backend.profilePicEquipe(cnpj5).subscribe(res => {
      this.profileIMG = res['url'];
    });
  }

  updateequipe(equipe) {
    const cnpj2 = this.cnpj1.first.nativeElement.value;
    const cnpj3 = cnpj2.replace('.', '')
    const cnpj4 = cnpj3.replace('.', '')
    const cnpj5 = cnpj4.replace('-', '')
    const cnpj6 = cnpj5.replace('/', '')
    let data = {
      nome: this.nome.first.nativeElement.value,
      cnpj: cnpj6,
      empresa: this.empresa.first.nativeElement.value,
      url_logotipo: this.url_logotipo.first.nativeElement.value,
      responsavel: this.responsavel.first.nativeElement.value,
      telefone_responsavel: this.telefone.first.nativeElement.value,
      email_responsavel: this.email.first.nativeElement.value,
      tecnico: this.tecnico.first.nativeElement.value,
      auxTecnico: this.auxTecnico.first.nativeElement.value,
      massagista: this.massagista.first.nativeElement.value
    };
    this.equipeAtual = [];
    this.equipeAtual.push(equipe);
    if (data.url_logotipo == "") {
      data.url_logotipo = equipe.url_logotipo;
    }
    if (
      data.nome != "" &&
      data.cnpj != "" &&
      data.empresa != "" &&
      data.responsavel != "" &&
      data.telefone_responsavel != "" &&
      data.email_responsavel != "" &&
      data.tecnico != "" &&
      data.auxTecnico != "" &&
      data.massagista != ""
    ) {
      this.backend.updateequipe(data, equipe.id).subscribe(res => {
        if (res['status'] == 200) {
          Swal.fire({
            title: "Sucesso!",
            text: "A Equipe foi Editada!",
            type: "success",
            showConfirmButton: false
          });
          if (this.files && this.files.size > 0) {
            this.service.uploadEquipe(this.files, data.cnpj).subscribe(res => {});
          }
          setTimeout(function() {
            window.location.reload();
          }, 800);
        }
      });
    } else {
      Swal.fire({
        title: "Atenção!",
        text: "Preencha todos os Campos para Atualizar o Registro",
        type: "warning",
        timer: 1200,
        showCancelButton: false,
        showConfirmButton: false
      });
    }
  }

  deleteequipe(equipe) {
    Swal.fire({
      title: "Atenção!",
      text: "Esta ação não poderá ser Desfeita!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Excluir",
      confirmButtonColor: "rgba(67, 117, 255, 0.95)",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.value) {
        this.equipeAtual = [];
        this.equipeAtual.push(equipe);
        this.backend.deleteequipe(equipe.id).subscribe(res => {
          if (res['status'] == 200) {
            Swal.fire({
              title: "Sucesso!",
              text: "A Equipe foi Excluida!",
              type: "success",
              showConfirmButton: false
            });
            setTimeout(function() {
              window.location.reload();
            }, 800);
          }
        });
      }
    });
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
    return (document.getElementById("url_logotipo").innerHTML = fileName);
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
