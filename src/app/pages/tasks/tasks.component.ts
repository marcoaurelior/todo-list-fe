import {Component, OnInit, TemplateRef} from '@angular/core';
import {CreateTaskRequest, Task, UpdateTaskRequest} from './tasks.model';
import {TasksService} from './tasks.service';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {BsModalRef, BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import swal from 'sweetalert2';

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    NgxMaskDirective
  ],
  providers: [BsModalService, provideNgxMask()],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {
  default = {
    keyboard: true,
    class: 'modal-dialog-centered'
  };
  createModal!: BsModalRef;
  updateModal!: BsModalRef;

  tasks: Task[] = [];

  createName!: string;
  createCost!: string;
  createDueDate!: string;

  editId!: string;
  editName!: string;
  editCost!: string;
  editDueDate!: string;

  constructor(
    private tasksService: TasksService,
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.getAllTasks()
  }

  private getAllTasks() {
    this.tasksService.getAllTasks().subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
      },
      error: (err: any) => {
        console.error('Erro ao carregar tasks', err);
      }
    });
  }

  createTask(newTaskForm: NgForm) {
    const request: CreateTaskRequest = {
      name: this.createName,
      cost: this.createCost,
      dueDate: this.createDueDate
    };

    this.tasksService.createTask(request).subscribe({
      next: () => {
        this.getAllTasks();
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.createModal.hide();
    newTaskForm.resetForm();
  }

  openCreateModal(modalDefault: TemplateRef<void>) {
    this.createModal = this.modalService.show(modalDefault, this.default);
  }

  updateTask(updateTaskForm: NgForm) {
    const request: UpdateTaskRequest = {
      name: this.createName,
      cost: this.createCost,
      dueDate: this.createDueDate
    };

    this.tasksService.updateTask(this.editId, request).subscribe({
      next: () => {
        this.getAllTasks();
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.createModal.hide();
    updateTaskForm.resetForm();
  }

  openEditTaskModal(modal: any, taskId: string): void {
    this.editId = taskId;
    this.tasksService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.editName = task?.name!;
        this.editDueDate = task?.dueDate!;
        this.editCost = task?.cost!;
        this.editId = task?.id!;
        this.openEditModal(modal);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  openEditModal(modalDefault: TemplateRef<void>) {
    this.updateModal = this.modalService.show(modalDefault, this.default);
  }

  deleteTask(id: string): void {
    swal
      .fire({
        title: 'Você tem certeza?',
        text: 'Essa tarefa será removida permanentemente!',
        icon: 'error',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: 'Apagar Tarefa',
        cancelButtonText: 'Cancelar',

        customClass: {
          confirmButton: 'btn btn-danger me-3',
          cancelButton: 'btn btn-secondary'
        }
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.tasksService.deleteTask(id).subscribe({
            next: () => {
              this.getAllTasks();
            },
            error: (error) => {
              console.error(error);
            }
          });
        }
      });
  }
}
