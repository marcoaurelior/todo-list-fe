import {Component, LOCALE_ID, OnInit, TemplateRef} from '@angular/core';
import {CreateTaskRequest, Task, UpdateAllTasksOrderRequest, UpdateTaskRequest} from './tasks.model';
import {TasksService} from './tasks.service';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
import {BsModalRef, BsModalService, ModalModule} from 'ngx-bootstrap/modal';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import swal from 'sweetalert2';
import {CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {NotificationService} from '../../core/notification.service';

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
  providers: [BsModalService, provideNgxMask(), CurrencyPipe, {provide: LOCALE_ID, useValue: 'pt-BR'}],
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
  createCost!: number;
  createDueDate!: string;

  editId!: string;
  editName!: string;
  editCost!: number;
  editDueDate!: string;

  constructor(
    private tasksService: TasksService,
    private modalService: BsModalService,
    private currencyPipe: CurrencyPipe,
    private notificationService: NotificationService
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
      error: (error: any) => {
        console.log(error)
        this.notificationService.showNotification(
          'danger',
          'Erro',
          'Houve um problema ao listar as tarefas. Tente novamente.'
        );
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
        this.notificationService.showNotification(
          'success',
          'Sucesso',
          'Tarefa criada com sucesso.'
        );
        this.getAllTasks();
      },
      error: (error) => {
        console.log(error)
        this.notificationService.showNotification(
          'danger',
          'Erro',
          'Houve um problema ao criar a tarefa. Tente novamente.'
        );
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
      next: () => {
        this.notificationService.showNotification(
          'success',
          'Sucesso',
          'Ordem das tarefas atualizada com sucesso.'
        );
        this.getAllTasks();
      },
      error: (error) => {
        console.log(error)
        this.notificationService.showNotification(
          'danger',
          'Erro',
          'Houve um problema ao atualizar a ordem das tarefas. Tente novamente.'
        );
      }
    });
  }

  moveUp(index: number) {
    if (index > 0) {
      const temp = this.tasks[index];
      this.tasks[index] = this.tasks[index - 1];
      this.tasks[index - 1] = temp;

      this.updateOrder();
    }
  }

  moveDown(index: number) {
    if (index < this.tasks.length - 1) {
      const temp = this.tasks[index];
      this.tasks[index] = this.tasks[index + 1];
      this.tasks[index + 1] = temp;

      this.updateOrder();
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
        this.notificationService.showNotification(
          'success',
          'Sucesso',
          'Tarefa atualizada com sucesso.'
        );
        this.getAllTasks();
      },
      error: (error) => {
        console.error(error);
        this.notificationService.showNotification(
          'danger',
          'Erro',
          'Houve um problema ao atualizar a tarefa. Tente novamente.'
        );
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
        this.notificationService.showNotification(
          'danger',
          'Erro',
          'Não foi possível carregar os dados da tarefa. Tente novamente.'
        );
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
              this.notificationService.showNotification(
                'success',
                'Sucesso',
                'Tarefa removida com sucesso.'
              );
              this.getAllTasks();
            },
            error: (error) => {
              console.error(error);
              this.notificationService.showNotification(
                'danger',
                'Erro',
                'Houve um problema ao remover a tarefa. Tente novamente.'
              );
            }
          });
        }
      });
  }

  currencyToBRL(valor?: number): string {
    const numero = Number(valor);

    return this.currencyPipe.transform(numero, 'BRL', 'symbol', '1.2-2', 'pt-BR') ?? 'R$0,00';
  }
}
