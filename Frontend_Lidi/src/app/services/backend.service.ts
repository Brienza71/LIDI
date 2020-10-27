import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";


// const URL = "http://fiecdev.kinghost.net:21525";
const URL = "http://localhost:3000";

@Injectable({
  providedIn: "root",
})
export class BackendService {
  constructor(private http: HttpClient) {}

  login(data) {
    return this.http.post(`${URL}/session/login`, data);
  }

  verificacpf(data) {
    return this.http.post(`${URL}/atleta/verifica`, data);
  }

  verificacnpj(data) {
    return this.http.post(`${URL}/equipe/verifica`, data);
  }

  updateatleta(data, id) {
    return this, this.http.put(`${URL}/atleta/update/${id}`, data);
  }

  updateequipe(data, id) {
    return this, this.http.put(`${URL}/equipe/update/${id}`, data);
  }

  createatleta(data) {
    return this.http.post(`${URL}/atleta/create`, data);
  }

  createequipe(data) {
    return this.http.post(`${URL}/equipe/create`, data);
  }

  deleteatleta(id) {
    return this.http.delete(`${URL}/atleta/delete/${id}`);
  }

  deleteequipe(id) {
    return this.http.delete(`${URL}/equipe/delete/${id}`);
  }

  profilePic(cpf) {
    return this.http.get(`${URL}/atleta/profile/pic/${cpf}`);
  }

  profilePicEquipe(cnpj) {
    return this.http.get(`${URL}/equipe/profile/pic/${cnpj}`);
  }
}
