import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from 'src/app/models/Contact';
import { Group } from 'src/app/models/Group';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }
  showGroups=false;
  groups: Group[] = [
    {id:1,name:"Família"},
    {id:2,name:"Trabalho"},
    {id:3,name:"Amigos"},
  ];
  contacts: Contact[] = [];
  id?:number;
  name:string='';
  phone:string='';
  group?:Group=undefined;
  ngOnInit(): void {
    try {
      const obj=JSON.parse(sessionStorage.getItem('groups')||"") as Group[];
      if(obj){
        this.groups=obj
      }
    } catch (error) { }

    try {
      const obj=JSON.parse(sessionStorage.getItem('contacts')||"")as Contact[];
      if(obj){
        this.contacts=obj
      }
    } catch (error) { }

    try {
      const paramId:number=parseInt(this.route.snapshot.paramMap.get('id')||"") ;
      const contact=this.contacts.find(contato => contato.id === paramId);
      if(contact){
        this.id=contact!.id;
        this.name=contact!.name||'';
        this.phone=contact!.phone||'';
        this.group=contact.group;
      }
    } catch (error) { }
  }
  save(){
    if(this.id){
      this.update();
    }
    else{
      this.create();
    }
    this.clean();
    sessionStorage.setItem('contacts', JSON.stringify(this.contacts));
  }
  generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  create(){
    let contact:Contact={
      id:this.generateRandomNumber(0,100),
      name:this.name,
      phone:this.phone,
      group:this.group,
    }
    this.contacts.push({...contact})
  }
  update(){
    const index = this.contacts.findIndex(c => c.id === this.id);
    if (index >= 0 && index < this.contacts.length) {
      let contact:Contact={
        id:this.id,
        name:this.name,
        phone:this.phone,
        group:this.group,
      }
      this.contacts[index]=({...contact})
    }
  }
  clean(){
    this.id=undefined;
    this.name='';
    this.phone='';
    this.group=undefined;
  }
  editItem(id?:number){
    this.router.navigate(['/cadastro-contatos', id]);
  }
  deleteItem(id?:number){
    const index = this.contacts.findIndex(c => c.id === id);
    if (index >= 0 && index < this.contacts.length) {
      this.contacts.splice(index, 1);
    }
    this.clean();
    sessionStorage.setItem('contacts', JSON.stringify(this.contacts));
  }
  refreshGroups(groups: Group[]){
    this.showGroups=false;
    this.groups=groups;
    sessionStorage.setItem('groups', JSON.stringify(this.groups));
  }
  onShowGroups(){
    this.showGroups=true;
  }
}
