import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Persona } from '../model/persona.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  URL= 'https://backmiportfolio.herokuapp.com/persona/'
  
  //'http://localhost:8080/persona/';

  constructor(private http: HttpClient) { }


  public getPersona(): Observable<Persona>{
    return this.http.get<Persona>(this.URL+ 'traer/perfil');
  }

  public EditPersona(persona:Persona){
  return this.http.put<Persona>(this.URL +'editar/' + persona.id, persona)
    
  }
  

  }

