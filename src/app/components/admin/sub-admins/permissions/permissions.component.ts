import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent {

  [key: string]: any;
  name: any = null;
  count: any = null;
  checkAll = false;
  data: any[] = [];
  selectedIds: number[] = [];

  checkAllModules = false;
  checkAllAdd = false;
  checkAllView = true;
  checkAllEdit = false;
  checkAllDelete = false;

  constructor(private route: ActivatedRoute, private service: SharedService, private location: Location) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const paramValue = params.get('name');
      if (paramValue) {
        if (!isNaN(Number(paramValue))) {
          this.count = paramValue;
          this.name = null;
        } else {
          this.name = paramValue;
          this.count = null;
        }
      }
    });
    this.loadData();
    this.toggleAllCheckboxes('view');
  }

  loadData() {
    this.data = [
      { id: 1, title: 'Module 1', checkedModules: false, checkedAdd: false, checkedView: false, checkedEdit: false, checkedDelete: false },
      { id: 2, title: 'Module 2', checkedModules: false, checkedAdd: false, checkedView: false, checkedEdit: false, checkedDelete: false },
      { id: 3, title: 'Module 3', checkedModules: false, checkedAdd: false, checkedView: false, checkedEdit: false, checkedDelete: false },
    ];
  }

  toggleAllCheckboxes(column: string) {
    this.data.forEach(item => {
      item[`checked${this.capitalize(column)}`] = this[`checkAll${this.capitalize(column)}`];
    });
  }

  updateColumnCheckAll(column: string, pic: any) {
    this[`checkAll${this.capitalize(column)}`] = this.data.every(item => item[`checked${this.capitalize(column)}`]);
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }


  logSelectedModules() {
    const selectedModules = this.data
      .filter(pic => pic.checkedModules) // Only modules explicitly selected
      .map(pic => {
        return {
          title: pic.title,
          selectedOptions: {
            add: pic.checkedAdd,
            view: pic.checkedView,
            edit: pic.checkedEdit,
            delete: pic.checkedDelete,
          },
        };
      });
    console.log('==========>', selectedModules);
  }

  backClicked() {
    this.location.back();
  }


}
