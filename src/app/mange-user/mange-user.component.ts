import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { User } from '../register/user.model';
import { UserService } from '../register/user.service';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import {MatTableDataSource, MatTable} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})

export class ManageUserComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;

  public users: User[];
  displayedColumns: string[] = ['username', 'firstname', 'lastname', 'address', 'role', 'action'];
  // displayedColumns: string[] = ['select', 'username', 'firstname', 'lastname', 'address', 'role', 'action'];
  dataSource: any;
  data: any;
  selection = new SelectionModel<User>(true, []);

  constructor(private elementRef: ElementRef,
              private userService: UserService,
              public dialog: MatDialog) {
  }

  openDialog(action, obj, index?) {
    obj.action = action;
    obj.index = index;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '587px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Edit') {
        this.editUser(result.data);
      } else if (result.event === 'Delete') {
        this.removeSelectedRows(result.data.index);
      }
    });
  }

  editUser(editData) {
    this.userService.updateUser(editData).subscribe(() => {
      this.fillDataTable();
    });
  }

  ngOnInit() {
    this.fillDataTable();
  }

  fillDataTable() {
    this.userService.getUsers().subscribe(data => {
      this.users = data.users;
      this.dataSource = new MatTableDataSource<User>(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.data = Object.assign(this.dataSource);
    });
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '';
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  removeSelectedRows(index) {
    this.userService.deleteUser(this.users[index].id).subscribe(() => {
      this.fillDataTable();
    });
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
