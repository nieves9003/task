import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule, NgFor } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../task.service';
import { Task } from '../../entities/task';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { atLeastOneSkill, uniqueNameValidator } from '../../common/validators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    NgFor,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    CommonModule,],
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private apiService: TaskService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      deadline: ['', Validators.required],
      persons: this.fb.array([], uniqueNameValidator)
    });
  }

  ngOnInit(): void {
    this.addPerson();
  }

  get persons() {
    return this.taskForm.get('persons') as FormArray;
  }

  addPerson() {
    const personForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: [[], [Validators.required, atLeastOneSkill]],
    });
    this.persons.push(personForm);
  }

  removePerson(index: number) {
    this.persons.removeAt(index);
  }

  addSkill(personIndex: number, event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const skills = this.persons.at(personIndex).get('skills')!.value as string[];
      skills.push(value);
      this.persons.at(personIndex).get('skills')!.setValue(skills);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeSkill(personIndex: number, skill: string): void {
    const skills = this.persons.at(personIndex).get('skills')!.value as string[];
    const index = skills.indexOf(skill);

    if (index >= 0) {
      skills.splice(index, 1);
      this.persons.at(personIndex).get('skills')!.setValue(skills);
    }
  }

  editSkill(personIndex: number, skill: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();

    // Remove Skill
    if (!value) {
      this.removeSkill(personIndex, skill);
      return;
    }

    // Edit existing Skill
    const skills = this.persons.at(personIndex).get('skills')!.value as string[];
    const index = skills.indexOf(skill);
    if (index >= 0) {
      skills[index] = value;
      this.persons.at(personIndex).get('skills')!.setValue(skills);
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newTask: Task = this.taskForm.value;
      this.apiService.addTask(newTask).subscribe(
        {
          next: () => {
            this.goToList();
            this._snackBar.open(
              'Tarea creada con exito',
              null,
              {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
          },
          error: (error) => {
            this._snackBar.open(
              error?.message || 'Something went wrong, please try again.',
              null,
              {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
          }
        }
      );
    }
  }
  goToList(): void {
    this.router.navigate(['/task-list']);
  }

}
