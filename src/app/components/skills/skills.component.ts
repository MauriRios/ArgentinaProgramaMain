import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Skill } from 'src/app/model/skill.model';
import { TokenService } from 'src/app/service/token.service';



@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  skills: Skill[];
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
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.getSkill();
    this.editForm = this.fb.group({
      id: [''],
      skill: [''],
      skillBar: [''],
    }),

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach(rol => {
      if (rol === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    });
  }

  getSkill(){
    this.httpClient.get<any>('https://backmiportfolio.herokuapp.com/skill/traer').subscribe(
      response =>{
        // console.log(response);
        this.skills = response;
      }
    )
  }

  onSubmit(f: NgForm) {
    // console.log(f.form.value);
    const url = 'https://backmiportfolio.herokuapp.com/skill/crear';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit();
      });
    this.modalService.dismissAll();
  }

  openEdit(targetModal, skill:Skill) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue( {
      id: skill.id,
      skill: skill.skill,
      skillBar: skill.skillBar,

    });
  }

  onSave() {
    const editURL = 'https://backmiportfolio.herokuapp.com/skill/' + 'editar/'  + this.editForm.value.id ;
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal, skill:Skill) {
    this.deleteId = skill.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete() {
    const deleteURL = 'https://backmiportfolio.herokuapp.com/skill/' +  'borrar/'+ this.deleteId ;
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }


  onAgregar(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    .result.then((result) => {
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
