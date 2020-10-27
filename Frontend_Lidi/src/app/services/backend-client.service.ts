import { environment } from './../../environments/environment';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Atleta } from "../models/atleta";
import { Equipe } from '../models/equipe';

// const URL = environment.api;
const URL = "http://localhost:3000";

@Injectable({
  providedIn: "root"
})
export class BackendClientService {
  constructor(private http: HttpClient) {}

  listarAtletas() {
    return this.http.get<Atleta[]>(`${URL}/atleta/read`);
  }

  listarEquipes() {
    return this.http.get<Equipe[]>(`${URL}/equipe/read`);
  }

  upload(files: Set<File>, cpf) {
    const formData = new FormData();
    files.forEach(file => formData.append("photo", file));
    formData.append("cpf", cpf);
    return this.http.post(`${URL}/atleta/upload/image`, formData, {
      observe: "events",
      reportProgress: true
    });
  }

  uploadEquipe(files: Set<File>, cnpj) {
    const formData = new FormData();
    files.forEach(file => formData.append("url_logotipo", file));
    formData.append("cnpj", cnpj);
    return this.http.post(`${URL}/equipe/upload/image`, formData, {
      observe: "events",
      reportProgress: true
    });
  }

}
