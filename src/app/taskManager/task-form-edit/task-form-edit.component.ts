import { NgFor, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Task } from '../../entities/task';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ActivatedRoute, Router } from '@angular/router';
import { uniqueNameValidator, atLeastOneSkill } from '../../common/validators';
import { Person } from '../../entities/person';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-form-edit',
  templateUrl: './task-form-edit.component.html',
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
    CommonModule,
  ],
})
export class TaskFormEditComponent implements OnInit {
  taskForm: FormGroup;
  taskId: number;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      deadline: ['', Validators.required],
      persons: this.fb.array([], uniqueNameValidator)
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.params['id'];
    this.apiService.getTask(this.taskId).subscribe(task => {
      this.taskForm.patchValue(task);
      task.persons.forEach(person => this.addPerson(person));
    });
  }

  get persons() {
    return this.taskForm.get('persons') as FormArray;
  }

  addPerson(person?: Person) {
    const personForm = this.fb.group({
      fullName: [person?.fullName || '', [Validators.required, Validators.minLength(5)]],
      age: [person?.age || '', [Validators.required, Validators.min(18)]],
      skills: [person?.skills || [], [Validators.required, atLeastOneSkill]],
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
      const updatedTask: Task = { ...this.taskForm.value, id: this.taskId };
      this.apiService.updateTask(updatedTask).subscribe(() => {
        this.router.navigate(['/task-list']);
      });
    }
  }
}
