import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Proyecto } from 'src/app/model/proyecto.model';
import { TokenService } from 'src/app/service/token.service';


@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  proyectos: Proyecto[];
  closeResult: string;
  editForm: FormGroup;
  private deleteId: number;
  isAdmin = false;
  roles: string[];
  URL = 'https://backmiportfolio.herokuapp.com/';
  URL2 = 'https://localhost:8080/'

  constructor(config: NgbModalConfig, 
    private tokenService : TokenService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public httpClient:HttpClient) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  

  ngOnInit(): void {
    this.getProyectos();
    this.editForm = this.fb.group({
      id: [''],
      tituloProyecto: [''],
      descripcionProyecto: [''],
    }),

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  getProyectos(){
    this.httpClient.get<any>('https://backmiportfolio.herokuapp.com/proyecto/traer').subscribe(
      response =>{
        // console.log(response);
        this.proyectos = response;
      }
    )
  }


  onSubmit(f: NgForm) {
    // console.log(f.form.value);
    const url = 'https://backmiportfolio.herokuapp.com/proyecto/crear';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); // reload the table
      });
    this.modalService.dismissAll(); // dismiss the modal
  }

  openEdit(targetModal, proyecto:Proyecto) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue( {
      id: proyecto.id,
      tituloProyecto: proyecto.tituloProyecto,
      descripcionProyecto: proyecto.descripcionProyecto,
    });
  }

  onSave() {
    const editURL = 'https://backmiportfolio.herokuapp.com/proyecto/' + 'editar/'  + this.editForm.value.id ;
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal, proyecto:Proyecto) {
    this.deleteId = proyecto.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete(): void {
    const deleteURL = 'https://backmiportfolio.herokuapp.com/proyecto/' +  'borrar/'+ this.deleteId ;
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }


  onAgregar(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


}
