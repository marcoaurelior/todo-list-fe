import {Component, OnInit, TemplateRef} from '@angular/core';
import {CreateTaskRequest, Task, UpdateAllTasksOrderRequest, UpdateTaskRequest} from './tasks.model';
import {TasksService} from './tasks.service';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {BsModalRef, BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import swal from 'sweetalert2';
import {CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ModalModule,
    FormsModule,
    NgxMaskDirective,
    CdkDropList,
    CdkDrag,
    CdkDragPreview
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
  editModal!: BsModalRef;

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

  dragAndDrop(event: CdkDragDrop<Task[]>) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    this.updateOrder();
  }

  updateOrder(): void {
    const orderedTasks: UpdateAllTasksOrderRequest[] = this.tasks.map((task, index) => ({
      id: task.id,
      displayOrder: index
    }));

    this.tasksService.updateAllDisplayOrder(orderedTasks).subscribe({
      next: (updatedTasks) => {
        console.log('Ordem atualizada com sucesso', updatedTasks);
        this.getAllTasks();
      },
      error: (error) => {
        console.error('Erro ao atualizar ordem', error);
      }
    });
  }

  moveUp(index: number) {
    if (index > 0) {
      const temp = this.tasks[index];
      this.tasks[index] = this.tasks[index - 1];
      this.tasks[index - 1] = temp;
    }
  }

  moveDown(index: number) {
    if (index < this.tasks.length - 1) {
      const temp = this.tasks[index];
      this.tasks[index] = this.tasks[index + 1];
      this.tasks[index + 1] = temp;
    }
  }

  updateTask(updateTaskForm: NgForm) {
    const request: UpdateTaskRequest = {
      name: this.editName,
      cost: this.editCost,
      dueDate: this.editDueDate
    };

    this.tasksService.updateTask(this.editId, request).subscribe({
      next: () => {
        this.getAllTasks();
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.editModal.hide();
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
    this.editModal = this.modalService.show(modalDefault, this.default);
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
