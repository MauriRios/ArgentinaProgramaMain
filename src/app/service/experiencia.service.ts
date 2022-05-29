import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Experiencia } from '../model/experiencia.model';

@Injectable({
  providedIn: 'root',
})
export class ExperienciaService {
  URL = 'http://localhost:8080/experiencia';

  constructor(private http: HttpClient) {}

  public getExperiencias(): Observable<Experiencia[]> {
    return this.http.get<Experiencia[]>(this.URL + '/traer');
  }

  public getExperiencia(id: number) {
    return this.http.get<Experiencia>(this.URL + '/' + id);
  }

  public createExperiencia(experiencia: Experiencia) {
    return this.http.post<Experiencia>(this.URL + '/crear/', experiencia);
  }

  public deleteExperiencia(experiencia: Experiencia) {
    return this.http.delete<Experiencia>(this.URL + '/borrar/' + experiencia.id);
  }

  public editExperiencia(experiencia: Experiencia) {
    return this.http.put<Experiencia>(this.URL + '/editar/' + experiencia.id,experiencia);
  }
}